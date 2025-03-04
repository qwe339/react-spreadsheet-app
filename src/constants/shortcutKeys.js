/**
 * キーボードショートカットの定義
 */

// キーの表示名を定義
export const KEY_DISPLAY_NAMES = {
  Ctrl: 'Ctrl',
  Alt: 'Alt',
  Shift: 'Shift',
  Enter: 'Enter',
  Tab: 'Tab',
  Escape: 'Esc',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Backspace: 'Backspace',
  Delete: 'Delete',
  Home: 'Home',
  End: 'End',
  PageUp: 'Page Up',
  PageDown: 'Page Down',
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12',
  ' ': 'スペース',
  '+': '+',
  '-': '-',
  '=': '=',
  '[': '[',
  ']': ']',
  '\\': '\\',
  ';': ';',
  "'": "'",
  ',': ',',
  '.': '.',
  '/': '/'
};

// ショートカットキーの定義
export const SHORTCUT_KEYS = [
  // ファイル関連
  {
    id: 'newFile',
    action: 'onNew',
    keys: { ctrlKey: true, key: 'n' },
    description: '新規作成'
  },
  {
    id: 'openFile',
    action: 'onOpen',
    keys: { ctrlKey: true, key: 'o' },
    description: '開く'
  },
  {
    id: 'saveFile',
    action: 'onSave',
    keys: { ctrlKey: true, key: 's' },
    description: '保存'
  },
  {
    id: 'saveAsFile',
    action: 'onSaveAs',
    keys: { ctrlKey: true, shiftKey: true, key: 's' },
    description: '名前を付けて保存'
  },
  {
    id: 'print',
    action: 'onPrint',
    keys: { ctrlKey: true, key: 'p' },
    description: '印刷'
  },

  // 編集関連
  {
    id: 'undo',
    action: 'onUndo',
    keys: { ctrlKey: true, key: 'z' },
    description: '元に戻す'
  },
  {
    id: 'redo',
    action: 'onRedo',
    keys: { ctrlKey: true, key: 'y' },
    description: 'やり直し'
  },
  {
    id: 'redoAlt',
    action: 'onRedo',
    keys: { ctrlKey: true, shiftKey: true, key: 'z' },
    description: 'やり直し'
  },
  {
    id: 'cut',
    action: 'onCut',
    keys: { ctrlKey: true, key: 'x' },
    description: '切り取り'
  },
  {
    id: 'copy',
    action: 'onCopy',
    keys: { ctrlKey: true, key: 'c' },
    description: 'コピー'
  },
  {
    id: 'paste',
    action: 'onPaste',
    keys: { ctrlKey: true, key: 'v' },
    description: '貼り付け'
  },
  {
    id: 'selectAll',
    action: 'onSelectAll',
    keys: { ctrlKey: true, key: 'a' },
    description: 'すべて選択'
  },
  {
    id: 'search',
    action: 'onSearch',
    keys: { ctrlKey: true, key: 'f' },
    description: '検索'
  },
  {
    id: 'replace',
    action: 'onReplace',
    keys: { ctrlKey: true, key: 'h' },
    description: '置換'
  },
  {
    id: 'delete',
    action: 'onDelete',
    keys: { key: 'Delete' },
    description: '削除'
  },

  // 書式関連
  {
    id: 'bold',
    action: 'onApplyBold',
    keys: { ctrlKey: true, key: 'b' },
    description: '太字'
  },
  {
    id: 'italic',
    action: 'onApplyItalic',
    keys: { ctrlKey: true, key: 'i' },
    description: '斜体'
  },
  {
    id: 'underline',
    action: 'onApplyUnderline',
    keys: { ctrlKey: true, key: 'u' },
    description: '下線'
  },

  // データ関連
  {
    id: 'fillDown',
    action: 'onFillDown',
    keys: { ctrlKey: true, key: 'd' },
    description: '下方向へコピー'
  },
  {
    id: 'fillRight',
    action: 'onFillRight',
    keys: { ctrlKey: true, key: 'r' },
    description: '右方向へコピー'
  },
  {
    id: 'autoSum',
    action: 'onAutoSum',
    keys: { altKey: true, key: '=' },
    description: 'オートSUM'
  },
  {
    id: 'recalculate',
    action: 'onRecalculate',
    keys: { key: 'F9' },
    description: '再計算'
  },

  // 表示関連
  {
    id: 'zoomIn',
    action: 'onZoomIn',
    keys: { ctrlKey: true, key: '+' },
    description: '拡大'
  },
  {
    id: 'zoomOut',
    action: 'onZoomOut',
    keys: { ctrlKey: true, key: '-' },
    description: '縮小'
  },
  {
    id: 'resetZoom',
    action: 'onResetZoom',
    keys: { ctrlKey: true, key: '0' },
    description: 'ズームをリセット'
  },

  // セル操作関連
  {
    id: 'editCell',
    action: 'onEditCell',
    keys: { key: 'F2' },
    description: 'セル編集'
  },
  {
    id: 'confirmCellEdit',
    action: 'onConfirmEdit',
    keys: { key: 'Enter' },
    description: '編集を確定'
  },
  {
    id: 'cancelCellEdit',
    action: 'onCancelEdit',
    keys: { key: 'Escape' },
    description: '編集をキャンセル'
  },
  {
    id: 'moveToNextCell',
    action: 'onMoveToNextCell',
    keys: { key: 'Tab' },
    description: '次のセルへ移動'
  },
  {
    id: 'moveToPrevCell',
    action: 'onMoveToPrevCell',
    keys: { shiftKey: true, key: 'Tab' },
    description: '前のセルへ移動'
  },
  {
    id: 'moveUp',
    action: 'onMoveUp',
    keys: { key: 'ArrowUp' },
    description: '上へ移動'
  },
  {
    id: 'moveDown',
    action: 'onMoveDown',
    keys: { key: 'ArrowDown' },
    description: '下へ移動'
  },
  {
    id: 'moveLeft',
    action: 'onMoveLeft',
    keys: { key: 'ArrowLeft' },
    description: '左へ移動'
  },
  {
    id: 'moveRight',
    action: 'onMoveRight',
    keys: { key: 'ArrowRight' },
    description: '右へ移動'
  },
  {
    id: 'extendSelectionUp',
    action: 'onExtendSelectionUp',
    keys: { shiftKey: true, key: 'ArrowUp' },
    description: '選択範囲を上へ拡張'
  },
  {
    id: 'extendSelectionDown',
    action: 'onExtendSelectionDown',
    keys: { shiftKey: true, key: 'ArrowDown' },
    description: '選択範囲を下へ拡張'
  },
  {
    id: 'extendSelectionLeft',
    action: 'onExtendSelectionLeft',
    keys: { shiftKey: true, key: 'ArrowLeft' },
    description: '選択範囲を左へ拡張'
  },
  {
    id: 'extendSelectionRight',
    action: 'onExtendSelectionRight',
    keys: { shiftKey: true, key: 'ArrowRight' },
    description: '選択範囲を右へ拡張'
  },
  {
    id: 'moveToFirstCell',
    action: 'onMoveToFirstCell',
    keys: { ctrlKey: true, key: 'Home' },
    description: '最初のセルへ移動'
  },
  {
    id: 'moveToLastCell',
    action: 'onMoveToLastCell',
    keys: { ctrlKey: true, key: 'End' },
    description: '最後のセルへ移動'
  },
  {
    id: 'moveToRowStart',
    action: 'onMoveToRowStart',
    keys: { key: 'Home' },
    description: '行の先頭へ移動'
  },
  {
    id: 'moveToRowEnd',
    action: 'onMoveToRowEnd',
    keys: { key: 'End' },
    description: '行の末尾へ移動'
  },

  // シート関連
  {
    id: 'nextSheet',
    action: 'onNextSheet',
    keys: { ctrlKey: true, key: 'PageDown' },
    description: '次のシートへ移動'
  },
  {
    id: 'prevSheet',
    action: 'onPrevSheet',
    keys: { ctrlKey: true, key: 'PageUp' },
    description: '前のシートへ移動'
  },
  {
    id: 'newSheet',
    action: 'onAddSheet',
    keys: { shiftKey: true, altKey: true, key: 'InsertSheet' },
    description: '新しいシートを追加'
  },

  // ヘルプ
  {
    id: 'showHelp',
    action: 'onShowHelp',
    keys: { key: 'F1' },
    description: 'ヘルプを表示'
  }
];

