import React, { useState, useRef } from 'react';
import './SheetTabs.css';

const SheetTabs = ({ sheets, currentSheet, onSheetChange, onAddSheet, onRenameSheet, onDeleteSheet }) => {
  const [editingTab, setEditingTab] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuSheet, setContextMenuSheet] = useState(null);
  const inputRef = useRef(null);

  // シート名のフォーマット（表示用）
  const formatSheetName = (sheetId) => {
    if (typeof sheetId !== 'string') return sheetId;
    
    if (sheetId.startsWith('sheet')) {
      const num = sheetId.replace('sheet', '');
      return `シート${num}`;
    }
    
    if (sheetId.startsWith('imported_sheet_')) {
      const num = sheetId.replace('imported_sheet_', '');
      return `インポートシート${num}`;
    }
    
    return sheetId;
  };

  // シートタブをダブルクリックしたときに編集モードに入る
  const handleDoubleClick = (sheet) => {
    setEditingTab(sheet);
    setEditValue(formatSheetName(sheet));
    
    // 次のレンダリングサイクルで入力フィールドにフォーカス
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0);
  };

  // シート名の変更を確定
  const handleRename = () => {
    if (editingTab && editValue.trim()) {
      onRenameSheet(editingTab, editValue.trim());
    }
    setEditingTab(null);
  };

  // キー入力ハンドラー
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditingTab(null);
    }
  };

  // 右クリックでコンテキストメニューを表示
  const handleContextMenu = (e, sheet) => {
    e.preventDefault();
    setContextMenuSheet(sheet);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // コンテキストメニューを閉じる
  const closeContextMenu = () => {
    setShowContextMenu(false);
  };

  // コンテキストメニューのアクション
  const handleContextMenuAction = (action) => {
    if (!contextMenuSheet) return;
    
    switch (action) {
      case 'rename':
        handleDoubleClick(contextMenuSheet);
        break;
      case 'delete':
        if (window.confirm(`シート「${formatSheetName(contextMenuSheet)}」を削除しますか？`)) {
          onDeleteSheet(contextMenuSheet);
        }
        break;
      case 'addBefore':
        onAddSheet();
        break;
      case 'addAfter':
        onAddSheet();
        break;
      case 'duplicate':
        // TODO: シートの複製機能
        break;
      default:
        break;
    }
    
    closeContextMenu();
  };

  // 外部クリックを検出してコンテキストメニューを閉じる
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (showContextMenu) {
        closeContextMenu();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showContextMenu]);

  return (
    <div className="sheet-tabs-container">
      <div className="sheet-tabs">
        {sheets.map(sheet => (
          <div
            key={sheet}
            className={`sheet-tab ${sheet === currentSheet ? 'active' : ''}`}
            onClick={() => onSheetChange(sheet)}
            onDoubleClick={() => handleDoubleClick(sheet)}
            onContextMenu={(e) => handleContextMenu(e, sheet)}
          >
            {editingTab === sheet ? (
              <input
                ref={inputRef}
                className="sheet-tab-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="sheet-tab-text">{formatSheetName(sheet)}</span>
            )}
          </div>
        ))}
        <div className="sheet-tab add-sheet" onClick={onAddSheet}>
          <span className="add-icon">+</span>
        </div>
      </div>

      {showContextMenu && (
        <div
          className="sheet-context-menu"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`
          }}
        >
          <div className="menu-item" onClick={() => handleContextMenuAction('rename')}>
            名前の変更
          </div>
          <div className="menu-item" onClick={() => handleContextMenuAction('delete')}>
            削除
          </div>
          <div className="menu-separator"></div>
          <div className="menu-item" onClick={() => handleContextMenuAction('addBefore')}>
            左に新しいシートを挿入
          </div>
          <div className="menu-item" onClick={() => handleContextMenuAction('addAfter')}>
            右に新しいシートを挿入
          </div>
          <div className="menu-separator"></div>
          <div className="menu-item" onClick={() => handleContextMenuAction('duplicate')}>
            複製
          </div>
        </div>
      )}
    </div>
  );
};

export default SheetTabs;