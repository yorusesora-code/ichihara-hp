/* ============================================================
   共通パーツ（ヘッダー／ドロワー／フッター）を全ページに書き込むスクリプト
   ------------------------------------------------------------
   ページ数が増えたため、共通部分を手作業でコピーするのをやめ、
   このファイルの NAV / SUBNAV を「唯一の正」として全 HTML に反映します。

   使い方（Node.js が入っている環境で、このリポジトリの直下から）:
       node tools/sync-parts.js

   ・メニューを増減したいとき   → 下の NAV / SUBNAV を編集して実行
   ・電話番号や住所を変えたいとき → 下の TEL / TEL_LINK を編集して実行
   ・表示される文字そのもの      → assets/i18n.js を編集（ここは初期表示用）

   HTML 側は、次のコメントで囲まれた範囲が丸ごと差し替わります。
       <!-- ============ ヘッダー（全ページ共通） ============ --> 〜 </header>
       <!-- ============ ドロワーメニュー（全ページ共通） ============ --> 〜 </aside>
       <!-- ============ フッター（全ページ共通） ============ --> 〜 </footer>
   ============================================================ */

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const TEL      = '06-7632-5062';
const TEL_LINK = 'tel:0676325062';

/* ---- ヘッダーのメニュー構成（この順に並びます） ---- */
const NAV = [
  { href: 'index.html',    en: 'HOME',     key: 'nav.home',    ja: 'トップ' },
  { href: 'aircon.html',   en: 'AIRCON',   key: 'nav.aircon',  ja: 'エアコンクリーニング', children: [
    { href: 'aircon.html#residential', key: 'nav.acHome', ja: '家庭用エアコン' },
    { href: 'aircon.html#selfclean',   key: 'nav.acSelf', ja: 'お掃除機能付き' },
    { href: 'aircon.html#commercial',  key: 'nav.acBiz',  ja: '業務用エアコン' },
    { href: 'aircon.html#outdoor',     key: 'nav.acOut',  ja: '室外機' }
  ] },
  { href: 'house.html',    en: 'HOUSE',    key: 'nav.house',   ja: 'ハウスクリーニング', children: [
    { href: 'house.html#bath',    key: 'nav.hcBath',    ja: '浴室' },
    { href: 'house.html#kitchen', key: 'nav.hcKitchen', ja: 'キッチン' },
    { href: 'house.html#hood',    key: 'nav.hcHood',    ja: 'レンジフード' },
    { href: 'house.html#toilet',  key: 'nav.hcToilet',  ja: 'トイレ' },
    { href: 'house.html#washbasin', key: 'nav.hcWash',  ja: '洗面所' }
  ] },
  { href: 'vacancy.html',  en: 'VACANCY',  key: 'nav.vacancy', ja: '空室清掃', children: [
    { href: 'vacancy.html#r1r',   key: 'nav.vc1r',   ja: '1R' },
    { href: 'vacancy.html#r1ldk', key: 'nav.vc1ldk', ja: '1LDK' },
    { href: 'vacancy.html#r2ldk', key: 'nav.vc2ldk', ja: '2LDK' },
    { href: 'vacancy.html#r3ldk', key: 'nav.vc3ldk', ja: '3LDK' }
  ] },
  { href: 'area.html',     en: 'AREA',     key: 'nav.area',     ja: '対応エリア' },
  { href: 'works.html',    en: 'WORKS',    key: 'nav.works',    ja: '施工事例' },
  { href: 'faq.html',      en: 'FAQ',      key: 'nav.faq',      ja: 'よくある質問' },
  { href: 'business.html', en: 'BUSINESS', key: 'nav.business', ja: '法人のお客様' },
  { href: 'other.html',    en: 'OTHER',    key: 'nav.other',    ja: 'その他サービス' },
  { href: 'recruit.html',  en: 'RECRUIT',  key: 'nav.recruit',  ja: '採用情報' },
  { href: 'company.html',  en: 'COMPANY',  key: 'nav.company',  ja: '会社概要' }
];

/* ---- ヘッダーには出さないが、ドロワーとフッターには出すページ ---- */
const SUBNAV = [
  { href: 'service.html', en: 'SERVICE', key: 'nav.service', ja: 'サービス一覧' },
  { href: 'price.html',   en: 'PRICE',   key: 'nav.price',   ja: '料金表' },
  { href: 'news.html',    en: 'NEWS',    key: 'nav.news',    ja: 'お知らせ' }
];

const CARET =
  '<svg class="nav__caret" viewBox="0 0 12 12" aria-hidden="true">' +
  '<path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ヘッダーは紺色の背景なので、黒い部分を白くした logo-light.webp を使っています。
   元の色のロゴは assets/img/ichihara-kensetsu-logo.webp（明るい背景用）です。 */
