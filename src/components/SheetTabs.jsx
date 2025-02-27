import React from 'react';
import './SheetTabs.css';

const SheetTabs = ({ sheets, currentSheet, onSheetChange, onAddSheet }) => {
  // シート名を表示用にフォーマット
  const formatSheetName = (sheetId) => {
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

  return (
    <div className="tabs">
      {sheets.map(sheetId => (
        <div
          key={sheetId}
          className={`tab ${sheetId === currentSheet ? 'active' : ''}`}
          data-sheet={sheetId}
          onClick={() => onSheetChange(sheetId)}
        >
          {formatSheetName(sheetId)}
        </div>
      ))}
      <div
        className="tab add-tab"
        onClick={onAddSheet}
      >
        <span>+</span>
      </div>
    </div>
  );
};

export default SheetTabs;