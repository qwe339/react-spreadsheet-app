/**
 * アプリケーションのメニュー項目定義
 */

export const FILE_MENU = {
  id: 'file',
  label: 'ファイル',
  items: [
    {
      id: 'new',
      label: '新規作成',
      shortcut: 'Ctrl+N',
      icon: '+'
    },
    {
      id: 'open',
      label: '開く...',
      shortcut: 'Ctrl+O',
      icon: '📂'
    },
    {
      id: 'save',
      label: '保存',
      shortcut: 'Ctrl+S',
      icon: '💾'
    },
    {
      id: 'saveAs',
      label: '名前を付けて保存...',
      shortcut: 'Ctrl+Shift+S',
      icon: '💾'
    },
    { type: 'separator' },
    {
      id: 'importCSV',
      label: 'CSVインポート...',
      icon: '📥'
    },
    {
      id: 'importExcel',
      label: 'Excelインポート...',
      icon: '📥'
    },
    { type: 'separator' },
    {
      id: 'exportCSV',
      label: 'CSVエクスポート',
      icon: '📤'
    },
    {
      id: 'exportExcel',
      label: 'Excelエクスポート',
      icon: '📤'
    },
    { type: 'separator' },
    {
      id: 'print',
      label: '印刷...',
      shortcut: 'Ctrl+P',
      icon: '🖨️'
    }
  ]
};

export const EDIT_MENU = {
  id: 'edit',
  label: '編集',
  items: [
    {
      id: 'undo',
      label: '元に戻す',
      shortcut: 'Ctrl+Z',
      icon: '↩️'
    },
    {
      id: 'redo',
      label: 'やり直し',
      shortcut: 'Ctrl+Y',
      icon: '↪️'
    },
    { type: 'separator' },
    {
      id: 'cut',
      label: '切り取り',
      shortcut: 'Ctrl+X',
      icon: '✂️'
    },
    {
      id: 'copy',
      label: 'コピー',
      shortcut: 'Ctrl+C',
      icon: '📋'
    },
    {
      id: 'paste',
      label: '貼り付け',
      shortcut: 'Ctrl+V',
      icon: '📌'
    },
    { type: 'separator' },
    {
      id: 'search',
      label: '検索と置換...',
      shortcut: 'Ctrl+F',
      icon: '🔍'
    },
    { type: 'separator' },
    {
      id: 'clearContents',
      label: '内容をクリア',
      shortcut: 'Delete',
      icon: '🗑️'
    },
    {
      id: 'clearFormats',
      label: '書式をクリア',
      icon: '🧹'
    },
    {
      id: 'clearAll',
      label: 'すべてクリア',
      icon: '🗑️'
    },
    { type: 'separator' },
    {
      id: 'fillDown',
      label: '下方向へコピー',
      shortcut: 'Ctrl+D',
      icon: '↓'
    },
    {
      id: 'fillRight',
      label: '右方向へコピー',
      shortcut: 'Ctrl+R',
      icon: '→'
    }
  ]
};

export const VIEW_MENU = {
  id: 'view',
  label: '表示',
  items: [
    {
      id: 'showGridlines',
      label: 'グリッド線を表示',
      icon: '🔲',
      checkable: true,
      checked: true
    },
    {
      id: 'showHeaders',
      label: 'ヘッダーを表示',
      icon: '🔤',
      checkable: true,
      checked: true
    },
    { type: 'separator' },
    {
      id: 'freezePanes',
      label: 'ウィンドウ枠の固定...',
      icon: '❄️'
    },
    {
      id: 'unfreezeAllPanes',
      label: 'すべての枠固定を解除',
      icon: '🔥'
    },
    { type: 'separator' },
    {
      id: 'zoomIn',
      label: '拡大',
      shortcut: 'Ctrl++',
      icon: '🔍+'
    },
    {
      id: 'zoomOut',
      label: '縮小',
      shortcut: 'Ctrl+-',
      icon: '🔍-'
    },
    {
      id: 'resetZoom',
      label: 'ズームをリセット',
      shortcut: 'Ctrl+0',
      icon: '🔍'
    }
  ]
};

export const INSERT_MENU = {
  id: 'insert',
  label: '挿入',
  items: [
    {
      id: 'insertSheet',
      label: '新しいシート',
      icon: '📄+'
    },
    { type: 'separator' },
    {
      id: 'insertRow',
      label: '行を挿入',
      icon: '↓↑'
    },
    {
      id: 'insertColumn',
      label: '列を挿入',
      icon: '→←'
    },
    { type: 'separator' },
    {
      id: 'insertRowsAbove',
      label: '上に行を挿入',
      icon: '↑'
    },
    {
      id: 'insertRowsBelow',
      label: '下に行を挿入',
      icon: '↓'
    },
    {
      id: 'insertColumnsLeft',
      label: '左に列を挿入',
      icon: '←'
    },
    {
      id: 'insertColumnsRight',
      label: '右に列を挿入',
      icon: '→'
    },
    { type: 'separator' },
    {
      id: 'insertChart',
      label: 'グラフ...',
      icon: '📊'
    },
    {
      id: 'insertImage',
      label: '画像...',
      icon: '🖼️'
    },
    {
      id: 'insertComment',
      label: 'コメント',
      icon: '💬'
    }
  ]
};

