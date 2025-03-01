import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { HyperFormula } from 'hyperformula';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

// コンポーネントのインポート
import MenuBar from './MenuBar';
import Toolbar from './Toolbar';
import FormulaBar from './FormulaBar';
import SheetTabs from './SheetTabs';
import StatusBar from './StatusBar';
import SearchModal from './modals/SearchModal';
import OpenFileModal from './modals/OpenFileModal';
import SaveAsModal from './modals/SaveAsModal';
import AboutModal from './modals/AboutModal';
import ShortcutsModal from './modals/ShortcutsModal';

// すべてのHandsontableモジュールを登録
registerAllModules();

// 初期データの生成
const generateInitialData = (rows, cols) => {
  const data = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(null);
    }
    data.push(row);
  }
  return data;
};

const SpreadsheetEditor = () => {
  // Handsontableの参照
  const hotRef = useRef(null);
  
  // 初期シート
  const initialSheets = ['sheet1', 'sheet2', 'sheet3'];
  
  // 状態管理
  const [currentSheet, setCurrentSheet] = useState('sheet1');
  const [sheetData, setSheetData] = useState(() => {
    const initialData = {};
    initialSheets.forEach(sheetId => {
      initialData[sheetId] = generateInitialData(100, 30);
    });
    return initialData;
  });
  const [cellStyles, setCellStyles] = useState(() => {
    const initialStyles = {};
    initialSheets.forEach(sheetId => {
      initialStyles[sheetId] = {};
    });
    return initialStyles;
  });
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [availableSheets, setAvailableSheets] = useState(initialSheets);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [selectionRange, setSelectionRange] = useState(null);
  const [statusMessage, setStatusMessage] = useState('拡張Handsontableスプレッドシートへようこそ');
  const [cellAddress, setCellAddress] = useState('A1');
  const [formulaValue, setFormulaValue] = useState('');
  const [selectionStats, setSelectionStats] = useState({ sum: 0, average: 0, selection: 'なし' });
  
  // モーダルの表示状態
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showOpenFileModal, setShowOpenFileModal] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // HyperFormulaインスタンス
  const [hyperformulaInstance] = useState(() => {
    return HyperFormula.buildEmpty({
      licenseKey: 'gpl-v3',
      precisionRounding: 8,
      sheets: initialSheets.reduce((acc, sheetId) => {
        acc[sheetId] = [];
        return acc;
      }, {})
    });
  });

  // 列番号をA, B, C...の形式に変換する関数
  const numToLetter = (num) => {
    let letters = '';
    while (num >= 0) {
      letters = String.fromCharCode(65 + (num % 26)) + letters;
      num = Math.floor(num / 26) - 1;
      if (num < 0) break;
    }
    return letters;
  };

  // ステータスメッセージを表示する関数
  const updateStatusMessage = (message, timeout = 3000) => {
    setStatusMessage(message);
    
    if (timeout > 0) {
      setTimeout(() => {
        setStatusMessage(`${currentSheet} アクティブ`);
      }, timeout);
    }
  };

  // セル選択時のイベントハンドラー
  const handleAfterSelectionEnd = (row, column, row2, column2) => {
    // セルのアドレスを更新
    const colLabel = numToLetter(column);
    setCellAddress(`${colLabel}${row + 1}`);
    
    // セルの値を取得
    const hot = hotRef.current.hotInstance;
    const value = hot.getDataAtCell(row, column);
    setFormulaValue(value !== null ? value : '');
    
    // 選択範囲を設定
    setSelectedCell({ row, col: column });
    setSelectionRange({ startRow: row, startCol: column, endRow: row2, endCol: column2 });
    
    // 選択範囲の統計を計算
    updateSelectionStats(row, column, row2, column2);
  };

  // 選択範囲の統計を更新
  const updateSelectionStats = (row, col, row2, col2) => {
    const hot = hotRef.current.hotInstance;
    const selText = `${numToLetter(col)}${row + 1}:${numToLetter(col2)}${row2 + 1}`;
    
    // 選択範囲の数値の合計と平均を計算
    const selectedValues = [];
    for (let r = Math.min(row, row2); r <= Math.max(row, row2); r++) {
      for (let c = Math.min(col, col2); c <= Math.max(col, col2); c++) {
        const value = hot.getDataAtCell(r, c);
        if (value !== null && value !== '' && !isNaN(value)) {
          selectedValues.push(parseFloat(value));
        }
      }
    }
    
    if (selectedValues.length > 0) {
      const sum = selectedValues.reduce((a, b) => a + b, 0);
      const average = sum / selectedValues.length;
      
      setSelectionStats({
        sum: sum.toFixed(2),
        average: average.toFixed(2),
        selection: selText
      });
    } else {
      setSelectionStats({
        sum: '0',
        average: '0',
        selection: selText
      });
    }
  };

  // データ変更時のイベントハンドラー
  const handleAfterChange = (changes, source) => {
    if (!changes || source === 'loadData') return;
    
    // 変更前の状態をアンドゥスタックに保存
    pushToUndoStack();
    
    // リドゥスタックをクリア
    setRedoStack([]);
  };

  // アンドゥスタックに現在の状態を保存
  const pushToUndoStack = () => {
    const hot = hotRef.current.hotInstance;
    const currentData = hot.getData().map(row => [...row]);
    
    setUndoStack(prevStack => {
      const newStack = [
        ...prevStack,
        {
          data: currentData,
          sheet: currentSheet,
          styles: JSON.parse(JSON.stringify(cellStyles[currentSheet] || {}))
        }
      ];
      
      // スタックが大きくなりすぎないように制限
      if (newStack.length > 20) {
        return newStack.slice(1);
      }
      return newStack;
    });
  };

  // 元に戻す機能
  const undo = () => {
    if (undoStack.length === 0) {
      updateStatusMessage('これ以上元に戻せません', 3000);
      return;
    }
    
    const newUndoStack = [...undoStack];
    const prevState = newUndoStack.pop();
    setUndoStack(newUndoStack);
    
    const hot = hotRef.current.hotInstance;
    
    // 現在の状態をリドゥスタックに保存
    setRedoStack(prevRedoStack => [
      ...prevRedoStack,
      {
        data: hot.getData().map(row => [...row]),
        sheet: currentSheet,
        styles: JSON.parse(JSON.stringify(cellStyles[currentSheet] || {}))
      }
    ]);
    
    // 前の状態に戻す
    if (prevState.sheet !== currentSheet) {
      // シートが異なる場合はシートを切り替え
      setCurrentSheet(prevState.sheet);
    }
    
    hot.loadData(prevState.data);
    
    // スタイル情報も復元
    setCellStyles(prevCellStyles => ({
      ...prevCellStyles,
      [currentSheet]: prevState.styles
    }));
    
    updateStatusMessage('操作を元に戻しました', 3000);
    
    // スタイルを適用
    setTimeout(() => {
      applyStoredStyles();
    }, 0);
  };

  // やり直し機能
  const redo = () => {
    if (redoStack.length === 0) {
      updateStatusMessage('これ以上やり直せません', 3000);
      return;
    }
    
    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop();
    setRedoStack(newRedoStack);
    
    const hot = hotRef.current.hotInstance;
    
    // 現在の状態をアンドゥスタックに保存
    setUndoStack(prevUndoStack => [
      ...prevUndoStack,
      {
        data: hot.getData().map(row => [...row]),
        sheet: currentSheet,
        styles: JSON.parse(JSON.stringify(cellStyles[currentSheet] || {}))
      }
    ]);
    
    // 次の状態に進める
    if (nextState.sheet !== currentSheet) {
      // シートが異なる場合はシートを切り替え
      setCurrentSheet(nextState.sheet);
    }
    
    hot.loadData(nextState.data);
    
    // スタイル情報も復元
    setCellStyles(prevCellStyles => ({
      ...prevCellStyles,
      [currentSheet]: nextState.styles
    }));
    
    updateStatusMessage('操作をやり直しました', 3000);
    
    // スタイルを適用
    setTimeout(() => {
      applyStoredStyles();
    }, 0);
  };

  // 保存されたスタイルを適用
  const applyStoredStyles = () => {
    if (!cellStyles[currentSheet]) return;
    
    const hot = hotRef.current.hotInstance;
    const rows = hot.countRows();
    const cols = hot.countCols();
    
    // セルのcellメタデータ配列を初期化
    const cellConfig = [];
    
    // スタイル設定を追加
    Object.entries(cellStyles[currentSheet]).forEach(([key, className]) => {
      const [row, col] = key.split(',').map(Number);
      if (row < rows && col < cols) {
        cellConfig.push({
          row: row,
          col: col,
          className: className.trim()
        });
      }
    });
    
    // スタイルを一括適用
    hot.updateSettings({
      cell: cellConfig
    });
    
    hot.render();
  };

  // シート切り替え処理
  const switchSheet = (sheetId) => {
    // すでに同じシートが選択されている場合は何もしない
    if (currentSheet === sheetId) return;
    
    try {
      const hot = hotRef.current.hotInstance;
      
      // 現在のシートのデータを保存
      setSheetData(prevSheetData => ({
        ...prevSheetData,
        [currentSheet]: hot.getData()
      }));
      
      // 新しいシートのデータをロード
      hot.loadData(sheetData[sheetId]);
      
      // アクティブシートを更新
      setCurrentSheet(sheetId);
      
      // 数式エンジンのシート名を更新
      const formulasPlugin = hot.getPlugin('formulas');
      
      // シートが存在するか確認
      const sheetExists = formulasPlugin.engine.getSheetId(sheetId) !== undefined;
      
      // シートが存在しなければ追加
      if (!sheetExists) {
        formulasPlugin.engine.addSheet(sheetId);
      }
      
      // アクティブシートを設定
      hot.updateSettings({
        formulas: {
          sheetName: sheetId
        }
      });
      
      // ステータスバーを更新
      updateStatusMessage(`${sheetId} アクティブ`, 0);
      
      // スタイルを適用
      setTimeout(() => {
        applyStoredStyles();
      }, 0);
    } catch (error) {
      console.error('シート切り替えエラー:', error);
      updateStatusMessage(`エラー: ${error.message}`, 5000);
    }
  };

  // 新しいシートの追加
  const addNewSheet = () => {
    const sheetCount = availableSheets.length;
    const newSheetId = `sheet${sheetCount + 1}`;
    
    // 新しいシートデータを作成
    setSheetData(prevSheetData => ({
      ...prevSheetData,
      [newSheetId]: generateInitialData(100, 30)
    }));
    
    // 新しいシート用のスタイル情報を初期化
    setCellStyles(prevCellStyles => ({
      ...prevCellStyles,
      [newSheetId]: {}
    }));
    
    // 利用可能なシートリストを更新
    setAvailableSheets(prevSheets => [...prevSheets, newSheetId]);
    
    // HyperFormulaエンジンに新しいシートを追加
    try {
      const hot = hotRef.current.hotInstance;
      hot.getPlugin('formulas').engine.addSheet(newSheetId);
    } catch (error) {
      console.error('新しいシート追加エラー:', error);
    }
    
    // 新しいシートに切り替え
    switchSheet(newSheetId);
  };

  // スプレッドシートをリセット
  const resetSpreadsheet = () => {
    // アンドゥ・リドゥスタックをクリア
    setUndoStack([]);
    setRedoStack([]);
    
    // 各シートをクリア
    const newSheetData = {};
    const newCellStyles = {};
    initialSheets.forEach(sheetId => {
      newSheetData[sheetId] = generateInitialData(100, 30);
      newCellStyles[sheetId] = {};
    });
    
    setSheetData(newSheetData);
    setCellStyles(newCellStyles);
    
    // 現在のシートを再描画
    const hot = hotRef.current.hotInstance;
    hot.loadData(newSheetData[currentSheet]);
    
    // スタイル情報をクリア
    hot.updateSettings({
      cell: []
    });
    
    hot.render();
    
    updateStatusMessage('新しいスプレッドシートを作成しました', 3000);
  };

  // 選択範囲にスタイルを適用
  const applyStyleToSelection = (style) => {
  const hot = hotRef.current.hotInstance;
  const selection = hot.getSelected();
  if (!selection) return;
  
  // 現在の選択範囲を保存
  const currentSelection = [...selection[0]]; // [startRow, startCol, endRow, endCol]
  
  // 変更前の状態をアンドゥスタックに保存
  pushToUndoStack();
  
  // 現在のセル設定を取得
  const currentCellConfig = hot.getSettings().cell || [];
  const cellConfig = [...currentCellConfig];
  
  selection.forEach(coords => {
    const [row1, col1, row2, col2] = coords;
    
    for (let row = Math.min(row1, row2); row <= Math.max(row1, row2); row++) {
      for (let col = Math.min(col1, col2); col <= Math.max(col1, col2); col++) {
        // 現在のセルスタイルを取得
        const cellKey = `${row},${col}`;
        const currentStyle = cellStyles[currentSheet][cellKey] || '';
        let newClassName = currentStyle;
        
        // スタイルに応じてクラス名を更新
        if (style.fontWeight === 'bold') {
          if (!newClassName.includes('font-bold')) {
            newClassName += ' font-bold';
          }
        } else if (style.fontWeight === 'normal') {
          newClassName = newClassName.replace(/font-bold/g, '');
        }
        
        if (style.fontStyle === 'italic') {
          if (!newClassName.includes('font-italic')) {
            newClassName += ' font-italic';
          }
        } else if (style.fontStyle === 'normal') {
          newClassName = newClassName.replace(/font-italic/g, '');
        }
        
        if (style.textDecoration === 'underline') {
          if (!newClassName.includes('text-underline')) {
            newClassName += ' text-underline';
          }
        } else if (style.textDecoration === 'none') {
          newClassName = newClassName.replace(/text-underline/g, '');
        }
        
        // テキスト配置の設定
        if (style.textAlign) {
          newClassName = newClassName
            .replace(/text-left|text-center|text-right/g, '')
            .trim();
          newClassName += ` text-${style.textAlign}`;
        }
        
        // クラス名の重複を防ぐためのクリーンアップ
        newClassName = newClassName
          .split(' ')
          .filter(Boolean)
          .filter((value, index, self) => self.indexOf(value) === index)
          .join(' ')
          .trim();
        
        // cellConfigにセルのスタイル設定を追加
        const existingIndex = cellConfig.findIndex(cell => cell.row === row && cell.col === col);
        
        if (existingIndex >= 0) {
          cellConfig[existingIndex].className = newClassName;
        } else {
          cellConfig.push({
            row: row,
            col: col,
            className: newClassName
          });
        }
        
        // スタイル情報を保存
        setCellStyles(prevCellStyles => {
          const updatedSheetStyles = {
            ...(prevCellStyles[currentSheet] || {})
          };
          
          if (newClassName) {
            updatedSheetStyles[cellKey] = newClassName;
          } else {
            delete updatedSheetStyles[cellKey];
          }
          
          return {
            ...prevCellStyles,
            [currentSheet]: updatedSheetStyles
          };
        });
      }
    }
  });
  
  // 一括でスタイルを適用
  hot.updateSettings({
    cell: cellConfig
  });
  
  // 明示的に再描画を強制
  hot.render();
  
  // 選択範囲を復元
  setTimeout(() => {
    hot.selectCell(
      currentSelection[0], 
      currentSelection[1], 
      currentSelection[2], 
      currentSelection[3], 
      false
    );
  }, 10);
  
  updateStatusMessage('書式を適用しました', 3000);
};

  // セルを結合
  const mergeCells = () => {
    const hot = hotRef.current.hotInstance;
    const selection = hot.getSelected();
    if (selection) {
      // 変更前の状態をアンドゥスタックに保存
      pushToUndoStack();
      
      const [row1, col1, row2, col2] = selection[0];
      hot.mergeCells({
        row: Math.min(row1, row2),
        col: Math.min(col1, col2),
        rowspan: Math.abs(row2 - row1) + 1,
        colspan: Math.abs(col2 - col1) + 1
      });
      hot.render();
    }
  };

  // セルの結合を解除
  const unmergeCells = () => {
    const hot = hotRef.current.hotInstance;
    const selection = hot.getSelected();
    if (selection) {
      // 変更前の状態をアンドゥスタックに保存
      pushToUndoStack();
      
      const [row, col] = selection[0];
      hot.unmergeCells(row, col);
      hot.render();
    }
  };

  // 数式バーからセルの更新
  const handleFormulaInputChange = (value) => {
    setFormulaValue(value);
  };

  // 数式バーでEnterキーが押された時の処理
  const handleFormulaSubmit = () => {
    const hot = hotRef.current.hotInstance;
    if (selectedCell) {
      hot.setDataAtCell(selectedCell.row, selectedCell.col, formulaValue);
    }
  };

  // セルのクラスを設定するためのカスタム関数