// キーコードからショートカットを検索する関数
export const findShortcutByKeyEvent = (event) => {
  return SHORTCUT_KEYS.find(shortcut => {
    const keys = shortcut.keys;
    return (
      (keys.ctrlKey === undefined || keys.ctrlKey === event.ctrlKey) &&
      (keys.altKey === undefined || keys.altKey === event.altKey) &&
      (keys.shiftKey === undefined || keys.shiftKey === event.shiftKey) &&
      (keys.metaKey === undefined || keys.metaKey === event.metaKey) &&
      keys.key.toLowerCase() === event.key.toLowerCase()
    );
  });
};

// ショートカットの表示用文字列を生成する関数
export const formatShortcut = (shortcut) => {
  const keys = shortcut.keys;
  const parts = [];
  
  if (keys.ctrlKey) parts.push(KEY_DISPLAY_NAMES.Ctrl);
  if (keys.altKey) parts.push(KEY_DISPLAY_NAMES.Alt);
  if (keys.shiftKey) parts.push(KEY_DISPLAY_NAMES.Shift);
  if (keys.metaKey) parts.push('⌘');
  
  const keyName = KEY_DISPLAY_NAMES[keys.key] || keys.key.toUpperCase();
  parts.push(keyName);
  
  return parts.join('+');
};

// アクション別のショートカットを取得する
export const getShortcutByAction = (actionName) => {
  return SHORTCUT_KEYS.find(shortcut => shortcut.action === actionName);
};

export default SHORTCUT_KEYS;