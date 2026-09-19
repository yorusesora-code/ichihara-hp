/* ============================================================
   予備データ（ネットにもローカルCSVにも到達できないとき用）
   data/ フォルダのCSVと同じ内容です。
   直接編集せず、CSVを直したあとに次を実行してください。
       node tools/build-fallback.js
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
  'エアコンクリーニング,Air conditioner cleaning,家庭用エアコン,Residential AC,窓用エアコン,Window unit,15000,,14000,,,TRUE',
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

window.BUILTIN_FAQ = [
  'グループ,グループ_en,質問,質問_en,回答,回答_en,補足,補足_en,リンク文言,リンク文言_en,リンクURL,公開',
  '施工について,WORK,エアコンの設置場所のスペースはどれくらい空いていればいいですか？,How much clearance does the air conditioner need?,エアコンを分解いたしますので、上下左右に約5〜10cm空いていれば施工可能です。,"Because we disassemble the unit, roughly 5–10 cm of clearance on all sides is enough.",,,,,,TRUE',
  '施工について,WORK,エアコンが稼働していない、またはエラーコードが出ていても施工できますか？,Can you clean a unit that will not run or is showing an error code?,上記の状態の場合、先にメーカー点検が必要となりますので、施工をお断りさせていただいております。,"In those cases a manufacturer inspection is needed first, so we have to decline the job.",,,,,,TRUE',
  '施工について,WORK,複数台まとめて対応してもらえますか？,Can you handle several units at once?,対応可能です。台数が多めの場合は、何日かに分けて施工させていただく場合もございます。,Yes. For larger numbers of units we may split the work across several days.,,,,,,TRUE',
  '施工について,WORK,古いエアコンでも施工してもらえますか？,Will you clean an older air conditioner?,エアコンの耐久年数が9〜10年のため、製造から9〜10年を超える商品は、現地判断の後にお断りする可能性がございます。あらかじめご了承ください。,"Air conditioners typically last 9–10 years, so units older than that may be declined after an on-site assessment. Thank you for your understanding.",,,,,,TRUE',
  '料金・お支払いについて,PRICE,お支払い方法は何がありますか？,What payment methods do you accept?,現地での作業後、現金にてお支払いいただいております（現段階）。,"At present, cash on site after the work is completed.",※今後、請求書払いやクレジット決済等の導入も検討しております。,Invoicing and card payment are under consideration for the future.,,,,TRUE',
  '料金・お支払いについて,PRICE,駐車場代はかかりますか？,Do I have to pay for parking?,駐車場代のみお客様のご負担となります。作業後、現地にて現金でお支払いをお願いいたします。,"Parking is the only cost you cover, payable in cash on site after the work.",※お借りできる駐車スペースがある場合は、費用は発生いたしません。,"If a parking space is available for us to use, there is no charge.",,,,TRUE',
  '料金・お支払いについて,PRICE,キャンセル費用は発生しますか？,Is there a cancellation fee?,"前日までのご連絡であれば発生いたしません。当日のキャンセルはキャンセル料3,300円（税込）、訪問時のキャンセルは出張料として5,500円（税込）を頂戴しております。","Not if you tell us the day before. Same-day cancellation is ¥3,300 (incl. tax), and cancellation once we have arrived incurs a ¥5,500 (incl. tax) call-out fee.",,,,,,TRUE',
  '料金・お支払いについて,PRICE,大阪府外でも来てもらえますか？,Do you travel outside Osaka Prefecture?,京都・滋賀・兵庫・奈良にもお伺いしております。ただし地域によっては、別途交通費が発生する場合がございます。詳しくは下記をご覧ください。,"We also visit Kyoto, Shiga, Hyogo and Nara, though a travel surcharge may apply depending on the area. See the page below.",,,対応エリア,service area,area.html,TRUE',
  '保証・アフターサービスについて,WARRANTY,作業後に汚れが残っていた場合はどうなりますか？,What if dirt remains after the job?,施工後1週間以内であれば、無償で再施工いたします。お気づきの点がございましたらお早めにご連絡ください。,We will re-clean free of charge within one week. Please let us know as soon as you notice anything.,※カビ汚れや汚れの酷い箇所、色の変色・油焼けは取り切れない場合がございます。,"Heavy mould, severe soiling, discolouration and grease burns may not come out completely.",,,,TRUE',
  '保証・アフターサービスについて,WARRANTY,作業中に破損した場合はどうなりますか？,What happens if something is damaged during the work?,作業中に発生した破損については、当社が保証いたします。,Any damage caused during the work is covered by us.,,,,,,TRUE',
''].join('\n');

window.BUILTIN_OTHER = [
  'グループ,グループ_en,サービス名,サービス名_en,説明,説明_en,公開',
  '暮らし・作業のサービス,Home & practical work,造園作業,Gardening,草刈り・草むしりから砂利敷き、落ち葉の掃除まで。お庭まわりの作業を承ります。,"Mowing, weeding, gravel laying and clearing fallen leaves — general work around the garden.",TRUE',
  '暮らし・作業のサービス,Home & practical work,引越し・運搬,Moving & transport,単身・オフィス・夜間・遠方の引越しや、荷物の運搬に対応します。,"Single-person, office, night-time and long-distance moves, plus general transport of goods.",TRUE',
  '暮らし・作業のサービス,Home & practical work,不用品回収,Unwanted item collection,家具・家電・衣類・残置物など、不要になったものをまとめて回収します。,"Furniture, appliances, clothing and leftover items collected together.",TRUE',
  '暮らし・作業のサービス,Home & practical work,エアコン関係,Air conditioner work,取り外し・取り付け・移設・ガス充填・点検に対応します。,"Removal, installation, relocation, gas charging and inspection.",TRUE',
  '暮らし・作業のサービス,Home & practical work,荷物運び,Heavy lifting,階段での運搬、積み込み補助、吊り上げ・吊り下げ、重量物の移動など。,"Carrying up stairs, loading assistance, hoisting and moving heavy items.",TRUE',
  '暮らし・作業のサービス,Home & practical work,家具組み立て,Furniture assembly,IKEAやLOWYAなどの家具を組み立てます。説明書がなくても対応可能です。,"Assembly of IKEA, LOWYA and similar furniture — even without the instructions.",TRUE',
  '暮らし・作業のサービス,Home & practical work,ゴミ屋敷片付け,Hoarded home clearance,片付けから全回収、清掃・消臭まで。お部屋をリセットします。,"Clearing, full removal, cleaning and deodorising to reset the room.",TRUE',
  '暮らし・作業のサービス,Home & practical work,遺品整理・生前整理,Estate & pre-death clearance,仕分け、残置物の回収、清掃まで一貫して承ります。,"Sorting, removal of remaining items and cleaning, all handled together.",TRUE',
  '暮らし・作業のサービス,Home & practical work,各種工事,Construction work,塗装・屋根・電気・修繕・大工・水道・室内工事などに対応します。,"Painting, roofing, electrical, repairs, carpentry, plumbing and interior work.",TRUE',
  '暮らし・作業のサービス,Home & practical work,DIYサービス,DIY service,棚づくりや店舗・室内のDIY、オーダーメイドのご相談も承ります。,"Shelving, shop and interior DIY, plus made-to-order requests.",TRUE',
  '暮らし・作業のサービス,Home & practical work,清掃・消臭,Cleaning & deodorising,お部屋や店舗の清掃、ペット臭の消臭、大掃除、高圧洗浄など。,"Cleaning homes and shops, pet odour removal, deep cleans and pressure washing.",TRUE',
  '暮らし・作業のサービス,Home & practical work,害虫・害獣駆除,Pest control,ゴキブリ・ハチ・ネズミの駆除、野良猫対策などに対応します。,"Cockroaches, wasps and rodents, plus measures against stray cats.",TRUE',
  'サポート・相談のサービス,Support & consultation,代行サービス,Errand services,買物・電話・受取・立会い・代理出席・場所取りなどを代わりに行います。,"Shopping, phone calls, collections, attending on your behalf and holding places in queues.",TRUE',
  'サポート・相談のサービス,Support & consultation,同行サービス,Accompaniment,一人では行きにくい場所へ同行します。病院、お墓参り、遠方への外出など。,"We come with you to places that are hard to face alone — hospitals, graves, trips far from home.",TRUE',
  'サポート・相談のサービス,Support & consultation,トラブル解決,Trouble resolution,近隣トラブル、騒音、人間関係のお悩みなどのご相談を承ります。,"Neighbour disputes, noise problems and difficulties with personal relationships.",TRUE',
  'サポート・相談のサービス,Support & consultation,悩み相談,Someone to talk to,話を聞いてほしい、どうしていいかわからない。そんなときにご相談ください。,"When you just need someone to listen, or do not know what to do next.",TRUE',
  'サポート・相談のサービス,Support & consultation,インターネット作業,Internet & devices,Wi-Fi接続、パソコン・スマホの操作、公式LINE作成などをお手伝いします。,"Wi-Fi setup, help with computers and smartphones, and setting up official LINE accounts.",TRUE',
  'サポート・相談のサービス,Support & consultation,ペット関係,Pet support,里親探し、迷子のペット探し、餌やり、保護などに対応します。,"Finding new homes, searching for lost pets, feeding and rescue.",TRUE',
  'サポート・相談のサービス,Support & consultation,撮影・動画編集,Photo & video,記念撮影、ドローン空撮、記念動画の作成、動画編集を承ります。,"Commemorative photography, drone footage, memorial videos and editing.",TRUE',
''].join('\n');
