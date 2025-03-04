import React, { useState } from 'react';
// react-draggableを使わない実装

/**
 * チャート表示用コンテナ (簡易版)
 */
const ChartContainer = ({ chart, onUpdate, onRemove }) => {
  const [position, setPosition] = useState(chart.position || { x: 100, y: 100 });
  const [size, setSize] = useState(chart.size || { width: 400, height: 300 });
  
  // チャート削除
  const handleRemove = () => {
    if (window.confirm('このチャートを削除しますか？')) {
      onRemove(chart.id);
    }
  };
  
  return (
    <div
      className="chart-container"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height
      }}
    >
      <div className="chart-header">
        <h3 className="chart-title">{chart.title}</h3>
        <div className="chart-controls">
          <button className="chart-control-button" onClick={handleRemove}>✕</button>
        </div>
      </div>
      <div className="chart-body">
        {/* ここにはChart.jsなどのライブラリを使って実際のチャートを描画 */}
        <div style={{ width: '100%', height: 'calc(100% - 20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>チャート: {chart.type}</p>
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;