import React, { useState } from 'react';
import './Toolbar.css';

const Toolbar = ({
  onNew,
  onOpen,
  onSave,
  onUndo,
  onRedo,
  onApplyBold,
  onApplyItalic,
  onApplyUnderline,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onMergeCells,
  onUnmergeCells,
  onSearch,
  onImportExcel,
  onExportExcel
}) => {
  const [activeButtons, setActiveButtons] = useState({
    bold: false,
    italic: false,
    underline: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false
  });

  const toggleButtonState = (button) => {
    setActiveButtons(prev => ({
      ...prev,
      [button]: !prev[button]
    }));
  };

  const resetAlignButtons = () => {
    setActiveButtons(prev => ({
      ...prev,
      alignLeft: false,
      alignCenter: false,
      alignRight: false
    }));
  };

  const handleBoldClick = () => {
    toggleButtonState('bold');
    onApplyBold();
  };

  const handleItalicClick = () => {
    toggleButtonState('italic');
    onApplyItalic();
  };

  const handleUnderlineClick = () => {
    toggleButtonState('underline');
    onApplyUnderline();
  };

  const handleAlignLeftClick = () => {
    resetAlignButtons();
    setActiveButtons(prev => ({ ...prev, alignLeft: true }));
    onAlignLeft();
  };

  const handleAlignCenterClick = () => {
    resetAlignButtons();
    setActiveButtons(prev => ({ ...prev, alignCenter: true }));
    onAlignCenter();
  };

  const handleAlignRightClick = () => {
    resetAlignButtons();
    setActiveButtons(prev => ({ ...prev, alignRight: true }));
    onAlignRight();
  };

  return (
    <div className="toolbar">
      <div className="button-group">
        <button 
          id="btn-new" 
          title="新規作成"
          onClick={onNew}
        >
          <i className="icon">+</i>
        </button>
        <button 
          id="btn-open" 
          title="開く"
          onClick={onOpen}
        >
          <i className="icon">📂</i>
        </button>
        <button 
          id="btn-save" 
          title="保存"
          onClick={onSave}
        >
          <i className="icon">💾</i>
        </button>
      </div>
      
      <div className="button-group">
        <button 
          id="btn-undo" 
          title="元に戻す"
          onClick={onUndo}
        >
          <i className="icon">↩️</i>
        </button>
        <button 
          id="btn-redo" 
          title="やり直し"
          onClick={onRedo}
        >
          <i className="icon">↪️</i>
        </button>
      </div>
      
      <div className="button-group">
        <button 
          id="btn-bold" 
          title="太字"
          className={activeButtons.bold ? 'active' : ''}
          onClick={handleBoldClick}
        >
          <b>B</b>
        </button>
        <button 
          id="btn-italic" 
          title="斜体"
          className={activeButtons.italic ? 'active' : ''}
          onClick={handleItalicClick}
        >
          <i>I</i>
        </button>
        <button 
          id="btn-underline" 
          title="下線"
          className={activeButtons.underline ? 'active' : ''}
          onClick={handleUnderlineClick}
        >
          <u>U</u>
        </button>
      </div>
      
      <div className="button-group">
        <button 
          id="btn-align-left" 
          title="左揃え"
          className={activeButtons.alignLeft ? 'active' : ''}
          onClick={handleAlignLeftClick}
        >
          <span>&#8676;</span>
        </button>
        <button 
          id="btn-align-center" 
          title="中央揃え"
          className={activeButtons.alignCenter ? 'active' : ''}
          onClick={handleAlignCenterClick}
        >
          <span>&#8660;</span>
        </button>
        <button 
          id="btn-align-right" 
          title="右揃え"
          className={activeButtons.alignRight ? 'active' : ''}
          onClick={handleAlignRightClick}
        >
          <span>&#8677;</span>
        </button>
      </div>
      
      <div className="button-group">
        <button 
          id="btn-merge-cells" 
          title="セルを結合"
          onClick={onMergeCells}
        >
          <i className="icon">⊞</i>
        </button>
        <button 
          id="btn-unmerge-cells" 
          title="結合を解除"
          onClick={onUnmergeCells}
        >
          <i className="icon">⊟</i>
        </button>
      </div>
      
      <div className="button-group">
        <button 
          id="btn-search" 
          title="検索と置換"
          onClick={onSearch}
        >
          <i className="icon">🔍</i>
        </button>
      </div>
      
      <div className="button-group">
        <button 
          id="btn-import-excel" 
          title="Excelインポート"
          onClick={onImportExcel}
        >
          <i className="icon">📥</i>
        </button>
        <button 
          id="btn-export-excel" 
          title="Excelエクスポート"
          onClick={onExportExcel}
        >
          <i className="icon">📤</i>
        </button>
      </div>
    </div>
  );
};
export default Toolbar;