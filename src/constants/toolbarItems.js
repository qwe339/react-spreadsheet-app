/**
 * ツールバーのボタン定義
 */

export const TOOLBAR_GROUPS = [
  {
    id: 'file',
    items: [
      {
        id: 'new',
        tooltip: '新規作成',
        icon: '+',
        action: 'onNew'
      },
      {
        id: 'open',
        tooltip: '開く',
        icon: '📂',
        action: 'onOpen'
      },
      {
        id: 'save',
        tooltip: '保存',
        icon: '💾',
        action: 'onSave'
      }
    ]
  },
  {
    id: 'edit',
    items: [
      {
        id: 'undo',
        tooltip: '元に戻す',
        icon: '↩️',
        action: 'onUndo'
      },
      {
        id: 'redo',
        tooltip: 'やり直し',
        icon: '↪️',
        action: 'onRedo'
      }
    ]
  },
  {
    id: 'clipboard',
    items: [
      {
        id: 'cut',
        tooltip: '切り取り',
        icon: '✂️',
        action: 'onCut'
      },
      {
        id: 'copy',
        tooltip: 'コピー',
        icon: '📋',
        action: 'onCopy'
      },
      {
        id: 'paste',
        tooltip: '貼り付け',
        icon: '📌',
        action: 'onPaste'
      }
    ]
  },
  {
    id: 'font',
    items: [
      {
        id: 'bold',
        tooltip: '太字',
        icon: 'B',
        action: 'onApplyBold',
        toggleable: true
      },
      {
        id: 'italic',
        tooltip: '斜体',
        icon: 'I',
        action: 'onApplyItalic',
        toggleable: true
      },
      {
        id: 'underline',
        tooltip: '下線',
        icon: 'U',
        action: 'onApplyUnderline',
        toggleable: true
      }
    ]
  },
  {
    id: 'alignment',
    items: [
      {
        id: 'alignLeft',
        tooltip: '左揃え',
        icon: '⬅️',
        action: 'onAlignLeft',
        toggleable: true,
        group: 'alignment'
      },
      {
        id: 'alignCenter',
        tooltip: '中央揃え',
        icon: '⬅️➡️',
        action: 'onAlignCenter',
        toggleable: true,
        group: 'alignment'
      },
      {
        id: 'alignRight',
        tooltip: '右揃え',
        icon: '➡️',
        action: 'onAlignRight',
        toggleable: true,
        group: 'alignment'
      }
    ]
  },
  {
    id: 'merge',
    items: [
      {
        id: 'mergeCells',
        tooltip: 'セルを結合',
        icon: '⊞',
        action: 'onMergeCells'
      },
      {
        id: 'unmergeCells',
        tooltip: '結合を解除',
        icon: '⊟',
        action: 'onUnmergeCells'
      }
    ]
  },
  {
    id: 'format',
    items: [
      {
        id: 'formatCell',
        tooltip: 'セルの書式',
        icon: '🎨',
        action: 'onFormatCell'
      },
      {
        id: 'conditionalFormat',
        tooltip: '条件付き書式',
        icon: '🎯',
        action: 'onConditionalFormat'
      }
    ]
  },
  {
    id: 'data',
    items: [
      {
        id: 'sortAsc',
        tooltip: '昇順ソート',
        icon: 'A→Z',
        action: 'onSortAsc'
      },
      {
        id: 'sortDesc',
        tooltip: '降順ソート',
        icon: 'Z→A',
        action: 'onSortDesc'
      },
      {
        id: 'filter',
        tooltip: 'フィルター',
        icon: '🔍',
        action: 'onToggleFilter',
        toggleable: true
      }
    ]
  },
  {
    id: 'insert',
    items: [
      {
        id: 'insertChart',
        tooltip: 'グラフを挿入',
        icon: '📊',
        action: 'onInsertChart'
      },
      {
        id: 'insertComment',
        tooltip: 'コメントを挿入',
        icon: '💬',
        action: 'onInsertComment'
      }
    ]
  },
  {
    id: 'tools',
    items: [
      {
        id: 'dataValidation',
        tooltip: 'データの入力規則',
        icon: '✓',
        action: 'onDataValidation'
      },
      {
        id: 'protectCells',
        tooltip: 'セルの保護',
        icon: '🔒',
        action: 'onProtectCells'
      }
    ]
  },
  {
    id: 'search',
    items: [
      {
        id: 'search',
        tooltip: '検索と置換',
        icon: '🔍',
        action: 'onSearch'
      }
    ]
  },
  {
    id: 'import-export',
    items: [
      {
        id: 'importExcel',
        tooltip: 'Excelインポート',
        icon: '📥',
        action: 'onImportExcel'
      },
      {
        id: 'exportExcel',
        tooltip: 'Excelエクスポート',
        icon: '📤',
        action: 'onExportExcel'
      }
    ]
  },
  {
    id: 'print',
    items: [
      {
        id: 'print',
        tooltip: '印刷',
        icon: '🖨️',
        action: 'onPrint'
      },
      {
        id: 'printPreview',
        tooltip: '印刷プレビュー',
        icon: '👁️',
        action: 'onPrintPreview'
      }
    ]
  }
];

// 全てのツールバーアイテムをフラット化したリスト
export const ALL_TOOLBAR_ITEMS = TOOLBAR_GROUPS.reduce((acc, group) => {
  return [...acc, ...group.items];
}, []);

// ID別のアイテムマップ
export const TOOLBAR_ITEMS_BY_ID = ALL_TOOLBAR_ITEMS.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

export default TOOLBAR_GROUPS;