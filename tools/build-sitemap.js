/* ============================================================
   sitemap.xml と robots.txt を作り直します。
   ------------------------------------------------------------
       node tools/build-sitemap.js

   ・公開URLは assets/config.js の site.url を見ています。
     ドメインを変えたら、まずそちらを直してください。
   ・ページを増やしたら、このコマンドを流すだけで一覧に加わります
     （フォルダ直下の .html を自動で拾います）。
   ・最終更新日は git の記録から取ります（git が無ければファイルの更新日）。

   ※ noindex が入っているうちは、送信しても検索エンジンに登録されません。
      サーチコンソールへの送信は、全体公開のあとに行ってください。
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');

global.window = {};
require(path.join(ROOT, 'assets/config.js'));
const SITE = (global.window.SITE_CONFIG.site || {}).url || '';
if (!/^https?:\/\/.+\/$/.test(SITE)) {
  throw new Error('assets/config.js の site.url を「https://〜/」の形で設定してください');
}

/* 表示の優先度。数字が大きいほど「このサイトの中で重要」という目安です */
const PRIORITY = {
  'index.html':    '1.0',
  'aircon.html':   '0.9',
  'house.html':    '0.9',
  'vacancy.html':  '0.9',
  'business.html': '0.9',
  'price.html':    '0.8',
  'works.html':    '0.8',
  'area.html':     '0.8',
  'service.html':  '0.7',
  'company.html':  '0.6',
  'faq.html':      '0.6',
  'other.html':    '0.6',
  'recruit.html':  '0.6',
  'news.html':     '0.5'
};

function lastmod(file) {
  try {
    const d = execSync('git log -1 --format=%cs -- "' + file + '"', { cwd: ROOT }).toString().trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  } catch (e) { /* git が無ければ下へ */ }
  return fs.statSync(path.join(ROOT, file)).mtime.toISOString().slice(0, 10);
}

const files = fs.readdirSync(ROOT).filter(f => /\.html$/.test(f)).sort(function (a, b) {
  return (+(PRIORITY[b] || 0.5)) - (+(PRIORITY[a] || 0.5)) || a.localeCompare(b);
});

const body = files.map(function (f) {
  const loc = SITE + (f === 'index.html' ? '' : f);
  return [
    '  <url>',
    '    <loc>' + loc + '</loc>',
    '    <lastmod>' + lastmod(f) + '</lastmod>',
    '    <priority>' + (PRIORITY[f] || '0.5') + '</priority>',
    '  </url>'
  ].join('\n');
}).join('\n');

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + '\n</urlset>\n', 'utf8');

fs.writeFileSync(path.join(ROOT, 'robots.txt'),
  [
    '# 全ページの巡回を許可しています。',
    '# レビュー中に検索へ出したくないページは、ここではなく',
    '# 各HTMLの <meta name="robots" content="noindex, nofollow"> で止めてください。',
    '# （ここで Disallow: / と書くと noindex を読んでもらえず、かえって逆効果です）',
    'User-agent: *',
    'Allow: /',
    '',
    'Sitemap: ' + SITE + 'sitemap.xml',
    ''
  ].join('\n'), 'utf8');

console.log('sitemap.xml（' + files.length + 'ページ）と robots.txt を作り直しました');
console.log('公開URL: ' + SITE);
