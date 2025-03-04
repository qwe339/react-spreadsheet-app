/**
 * 書式設定に関するオプション定義
 */

// フォントサイズオプション
export const FONT_SIZE_OPTIONS = [
  { value: 'x-small', label: '極小', className: 'text-xs' },
  { value: 'small', label: '小', className: 'text-sm' },
  { value: 'medium', label: '中', className: 'text-md' },
  { value: 'large', label: '大', className: 'text-lg' },
  { value: 'x-large', label: '極大', className: 'text-xl' },
  { value: 'xx-large', label: '特大', className: 'text-2xl' }
];

// フォントファミリーオプション
export const FONT_FAMILY_OPTIONS = [
  { value: 'sans-serif', label: 'Sans-serif', className: 'font-sans' },
  { value: 'serif', label: 'Serif', className: 'font-serif' },
  { value: 'monospace', label: 'Monospace', className: 'font-mono' },
  { value: 'meiryo', label: 'メイリオ', className: 'font-meiryo' },
  { value: 'ms-pgothic', label: 'MS Pゴシック', className: 'font-ms-pgothic' },
  { value: 'yu-gothic', label: '游ゴシック', className: 'font-yu-gothic' }
];

// テキスト配置オプション
export const TEXT_ALIGN_OPTIONS = [
  { value: 'left', label: '左揃え', className: 'text-left' },
  { value: 'center', label: '中央揃え', className: 'text-center' },
  { value: 'right', label: '右揃え', className: 'text-right' }
];

// 垂直配置オプション
export const VERTICAL_ALIGN_OPTIONS = [
  { value: 'top', label: '上揃え', className: 'align-top' },
  { value: 'middle', label: '中央揃え', className: 'align-middle' },
  { value: 'bottom', label: '下揃え', className: 'align-bottom' }
];

// テキスト装飾オプション
export const TEXT_DECORATION_OPTIONS = [
  { value: 'none', label: 'なし', className: '' },
  { value: 'underline', label: '下線', className: 'text-underline' },
  { value: 'line-through', label: '取り消し線', className: 'text-line-through' }
];

// 数値フォーマットオプション
export const NUMBER_FORMAT_OPTIONS = [
  { value: 'general', label: '標準', example: '1234.56' },
  { value: 'number', label: '数値', example: '1,234.56' },
  { value: 'percent', label: 'パーセント', example: '1234.56%' },
  { value: 'currency', label: '通貨', example: '¥1,234.56' },
  { value: 'date', label: '日付', example: '2023/01/31' },
  { value: 'time', label: '時間', example: '13:45:00' },
  { value: 'datetime', label: '日付と時刻', example: '2023/01/31 13:45:00' },
  { value: 'scientific', label: '指数', example: '1.23E+03' },
  { value: 'fraction', label: '分数', example: '1234 9/16' },
  { value: 'text', label: 'テキスト', example: '1234.56' },
  { value: 'custom', label: 'ユーザー設定', example: '任意のフォーマット' }
];

// 日付フォーマットオプション
export const DATE_FORMAT_OPTIONS = [
  { value: 'yyyy/MM/dd', label: '2023/01/31', example: '2023/01/31' },
  { value: 'yyyy年MM月dd日', label: '2023年01月31日', example: '2023年01月31日' },
  { value: 'MM/dd/yyyy', label: '01/31/2023', example: '01/31/2023' },
  { value: 'dd/MM/yyyy', label: '31/01/2023', example: '31/01/2023' },
  { value: 'yyyy-MM-dd', label: '2023-01-31', example: '2023-01-31' },
  { value: 'yy/MM/dd', label: '23/01/31', example: '23/01/31' },
  { value: 'MM/dd', label: '01/31', example: '01/31' },
  { value: 'yyyy年M月d日', label: '2023年1月31日', example: '2023年1月31日' }
];

// 時刻フォーマットオプション
export const TIME_FORMAT_OPTIONS = [
  { value: 'HH:mm:ss', label: '13:45:30', example: '13:45:30' },
  { value: 'HH:mm', label: '13:45', example: '13:45' },
  { value: 'hh:mm:ss a', label: '01:45:30 PM', example: '01:45:30 PM' },
  { value: 'hh:mm a', label: '01:45 PM', example: '01:45 PM' },
  { value: 'H時m分s秒', label: '13時45分30秒', example: '13時45分30秒' },
  { value: 'H時m分', label: '13時45分', example: '13時45分' }
];

