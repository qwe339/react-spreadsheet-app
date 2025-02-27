import React from 'react';
import './FormulaBar.css';

const FormulaBar = ({ cellAddress, value, onChange, onSubmit }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="formula-bar">
      <div className="cell-address">{cellAddress}</div>
      <label htmlFor="formula-input">fx:</label>
      <input
        type="text"
        id="formula-input"
        placeholder="数式を入力..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default FormulaBar;