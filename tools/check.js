/* ============================================================
   ざっくり自己点検スクリプト
   ------------------------------------------------------------
       node tools/check.js

   ・HTML で使っている data-i18n のキーが、assets/i18n.js に無い
   ・assets/i18n.js にあるのに、どこからも使われていない
   ・href のリンク先ファイル／ページ内 id が存在しない
   ・画像ファイルが存在しない
   を洗い出します。公開前の確認用です。
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

global.window = {};
require(path.join(ROOT, 'assets/i18n.js'));
const DICT = global.window.I18N;

const files = require('./pages.js')(ROOT);
const used = new Set();
const problems = [];

const ids = {};
files.forEach(f => {
  const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
  ids[f] = new Set([...s.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
});

files.forEach(f => {
  const s = fs.readFileSync(path.join(ROOT, f), 'utf8');

  [...s.matchAll(/(?:data-i18n(?:-aria|-alt|-title)?|data-title|data-desc|data-unit-key)="([^"]+)"/g)].forEach(m => {
    used.add(m[1]);
    if (!DICT[m[1]]) problems.push(f + ': 辞書にないキー → ' + m[1]);
  });

  [...s.matchAll(/(?:href|src)="([^"]+)"/g)].forEach(m => {
    const v = m[1];
    if (/^(https?:|tel:|mailto:|data:|#)/.test(v)) {
      if (v.startsWith('#') && v.length > 1 && !ids[f].has(v.slice(1))) {
        problems.push(f + ': ページ内リンク先が無い → ' + v);
      }
      return;
    }
    const [file, hash] = v.split('#');
    if (!fs.existsSync(path.join(ROOT, file))) {
      problems.push(f + ': ファイルが無い → ' + v);
    } else if (hash && ids[file] && !ids[file].has(hash)) {
      problems.push(f + ': リンク先ページに id が無い → ' + v);
    }
  });
});

// JS の中で t('キー') として使われているものも「使用済み」とみなす
['assets/main.js'].forEach(f => {
  const js = fs.readFileSync(path.join(ROOT, f), 'utf8');
  [...js.matchAll(/t\('([^']+)'\)/g)].forEach(m => used.add(m[1]));
});

// JS が状況に応じて組み立てて使うキー（検出できないので除外）
const DYNAMIC = ['header.menuOpen', 'header.menuClose', 'psum.count', 'psum.count1'];

Object.keys(DICT).forEach(k => {
  if (DYNAMIC.indexOf(k) >= 0) return;
  if (!used.has(k)) problems.push('（未使用の辞書キー）' + k);
});

if (!problems.length) {
  console.log('問題は見つかりませんでした（' + files.length + 'ページ／辞書 ' +
              Object.keys(DICT).length + 'キー）');
} else {
  problems.forEach(p => console.log(p));
  console.log('---');
  console.log(problems.length + ' 件');
}
