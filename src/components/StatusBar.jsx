import React from 'react';
import './StatusBar.css';

const StatusBar = ({ message, sum, average, selection }) => {
  return (
    <div className="footer">
      <div className="status" id="status-bar">{message}</div>
      <div>
        合計: <span id="sum">{sum}</span> | 
        平均: <span id="average">{average}</span> | 
        選択: <span id="selection">{selection}</span>
      </div>
    </div>
  );
};

export default StatusBar;