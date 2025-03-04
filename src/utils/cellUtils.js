/**
 * セル操作に関するユーティリティ関数
 */

/**
 * 列インデックスをアルファベット表記に変換する (0 -> A, 1 -> B, ..., 26 -> AA)
 * @param {number} colIndex 列インデックス (0から始まる)
 * @return {string} アルファベット表記
 */
export function numToLetter(colIndex) {
  let temp, letter = '';
  while (colIndex >= 0) {
    temp = colIndex % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    colIndex = (colIndex - temp) / 26 - 1;
  }
  return letter;
}

/**
 * 行と列のインデックスからセルアドレスを生成する
 * @param {number} rowIndex 行インデックス (0から始まる)
 * @param {number} colIndex 列インデックス (0から始まる)
 * @return {string} セルアドレス (例: 'A1')
 */
export function indicesToCellAddress(rowIndex, colIndex) {
  return `${numToLetter(colIndex)}${rowIndex + 1}`;
}

/**
 * 選択範囲からレンジアドレスを生成する
 * @param {Object} range {startRow, startCol, endRow, endCol}
 * @return {string} レンジアドレス (例: 'A1:B2')
 */
export function getRangeAddress(range) {
  if (!range) return '';
  
  const { startRow, startCol, endRow, endCol } = range;
  return `${indicesToCellAddress(startRow, startCol)}:${indicesToCellAddress(endRow, endCol)}`;
}

/**
 * 値が数値かどうかをチェックする
 * @param {any} value チェックする値
 * @return {boolean} 数値の場合はtrue
 */
export function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}