export const FORMAT_MENU = {
  id: 'format',
  label: '書式',
  items: [
    {
      id: 'formatCell',
      label: 'セルの書式...',
      icon: '🎨'
    },
    { type: 'separator' },
    {
      id: 'formatBold',
      label: '太字',
      shortcut: 'Ctrl+B',
      icon: 'B',
      checkable: true
    },
    {
      id: 'formatItalic',
      label: '斜体',
      shortcut: 'Ctrl+I',
      icon: 'I',
      checkable: true
    },
    {
      id: 'formatUnderline',
      label: '下線',
      shortcut: 'Ctrl+U',
      icon: 'U',
      checkable: true
    },
    { type: 'separator' },
    {
      id: 'formatAlignLeft',
      label: '左揃え',
      icon: '⬅️',
      checkable: true,
      group: 'align'
    },
    {
      id: 'formatAlignCenter',
      label: '中央揃え',
      icon: '⬅️➡️',
      checkable: true,
      group: 'align'
    },
    {
      id: 'formatAlignRight',
      label: '右揃え',
      icon: '➡️',
      checkable: true,
      group: 'align'
    },
    { type: 'separator' },
    {
      id: 'formatNumberGeneral',
      label: '標準',
      checkable: true,
      group: 'number'
    },
    {
      id: 'formatNumberPercent',
      label: 'パーセント',
      icon: '%',
      checkable: true,
      group: 'number'
    },
    {
      id: 'formatNumberCurrency',
      label: '通貨',
      icon: '¥',
      checkable: true,
      group: 'number'
    },
    {
      id: 'formatNumberDate',
      label: '日付',
      icon: '📅',
      checkable: true,
      group: 'number'
    },
    {
      id: 'formatNumberTime',
      label: '時刻',
      icon: '🕒',
      checkable: true,
      group: 'number'
    },
    {
      id: 'formatNumberCustom',
      label: 'ユーザー設定...',
      icon: '🔧',
      checkable: true,
      group: 'number'
    },
    { type: 'separator' },
    {
      id: 'formatConditional',
      label: '条件付き書式...',
      icon: '🎯'
    },
    { type: 'separator' },
    {
      id: 'mergeCells',
      label: 'セルを結合',
      icon: '⊞'
    },
    {
      id: 'unmergeCells',
      label: '結合を解除',
      icon: '⊟'
    }
  ]
};

export const DATA_MENU = {
  id: 'data',
  label: 'データ',
  items: [
    {
      id: 'dataSortAsc',
      label: '昇順ソート',
      icon: 'A→Z'
    },
    {
      id: 'dataSortDesc',
      label: '降順ソート',
      icon: 'Z→A'
    },
    {
      id: 'dataSortCustom',
      label: 'カスタムソート...',
      icon: '↕️'
    },
    { type: 'separator' },
    {
      id: 'dataFilterToggle',
      label: 'フィルター切替',
      icon: '🔍',
      checkable: true
    },
    {
      id: 'dataClearFilter',
      label: 'フィルターをクリア',
      icon: '🔍❌'
    },
    { type: 'separator' },
    {
      id: 'dataValidation',
      label: 'データの入力規則...',
      icon: '✓'
    },
    { type: 'separator' },
    {
      id: 'dataRemoveDuplicates',
      label: '重複データの削除...',
      icon: '🔄'
    },
    {
      id: 'dataCleanupTools',
      label: 'データクリーニング...',
      icon: '🧹'
    },
    { type: 'separator' },
    {
      id: 'dataGroupRows',
      label: '行をグループ化',
      icon: '📎'
    },
    {
      id: 'dataUngroupRows',
      label: '行のグループ化を解除',
      icon: '📎❌'
    }
  ]
};

export const TOOLS_MENU = {
  id: 'tools',
  label: 'ツール',
  items: [
    {
      id: 'toolsSpellCheck',
      label: 'スペルチェック',
      icon: '📝'
    },
    { type: 'separator' },
    {
      id: 'toolsProtectSheet',
      label: 'シートの保護...',
      icon: '🔒'
    },
    {
      id: 'toolsProtectCells',
      label: 'セルの保護...',
      icon: '🔒'
    },
    {
      id: 'toolsUnprotectSheet',
      label: 'シートの保護を解除',
      icon: '🔓'
    },
    { type: 'separator' },
    {
      id: 'toolsAutosum',
      label: 'オートSUM',
      shortcut: 'Alt+=',
      icon: 'Σ'
    },
    {
      id: 'toolsFormulas',
      label: '数式ライブラリ...',
      icon: 'ƒ'
    },
    {
      id: 'toolsFormulasRecalc',
      label: '数式の再計算',
      shortcut: 'F9',
      icon: '🔄'
    },
    { type: 'separator' },
    {
      id: 'toolsGoalSeek',
      label: 'ゴールシーク...',
      icon: '🎯'
    },
    {
      id: 'toolsSolver',
      label: 'ソルバー...',
      icon: '📊'
    }
  ]
};

export const HELP_MENU = {
  id: 'help',
  label: 'ヘルプ',
  items: [
    {
      id: 'helpDocumentation',
      label: 'ドキュメント',
      icon: '📚'
    },
    {
      id: 'helpShortcuts',
      label: 'キーボードショートカット',
      icon: '⌨️'
    },
    { type: 'separator' },
    {
      id: 'helpFeedback',
      label: 'フィードバックを送信',
      icon: '📧'
    },
    { type: 'separator' },
    {
      id: 'helpAbout',
      label: 'バージョン情報',
      icon: 'ℹ️'
    }
  ]
};

export const ALL_MENUS = [
  FILE_MENU,
  EDIT_MENU,
  VIEW_MENU,
  INSERT_MENU,
  FORMAT_MENU,
  DATA_MENU,
  TOOLS_MENU,
  HELP_MENU
];

export default ALL_MENUS;