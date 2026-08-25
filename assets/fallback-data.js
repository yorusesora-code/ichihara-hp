/* ============================================================
   予備データ（ネットにもローカルCSVにも到達できないとき用）
   data/notices.csv・data/prices.csv と同じ内容です。
   通常は編集不要です。CSVを変えたときだけ合わせてください。
   ============================================================ */
window.BUILTIN_NOTICES = [
  '日付,カテゴリ,カテゴリ_en,タイトル,タイトル_en,本文,本文_en,公開',
  '2026-08-01,お知らせ,News,ホームページを公開しました,Our website is now live,市原建設のホームページを公開いたしました。エアコンクリーニング・ハウスクリーニングのご相談はお気軽にお問い合わせください。,The Ichihara Kensetsu website is now open. Please get in touch about air conditioner cleaning or house cleaning.,TRUE',
  '2026-07-15,重要,Important,夏季の繁忙につきご予約が混み合っております,Bookings are busy through the summer,7月〜9月はエアコンクリーニングのご依頼が集中いたします。ご希望日での施工をご検討の方はお早めにご連絡ください。,Requests for air conditioner cleaning peak from July to September. Please contact us early if you have a preferred date.,TRUE',
  '2026-06-01,キャンペーン,Campaign,2台目以降の割引について,Discount for additional units,同日・同一住所でのエアコンクリーニングは、2台目以降を割引価格にてご案内しております。詳しくは料金表をご覧ください。,Additional air conditioners cleaned at the same address on the same day are offered at a discounted rate. See the price list for details.,TRUE',
''].join('\n');

window.BUILTIN_PRICES = [
  'カテゴリ,カテゴリ_en,対象,対象_en,メニュー,メニュー_en,料金,料金_en,料金2,備考,備考_en,公開',
  'エアコンクリーニング,Air conditioner cleaning,家庭用エアコン,Residential AC,ノーマルエアコン,Standard unit,9000,,8000,,,TRUE',
  'エアコンクリーニング,Air conditioner cleaning,家庭用エアコン,Residential AC,お掃除機能付きエアコン,Self-cleaning unit,15000,,14000,,,TRUE',
  'エアコンクリーニング,Air conditioner cleaning,家庭用エアコン,Residential AC,特殊タイプ,Special type,21000,,20000,富士通製・三菱製のサイドファンタイプなど,e.g. Fujitsu / Mitsubishi side-fan types,TRUE',
  'エアコンクリーニング,Air conditioner cleaning,業務用エアコン,Commercial AC,2方向タイプ,2-way cassette,26000,,25000,,,TRUE',
  'エアコンクリーニング,Air conditioner cleaning,業務用エアコン,Commercial AC,4方向タイプ,4-way cassette,23000,,22000,,,TRUE',
  'エアコンクリーニング,Air conditioner cleaning,業務用エアコン,Commercial AC,その他のタイプ,Other types,都度お見積り,Quote on request,,現地確認のうえお見積りいたします,Quoted after an on-site assessment,TRUE',
  'エアコンクリーニング,Air conditioner cleaning,オプション,Options,抗菌コート,Antibacterial coating,3000,,3000,,,TRUE',
  'エアコンクリーニング,Air conditioner cleaning,オプション,Options,室外機洗浄,Outdoor unit wash,3000,,3000,,,TRUE',
  'ハウスクリーニング,House cleaning,水まわり,Water areas,浴室,Bathroom,8900,,,,,TRUE',
  'ハウスクリーニング,House cleaning,水まわり,Water areas,レンジフード,Range hood,8900,,,,,TRUE',
  'ハウスクリーニング,House cleaning,水まわり,Water areas,キッチン,Kitchen,8900,,,,,TRUE',
  'ハウスクリーニング,House cleaning,水まわり,Water areas,トイレ,Toilet,4900,,,,,TRUE',
  'ハウスクリーニング,House cleaning,水まわり,Water areas,洗面所,Washbasin,4900,,,,,TRUE',
  '空室清掃,Vacant-room cleaning,マンション,Apartment,1R,Studio,15000,,,,,TRUE',
  '空室清掃,Vacant-room cleaning,マンション,Apartment,1LDK,1LDK,18000,,,,,TRUE',
  '空室清掃,Vacant-room cleaning,マンション,Apartment,2R,2 rooms,21000,,,,,TRUE',
  '空室清掃,Vacant-room cleaning,マンション,Apartment,2LDK,2LDK,24000,,,,,TRUE',
  '空室清掃,Vacant-room cleaning,マンション,Apartment,3LDK,3LDK,27000,,,,,TRUE',
  '空室清掃,Vacant-room cleaning,戸建て,Detached house,2階建て・3階建て,2- or 3-storey,都度お見積り,Quote on request,,平均50000円程度,Around 50000 yen on average,TRUE',
  'その他簡易作業,Other light work,その他,Other,人材派遣・草むしり等の簡易作業,Staffing / weeding and similar light work,都度お見積り,Quote on request,,毎回内容を確認のうえお見積りいたします,Quoted after reviewing each request,TRUE',
''].join('\n');