const LOGO_IMG =
  '<img class="brand__logo" src="assets/img/ichihara-kensetsu-logo-light.webp" alt="" ' +
  'width="128" height="114" decoding="async">';

const PHONE_SVG = function (size) {
  return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true">' +
    '<path fill="currentColor" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z"/></svg>';
};

function cur(href, page) { return href === page ? ' aria-current="page"' : ''; }

/* ------------------------------------------------------------ ヘッダー */
function header(page) {
  const items = NAV.map(function (n) {
    // 子メニューを持つ項目は、ラベルを span で包んでから矢印アイコンを足す。
    // （data-i18n は要素の中身を丸ごと書き換えるため、<a> 直下に置くとアイコンが消えます）
    const inner = n.children
      ? '<span data-i18n="' + n.key + '">' + n.ja + '</span>' + CARET
      : '<span data-i18n="' + n.key + '">' + n.ja + '</span>';
    const link = '<a href="' + n.href + '"' + cur(n.href, page) + '>' + inner + '</a>';
    if (!n.children) return '      ' + link;
    const subs = n.children.map(function (c) {
      return '          <a href="' + c.href + '" data-i18n="' + c.key + '">' + c.ja + '</a>';
    }).join('\n');
    return [
      '      <span class="nav__group">',
      '        ' + link,
      '        <span class="nav__sub">',
      subs,
      '        </span>',
      '      </span>'
    ].join('\n');
  }).join('\n');

  return [
    '<!-- ============ ヘッダー（全ページ共通） ============ -->',
    '<!-- このブロックは tools/sync-parts.js が自動生成しています（手で書き換えないでください） -->',
    '<header class="header" id="header">',
    '  <div class="header__inner">',
    '    <a class="brand" href="index.html">',
    '      <span class="brand__mark" aria-hidden="true">',
    '        ' + LOGO_IMG,
    '      </span>',
    '      <span class="brand__text">',
    '        <b data-i18n="brand.name">市原建設</b>',
    '        <small data-i18n="brand.tag">エアコン・ハウスクリーニング</small>',
    '      </span>',
    '    </a>',
    '',
    '    <nav class="nav" id="nav" aria-label="グローバルメニュー" data-i18n-aria="nav.aria">',
    items,
    '    </nav>',
    '',
    '    <div class="header__side">',
    '      <div class="langsw" role="group" aria-label="言語を選択" data-i18n-aria="lang.aria">',
    '        <button type="button" data-lang-set="ja" aria-pressed="true">日本語</button>',
    '        <button type="button" data-lang-set="en" aria-pressed="false">EN</button>',
    '      </div>',
    '      <a class="header__tel" href="' + TEL_LINK + '">',
    '        <span class="header__tel-label" data-i18n="header.telLabel">お電話でのご相談</span>',
    '        <span class="header__tel-num">' + TEL + '</span>',
    '      </a>',
    '      <button class="hamburger" id="hamburger" type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="drawer">',
    '        <span></span><span></span><span></span>',
    '      </button>',
    '    </div>',
    '  </div>',
    '</header>'
  ].join('\n');
}

