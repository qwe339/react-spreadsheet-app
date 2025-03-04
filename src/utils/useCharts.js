import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSpreadsheet } from '../context/SpreadsheetContext';
import useSpreadsheetData from './useSpreadsheetData';

/**
 * チャート機能を管理するためのカスタムフック
 */
const useCharts = () => {
  const { state, dispatch, actionTypes } = useSpreadsheet();
  const { updateStatusMessage } = useSpreadsheetData();
  
  /**
   * チャートを追加する
   * @param {Object} chartConfig チャート設定
   * @returns {string} 追加されたチャートのID
   */
  const addChart = useCallback((chartConfig) => {
    if (!chartConfig) return null;
    
    const chartId = uuidv4();
    const newChart = {
      id: chartId,
      title: chartConfig.title || '新しいチャート',
      type: chartConfig.type || 'bar',
      dataRange: chartConfig.dataRange,
      sheetId: chartConfig.sheetId || state.currentSheet,
      options: chartConfig.options || {},
      position: chartConfig.position || { x: 0, y: 0 },
      size: chartConfig.size || { width: 400, height: 300 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    dispatch({
      type: actionTypes.ADD_CHART,
      payload: newChart
    });
    
    updateStatusMessage('チャートを追加しました', 3000);
    return chartId;
  }, [state.currentSheet, dispatch, actionTypes, updateStatusMessage]);
  
  /**
   * チャートを更新する
   * @param {string} chartId チャートID
   * @param {Object} chartConfig 更新するチャート設定
   */
  const updateChart = useCallback((chartId, chartConfig) => {
    if (!chartId || !chartConfig) return;
    
    // 既存のチャートを検索
    const existingChart = state.charts.find(chart => chart.id === chartId);
    if (!existingChart) {
      updateStatusMessage('更新するチャートが見つかりません', 3000);
      return;
    }
    
    const updatedChart = {
      ...existingChart,
      ...chartConfig,
      updatedAt: new Date().toISOString()
    };
    
    dispatch({
      type: actionTypes.UPDATE_CHART,
      payload: {
        id: chartId,
        chartData: updatedChart
      }
    });
    
    updateStatusMessage('チャートを更新しました', 3000);
  }, [state.charts, dispatch, actionTypes, updateStatusMessage]);
  
  /**
   * チャートを削除する
   * @param {string} chartId チャートID
   */
  const removeChart = useCallback((chartId) => {
    if (!chartId) return;
    
    // 既存のチャートを検索
    const existingChart = state.charts.find(chart => chart.id === chartId);
    if (!existingChart) {
      updateStatusMessage('削除するチャートが見つかりません', 3000);
      return;
    }
    
    dispatch({
      type: actionTypes.REMOVE_CHART,
      payload: chartId
    });
    
    updateStatusMessage('チャートを削除しました', 3000);
  }, [state.charts, dispatch, actionTypes, updateStatusMessage]);
  
  /**
   * 指定されたシートに関連するすべてのチャートを取得する
   * @param {string} sheetId シートID
   * @returns {Array} チャートの配列
   */
  const getChartsBySheet = useCallback((sheetId) => {
    return state.charts.filter(chart => chart.sheetId === sheetId);
  }, [state.charts]);
  
  /**
   * 現在のシートに関連するすべてのチャートを取得する
   * @returns {Array} チャートの配列
   */
  const getCurrentSheetCharts = useCallback(() => {
    return getChartsBySheet(state.currentSheet);
  }, [state.currentSheet, getChartsBySheet]);
  
  /**
   * チャートデータを準備する
   * @param {Object} hotInstance Handsontableインスタンス
   * @param {Object} dataRange {startRow, startCol, endRow, endCol}
   * @param {Object} options オプション
   * @returns {Object} チャートデータ
   */
  const prepareChartData = useCallback((hotInstance, dataRange, options = {}) => {
    if (!hotInstance || !dataRange) return null;
    
    const { startRow, startCol, endRow, endCol } = dataRange;
    const {
      hasHeaders = true,
      headerAxis = 'both', // 'row', 'column', 'both', 'none'
      dataOrientation = 'columns' // 'columns', 'rows'
    } = options;
    
    // データを取得
    const data = [];
    for (let row = startRow; row <= endRow; row++) {
      const rowData = [];
      for (let col = startCol; col <= endCol; col++) {
        const cellValue = hotInstance.getDataAtCell(row, col);
        rowData.push(cellValue);
      }
      data.push(rowData);
    }
    
    // ヘッダー行/列を処理
    let rowHeaders = [];
    let columnHeaders = [];
    
    if (hasHeaders) {
      if (headerAxis === 'row' || headerAxis === 'both') {
        // 最初の列をヘッダーとして使用
        rowHeaders = data.map(row => row[0]);
        
        // ヘッダー列を除去
        data.forEach(row => row.shift());
      }
      
      if (headerAxis === 'column' || headerAxis === 'both') {
        // 最初の行をヘッダーとして使用
        columnHeaders = data[0];
        
        // ヘッダー行を除去
        data.shift();
      }
    }
    
    // データの向きを処理
    let chartData;
    if (dataOrientation === 'columns') {
      // 列ごとのデータ（デフォルト）
      chartData = {
        labels: rowHeaders,
        datasets: columnHeaders.map((header, index) => ({
          label: header,
          data: data.map(row => row[index])
        }))
      };
    } else {
      // 行ごとのデータ
      chartData = {
        labels: columnHeaders,
        datasets: data.map((row, index) => ({
          label: rowHeaders[index] || `データセット ${index + 1}`,
          data: row
        }))
      };
    }
    
    return chartData;
  }, []);
  
  /**
   * テーマに基づいてチャートの配色を取得する
   * @param {string} theme テーマ名
   * @param {number} datasetCount データセット数
   * @returns {Array} 色の配列
   */
  const getChartColors = useCallback((theme = 'default', datasetCount = 1) => {
    const colorThemes = {
      default: [
        'rgba(54, 162, 235, 0.7)', // 青
        'rgba(255, 99, 132, 0.7)', // 赤
        'rgba(255, 206, 86, 0.7)', // 黄
        'rgba(75, 192, 192, 0.7)', // 緑
        'rgba(153, 102, 255, 0.7)', // 紫
        'rgba(255, 159, 64, 0.7)', // オレンジ
        'rgba(199, 199, 199, 0.7)' // グレー
      ],
      pastel: [
        'rgba(169, 214, 229, 0.7)', // パステル青
        'rgba(246, 178, 178, 0.7)', // パステル赤
        'rgba(241, 230, 178, 0.7)', // パステル黄
        'rgba(175, 215, 180, 0.7)', // パステル緑
        'rgba(208, 186, 230, 0.7)', // パステル紫
        'rgba(255, 209, 173, 0.7)', // パステルオレンジ
        'rgba(221, 221, 221, 0.7)'  // パステルグレー
      ],
      vivid: [
        'rgba(32, 119, 180, 0.7)', // 鮮やか青
        'rgba(214, 39, 40, 0.7)', // 鮮やか赤
        'rgba(255, 187, 0, 0.7)', // 鮮やか黄
        'rgba(44, 160, 44, 0.7)', // 鮮やか緑
        'rgba(148, 103, 189, 0.7)', // 鮮やか紫
        'rgba(255, 127, 14, 0.7)', // 鮮やかオレンジ
        'rgba(140, 140, 140, 0.7)' // 鮮やかグレー
      ],
      monochrome: [
        'rgba(0, 0, 0, 0.9)',
        'rgba(50, 50, 50, 0.8)',
        'rgba(100, 100, 100, 0.7)',
        'rgba(150, 150, 150, 0.6)',
        'rgba(200, 200, 200, 0.5)',
        'rgba(225, 225, 225, 0.4)',
        'rgba(240, 240, 240, 0.3)'
      ]
    };
    
    const colors = colorThemes[theme] || colorThemes.default;
    
    // データセット数に応じて色を返す
    if (datasetCount <= colors.length) {
      return colors.slice(0, datasetCount);
    } else {
      // 色が足りない場合は繰り返す
      const result = [];
      for (let i = 0; i < datasetCount; i++) {
        result.push(colors[i % colors.length]);
      }
      return result;
    }
  }, []);
  
  /**
   * チャート設定を作成する
   * @param {string} type チャートタイプ
   * @param {Object} data チャートデータ
   * @param {Object} options カスタムオプション
   * @returns {Object} Chart.js設定オブジェクト
   */
  const createChartConfig = useCallback((type, data, options = {}) => {
    const {
      title = '',
      theme = 'default',
      showLegend = true,
      animation = true,
      responsive = true,
      maintainAspectRatio = false,
      ...customOptions
    } = options;
    
    // データセット数を取得
    const datasetCount = data.datasets ? data.datasets.length : 0;
    
    // テーマに基づいて色を取得
    const colors = getChartColors(theme, datasetCount);
    
    // データセットに色を適用
    if (data.datasets) {
      data.datasets = data.datasets.map((dataset, index) => {
        const color = colors[index % colors.length];
        
        // チャートタイプに応じた設定
        switch (type) {
          case 'line':
            return {
              ...dataset,
              borderColor: color,
              backgroundColor: color.replace(/[\d.]+\)$/, '0.1)'),
              borderWidth: 2,
              pointRadius: 3,
              pointBackgroundColor: color,
              pointBorderColor: '#fff',
              pointHoverRadius: 5,
              tension: 0.1
            };
            
          case 'bar':
            return {
              ...dataset,
              backgroundColor: color,
              borderColor: color.replace(/[\d.]+\)$/, '1)'),
              borderWidth: 1,
              hoverBackgroundColor: color.replace(/[\d.]+\)$/, '0.8)')
            };
            
          case 'pie':
          case 'doughnut':
            // 円グラフの場合、データセット内の各データに異なる色を適用
            const pieColors = getChartColors(theme, dataset.data.length);
            return {
              ...dataset,
              backgroundColor: pieColors,
              borderColor: pieColors.map(color => color.replace(/[\d.]+\)$/, '1)')),
              borderWidth: 1
            };
            
          case 'radar':
            return {
              ...dataset,
              backgroundColor: color.replace(/[\d.]+\)$/, '0.2)'),
              borderColor: color,
              pointBackgroundColor: color,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: color,
              borderWidth: 2
            };
            
          case 'scatter':
            return {
              ...dataset,
              backgroundColor: color,
              borderColor: color.replace(/[\d.]+\)$/, '1)'),
              pointRadius: 6,
              pointHoverRadius: 8
            };
            
          case 'bubble':
            return {
              ...dataset,
              backgroundColor: color.replace(/[\d.]+\)$/, '0.7)'),
              borderColor: color.replace(/[\d.]+\)$/, '1)'),
              borderWidth: 1,
              hoverBackgroundColor: color.replace(/[\d.]+\)$/, '0.9)')
            };
            
          default:
            return {
              ...dataset,
              backgroundColor: color,
              borderColor: color.replace(/[\d.]+\)$/, '1)'),
              borderWidth: 1
            };
        }
      });
    }
    
    // チャート設定を作成
    const chartConfig = {
      type,
      data,
      options: {
        plugins: {
          title: {
            display: !!title,
            text: title,
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          legend: {
            display: showLegend,
            position: 'top',
            labels: {
              boxWidth: 12,
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            enabled: true,
            mode: type === 'pie' || type === 'doughnut' ? 'nearest' : 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleFont: {
              size: 13
            },
            bodyFont: {
              size: 12
            },
            padding: 10,
            displayColors: true
          }
        },
        animation,
        responsive,
        maintainAspectRatio,
        scales: {
          // チャートタイプによってスケール設定を変更
          ...(type !== 'pie' && type !== 'doughnut' && type !== 'radar' && type !== 'polarArea' ? {
            x: {
              title: {
                display: true,
                text: customOptions.xAxisTitle || '',
                font: {
                  size: 13
                },
                padding: {
                  top: 10
                }
              },
              ticks: {
                font: {
                  size: 11
                }
              },
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            y: {
              title: {
                display: true,
                text: customOptions.yAxisTitle || '',
                font: {
                  size: 13
                }
              },
              ticks: {
                font: {
                  size: 11
                }
              },
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)'
              },
              beginAtZero: true
            }
          } : {})
        },
        ...customOptions
      }
    };
    
    return chartConfig;
  }, [getChartColors]);
  
  return {
    charts: state.charts,
    currentSheetCharts: getCurrentSheetCharts(),
    addChart,
    updateChart,
    removeChart,
    getChartsBySheet,
    getCurrentSheetCharts,
    prepareChartData,
    getChartColors,
    createChartConfig
  };
};

export default useCharts;