/* ============================================================
   市原建設 ホームページ 設定ファイル
   ここだけ書き換えれば、スプレッドシート連携や表示設定を変更できます。
   （画面に出る文言そのものは assets/i18n.js にまとまっています）
   ============================================================ */
window.SITE_CONFIG = {

  /* --- 公開URL ---------------------------------------------
     canonical・OGP画像・sitemap.xml・構造化データで使います。
     独自ドメインに変えたら、ここを直して次の2つを実行してください。
         node tools/sync-text.js
         node tools/build-sitemap.js
     （最後は必ず / で終えてください） */
  site: {
    url: 'https://ichihara-hp.pages.dev/',

    /* Cloudflare Pages は /aircon.html へのアクセスを /aircon へ転送します。
       そのため canonical とサイトマップには「.htmlなし」のURLを載せます。
       .html のまま配信するサーバーへ引っ越すときは false にしてください。 */
    stripHtmlExtension: true,

    /* Googleサーチコンソールの所有者確認コード。
       Googleの「HTMLタグ」方式で表示される
           <meta name="google-site-verification" content="ここの文字列">
       の「ここの文字列」だけを貼り付けて、node tools/sync-text.js を実行すると
       トップページに埋め込まれます。空のままなら何も入りません。 */
    googleSiteVerification: ''
  },

  /* --- 会社情報 -------------------------------------------- */
  company: {
    name: '市原建設',
    representative: '富山 凛香',
    zip: '〒572-0050',
    address: '大阪府寝屋川市黒原城内町11-10 ラ・エアナ15号',
    tel: '06-7632-5062',
    hours: '平日・土日 9:00〜18:00（祝日は翌営業日対応）'
  },

  /* --- Googleスプレッドシート連携 ---------------------------
     「ファイル → 共有 → ウェブに公開」で
     形式に「カンマ区切り形式(.csv)」を選んで発行し、
     表示されたURLをそのまま下に貼り付けてください。
     空のままなら data/ フォルダのCSVが表示されます。
     -------------------------------------------------------- */
  sheets: {
    /* 【方法1・かんたん】スプレッドシートのIDとシート（タブ）の名前を書くだけ。
       IDはブラウザのアドレス欄の /d/ と /edit の間の文字列です。
         https://docs.google.com/spreadsheets/d/★ここ★/edit
       スプレッドシートの共有を「リンクを知っている全員（閲覧者）」にしてください。
       ※タブの名前を変えたら、ここも合わせて直してください。 */
    sheetId:      '1QkslWNs7Bhz_NB0q-8Pkf88eThuMKDSABV-ROuGp4yc',
    noticesSheet: 'お知らせ',
    pricesSheet:  '料金表',

    /* 【方法2・より確実】「ファイル → 共有 → ウェブに公開」で
       形式に「カンマ区切り形式(.csv)」を選んで発行し、出てきたURLを貼ります。
       こちらを書いた場合は、上のIDより優先されます。
       （反映まで最大5分ほどかかりますが、Googleが正式に用意している方法です） */
    noticesCsvUrl: '',
    pricesCsvUrl:  '',

    // ↓ 上のどれも読めなかったときに使うローカルCSV（初期表示用）
    noticesFallback: 'data/notices.csv',
    pricesFallback:  'data/prices.csv',

    /* シートの1行目（見出し）に、この列が無ければ「読めなかった」と判断して
       ローカルCSVに切り替えます。見出しを消してしまったときの保険です。 */
    noticesRequired: ['日付', 'タイトル'],
    pricesRequired:  ['カテゴリ', 'メニュー', '料金'],

    // お知らせの表示件数（各ページの data-limit が優先されます）
    noticeLimit: 6
  },

  /* --- 「◯◯円〜」の目安表示から除外する「対象」 ---------------
     トップページの料金カードやサービスカードの「9,000円〜」は
     料金表の最安値から自動計算しています。
     オプションなど、単体では基本料金にならない行はここで除外します。
     ※必ず日本語の「対象」名で指定してください。
     -------------------------------------------------------- */
  summaryExcludeGroups: ['オプション'],

  /* --- 料金表カテゴリごとの列見出しと補足 --------------------
     キーは必ず日本語の「カテゴリ」名にしてください。
     _en が付いたものは、英語表示のときに使われます。
     -------------------------------------------------------- */
  priceMeta: {
    'エアコンクリーニング': {
      col1: '1台目',    col1_en: '1st unit',
      col2: '2台目以降', col2_en: '2nd unit onward',
      note:    'エアコン本体を分解し、部品および本体を高圧洗浄機で洗浄いたします。',
      note_en: 'We disassemble the unit and pressure-wash both the parts and the body.'
    },
    'ハウスクリーニング': {
      col1: '料金', col1_en: 'Price',
      col2: '',     col2_en: '',
      note:    '※カビ汚れや汚れの酷い箇所、素材の変色・油焼けは取り切れない場合がございます。',
      note_en: 'Heavy mould, discolouration and grease burns may not come out completely.'
    },
    '空室清掃': {
      col1: '料金', col1_en: 'Price',
      col2: '',     col2_en: '',
      note:    'リフォーム後のお引越し前のお住まいや、マンションの空き部屋などの清掃を承ります。',
      note_en: 'For renovated homes before move-in and vacant apartments.'
    },
    'その他簡易作業': {
      col1: '料金', col1_en: 'Price',
      col2: '',     col2_en: '',
      note:    '内容を確認のうえ、その都度お見積りいたします。まずはご相談ください。',
      note_en: 'We review each request and quote accordingly. Please get in touch.'
    }
  }
};