// 罫線スタイルオプション
export const BORDER_STYLE_OPTIONS = [
  { value: 'none', label: 'なし', className: 'border-none' },
  { value: 'thin', label: '細線', className: 'border-thin' },
  { value: 'medium', label: '中線', className: 'border-medium' },
  { value: 'thick', label: '太線', className: 'border-thick' },
  { value: 'dashed', label: '破線', className: 'border-dashed' },
  { value: 'dotted', label: '点線', className: 'border-dotted' },
  { value: 'double', label: '二重線', className: 'border-double' }
];

// 罫線位置オプション
export const BORDER_POSITION_OPTIONS = [
  { value: 'all', label: 'すべての罫線', className: 'border' },
  { value: 'outside', label: '外枠', className: 'border-outside' },
  { value: 'top', label: '上', className: 'border-t' },
  { value: 'right', label: '右', className: 'border-r' },
  { value: 'bottom', label: '下', className: 'border-b' },
  { value: 'left', label: '左', className: 'border-l' },
  { value: 'horizontal', label: '水平', className: 'border-horizontal' },
  { value: 'vertical', label: '垂直', className: 'border-vertical' },
  { value: 'none', label: 'なし', className: 'border-0' }
];

// 基本カラーパレット
export const COLOR_PALETTE = [
  { value: '#000000', label: '黒' },
  { value: '#FFFFFF', label: '白' },
  { value: '#FF0000', label: '赤' },
  { value: '#00FF00', label: '緑' },
  { value: '#0000FF', label: '青' },
  { value: '#FFFF00', label: '黄' },
  { value: '#FF00FF', label: 'マゼンタ' },
  { value: '#00FFFF', label: 'シアン' },
  { value: '#C0C0C0', label: '銀' },
  { value: '#808080', label: '灰色' },
  { value: '#800000', label: 'えび茶' },
  { value: '#808000', label: 'オリーブ' },
  { value: '#008000', label: '深緑' },
  { value: '#800080', label: '紫' },
  { value: '#008080', label: 'ティール' },
  { value: '#000080', label: '紺' }
];

// グラデーションパレット（10色）
export const GRADIENT_PALETTE = [
  { value: '#F8F9FA', label: '白' },
  { value: '#E9ECEF', label: '明るい灰色' },
  { value: '#DEE2E6', label: '薄灰色' },
  { value: '#CED4DA', label: '灰色' },
  { value: '#ADB5BD', label: '中灰色' },
  { value: '#6C757D', label: '暗い灰色' },
  { value: '#495057', label: '濃い灰色' },
  { value: '#343A40', label: '暗めの黒' },
  { value: '#212529', label: '黒に近い' },
  { value: '#000000', label: '黒' }
];

// テーマカラーパレット
export const THEME_COLOR_PALETTE = [
  { value: '#007BFF', label: 'プライマリ' },
  { value: '#6C757D', label: 'セカンダリ' },
  { value: '#28A745', label: '成功' },
  { value: '#DC3545', label: '危険' },
  { value: '#FFC107', label: '警告' },
  { value: '#17A2B8', label: '情報' },
  { value: '#F8F9FA', label: '明るい' },
  { value: '#343A40', label: '暗い' }
];

// 条件付き書式のタイプ
export const CONDITIONAL_FORMAT_TYPES = [
  { value: 'greaterThan', label: '指定値より大きい' },
  { value: 'lessThan', label: '指定値より小さい' },
  { value: 'equalTo', label: '指定値に等しい' },
  { value: 'between', label: '指定値の間' },
  { value: 'top10', label: '上位10項目' },
  { value: 'bottom10', label: '下位10項目' },
  { value: 'aboveAverage', label: '平均以上' },
  { value: 'belowAverage', label: '平均以下' },
  { value: 'containsText', label: '指定文字列を含む' },
  { value: 'dateOccurring', label: '指定日付' },
  { value: 'duplicate', label: '重複する値' },
  { value: 'unique', label: '固有の値' },
  { value: 'custom', label: 'カスタム数式' }
];

// データ検証のタイプ
export const DATA_VALIDATION_TYPES = [
  { value: 'list', label: 'リストから選択' },
  { value: 'number', label: '数値' },
  { value: 'date', label: '日付' },
  { value: 'time', label: '時刻' },
  { value: 'textLength', label: 'テキストの長さ' },
  { value: 'custom', label: 'カスタム数式' }
];

