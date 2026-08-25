/* ============================================================
   市原建設 ホームページ 設定ファイル
   ここだけ書き換えれば、スプレッドシート連携や表示設定を変更できます。
   （画面に出る文言そのものは assets/i18n.js にまとまっています）
   ============================================================ */
window.SITE_CONFIG = {

  /* --- 会社情報 -------------------------------------------- */
  company: {
    name: '市原建設',
    representative: '富山 凛香',
    zip: '〒534-0025',
    address: '大阪府大阪市都島区片町1丁目8-20 ヴィストゥール大阪城北',
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
    noticesCsvUrl: '',   // 「お知らせ」シートの公開CSV URL
    pricesCsvUrl:  '',   // 「料金表」シートの公開CSV URL

    // ↓ 上の2つが空のとき使われるローカルCSV（初期表示用）
    noticesFallback: 'data/notices.csv',
    pricesFallback:  'data/prices.csv',

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