/* ------------------------------------------------------------ ドロワー */
function drawer(page) {
  const tree = NAV.map(function (n) {
    const link = '<a href="' + n.href + '"' + cur(n.href, page) + '><small>' + n.en +
      '</small><span data-i18n="' + n.key + '">' + n.ja + '</span></a>';
    if (!n.children) return '    ' + link;

    // 子メニューは開閉式。いま見ているページのグループだけ、最初から開いておく
    const id = 'dsub-' + n.href.replace(/\.html$/, '');
    const open = (n.href === page) || n.children.some(function (c) { return c.href.split('#')[0] === page; });
    const subs = n.children.map(function (c) {
      return '        <a href="' + c.href + '" data-i18n="' + c.key + '">' + c.ja + '</a>';
    }).join('\n');
    return [
      '    <div class="drawer__row">',
      '      ' + link,
      '      <button class="drawer__toggle" type="button" aria-expanded="' + (open ? 'true' : 'false') + '"',
      '              aria-controls="' + id + '" aria-label="下層メニューの開閉" data-i18n-aria="drawer.sub">',
      '        <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M3 5.5 7 9.5 11 5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      '      </button>',
      '    </div>',
      '    <div class="drawer__sub' + (open ? ' is-open' : '') + '" id="' + id + '">',
      subs,
      '    </div>'
    ].join('\n');
  }).join('\n');

  const more = SUBNAV.map(function (n) {
    return '    <a href="' + n.href + '"' + cur(n.href, page) + '><small>' + n.en +
      '</small><span data-i18n="' + n.key + '">' + n.ja + '</span></a>';
  }).join('\n');

  return [
    '<!-- ============ ドロワーメニュー（全ページ共通） ============ -->',
    '<!-- このブロックは tools/sync-parts.js が自動生成しています（手で書き換えないでください） -->',
    '<div class="drawer-overlay" id="drawerOverlay"></div>',
    '<aside class="drawer" id="drawer" aria-hidden="true" aria-label="メニュー" data-i18n-aria="drawer.title">',
    '  <div class="drawer__head">',
    '    <span data-i18n="drawer.title">メニュー</span>',
    '    <button type="button" class="drawer__close" data-drawer-close aria-label="閉じる" data-i18n-aria="drawer.close">',
    '      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>',
    '    </button>',
    '  </div>',
    '',
    '  <nav class="drawer__nav drawer__nav--tree">',
    tree,
    '',
    '    <p class="drawer__navhead" data-i18n="drawer.moreTitle">その他のページ</p>',
    more,
    '  </nav>',
    '',
    '  <div class="drawer__block">',
    '    <h3 data-i18n="drawer.langTitle">言語 / Language</h3>',
    '    <div class="langsw langsw--drawer" role="group" aria-label="言語を選択" data-i18n-aria="lang.aria">',
    '      <button type="button" data-lang-set="ja" aria-pressed="true">日本語</button>',
    '      <button type="button" data-lang-set="en" aria-pressed="false">English</button>',
    '    </div>',
    '  </div>',
    '',
    '  <div class="drawer__block">',
    '    <h3 data-i18n="drawer.contact">お問い合わせ</h3>',
    '    <a class="btn btn--primary drawer__tel" href="' + TEL_LINK + '">',
    '      ' + PHONE_SVG(18),
    '      <span><small data-i18n="cta.small">受付 9:00〜18:00</small>' + TEL + '</span>',
    '    </a>',
    '    <dl class="drawer__meta">',
    '      <dt data-i18n="drawer.hoursLabel">受付時間</dt>',
    '      <dd data-i18n="drawer.hours">平日・土日 9:00〜18:00（祝日は翌営業日）</dd>',
    '      <dt data-i18n="drawer.addrLabel">所在地</dt>',
    '      <dd data-i18n="drawer.addr">〒572-0050 大阪府寝屋川市黒原城内町11-10 ラ・エアナ15号</dd>',
    '    </dl>',
    '  </div>',
    '</aside>'
  ].join('\n');
}

/* ------------------------------------------------------------ フッター */
function footer(page) {
  const links = NAV.concat(SUBNAV).map(function (n) {
    return '      <a href="' + n.href + '"' + cur(n.href, page) + ' data-i18n="' + n.key + '">' + n.ja + '</a>';
  }).join('\n');

  return [
    '<!-- ============ フッター（全ページ共通） ============ -->',
    '<!-- このブロックは tools/sync-parts.js が自動生成しています（手で書き換えないでください） -->',
    '<footer class="footer">',
    '  <div class="container footer__inner">',
    '    <div class="footer__brand">',
    '      <b data-i18n="brand.name">市原建設</b>',
    '      <p data-i18n="footer.addr">〒572-0050 大阪府寝屋川市黒原城内町11-10 ラ・エアナ15号</p>',
    '      <p><a href="' + TEL_LINK + '">TEL ' + TEL + '</a><span data-i18n="footer.hours">／受付 9:00〜18:00</span></p>',
    '    </div>',
    '    <nav class="footer__nav">',
    links,
    '    </nav>',
    '  </div>',
    '  <p class="copyright" data-i18n="footer.copy">&copy; 市原建設 All Rights Reserved.</p>',
    '</footer>'
  ].join('\n');
}

/* ------------------------------------------------------------ 差し替え */
const BLOCKS = [
  { start: '<!-- ============ ヘッダー（全ページ共通） ============ -->', end: '</header>', build: header },
  { start: '<!-- ============ ドロワーメニュー（全ページ共通） ============ -->', end: '</aside>', build: drawer },
  { start: '<!-- ============ フッター（全ページ共通） ============ -->', end: '</footer>', build: footer }
];

function syncFile(file) {
  const full = path.join(ROOT, file);
  let s = fs.readFileSync(full, 'utf8');
  BLOCKS.forEach(function (b) {
    const i = s.indexOf(b.start);
    if (i < 0) throw new Error(file + ': 目印が見つかりません → ' + b.start);
    const j = s.indexOf(b.end, i);
    if (j < 0) throw new Error(file + ': 終わりが見つかりません → ' + b.end);
    s = s.slice(0, i) + b.build(file) + s.slice(j + b.end.length);
  });
  fs.writeFileSync(full, s, 'utf8');
}

const files = fs.readdirSync(ROOT).filter(function (f) { return /\.html$/.test(f); });
files.forEach(syncFile);
console.log('共通パーツを更新しました：' + files.length + ' ページ');
console.log(files.join(', '));
