/* ============================================================
   市原建設 HP スクリプト（全ページ共通）
   - 日本語／英語の切り替え（assets/i18n.js の辞書を使用）
   - Googleスプレッドシート（公開CSV）から お知らせ / 料金表 を取得
   - ヘッダーのドロワーメニュー、スクロール表示などのUI
   ページ内に該当の入れ物が無ければ、その処理は自動的にスキップされます。
   ============================================================ */
(function () {
  'use strict';

  var CFG  = window.SITE_CONFIG || {};
  var SH   = CFG.sheets || {};
  var META = CFG.priceMeta || {};
  var DICT = window.I18N || {};

  var LANGS = ['ja', 'en'];
  var STORE_KEY = 'ichihara-lang';
  var lang = 'ja';

  /* 読み込んだデータを保持しておき、言語切替時に再描画する */
  var priceRows = null;
  var noticeRows = null;

  /* ============================================================
     多言語
     ============================================================ */
  function t(key) {
    var e = DICT[key];
    if (!e) return '';
    return (e[lang] != null && e[lang] !== '') ? e[lang] : (e.ja || '');
  }

  function remember(v) {
    try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* 無視 */ }
  }

  function detectLang() {
    // 1) URLの ?lang=en が最優先（リンクで共有できるように）
    //    そのまま他ページへ移動しても英語のままになるよう、選択を記憶する
    var m = location.search.match(/[?&]lang=([a-zA-Z-]+)/);
    if (m) {
      var q = m[1].toLowerCase().slice(0, 2);
      if (LANGS.indexOf(q) !== -1) { remember(q); return q; }
    }
    // 2) 前回選んだ言語
    try {
      var s = localStorage.getItem(STORE_KEY);
      if (s && LANGS.indexOf(s) !== -1) return s;
    } catch (e) { /* localStorage が使えない環境は無視 */ }
    // 3) ブラウザの言語設定（日本語以外なら英語）
    var nav = (navigator.language || 'ja').toLowerCase();
    return nav.indexOf('ja') === 0 ? 'ja' : 'en';
  }

  function applyI18n() {
    var root = document.documentElement;
    root.setAttribute('lang', lang);

    // 本文
    var nodes = document.querySelectorAll('[data-i18n]');
    Array.prototype.forEach.call(nodes, function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v !== '') el.innerHTML = v;
    });

    // aria-label など、属性に入れるもの
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-aria]'), function (el) {
      var v = t(el.getAttribute('data-i18n-aria'));
      if (v !== '') el.setAttribute('aria-label', stripTags(v));
    });

    // 画像の代替テキスト
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-alt]'), function (el) {
      var v = t(el.getAttribute('data-i18n-alt'));
      if (v !== '') el.setAttribute('alt', stripTags(v));
    });

    // ページタイトルとディスクリプション
    var body = document.body;
    if (body.getAttribute('data-title')) {
      var tt = t(body.getAttribute('data-title'));
      if (tt) document.title = stripTags(tt);
    }
    if (body.getAttribute('data-desc')) {
      var dd = t(body.getAttribute('data-desc'));
      var meta = document.querySelector('meta[name="description"]');
      if (dd && meta) meta.setAttribute('content', stripTags(dd));
    }

    // 言語切替ボタンの状態
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-set]'), function (b) {
      var on = b.getAttribute('data-lang-set') === lang;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('is-active', on);
    });

    // ハンバーガーのラベル（開閉状態に合わせて）
    var burger = document.getElementById('hamburger');
    if (burger) {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-label', stripTags(t(open ? 'header.menuClose' : 'header.menuOpen')));
    }
  }

  function stripTags(s) {
    var d = document.createElement('div');
    d.innerHTML = s;
    return d.textContent || '';
  }

  function setLang(next) {
    if (LANGS.indexOf(next) === -1 || next === lang) return;
    lang = next;
    remember(lang);
    applyI18n();
    // スプレッドシート由来の内容も描き直す
    if (noticeRows) renderNotices(noticeRows);
    if (priceRows) {
      renderPriceTables(priceRows);
      renderPriceSummary(priceRows);
      renderServicePrices(priceRows);
      renderMinPrice(priceRows);
      observeReveals();
    }
  }

  /* ============================================================
     ユーティリティ
     ============================================================ */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function nl2br(s) { return esc(s).replace(/\r?\n/g, '<br>'); }

  function toNum(v) {
    var s = String(v == null ? '' : v).replace(/[,，\s円¥￥]/g, '');
    return /^[0-9]+$/.test(s) ? Number(s) : null;
  }
  // 言語に合わせた金額表記（日本語: 9,000円 ／ 英語: ¥9,000）
  function yen(n) {
    var v = n.toLocaleString('en-US');
    return lang === 'en' ? '¥' + v : v + '円';
  }
  // 「9,000円〜」/「From ¥9,000」の言い回しを言語ごとに切り替える
  function fromPrice(n) { return t('price.from').replace('{v}', yen(n)); }

  function yenHtml(n) {
    var v = n.toLocaleString('en-US');
    return lang === 'en' ? '¥' + v : v + '<span class="yen">円</span>';
  }

  // CSVの「メニュー」に対する「メニュー_en」を、英語表示のときだけ優先して使う
  function col(o, base) {
    if (lang !== 'ja') {
      var v = o[base + '_' + lang];
      if (v != null && String(v).trim() !== '') return String(v).trim();
    }
    return String(o[base] == null ? '' : o[base]).trim();
  }

  /* ---------- CSVパーサ（引用符・改行・カンマ対応） ---------- */
  function parseCSV(text) {
    text = String(text).replace(/^﻿/, '');
    var rows = [], row = [], field = '', i = 0, inQ = false, c;
    while (i < text.length) {
      c = text[i];
      if (inQ) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQ = false; i++; continue;
        }
        field += c; i++; continue;
      }
      if (c === '"') { inQ = true; i++; continue; }
      if (c === ',') { row.push(field); field = ''; i++; continue; }
      if (c === '\r') { i++; continue; }
      if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
      field += c; i++;
    }
    row.push(field); rows.push(row);
    return rows.filter(function (r) {
      return r.some(function (v) { return String(v).trim() !== ''; });
    });
  }

  function toObjects(rows) {
    if (!rows.length) return [];
    var head = rows[0].map(function (h) { return String(h).trim(); });
    return rows.slice(1).map(function (r) {
      var o = {};
      head.forEach(function (h, idx) { o[h] = (r[idx] == null ? '' : String(r[idx]).trim()); });
      return o;
    });
  }

  function isPublished(v) {
    var s = String(v == null ? '' : v).trim().toUpperCase();
    if (s === '') return true;
    return !(s === 'FALSE' || s === 'NO' || s === '0' || s === '非公開' || s === '×');
  }

  /* ---------- データ取得（Sheets → ローカルCSV → 内蔵） ---------- */
  function loadCSV(remoteUrl, localUrl, builtin) {
    var sources = [];
    if (remoteUrl) sources.push(remoteUrl);
    if (localUrl) sources.push(localUrl);

    return sources.reduce(function (chain, url) {
      return chain.then(function (res) {
        if (res) return res;
        return fetch(url, { cache: 'no-store' })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            return r.text();
          })
          .then(function (x) {
            // 公開設定が未完了だとHTMLが返ることがあるので弾く
            if (/^\s*<(!doctype|html)/i.test(x)) throw new Error('not csv');
            return x;
          })
          .catch(function () { return null; });
      });
    }, Promise.resolve(null)).then(function (res) {
      return res || builtin;
    });
  }

  /* ============================================================
     お知らせ
     ============================================================ */
  function renderNotices(list) {
    var box = document.getElementById('noticeList');
    if (!box) return;

    var attr = box.getAttribute('data-limit');
    var limit;
    if (attr === 'all') limit = Infinity;
    else if (attr && !isNaN(Number(attr))) limit = Number(attr);
    else limit = SH.noticeLimit || 6;

    var shown = list.slice(0, limit);

    if (!shown.length) {
      box.innerHTML = '<p class="errmsg">' + t('common.noNotice') + '</p>';
      return;
    }

    box.innerHTML = shown.map(function (o) {
      var d = String(o['日付'] || '').trim().replace(/[-/]/g, '.');
      var catJa = String(o['カテゴリ'] || 'お知らせ').trim();   // 色分けは日本語の値で判定
      var catLb = col(o, 'カテゴリ') || catJa;
      var body  = col(o, '本文');
      return '<article class="notice__item">' +
        '<time class="notice__date">' + esc(d) + '</time>' +
        '<span class="notice__cat" data-cat="' + esc(catJa) + '">' + esc(catLb) + '</span>' +
        '<div><p class="notice__title">' + nl2br(col(o, 'タイトル')) + '</p>' +
        (body ? '<p class="notice__body">' + nl2br(body) + '</p>' : '') +
        '</div></article>';
    }).join('');
  }

  /* ============================================================
     料金
     ============================================================ */
  // グループ化は必ず「日本語のカテゴリ／対象」で行う（設定ファイルの指定と合わせるため）
  function groupByCategory(rows) {
    var cats = [], byCat = {};
    rows.forEach(function (o) {
      var c = String(o['カテゴリ'] || 'その他').trim();
      if (!byCat[c]) { byCat[c] = []; cats.push(c); }
      byCat[c].push(o);
    });
    return { order: cats, map: byCat };
  }

  function minPrice(items) {
    var skip = CFG.summaryExcludeGroups || [];
    var nums = items
      .filter(function (o) { return skip.indexOf(String(o['対象'] || '').trim()) === -1; })
      .map(function (o) { return toNum(o['料金']); })
      .filter(function (n) { return n != null; });
    return nums.length ? Math.min.apply(null, nums) : null;
  }

  function metaOf(cat) {
    var m = META[cat] || {};
    var suffix = (lang === 'ja') ? '' : '_' + lang;
    return {
      col1: m['col1' + suffix] || m.col1 || '',
      col2: m['col2' + suffix] || m.col2 || '',
      note: m['note' + suffix] || m.note || ''
    };
  }

  function priceCell(o, key, isSub) {
    var n = toNum(o[key]);
    if (n != null) {
      return '<td class="num' + (isSub ? ' sub' : '') + '">' + yenHtml(n) + '</td>';
    }
    var v = col(o, key);
    if (v === '') return '<td class="num sub">—</td>';
    return '<td class="num est' + (isSub ? ' sub' : '') + '">' + esc(v) + '</td>';
  }

  function renderPriceTables(rows) {
    var box = document.getElementById('priceArea');
    if (!box) return;

    if (!rows.length) {
      box.innerHTML = '<p class="errmsg">' + t('common.priceErr') + '</p>';
      return;
    }

    var g = groupByCategory(rows);

    box.innerHTML = g.order.map(function (cat, ci) {
      var items = g.map[cat];
      var meta = metaOf(cat);
      var hasCol2 = items.some(function (o) { return String(o['料金2'] || '').trim() !== ''; });
      var col1 = meta.col1 || (hasCol2 ? '1台目' : '料金');
      var col2 = meta.col2 || '2台目以降';
      var catLabel = col(items[0], 'カテゴリ') || cat;

      var grpCount = {};
      items.forEach(function (o) {
        var gp = String(o['対象'] || '').trim();
        grpCount[gp] = (grpCount[gp] || 0) + 1;
      });
      var used = {};

      var body = items.map(function (o) {
        var gp = String(o['対象'] || '').trim();
        var tds = '';
        if (!used[gp]) {
          used[gp] = true;
          tds += '<th class="grp" scope="rowgroup" rowspan="' + grpCount[gp] + '">' +
                 esc(col(o, '対象')) + '</th>';
        }
        var note = col(o, '備考');
        tds += '<td class="menu">' + esc(col(o, 'メニュー')) +
          (note ? '<small>' + esc(note) + '</small>' : '') + '</td>';
        tds += priceCell(o, '料金', false);
        if (hasCol2) tds += priceCell(o, '料金2', true);
        return '<tr>' + tds + '</tr>';
      }).join('');

      return '<div class="price__group" id="price-' + (ci + 1) + '">' +
        '<div class="price__head">' +
          '<h2 class="price__cat">' + esc(catLabel) + '</h2>' +
          (meta.note ? '<p class="price__note">' + esc(meta.note) + '</p>' : '') +
        '</div>' +
        '<div class="price__scroll"><table class="price__table"><thead><tr>' +
          '<th scope="col">' + t('price.colTarget') + '</th>' +
          '<th scope="col">' + t('price.colMenu') + '</th>' +
          '<th scope="col" class="num">' + esc(col1) + '</th>' +
          (hasCol2 ? '<th scope="col" class="num">' + esc(col2) + '</th>' : '') +
        '</tr></thead><tbody>' + body + '</tbody></table></div>' +
      '</div>';
    }).join('');
  }

  function renderPriceSummary(rows) {
    var box = document.getElementById('priceSummary');
    if (!box || !rows.length) return;

    var g = groupByCategory(rows);

    box.innerHTML = g.order.map(function (cat, ci) {
      var items = g.map[cat];
      var m = minPrice(items);
      var label = (m != null) ? fromPrice(m) : t('common.quote');
      var catLabel = col(items[0], 'カテゴリ') || cat;
      var count = t(items.length === 1 ? 'psum.count1' : 'psum.count').replace('{n}', items.length);
      return '<a class="psum reveal" href="price.html#price-' + (ci + 1) + '">' +
        '<span class="psum__cat">' + esc(catLabel) + '</span>' +
        '<span class="psum__price">' + esc(label) + '</span>' +
        '<span class="psum__meta">' + esc(count) + '</span>' +
      '</a>';
    }).join('');
  }

  // ヒーローの「安心価格 税込◯◯円〜」を、料金表全体の最安値から自動計算する
  function renderMinPrice(rows) {
    var els = document.querySelectorAll('[data-price-min]');
    if (!els.length || !rows.length) return;
    var skip = CFG.summaryExcludeGroups || [];
    var nums = rows
      .filter(function (o) { return skip.indexOf(String(o['対象'] || '').trim()) === -1; })
      .map(function (o) { return toNum(o['料金']); })
      .filter(function (n) { return n != null; });
    if (!nums.length) return;
    var m = Math.min.apply(null, nums);
    Array.prototype.forEach.call(els, function (el) {
      el.textContent = (lang === 'en' ? '¥' : '') + m.toLocaleString('en-US');
    });
  }

  // サービスカードの「9,000円〜」を料金データから反映
  function renderServicePrices(rows) {
    var els = document.querySelectorAll('[data-price-cat]');
    if (!els.length || !rows.length) return;

    var g = groupByCategory(rows);
    Array.prototype.forEach.call(els, function (el) {
      var cat = el.getAttribute('data-price-cat');
      var items = g.map[cat];
      if (!items) return;
      var m = minPrice(items);
      var unitKey = el.getAttribute('data-unit-key');
      var unit = unitKey ? t(unitKey) : '';
      el.innerHTML = (m != null ? esc(fromPrice(m)) : esc(t('common.quote'))) +
        (unit && m != null ? '<small>' + unit + '</small>' : '');
    });
  }

  /* ============================================================
     UI
     ============================================================ */
  function initDrawer() {
    var burger  = document.getElementById('hamburger');
    var drawer  = document.getElementById('drawer');
    var overlay = document.getElementById('drawerOverlay');
    if (!burger || !drawer) return;

    function setOpen(open) {
      drawer.classList.toggle('is-open', open);
      burger.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
      if (overlay) overlay.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', stripTags(t(open ? 'header.menuClose' : 'header.menuOpen')));
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) {
        var first = drawer.querySelector('a,button');
        if (first) first.focus();
      }
    }

    burger.addEventListener('click', function () {
      setOpen(!drawer.classList.contains('is-open'));
    });
    if (overlay) overlay.addEventListener('click', function () { setOpen(false); burger.focus(); });
    drawer.addEventListener('click', function (e) {
      var el = e.target;
      if (!el || !el.closest) return;
      if (el.closest('a') || el.closest('[data-drawer-close]')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        setOpen(false); burger.focus();
      }
    });
  }

  function initLangSwitch() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-set]'), function (b) {
      b.addEventListener('click', function () {
        setLang(b.getAttribute('data-lang-set'));
      });
    });
  }

  function initHeader() {
    var header = document.getElementById('header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ナビが横に長い場合、現在地が見えるようにスクロール位置を寄せる。
    // Webフォントの読み込み前だと文字幅が違って正しく計算できないため、
    // フォントが揃ってから実行する。
    var nav = document.getElementById('nav');
    var cur = nav && nav.querySelector('[aria-current="page"]');
    if (!nav || !cur) return;

    var centerCurrent = function () {
      if (nav.scrollWidth <= nav.clientWidth) return;
      var target = cur.offsetLeft - (nav.clientWidth - cur.offsetWidth) / 2;
      nav.scrollLeft = Math.max(0, target);
    };

    centerCurrent();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(centerCurrent);
    } else {
      window.addEventListener('load', centerCurrent);
    }
  }

  var io = null;
  function observeReveals() {
    var targets = document.querySelectorAll('.reveal:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    }
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  function jumpToHash() {
    if (!location.hash) return;
    var id;
    try { id = decodeURIComponent(location.hash.slice(1)); }
    catch (e) { id = location.hash.slice(1); }
    var el = document.getElementById(id);
    if (!el) return;
    requestAnimationFrame(function () {
      var root = document.documentElement;
      var prev = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      el.scrollIntoView();
      root.style.scrollBehavior = prev;
    });
  }

  /* ============================================================
     起動
     ============================================================ */
  function start() {
    lang = detectLang();
    applyI18n();

    initHeader();
    initDrawer();
    initLangSwitch();
    document.body.classList.add('is-ready');
    observeReveals();

    if (document.getElementById('noticeList')) {
      loadCSV(SH.noticesCsvUrl, SH.noticesFallback, window.BUILTIN_NOTICES || '')
        .then(function (csv) {
          noticeRows = toObjects(parseCSV(csv)).filter(function (o) {
            return isPublished(o['公開']) && (o['タイトル'] || o['本文']);
          });
          noticeRows.sort(function (a, b) {
            return String(b['日付'] || '').localeCompare(String(a['日付'] || ''));
          });
          renderNotices(noticeRows);
          observeReveals();
        });
    }

    var needPrice = document.getElementById('priceArea') ||
                    document.getElementById('priceSummary') ||
                    document.querySelector('[data-price-cat]');
    if (needPrice) {
      loadCSV(SH.pricesCsvUrl, SH.pricesFallback, window.BUILTIN_PRICES || '')
        .then(function (csv) {
          priceRows = toObjects(parseCSV(csv)).filter(function (o) {
            return isPublished(o['公開']) && o['メニュー'];
          });
          renderPriceTables(priceRows);
          renderPriceSummary(priceRows);
          renderServicePrices(priceRows);
          renderMinPrice(priceRows);
          observeReveals();
          jumpToHash();
        });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
