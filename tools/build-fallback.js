/* ============================================================
   data/notices.csv と data/prices.csv から assets/fallback-data.js を作り直します。
   ------------------------------------------------------------
       node tools/build-fallback.js

   fallback-data.js は「スプレッドシートにもCSVにも到達できなかったとき」に
   使われる予備データです。CSVを直したら、このコマンドで合わせてください。
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

function lines(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\s+$/, '')
    .split('\n');
}
// JS の文字列リテラルとして安全な形にする
function q(s) { return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; }

function block(name, file) {
  const rows = lines(file).map(l => '  ' + q(l) + ',');
  return 'window.' + name + ' = [\n' + rows.join('\n') + "\n''].join('\\n');\n";
}

const out =
`/* ============================================================
   予備データ（ネットにもローカルCSVにも到達できないとき用）
   data/notices.csv・data/prices.csv と同じ内容です。
   直接編集せず、CSVを直したあとに次を実行してください。
       node tools/build-fallback.js
   ============================================================ */
` + block('BUILTIN_NOTICES', 'data/notices.csv') + '\n' + block('BUILTIN_PRICES', 'data/prices.csv');

fs.writeFileSync(path.join(ROOT, 'assets/fallback-data.js'), out, 'utf8');
console.log('assets/fallback-data.js を作り直しました');
