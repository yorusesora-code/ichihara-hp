/* ============================================================
   HTMLに書いてある日本語を、assets/i18n.js の内容に合わせ直します。
   ------------------------------------------------------------
       node tools/sync-text.js

   このサイトでは、画面に出る文字は assets/i18n.js が「正」で、
   HTMLに直接書いてある日本語は
   「JavaScriptが動かない環境で表示される予備」＋「検索エンジンが読む文字」です。

   i18n.js だけ直すと、この予備の文字が古いまま残ってしまうため、
   文言を直したあとにこのコマンドを流して、両方をそろえてください。

   対象の書き方：
       <p data-i18n="キー">ここが差し替わります</p>
       <img data-i18n-alt="キー" alt="ここが差し替わります">
       <nav data-i18n-aria="キー" aria-label="ここ">
       <iframe data-i18n-title="キー" title="ここ">
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

global.window = {};
require(path.join(ROOT, 'assets/i18n.js'));
const DICT = global.window.I18N;

require(path.join(ROOT, 'assets/config.js'));
const SITE = (global.window.SITE_CONFIG.site || {}).url || '';
if (!/^https?:\/\/.+\/$/.test(SITE)) {
  throw new Error('assets/config.js の site.url を「https://〜/」の形で設定してください');
}

function stripTags(s) { return String(s).replace(/<[^>]*>/g, ''); }
function attrSafe(s) { return stripTags(s).replace(/"/g, '&quot;'); }

/* data-i18n の付いた要素の中身を入れ替える（同じタグの入れ子も数えます） */
function replaceContent(src) {
  let out = '', i = 0, changed = 0;
  const open = /<([a-zA-Z][\w-]*)\b([^>]*\sdata-i18n="([^"]+)"[^>]*)>/g;
  let m;
  while ((m = open.exec(src)) !== null) {
    const tag = m[1], key = m[3];
    const bodyStart = m.index + m[0].length;
    if (!DICT[key]) { continue; }              // 辞書に無いキーは触らない（check.js が拾います）

    // 同じタグの入れ子を数えながら、対応する閉じタグを探す
    const scan = new RegExp('<(/?)' + tag + '\\b', 'gi');
    scan.lastIndex = bodyStart;
    let depth = 1, end = -1, t;
    while ((t = scan.exec(src)) !== null) {
      depth += t[1] ? -1 : 1;
      if (depth === 0) { end = t.index; break; }
    }
    if (end < 0) throw new Error('閉じタグが見つかりません: ' + key);

    const now = src.slice(bodyStart, end);
    const want = DICT[key].ja;
    out += src.slice(i, bodyStart) + want;
    i = end;
    if (now !== want) changed++;
    open.lastIndex = end;                      // 差し替えた中身は再走査しない
  }
  out += src.slice(i);
  return { text: out, changed: changed };
}

/* 属性（alt / aria-label / title）を入れ替える */
function replaceAttrs(src) {
  let changed = 0;
  const jobs = [
    { data: 'data-i18n-alt',   attr: 'alt' },
    { data: 'data-i18n-aria',  attr: 'aria-label' },
    { data: 'data-i18n-title', attr: 'title' }
  ];
  jobs.forEach(function (j) {
    src = src.replace(/<([a-zA-Z][\w-]*)\b([^>]*)>/g, function (whole, tag, attrs) {
      const k = attrs.match(new RegExp('\\s' + j.data + '="([^"]+)"'));
      if (!k || !DICT[k[1]]) return whole;
      const want = attrSafe(DICT[k[1]].ja);
      const re = new RegExp('(\\s' + j.attr + '=")([^"]*)(")');
      if (!re.test(attrs)) return whole;       // その属性が無ければ何もしない
      const next = attrs.replace(re, function (_, a, cur, c) {
        if (cur !== want) changed++;
        return a + want + c;
      });
      return '<' + tag + next + '>';
    });
  });
  return { text: src, changed: changed };
}

/* <body data-title="キー" data-desc="キー"> をもとに、
   <title> と description・OGP をそろえる。
   あわせて canonical（正式なURL）・og:url・og:image を絶対URLにする。 */