const cellClassRenderer = (instance, td, row, col, prop, value, cellProperties) => {
  // デフォルトのレンダラーを適用
  Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
  
  // セルのキー
  const cellKey = `${row},${col}`;
  
  // このセルにスタイルがあるか確認
  if (cellStyles[currentSheet] && cellStyles[currentSheet][cellKey]) {
    const classes = cellStyles[currentSheet][cellKey].split(' ');
    
    classes.forEach(className => {
      if (className) {
        td.classList.add(className);
      }
    });
  }
  
  return td;
};

  // スプレッドシートの設定
  const hotSettings = {
  data: sheetData[currentSheet] || generateInitialData(100, 30),
  rowHeaders: true,
  colHeaders: true,
  licenseKey: 'non-commercial-and-evaluation',
  contextMenu: true,
  manualColumnResize: true,
  manualRowResize: true,
  comments: true,
  formulas: {
    engine: hyperformulaInstance,
    sheetName: currentSheet
  },
  stretchH: 'all',
  autoWrapRow: true,
  wordWrap: true,
  mergeCells: [],
  fixedRowsTop: 0,
  fixedColumnsLeft: 0,
  minSpareRows: 5,
  minSpareCols: 2,
  afterSelectionEnd: handleAfterSelectionEnd,
  afterChange: handleAfterChange,
  className: 'htCustomStyles',
  outsideClickDeselects: false, // 外部クリックで選択解除しない設定を追加
  cell: []
};

  // ローカルストレージから前回のデータを読み込む
  useEffect(() => {
    const savedData = localStorage.getItem('handsontable_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.sheets) {
          setSheetData(data.sheets);
          
          if (data.styles) {
            setCellStyles(data.styles);
          }
          
          // 利用可能なシートリストを更新
          setAvailableSheets(Object.keys(data.sheets));
          
          updateStatusMessage('前回のデータを読み込みました', 3000);
        }
      } catch (error) {
        console.error('保存データの読み込みエラー:', error);
      }
    }
  }, []);

  // シート変更時の処理
  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      hot.loadData(sheetData[currentSheet] || generateInitialData(100, 30));
      
      // フォーミュラプラグインのシート名を更新
      hot.updateSettings({
        formulas: {
          sheetName: currentSheet
        }
      });
      
      // スタイルを適用
      setTimeout(() => {
        applyStoredStyles();
      }, 0);
    }
  }, [currentSheet]);

  // Handsontable読み込み後の処理
  useEffect(() => {
    if (hotRef.current?.hotInstance) {
      // スタイルを適用
      setTimeout(() => {
        applyStoredStyles();
      }, 0);
    }
  }, [hotRef.current]);

  // キーボードショートカットの設定
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 入力フィールドでのショートカットは除外
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      // Ctrl+S で保存
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      
      // Ctrl+O でファイルを開く
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        setShowOpenFileModal(true);
      }
      
      // Ctrl+N で新規作成
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        if (window.confirm('新しいスプレッドシートを作成しますか？現在のデータは保存されていない場合、失われます。')) {
          resetSpreadsheet();
        }
      }
      
      // Ctrl+Z でアンドゥ
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      
      // Ctrl+Y または Ctrl+Shift+Z でリドゥ
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
      }
      
      // Ctrl+F で検索
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setShowSearchModal(true);
      }
      
      // Ctrl+P で印刷
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
      
      // Ctrl+B で太字
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        applyStyleToSelection({ fontWeight: 'bold' });
      }
      
      // Ctrl+I で斜体
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        applyStyleToSelection({ fontStyle: 'italic' });
      }
      
      // Ctrl+U で下線
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        applyStyleToSelection({ textDecoration: 'underline' });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undoStack, redoStack, currentSheet, sheetData]);

  // スプレッドシートデータの保存
  const handleSave = () => {
    const hot = hotRef.current.hotInstance;
    
    // 現在のシートのデータを保存
    const updatedSheetData = {
      ...sheetData,
      [currentSheet]: hot.getData()
    };
    setSheetData(updatedSheetData);
    
    // すべてのシートデータをJSONに変換して保存
    const dataToSave = {
      sheets: updatedSheetData,
      styles: cellStyles,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('handsontable_data', JSON.stringify(dataToSave));
    updateStatusMessage('データを保存しました', 3000);
  };

  // Excelエクスポート機能
  const exportExcel = () => {
    const hot = hotRef.current.hotInstance;
    
    // 現在のシートのデータを取得
    const updatedSheetData = {
      ...sheetData,
      [currentSheet]: hot.getData()
    };
    
    try {
      // 新しいワークブックを作成
      const wb = XLSX.utils.book_new();
      
      // シートをワークブックに追加
      const ws = XLSX.utils.aoa_to_sheet(updatedSheetData[currentSheet]);
      XLSX.utils.book_append_sheet(wb, ws, currentSheet);
      
      // 他のシートがあれば追加
      for (const sheetId in updatedSheetData) {
        if (sheetId !== currentSheet) {
          const wsData = updatedSheetData[sheetId];
          const ws = XLSX.utils.aoa_to_sheet(wsData);
          XLSX.utils.book_append_sheet(wb, ws, sheetId);
        }
      }
      
      // ファイル名を生成（現在の日時を含む）
      const now = new Date();
      const dateStr = now.getFullYear() + 
                     ('0' + (now.getMonth() + 1)).slice(-2) + 
                     ('0' + now.getDate()).slice(-2);
      const fileName = `spreadsheet_export_${dateStr}.xlsx`;
      
      // Excelファイルとしてダウンロード
      XLSX.writeFile(wb, fileName);
      
      updateStatusMessage(`${fileName} をエクスポートしました`, 3000);
    } catch (error) {
      console.error('エクスポートエラー:', error);
      updateStatusMessage('エクスポートに失敗しました', 5000);
    }
  };

  // CSVエクスポート機能
  const exportCSV = () => {
    const hot = hotRef.current.hotInstance;
    
    // 現在のシートのデータを取得
    const currentData = hot.getData();
    
    try {
      // CSVに変換
      const csvContent = Papa.unparse(currentData, {
        delimiter: ',',
        header: false
      });
      
      // BOMを追加してUTF-8として認識されるようにする
      const csvContentWithBOM = '\uFEFF' + csvContent;
      
      // Blobを作成してダウンロード
      const blob = new Blob([csvContentWithBOM], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // ダウンロードリンクを作成
      const link = document.createElement('a');
      const now = new Date();
      const dateStr = now.getFullYear() + 
                     ('0' + (now.getMonth() + 1)).slice(-2) + 
                     ('0' + now.getDate()).slice(-2);
      link.setAttribute('href', url);
      link.setAttribute('download', `spreadsheet_export_${dateStr}.csv`);
      link.style.visibility = 'hidden';
      
      // クリックを実行してダウンロード
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      updateStatusMessage('CSVファイルをエクスポートしました', 3000);
    } catch (error) {
      console.error('CSVエクスポートエラー:', error);
      updateStatusMessage('CSVエクスポートに失敗しました', 5000);
    }
  };

  // ファイルインポート処理
  const importFile = (acceptTypes = '.xlsx, .xls, .csv') => {
    // ファイル選択ダイアログを作成
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = acceptTypes;
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        
        try {
          // ファイルの種類に応じた処理
          if (file.name.endsWith('.csv')) {
            // CSVファイルの処理
            const text = new TextDecoder('utf-8').decode(data);
            parseCSVAndLoad(text);
          } else {
            // Excel形式ファイルの処理（XLSX/XLS）
            const workbook = XLSX.read(data, {
              type: 'array',
              cellDates: true,
              cellStyles: true
            });
            
            // 最初のシートを読み込む
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // シートデータをJSON形式に変換
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
              defval: null
            });
            
            // 現在のシートデータを更新
            setSheetData(prevSheetData => ({
              ...prevSheetData,
              [currentSheet]: jsonData
            }));
            
            const hot = hotRef.current.hotInstance;
            hot.loadData(jsonData);
            
            // 他のシートがある場合は追加
            if (workbook.SheetNames.length > 1) {
              const newSheets = [...availableSheets];
              
              for (let i = 1; i < workbook.SheetNames.length; i++) {
                const sheetName = workbook.SheetNames[i];
                const ws = workbook.Sheets[sheetName];
                const wsData = XLSX.utils.sheet_to_json(ws, {
                  header: 1,
                  defval: null
                });
                
                // 新しいシートIDを生成
                const newSheetId = `imported_sheet_${i}`;
                
                // 新しいシートデータを登録
                setSheetData(prevSheetData => ({
                  ...prevSheetData,
                  [newSheetId]: wsData
                }));
                
                setCellStyles(prevCellStyles => ({
                  ...prevCellStyles,
                  [newSheetId]: {}
                }));
                
                // 利用可能なシートリストを更新
                if (!newSheets.includes(newSheetId)) {
                  newSheets.push(newSheetId);
                }
                
                // HyperFormulaエンジンに新しいシートを追加
                try {
                  hot.getPlugin('formulas').engine.addSheet(newSheetId);
                } catch (error) {
                  console.error(`シート ${newSheetId} の追加エラー:`, error);
                }
              }
              
              setAvailableSheets(newSheets);
            }
            
            updateStatusMessage(`${file.name} を読み込みました`, 3000);
          }
        } catch (error) {
          console.error('ファイル読み込みエラー:', error);
          updateStatusMessage(`エラー: ${file.name} の読み込みに失敗しました`, 5000);
        }
      };
      
      reader.readAsArrayBuffer(file);
    });
    
    // ファイル選択ダイアログを表示
    fileInput.click();
  };

  // CSVファイルのパースと読み込み
  const parseCSVAndLoad = (csvText) => {
    Papa.parse(csvText, {
      delimiter: ',',
      header: false,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          // 変更前の状態をアンドゥスタックに保存
          pushToUndoStack();
          
          // 現在のシートデータを更新
          setSheetData(prevSheetData => ({
            ...prevSheetData,
            [currentSheet]: results.data
          }));
          
          const hot = hotRef.current.hotInstance;
          hot.loadData(results.data);
          updateStatusMessage('CSVファイルを読み込みました', 3000);
        }
      },
      error: (error) => {
        console.error('CSVパースエラー:', error);
        updateStatusMessage('CSVファイルの解析に失敗しました', 5000);
      }
    });
  };

  // 名前を付けて保存の処理
  const handleSaveAs = (filename) => {
    if (!filename.trim()) {
      alert('ファイル名を入力してください');
      return;
    }
    
    const hot = hotRef.current.hotInstance;
    
    // 現在のシートのデータを保存
    const updatedSheetData = {
      ...sheetData,
      [currentSheet]: hot.getData()
    };
    
    // データをJSONとして保存
    const dataToSave = {
      sheets: updatedSheetData,
      styles: cellStyles,
      lastSaved: new Date().toISOString(),
      filename: filename
    };
    
    // ローカルストレージの保存キーを生成
    const saveKey = `handsontable_${filename}_${Date.now()}`;
    
    try {
      localStorage.setItem(saveKey, JSON.stringify(dataToSave));
      
      // 保存されたファイル一覧を更新
      updateSavedFilesList(saveKey, filename);
      
      updateStatusMessage(`「${filename}」として保存しました`, 3000);
      setShowSaveAsModal(false);
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。ストレージの容量が不足している可能性があります。');
    }
  };

  // 保存されたファイル一覧を管理
  const updateSavedFilesList = (key, filename) => {
    let filesList = JSON.parse(localStorage.getItem('handsontable_files_list') || '[]');
    
    // 既存のエントリを検索（同じファイル名の場合は更新）
    const existingIndex = filesList.findIndex(file => file.filename === filename);
    
    if (existingIndex >= 0) {
      filesList[existingIndex] = {
        key,
        filename,
        savedAt: new Date().toISOString()
      };
    } else {
      filesList.push({
        key,
        filename,
        savedAt: new Date().toISOString()
      });
    }
    
    // 最新の保存順にソート
    filesList.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    
    // 一覧を保存
    localStorage.setItem('handsontable_files_list', JSON.stringify(filesList));
  };

  // 保存されたファイルを読み込む
  const loadSavedFile = (key) => {
    const savedData = localStorage.getItem(key);
    if (!savedData) {
      alert('ファイルが見つかりません');
      return;
    }
    
    try {
      const data = JSON.parse(savedData);
      
      // データを読み込む
      if (data.sheets) {
        // アンドゥ・リドゥスタックをクリア
        setUndoStack([]);
        setRedoStack([]);
        
        // シートデータを読み込む
        setSheetData(data.sheets);
        
        // スタイル情報があれば読み込む
        if (data.styles) {
          setCellStyles(data.styles);
        }
        
        // 利用可能なシートリストを更新
        setAvailableSheets(Object.keys(data.sheets));
        
        // 現在のシートを更新
        if (Object.keys(data.sheets).includes(currentSheet)) {
          const hot = hotRef.current.hotInstance;
          hot.loadData(data.sheets[currentSheet]);
          setTimeout(() => {
            applyStoredStyles();
          }, 0);
        } else if (Object.keys(data.sheets).length > 0) {
          // 現在のシートが存在しない場合は最初のシートを選択
          setCurrentSheet(Object.keys(data.sheets)[0]);
        }
        
        updateStatusMessage(`${data.filename} を開きました`, 3000);
      }
    } catch (error) {
      console.error('ファイル読み込みエラー:', error);
      alert('ファイルの読み込みに失敗しました');
    }
  };

  // 検索関連の状態管理
  const [searchState, setSearchState] = useState({
    searchText: '',
    replaceText: '',
    caseSensitive: false,
    wholeCell: false,
    searchPosition: { row: 0, col: 0 }
  });

  // 検索処理
  const handleSearch = () => {
    const { searchText, caseSensitive, wholeCell, searchPosition } = searchState;
    
    if (!searchText) return;
    
    const hot = hotRef.current.hotInstance;
    const data = hot.getData();
    let found = false;
    
    // 現在位置から検索を開始
    const startRow = searchPosition.row;
    const startCol = searchPosition.col + 1; // 現在位置の次から
    
    // 検索ループ
    outerLoop:
    for (let row = startRow; row < data.length; row++) {
      // 最初の行の場合、現在の列から開始
      const colStart = row === startRow ? startCol : 0;
      
      for (let col = colStart; col < data[row].length; col++) {
        const cellValue = data[row][col];
        
        // セルに値がある場合のみ検索
        if (cellValue !== null && cellValue !== undefined) {
          const cellText = String(cellValue);
          
          let match = false;
          if (wholeCell) {
            // セル全体が一致するか
            match = caseSensitive 
              ? cellText === searchText 
              : cellText.toLowerCase() === searchText.toLowerCase();
          } else {
            // 部分一致
            match = caseSensitive 
              ? cellText.includes(searchText) 
              : cellText.toLowerCase().includes(searchText.toLowerCase());
          }
          
          if (match) {
            // マッチした場合はそのセルを選択
            hot.selectCell(row, col);
            
            // 次回検索のための現在位置を更新
            setSearchState(prev => ({
              ...prev,
              searchPosition: { row, col }
            }));
            
            found = true;
            updateStatusMessage(`「${searchText}」が見つかりました`, 3000);
            break outerLoop;
          }
        }
      }
    }
    
    // 見つからなかった場合は最初から再検索
    if (!found) {
      // 検索位置をリセット
      setSearchState(prev => ({
        ...prev,
        searchPosition: { row: 0, col: -1 } // 最初のセルから検索するため
      }));
      
      updateStatusMessage(`「${searchText}」が見つかりませんでした。最初から検索します`, 3000);
      
      // 先頭に戻ってもう一度検索（少し遅延させる）
      setTimeout(() => handleSearch(), 100);
    }
  };

  // 置換処理
  const handleReplace = () => {
    const { searchText, replaceText, caseSensitive, wholeCell } = searchState;
    
    const hot = hotRef.current.hotInstance;
    const selectedCell = hot.getSelected();
    if (!selectedCell) {
      updateStatusMessage('置換するセルが選択されていません', 3000);
      return;
    }
    
    // 変更前の状態をアンドゥスタックに保存
    pushToUndoStack();
    
    const [row, col] = selectedCell[0];
    const cellValue = hot.getDataAtCell(row, col);
    
    if (cellValue !== null && cellValue !== undefined) {
      const cellText = String(cellValue);
      
      let newValue;
      if (wholeCell) {
        // セル全体が一致する場合は完全に置換
        const match = caseSensitive
          ? cellText === searchText
          : cellText.toLowerCase() === searchText.toLowerCase();
        
        if (match) {
          newValue = replaceText;
        }
      } else {
        // 部分一致の場合は該当部分のみ置換
        if (caseSensitive) {
          newValue = cellText.replace(searchText, replaceText);
        } else {
          newValue = cellText.replace(
            new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\      // ファイル名を生成（現在の日時を含'), 'gi'),
            replaceText
          );
        }
      }
      
      if (newValue !== undefined && newValue !== cellText) {
        hot.setDataAtCell(row, col, newValue);
        updateStatusMessage('置換しました', 3000);
      } else {
        updateStatusMessage('置換対象が見つかりませんでした', 3000);
      }
    }
    
    // 次の検索を実行
    handleSearch();
  };

  // すべて置換処理
  const handleReplaceAll = () => {
    const { searchText, replaceText, caseSensitive, wholeCell } = searchState;
    
    if (!searchText) {
      updateStatusMessage('検索する文字列を入力してください', 3000);
      return;
    }
    
    // 変更前の状態をアンドゥスタックに保存
    pushToUndoStack();
    
    const hot = hotRef.current.hotInstance;
    const data = hot.getData();
    let replaceCount = 0;
    
    // すべてのセルをチェック
    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < data[row].length; col++) {
        const cellValue = data[row][col];
        
        if (cellValue !== null && cellValue !== undefined) {
          const cellText = String(cellValue);
          
          let newValue;
          if (wholeCell) {
            // セル全体が一致する場合は完全に置換
            const match = caseSensitive
              ? cellText === searchText
              : cellText.toLowerCase() === searchText.toLowerCase();
            
            if (match) {
              newValue = replaceText;
              replaceCount++;
            }
          } else {
            // 部分一致の場合は該当部分のみ置換
            const regex = new RegExp(
              searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\      // ファイル名を生成（現在の日時を含'),
              caseSensitive ? 'g' : 'gi'
            );
            
            const matches = cellText.match(regex);
            if (matches) {
              newValue = cellText.replace(regex, replaceText);
              replaceCount += matches.length;
            }
          }
          
          if (newValue !== undefined && newValue !== cellText) {
            hot.setDataAtCell(row, col, newValue);
          }
        }
      }
    }
    
    updateStatusMessage(`${replaceCount}件置換しました`, 3000);
  };
  
  return (
    <div className="spreadsheet-container">
      <Helmet>
        <title>拡張Handsontableスプレッドシート</title>
      </Helmet>
      
      <div className="header">
        <h1>拡張Handsontableスプレッドシート</h1>
      </div>
      
      <MenuBar 
        onNewFile={() => {
          if (window.confirm('新しいスプレッドシートを作成しますか？現在のデータは保存されていない場合、失われます。')) {
            resetSpreadsheet();
          }
        }}
        onOpenFile={() => setShowOpenFileModal(true)}
        onSave={handleSave}
        onSaveAs={() => setShowSaveAsModal(true)}
        onImportCSV={() => importFile('.csv')}
        onImportExcel={() => importFile('.xlsx, .xls')}
        onExportCSV={exportCSV}
        onExportExcel={exportExcel}
        onPrint={() => window.print()}
        onUndo={undo}
        onRedo={redo}
        onSearch={() => setShowSearchModal(true)}
        onAbout={() => setShowAboutModal(true)}
        onShortcuts={() => setShowShortcutsModal(true)}
      />
      
      <Toolbar 
        onNew={() => {
          if (window.confirm('新しいスプレッドシートを作成しますか？現在のデータは保存されていない場合、失われます。')) {
            resetSpreadsheet();
          }
        }}
        onOpen={() => setShowOpenFileModal(true)}
        onSave={handleSave}
        onUndo={undo}
        onRedo={redo}
        onApplyBold={() => applyStyleToSelection({ fontWeight: 'bold' })}
        onApplyItalic={() => applyStyleToSelection({ fontStyle: 'italic' })}
        onApplyUnderline={() => applyStyleToSelection({ textDecoration: 'underline' })}
        onAlignLeft={() => applyStyleToSelection({ textAlign: 'left' })}
        onAlignCenter={() => applyStyleToSelection({ textAlign: 'center' })}
        onAlignRight={() => applyStyleToSelection({ textAlign: 'right' })}
        onMergeCells={mergeCells}
        onUnmergeCells={unmergeCells}
        onSearch={() => setShowSearchModal(true)}
        onImportExcel={() => importFile('.xlsx, .xls')}
        onExportExcel={exportExcel}
      />
      
      <FormulaBar 
        cellAddress={cellAddress}
        value={formulaValue}
        onChange={handleFormulaInputChange}
        onSubmit={handleFormulaSubmit}
      />
      
      <SheetTabs 
        sheets={availableSheets}
        currentSheet={currentSheet}
        onSheetChange={switchSheet}
        onAddSheet={addNewSheet}
      />
      
      <div className="spreadsheet-wrapper">
        <HotTable
          ref={hotRef}
          {...hotSettings}
        />
      </div>
      
      <StatusBar 
        message={statusMessage}
        sum={selectionStats.sum}
        average={selectionStats.average}
        selection={selectionStats.selection}
      />
      
      {/* モーダルダイアログ */}
      {showSearchModal && (
        <SearchModal 
          onClose={() => setShowSearchModal(false)}
          searchState={searchState}
          onSearchStateChange={setSearchState}
          onFindNext={handleSearch}
          onReplace={handleReplace}
          onReplaceAll={handleReplaceAll}
        />
      )}
      
      {showOpenFileModal && (
        <OpenFileModal 
          onClose={() => setShowOpenFileModal(false)}
          onFileSelect={loadSavedFile}
        />
      )}
      
      {showSaveAsModal && (
        <SaveAsModal 
          onClose={() => setShowSaveAsModal(false)}
          onSave={handleSaveAs}
        />
      )}
      
      {showAboutModal && (
        <AboutModal 
          onClose={() => setShowAboutModal(false)}
        />
      )}
      
      {showShortcutsModal && (
        <ShortcutsModal 
          onClose={() => setShowShortcutsModal(false)}
        />
      )}
    </div>
  );
};

export default SpreadsheetEditor;