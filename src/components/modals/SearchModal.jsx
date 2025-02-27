import React from 'react';
import Modal from './Modal';
import '../../css/Modals.css';

const SearchModal = ({ 
  onClose, 
  searchState,
  onSearchStateChange,
  onFindNext,
  onReplace,
  onReplaceAll
}) => {
  // 検索状態の更新ハンドラー
  const handleChange = (field, value) => {
    onSearchStateChange({
      ...searchState,
      [field]: value
    });
  };

  return (
    <Modal title="検索と置換" onClose={onClose}>
      <div className="modal-body">
        <div className="form-group">
          <label htmlFor="search-text">検索する文字列:</label>
          <input 
            type="text" 
            id="search-text"
            value={searchState.searchText}
            onChange={(e) => handleChange('searchText', e.target.value)}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label htmlFor="replace-text">置換後の文字列:</label>
          <input 
            type="text" 
            id="replace-text"
            value={searchState.replaceText}
            onChange={(e) => handleChange('replaceText', e.target.value)}
          />
        </div>
        <div className="form-check">
          <input 
            type="checkbox" 
            id="case-sensitive"
            checked={searchState.caseSensitive}
            onChange={(e) => handleChange('caseSensitive', e.target.checked)}
          />
          <label htmlFor="case-sensitive">大文字/小文字を区別する</label>
        </div>
        <div className="form-check">
          <input 
            type="checkbox" 
            id="whole-cell"
            checked={searchState.wholeCell}
            onChange={(e) => handleChange('wholeCell', e.target.checked)}
          />
          <label htmlFor="whole-cell">セル全体に一致する場合のみ</label>
        </div>
      </div>
      <div className="modal-footer">
        <button id="search-next-btn" onClick={onFindNext}>次を検索</button>
        <button id="replace-btn" onClick={onReplace}>置換</button>
        <button id="replace-all-btn" onClick={onReplaceAll}>すべて置換</button>
        <button id="close-search-btn" onClick={onClose}>閉じる</button>
      </div>
    </Modal>
  );
};

export default SearchModal;