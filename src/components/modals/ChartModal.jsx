import React, { useState } from 'react';
import Modal from './Modal';

/**
 * チャート作成・編集モーダル
 */
const ChartModal = ({ onClose, onAddChart, selectedRange = '' }) => {
  const [chartSettings, setChartSettings] = useState({
    type: 'bar',
    title: '新しいチャート',
    dataOptions: {
      hasHeaders: true,
      headerAxis: 'both', // 'row', 'column', 'both', 'none'
      dataOrientation: 'columns' // 'columns', 'rows'
    },
    options: {
      showLegend: true,
      theme: 'default',
      animation: true
    }
  });
  
  // チャート設定の変更
  const handleChange = (field, value) => {
    setChartSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // データオプションの変更
  const handleDataOptionChange = (field, value) => {
    setChartSettings(prev => ({
      ...prev,
      dataOptions: {
        ...prev.dataOptions,
        [field]: value
      }
    }));
  };
  
  // 表示オプションの変更
  const handleOptionChange = (field, value) => {
    setChartSettings(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [field]: value
      }
    }));
  };
  
  // チャート追加
  const handleAddChart = () => {
    if (!selectedRange) {
      alert('チャートを作成するデータ範囲を選択してください');
      return;
    }
    
    onAddChart(chartSettings);
  };
  
  return (
    <Modal title="チャートの作成" onClose={onClose}>
      <div className="modal-body">
        <div className="form-group">
          <label htmlFor="chart-title">タイトル:</label>
          <input
            type="text"
            id="chart-title"
            value={chartSettings.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="chart-type">グラフの種類:</label>
          <select
            id="chart-type"
            value={chartSettings.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="bar">棒グラフ</option>
            <option value="line">折れ線グラフ</option>
            <option value="pie">円グラフ</option>
            <option value="doughnut">ドーナツグラフ</option>
            <option value="area">面グラフ</option>
            <option value="scatter">散布図</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>データ範囲:</label>
          <div className="data-range">{selectedRange || '（範囲が選択されていません）'}</div>
        </div>
        
        <div className="form-group">
          <label>データオプション:</label>
          
          <div className="form-check">
            <input
              type="checkbox"
              id="has-headers"
              checked={chartSettings.dataOptions.hasHeaders}
              onChange={(e) => handleDataOptionChange('hasHeaders', e.target.checked)}
            />
            <label htmlFor="has-headers">ヘッダー行/列を含む</label>
          </div>
          
          <div className="form-group">
            <label htmlFor="header-axis">ヘッダーの位置:</label>
            <select
              id="header-axis"
              value={chartSettings.dataOptions.headerAxis}
              onChange={(e) => handleDataOptionChange('headerAxis', e.target.value)}
              disabled={!chartSettings.dataOptions.hasHeaders}
            >
              <option value="both">行と列</option>
              <option value="row">行のみ</option>
              <option value="column">列のみ</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="data-orientation">データの向き:</label>
            <select
              id="data-orientation"
              value={chartSettings.dataOptions.dataOrientation}
              onChange={(e) => handleDataOptionChange('dataOrientation', e.target.value)}
            >
              <option value="columns">列ごと</option>
              <option value="rows">行ごと</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>表示オプション:</label>
          
          <div className="form-check">
            <input
              type="checkbox"
              id="show-legend"
              checked={chartSettings.options.showLegend}
              onChange={(e) => handleOptionChange('showLegend', e.target.checked)}
            />
            <label htmlFor="show-legend">凡例を表示</label>
          </div>
          
          <div className="form-group">
            <label htmlFor="chart-theme">テーマ:</label>
            <select
              id="chart-theme"
              value={chartSettings.options.theme}
              onChange={(e) => handleOptionChange('theme', e.target.value)}
            >
              <option value="default">デフォルト</option>
              <option value="pastel">パステル</option>
              <option value="vivid">鮮やか</option>
              <option value="monochrome">モノクロ</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="modal-footer">
        <button onClick={handleAddChart}>作成</button>
        <button onClick={onClose}>キャンセル</button>
      </div>
    </Modal>
  );
};

export default ChartModal;