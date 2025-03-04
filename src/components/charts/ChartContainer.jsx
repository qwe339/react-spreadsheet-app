import React, { useState } from 'react';
import Draggable from 'react-draggable'; // ※このライブラリのインストールが必要

/**
 * チャート表示用コンテナ
 */
const ChartContainer = ({ chart, onUpdate, onRemove }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState(chart.size || { width: 400, height: 300 });
  
  // ドラッグ終了時の処理
  const handleDragStop = (e, data) => {
    onUpdate(chart.id, {
      position: { x: data.x, y: data.y }
    });
  };
  
  // サイズ変更開始
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
  };
  
  // サイズ変更中
  const handleResize = (e) => {
    if (!isResizing) return;
    
    // マウス位置からサイズを計算
    const element = e.currentTarget.parentElement;
    const rect = element.getBoundingClientRect();
    const width = e.clientX - rect.left;
    const height = e.clientY - rect.top;
    
    setSize({
      width: Math.max(200, width),  // 最小幅
      height: Math.max(150, height) // 最小高さ
    });
  };
  
  // サイズ変更終了
  const handleResizeEnd = () => {
    if (!isResizing) return;
    
    setIsResizing(false);
    onUpdate(chart.id, { size });
  };
  
  // チャート削除
  const handleRemove = () => {
    if (window.confirm('このチャートを削除しますか？')) {
      onRemove(chart.id);
    }
  };
  
  // マウスアップイベント（サイズ変更終了）をウィンドウに追加
  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing]);
  
  return (
    <Draggable
      handle=".chart-header"
      defaultPosition={chart.position}
      onStop={handleDragStop}
      bounds=".spreadsheet-wrapper"
    >
      <div
        className="chart-container"
        style={{
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
        <div
          className="chart-resize-handle"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '20px',
            height: '20px',
            cursor: 'nwse-resize'
          }}
          onMouseDown={handleResizeStart}
        />
      </div>
    </Draggable>
  );
};

export default ChartContainer;