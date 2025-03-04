import React, { useState, useRef, useEffect } from 'react';
import './FormulaBar.css';

const FormulaBar = ({ cellAddress, value, onChange, onSubmit, onFocus, onBlur }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // セル選択が変更されたときに入力フィールドの値を更新
  useEffect(() => {
    if (!isFocused && inputRef.current) {
      inputRef.current.value = value;
    }
  }, [value, isFocused]);

  // キー入力ハンドラー
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
      inputRef.current.blur();
    } else if (e.key === 'Escape') {
      inputRef.current.value = value; // 変更をキャンセル
      inputRef.current.blur();
    }
  };

  // フォーカスハンドラー
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  // ブラーハンドラー
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  // 値変更ハンドラー
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="formula-bar">
      <div className="cell-address-container">
        <div className="cell-address-label">セル:</div>
        <div className="cell-address">{cellAddress}</div>
      </div>
      <div className="formula-input-container">
        <div className="formula-label">fx</div>
        <input
          ref={inputRef}
          type="text"
          className="formula-input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="数式または値を入力..."
        />
      </div>
      <button 
        className="formula-submit-button"
        onClick={onSubmit}
        title="確定 (Enter)"
      >
        ✓
      </button>
    </div>
  );
};

export default FormulaBar;