function replaceHead(src, file) {
  let changed = 0;
  const b = src.match(/<body\b[^>]*>/);
  if (!b) return { text: src, changed: 0 };
  const tk = b[0].match(/\sdata-title="([^"]+)"/);
  const dk = b[0].match(/\sdata-desc="([^"]+)"/);
  const title = tk && DICT[tk[1]] ? attrSafe(DICT[tk[1]].ja) : null;
  const desc  = dk && DICT[dk[1]] ? attrSafe(DICT[dk[1]].ja) : null;
  const pageUrl = SITE + (file === 'index.html' ? '' : file);

  function put(re, want) {
    src = src.replace(re, function (whole, a, cur, c) {
      if (cur !== want) changed++;
      return a + want + c;
    });
  }
  if (title) {
    put(/(<title>)([\s\S]*?)(<\/title>)/, title);
    put(/(<meta property="og:title" content=")([^"]*)(">)/, title);
  }
  if (desc) {
    put(/(<meta name="description" content=")([^"]*)(">)/, desc);
    put(/(<meta property="og:description" content=")([^"]*)(">)/, desc);
  }

  // OGP画像は相対パスだと一部のSNSで表示されないため、絶対URLにする
  put(/(<meta property="og:image" content=")([^"]*)(">)/, function () {
    const m = src.match(/<meta property="og:image" content="([^"]*)">/);
    return m ? SITE + m[1].replace(/^https?:\/\/[^/]+\//, '') : '';
  }());

  // canonical（このページの正式なURL）
  if (/<link rel="canonical"/.test(src)) {
    put(/(<link rel="canonical" href=")([^"]*)(">)/, pageUrl);
  } else {
    src = src.replace('<meta name="theme-color"',
      '<link rel="canonical" href="' + pageUrl + '">\n<meta name="theme-color"');
    changed++;
  }

  // og:url（SNSでシェアされたときのURL）
  if (/<meta property="og:url"/.test(src)) {
    put(/(<meta property="og:url" content=")([^"]*)(">)/, pageUrl);
  } else {
    src = src.replace('<meta property="og:site_name"',
      '<meta property="og:url" content="' + pageUrl + '">\n<meta property="og:site_name"');
    changed++;
  }

  return { text: src, changed: changed };
}

/* Googleサーチコンソールの所有者確認タグ（トップページだけに入れます） */
function replaceVerify(src, file) {
  if (file !== 'index.html') return { text: src, changed: 0 };
  const code = ((global.window.SITE_CONFIG.site || {}).googleSiteVerification || '').trim();
  const has = /<meta name="google-site-verification"[^>]*>\n?/;
  if (!code) {
    if (!has.test(src)) return { text: src, changed: 0 };
    return { text: src.replace(has, ''), changed: 1 };      // 空にしたら削除
  }
  const tag = '<meta name="google-site-verification" content="' + attrSafe(code) + '">';
  if (has.test(src)) {
    const now = src.match(has)[0].replace(/\n$/, '');
    if (now === tag) return { text: src, changed: 0 };
    return { text: src.replace(has, tag + '\n'), changed: 1 };
  }
  return { text: src.replace('<meta name="theme-color"', tag + '\n<meta name="theme-color"'), changed: 1 };
}

let files = 0, edits = 0;
fs.readdirSync(ROOT).filter(f => /\.html$/.test(f)).forEach(function (f) {
  const full = path.join(ROOT, f);
  const before = fs.readFileSync(full, 'utf8');
  const a = replaceContent(before);
  const b = replaceAttrs(a.text);
  const c = replaceHead(b.text, f);
  const d = replaceVerify(c.text, f);
  if (d.text !== before) {
    fs.writeFileSync(full, d.text, 'utf8');
    files++;
    const n = a.changed + b.changed + c.changed + d.changed;
    edits += n;
    console.log('更新:', f, '（' + n + 'か所）');
  }
});
console.log(files ? files + 'ページ・' + edits + 'か所をそろえました' : 'すでにそろっています');
