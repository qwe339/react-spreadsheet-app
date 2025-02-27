import React, { useState } from 'react';
import './MenuBar.css';

const MenuBar = ({
  onNewFile,
  onOpenFile,
  onSave,
  onSaveAs,
  onImportCSV,
  onImportExcel,
  onExportCSV,
  onExportExcel,
  onPrint,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onSearch,
  onAbout,
  onShortcuts
}) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  const handleMenuItemClick = (action) => {
    setActiveMenu(null);
    if (typeof action === 'function') {
      action();
    }
  };

  // メニュー外をクリックした時にメニューを閉じる
  const handleOutsideClick = () => {
    if (activeMenu) {
      setActiveMenu(null);
    }
  };

  return (
    <div className="menu-bar">
      <div 
        className={`menu-item ${activeMenu === 'file' ? 'active' : ''}`}
        onClick={() => handleMenuClick('file')}
      >
        ファイル
        {activeMenu === 'file' && (
          <div className="dropdown-content">
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onNewFile)}>新規作成</div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onOpenFile)}>開く...</div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onSave)}>保存</div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onSaveAs)}>名前を付けて保存...</div>
            <div className="dropdown-separator"></div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onImportCSV)}>CSVインポート...</div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onImportExcel)}>Excelインポート...</div>
            <div className="dropdown-separator"></div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onExportCSV)}>CSVエクスポート</div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onExportExcel)}>Excelエクスポート</div>
            <div className="dropdown-separator"></div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onPrint)}>印刷...</div>
          </div>
        )}
      </div>
      
      <div 
        className={`menu-item ${activeMenu === 'edit' ? 'active' : ''}`}
        onClick={() => handleMenuClick('edit')}
      >
        編集
        {activeMenu === 'edit' && (
          <div className="dropdown-content">
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onUndo)}>元に戻す</div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onRedo)}>やり直し</div>
            <div className="dropdown-separator"></div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onCut)}>切り取り</div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onCopy)}>コピー</div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onPaste)}>貼り付け</div>
            <div className="dropdown-separator"></div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onSearch)}>検索と置換...</div>
          </div>
        )}
      </div>
      
      <div 
        className={`menu-item ${activeMenu === 'view' ? 'active' : ''}`}
        onClick={() => handleMenuClick('view')}
      >
        表示
        {activeMenu === 'view' && (
          <div className="dropdown-content">
            <div className="dropdown-item">グリッド線を非表示</div>
            <div className="dropdown-item">グリッド線を表示</div>
            <div className="dropdown-separator"></div>
            <div className="dropdown-item">ウィンドウ枠の固定...</div>
          </div>
        )}
      </div>
      
      <div 
        className={`menu-item ${activeMenu === 'format' ? 'active' : ''}`}
        onClick={() => handleMenuClick('format')}
      >
        書式
        {activeMenu === 'format' && (
          <div className="dropdown-content">
            <div className="dropdown-item">セルの書式...</div>
            <div className="dropdown-separator"></div>
            <div className="dropdown-item">太字</div>
            <div className="dropdown-item">斜体</div>
            <div className="dropdown-item">下線</div>
            <div className="dropdown-separator"></div>
            <div className="dropdown-item">左揃え</div>
            <div className="dropdown-item">中央揃え</div>
            <div className="dropdown-item">右揃え</div>
          </div>
        )}
      </div>
      
      <div 
        className={`menu-item ${activeMenu === 'help' ? 'active' : ''}`}
        onClick={() => handleMenuClick('help')}
      >
        ヘルプ
        {activeMenu === 'help' && (
          <div className="dropdown-content">
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onAbout)}>バージョン情報</div>
            <div className="dropdown-item" onClick={() => handleMenuItemClick(onShortcuts)}>キーボードショートカット</div>
          </div>
        )}
      </div>
      
      {/* メニューが開いている時は背景クリックでメニューを閉じる */}
      {activeMenu && (
        <div 
          className="menu-backdrop"
          onClick={handleOutsideClick}
        />
      )}
    </div>
  );
};

export default MenuBar;