// グラフタイプ
export const CHART_TYPES = [
  { value: 'bar', label: '棒グラフ', icon: '📊' },
  { value: 'line', label: '折れ線グラフ', icon: '📈' },
  { value: 'pie', label: '円グラフ', icon: '🥧' },
  { value: 'doughnut', label: 'ドーナツグラフ', icon: '🍩' },
  { value: 'area', label: '面グラフ', icon: '📉' },
  { value: 'scatter', label: '散布図', icon: '💭' },
  { value: 'bubble', label: 'バブルチャート', icon: '🫧' },
  { value: 'radar', label: 'レーダーチャート', icon: '🕸️' },
  { value: 'polarArea', label: '極座標グラフ', icon: '🔘' },
  { value: 'horizontalBar', label: '横棒グラフ', icon: '📊' },
  { value: 'mixed', label: '複合グラフ', icon: '📊📈' }
];

// グラフテーマ
export const CHART_THEMES = [
  { value: 'default', label: 'デフォルト' },
  { value: 'pastel', label: 'パステル' },
  { value: 'vivid', label: '鮮やか' },
  { value: 'monochrome', label: 'モノクロ' },
  { value: 'forest', label: '森林' },
  { value: 'ocean', label: '海洋' },
  { value: 'sunset', label: '夕焼け' },
  { value: 'neon', label: 'ネオン' }
];

// 書式クラスのマッピング
export const FORMAT_CLASS_MAPPING = {
  // フォントスタイル
  'font-bold': { property: 'fontWeight', value: 'bold' },
  'font-italic': { property: 'fontStyle', value: 'italic' },
  'text-underline': { property: 'textDecoration', value: 'underline' },
  'text-line-through': { property: 'textDecoration', value: 'line-through' },
  
  // テキスト配置
  'text-left': { property: 'textAlign', value: 'left' },
  'text-center': { property: 'textAlign', value: 'center' },
  'text-right': { property: 'textAlign', value: 'right' },
  
  // 垂直配置
  'align-top': { property: 'verticalAlign', value: 'top' },
  'align-middle': { property: 'verticalAlign', value: 'middle' },
  'align-bottom': { property: 'verticalAlign', value: 'bottom' },
  
  // フォントサイズ
  'text-xs': { property: 'fontSize', value: 'x-small' },
  'text-sm': { property: 'fontSize', value: 'small' },
  'text-md': { property: 'fontSize', value: 'medium' },
  'text-lg': { property: 'fontSize', value: 'large' },
  'text-xl': { property: 'fontSize', value: 'x-large' },
  'text-2xl': { property: 'fontSize', value: 'xx-large' }
};

// 書式プロパティからクラス名を取得する関数
export const getClassNameFromProperty = (property, value) => {
  for (const [className, mapping] of Object.entries(FORMAT_CLASS_MAPPING)) {
    if (mapping.property === property && mapping.value === value) {
      return className;
    }
  }
  return null;
};

// クラス名から書式プロパティを取得する関数
export const getPropertiesFromClassName = (className) => {
  const properties = {};
  const classes = className.split(' ').filter(Boolean);
  
  classes.forEach(cls => {
    const mapping = FORMAT_CLASS_MAPPING[cls];
    if (mapping) {
      properties[mapping.property] = mapping.value;
    }
  });
  
  return properties;
};

export default {
  FONT_SIZE_OPTIONS,
  FONT_FAMILY_OPTIONS,
  TEXT_ALIGN_OPTIONS,
  VERTICAL_ALIGN_OPTIONS,
  TEXT_DECORATION_OPTIONS,
  NUMBER_FORMAT_OPTIONS,
  DATE_FORMAT_OPTIONS,
  TIME_FORMAT_OPTIONS,
  BORDER_STYLE_OPTIONS,
  BORDER_POSITION_OPTIONS,
  COLOR_PALETTE,
  GRADIENT_PALETTE,
  THEME_COLOR_PALETTE,
  CONDITIONAL_FORMAT_TYPES,
  DATA_VALIDATION_TYPES,
  CHART_TYPES,
  CHART_THEMES,
  FORMAT_CLASS_MAPPING,
  getClassNameFromProperty,
  getPropertiesFromClassName
};