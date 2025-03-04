import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { HyperFormula } from 'hyperformula';

// コンテキスト
import { useSpreadsheet } from '../../context/SpreadsheetContext';

// カスタムフック
import useSpreadsheetData from '../../hooks/useSpreadsheetData';
import useUndoRedo from '../../hooks/useUndoRedo';
import useCellFormatting from '../../hooks/useCellFormatting';
import useFileImportExport from '../../hooks/useFileImportExport';
import useCellFeatures from '../../hooks/useCellFeatures';
import useCharts from '../../hooks/useCharts';

// コンポーネント
import MenuBar from './MenuBar';
import Toolbar from './Toolbar';
import FormulaBar from './FormulaBar';
import SheetTabs from './SheetTabs';
import StatusBar from './StatusBar';
import CommentDisplay from '../features/CommentDisplay';
import ChartContainer from '../charts/ChartContainer';

// モーダル
import AboutModal from '../modals/AboutModal';
import ChartModal from '../modals/ChartModal';
import ConditionalFormatModal from '../modals/ConditionalFormatModal';
import CSVImportModal from '../modals/CSVImportModal';
import DataCleaningModal from '../modals/DataCleaningModal';
import DataValidationModal from '../modals/DataValidationModal';
import FormatCellModal from '../modals/FormatCellModal';
import OpenFileModal from '../modals/OpenFileModal';
import PrintPreviewModal from '../modals/PrintPreviewModal';
import SaveAsModal from '../modals/SaveAsModal';
import SearchModal from '../modals/SearchModal';
import ShortcutsModal from '../modals/ShortcutsModal';

// ユーティリティ
import { 
  numToLetter, 
  indicesToCellAddress, 
  getRangeAddress, 
  isNumeric 
} from '../../utils/cellUtils';

// 定数
import { findShortcutByKeyEvent } from '../../constants/shortcutKeys';

// CSSスタイル
import './SpreadsheetEditor.css';

// すべてのHandsontableモジュールを登録
registerAllModules();

/**
 * 拡張スプレッドシートエディタのメインコンポーネント
 * 
 * @returns {JSX.Element} スプレッドシートエディタのUIコンポーネント
 */
const SpreadsheetEditor = () => {
  // ===== 参照と状態の定義 =====
  
  // Handsontableの参照
  const hotRef = useRef(null);

  // コンテキストとカスタムフック
  const { state, dispatch, actionTypes } = useSpreadsheet();
  const spreadsheetData = useSpreadsheetData();
  const undoRedo = useUndoRedo();
  const cellFormatting = useCellFormatting();
  const fileIO = useFileImportExport();
  const cellFeatures = useCellFeatures();
  const charts = useCharts();

  // UI状態
  const [activeCommentCell, setActiveCommentCell] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [isFormulaEditing, setIsFormulaEditing] = useState(false);
  const [currentCellStyles, setCurrentCellStyles] = useState({});

  // モーダルの表示状態
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [showConditionalFormatModal, setShowConditionalFormatModal] = useState(false);
  const [showCSVImportModal, setShowCSVImportModal] = useState(false);
  const [showDataCleaningModal, setShowDataCleaningModal] = useState(false);
  const [showDataValidationModal, setShowDataValidationModal] = useState(false);
  const [showFormatCellModal, setShowFormatCellModal] = useState(false);
  const [showOpenFileModal, setShowOpenFileModal] = useState(false);
  const [showPrintPreviewModal, setShowPrintPreviewModal] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // 検索関連の状態
  const [searchState, setSearchState] = useState({
    searchText: '',
    replaceText: '',
    caseSensitive: false,
    wholeCell: false,
    searchPosition: { row: 0, col: 0 }
  });

  // スプレッドシートデータをカスタムフックから取得
  const {
    currentSheet,
    sheets,
    currentSheetData,
    selectedCell,
    selectionRange,
    cellAddress,
    formulaValue,
    statusMessage,
    selectionStats,
    isModified,
    currentFilename,
    lastSaved,
    
    switchToSheet,
    addSheet,
    renameSheet,
    deleteSheet,
    updateCurrentSheetData,
    setSelectedCell,
    setSelectionRange,
    setCellAddress,
    setFormulaValue,
    updateStatusMessage,
    updateSelectionStats,
    resetSpreadsheet,
    setModified,
    setFilename,
    setLastSaved
  } = spreadsheetData;

  // アンドゥ・リドゥ機能
  const {
    pushToUndoStack,
    undo,
    redo,
    clearUndoRedoStack
  } = undoRedo;

  // セルの書式設定
  const {
    currentSheetStyles,
    currentSheetConditionalFormats,
    getCellStyle,
    applyStyleToSelection,
    applyCurrentSheetStyles,
    addConditionalFormat,
    removeConditionalFormat,
    applyConditionalFormatting
  } = cellFormatting;
  
  // ファイル操作
  const {
    saveToLocalStorage,
    saveAs,
    loadSavedFile,
    getSavedFilesList,
    importCSV,
    importExcel,
    exportCSV,
    exportExcel
  } = fileIO;

  // セル機能（コメント、保護、データ検証）
  const {
    currentSheetComments,
    addCommentToCurrentSheet,
    updateCommentInCurrentSheet,
    removeCommentFromCurrentSheet,
    getCommentFromCurrentSheet,
    isCellProtectedInCurrentSheet,
    addDataValidationToCurrentSheet,
    getDataValidationFromCurrentSheet,
    validateCellValueInCurrentSheet
  } = cellFeatures;

  // チャート機能
  const {
    currentSheetCharts,
    addChart,
    updateChart,
    removeChart,
    prepareChartData,
    createChartConfig
  } = charts;

  // ===== 副作用（useEffect）=====

  // HyperFormulaの初期化
 useEffect(() => {
  if (!state.hyperformulaInstance) {
    try {
      // HyperFormulaインスタンスを作成
      const hfInstance = HyperFormula.buildEmpty({
        licenseKey: 'non-commercial-and-evaluation'
      });
      
      // 状態に保存
      dispatch({
        type: actionTypes.SET_HYPERFORMULA_INSTANCE,
        payload: hfInstance
      });
      
      console.log('HyperFormulaが正常に初期化されました');
    } catch (error) {
      console.error('HyperFormula初期化エラー:', error);
    }
  }
}, []);

  // ページタイトルの更新
  useEffect(() => {
    document.title = isModified 
      ? `*${currentFilename} - 拡張スプレッドシート` 
      : `${currentFilename} - 拡張スプレッドシート`;
  }, [currentFilename, isModified]);

  // シート変更時の処理
  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      // データを読み込み
      hot.loadData(currentSheetData);
      
      // フォーミュラプラグインのシート名を更新
      hot.updateSettings({
        formulas: {
          sheetName: currentSheet
        }
      });
      
      // スタイルと条件付き書式を適用（非同期で処理）
      setTimeout(() => {
        applyCurrentSheetStyles(hot);
        applyConditionalFormatting(hot);
      }, 0);
    }
  }, [currentSheet, currentSheetData, applyCurrentSheetStyles, applyConditionalFormatting]);

  // Handsontable初期化後の処理
  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      // スタイルと条件付き書式を適用
      setTimeout(() => {
        applyCurrentSheetStyles(hot);
        applyConditionalFormatting(hot);
      }, 0);
    }
  }, [hotRef.current, applyCurrentSheetStyles, applyConditionalFormatting]);

  // キーボードショートカットの設定
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 入力フィールドでのショートカットは除外
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || isFormulaEditing) {
        return;
      }
      
      // ショートカットを検索
      const shortcut = findShortcutByKeyEvent(e);
      if (shortcut) {
        e.preventDefault();
        handleShortcutAction(shortcut.action);
      }
    };
    
    // イベントリスナーを登録
    window.addEventListener('keydown', handleKeyDown);
    
    // クリーンアップ
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFormulaEditing]);

  // ===== イベントハンドラー =====

  // ショートカットアクションのハンドラー
  const handleShortcutAction = (action) => {
    const hot = hotRef.current?.hotInstance;
    
    switch (action) {
      case 'onNew':
        handleNewFile();
        break;
      case 'onOpen':
        setShowOpenFileModal(true);
        break;
      case 'onSave':
        handleSave();
        break;
      case 'onSaveAs':
        setShowSaveAsModal(true);
        break;
      case 'onPrint':
        handlePrint();
        break;
      case 'onUndo':
        if (hot) undo(hot);
        break;
      case 'onRedo':
        if (hot) redo(hot);
        break;
      case 'onSearch':
        setShowSearchModal(true);
        break;
      case 'onSelectAll':
        if (hot) hot.selectAll();
        break;
      case 'onApplyBold':
        if (hot) applyStyleToSelection(hot, { fontWeight: 'bold' });
        break;
      case 'onApplyItalic':
        if (hot) applyStyleToSelection(hot, { fontStyle: 'italic' });
        break;
      case 'onApplyUnderline':
        if (hot) applyStyleToSelection(hot, { textDecoration: 'underline' });
        break;
      default:
        console.log('未実装のショートカット:', action);
        break;
    }
  };

  // セル選択時のイベントハンドラー
  const handleAfterSelectionEnd = (row, column, row2, column2) => {
    // セルアドレスを更新（例: A1）
    const colLabel = numToLetter(column);
    setCellAddress(`${colLabel}${row + 1}`);
    
    // セルの値を取得してフォーミュラバーに表示
    const hot = hotRef.current.hotInstance;
    const value = hot.getDataAtCell(row, column);
    setFormulaValue(value !== null ? value : '');
    
    // 選択範囲を更新
    setSelectedCell({ row, col: column });
    setSelectionRange({ startRow: row, startCol: column, endRow: row2, endCol: column2 });
    
    // 選択範囲の統計を計算
    updateCellSelectionStats(row, column, row2, column2);
    
    // 現在選択されているセルのスタイルを取得
    const cellStyle = getCellStyle(currentSheet, row, column);
    setCurrentCellStyles(cellStyle);
  };

  // 数式バーの値変更ハンドラー
  const handleFormulaInputChange = (value) => {
    setFormulaValue(value);
  };

  // 数式バーでEnterキーが押された時の処理
  const handleFormulaSubmit = () => {
    const hot = hotRef.current.hotInstance;
    if (selectedCell) {
      // 変更前の状態をアンドゥスタックに保存
      pushToUndoStack(hot);
      
      // セルの値を更新
      hot.setDataAtCell(selectedCell.row, selectedCell.col, formulaValue);
      
      // 編集モードを終了
      setIsFormulaEditing(false);
    }
  };

  // 選択範囲の統計情報を更新
  const updateCellSelectionStats = (row, col, row2, col2) => {
    const hot = hotRef.current.hotInstance;
    const selText = `${numToLetter(col)}${row + 1}:${numToLetter(col2)}${row2 + 1}`;
    
    // 選択範囲の数値を収集
    const selectedValues = [];
    for (let r = Math.min(row, row2); r <= Math.max(row, row2); r++) {
      for (let c = Math.min(col, col2); c <= Math.max(col, col2); c++) {
        const value = hot.getDataAtCell(r, c);
        if (value !== null && value !== '' && isNumeric(value)) {
          selectedValues.push(parseFloat(value));
        }
      }
    }
    
    // 統計情報を計算
    if (selectedValues.length > 0) {
      const sum = selectedValues.reduce((a, b) => a + b, 0);
      const average = sum / selectedValues.length;
      
      updateSelectionStats({
        sum: sum.toFixed(2),
        average: average.toFixed(2),
        count: selectedValues.length,
        selection: selText
      });
    } else {
      updateSelectionStats({
        sum: '0',
        average: '0',
        count: 0,
        selection: selText
      });
    }
  };

  // データ変更時のイベントハンドラー
  const handleAfterChange = (changes, source) => {
    if (!changes || source === 'loadData') return;
    
    const hot = hotRef.current.hotInstance;
    
    // 変更前の状態をアンドゥスタックに保存
    pushToUndoStack(hot);
    
    // シートデータを更新
    updateCurrentSheetData(hot.getData());
    
    // 変更フラグを設定
    setModified(true);
    
    // データ検証を適用
    for (const [row, col, oldValue, newValue] of changes) {
      const validation = getDataValidationFromCurrentSheet(row, col);
      
      if (validation) {
        // 値を検証
        const { isValid, message } = validateCellValueInCurrentSheet(row, col, newValue);
        
        if (!isValid) {
          // データ検証に失敗した場合の処理
          if (validation.rejectInvalid) {
            // 変更を拒否して元の値に戻す
            hot.setDataAtCell(row, col, oldValue);
            updateStatusMessage(`検証エラー: ${message}`, 5000);
          } else {
            // 警告のみ表示
            updateStatusMessage(`警告: ${message}`, 5000);
          }
        }
      }
    }
    
    // 条件付き書式を再適用
    applyConditionalFormatting(hot);
  };

  // セルにマウスオーバーしたときの処理
  const handleCellMouseOver = (event, coords) => {
    if (!coords) return;
    
    const { row, col } = coords;
    setHoveredCell({ row, col });
    
    // コメントがあるかチェック
    const comment = getCommentFromCurrentSheet(row, col);
    if (comment) {
      setActiveCommentCell({ row, col, comment });
    } else {
      setActiveCommentCell(null);
    }
  };

  // セルからマウスが出た時の処理
  const handleCellMouseOut = () => {
    setHoveredCell(null);
    // コメントを少し遅延して非表示に
    setTimeout(() => {
      if (!hoveredCell) {
        setActiveCommentCell(null);
      }
    }, 300);
  };

  // セルをダブルクリックしたときの処理
  const handleCellDoubleClick = (event, coords) => {
    if (!coords) return;
    
    const { row, col } = coords;
    
    // 保護されたセルかどうかをチェック
    if (isCellProtectedInCurrentSheet(row, col)) {
      updateStatusMessage('このセルは保護されています', 3000);
      return;
    }
  };

  // セルレンダラー - カスタムスタイル適用
  const cellRenderer = (instance, td, row, col, prop, value, cellProperties) => {
    // デフォルトのレンダラーを適用
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
    
    // セルキー（位置を表す文字列）
    const cellKey = `${row},${col}`;
    
    // セルにスタイルを適用
    if (currentSheetStyles && currentSheetStyles[cellKey]) {
      const classes = currentSheetStyles[cellKey].split(' ');
      classes.forEach(className => {
        if (className.trim()) {
          td.classList.add(className.trim());
        }
      });
    }
    
    // コメントマーカーの表示
    const comment = getCommentFromCurrentSheet(row, col);
    if (comment) {
      const marker = document.createElement('div');
      marker.className = 'cell-comment-marker';
      marker.innerHTML = '📝';
      marker.style.position = 'absolute';
      marker.style.top = '2px';
      marker.style.right = '2px';
      marker.style.fontSize = '10px';
      marker.style.color = '#ff0000';
      td.style.position = 'relative';
      td.appendChild(marker);
    }
    
    // データ検証マーカーの表示
    const validation = getDataValidationFromCurrentSheet(row, col);
    if (validation) {
      const marker = document.createElement('div');
      marker.className = 'cell-validation-marker';
      marker.innerHTML = '✓';
      marker.style.position = 'absolute';
      marker.style.bottom = '2px';
      marker.style.right = '2px';
      marker.style.fontSize = '10px';
      marker.style.color = '#00aa00';
      td.style.position = 'relative';
      td.appendChild(marker);
    }
    
    // 保護されたセルの表示
    if (isCellProtectedInCurrentSheet(row, col)) {
      td.classList.add('protected-cell');
    }
    
    return td;
  };

  // ===== 機能ハンドラー =====

  // 書式メニュー処理
  const handleFormatCellClick = () => {
    if (selectionRange) {
      setShowFormatCellModal(true);
    } else {
      updateStatusMessage('書式を適用するセルを選択してください', 3000);
    }
  };

  // 書式設定を適用する関数
  const handleApplyFormat = (styleSettings) => {
    const hot = hotRef.current.hotInstance;
    applyStyleToSelection(hot, styleSettings);
    setShowFormatCellModal(false);
  };

  // 条件付き書式を追加する処理
  const handleAddConditionalFormat = (formatSettings) => {
    if (!selectionRange) {
      updateStatusMessage('条件付き書式を適用する範囲を選択してください', 3000);
      return;
    }
    
    addConditionalFormat({
      range: selectionRange,
      ...formatSettings
    });
    
    setShowConditionalFormatModal(false);
    
    // 条件付き書式を適用
    const hot = hotRef.current.hotInstance;
    applyConditionalFormatting(hot);
  };

  // 新規作成
  const handleNewFile = () => {
    if (isModified) {
      if (window.confirm('変更が保存されていません。新しいファイルを作成しますか？')) {
        resetSpreadsheet();
      }
    } else {
      resetSpreadsheet();
    }
  };

  // 保存
  const handleSave = () => {
    saveToLocalStorage();
  };

  // 名前を付けて保存
  const handleSaveAs = (filename) => {
    saveAs(filename);
    setShowSaveAsModal(false);
  };

  // 印刷
  const handlePrint = () => {
    setShowPrintPreviewModal(true);
  };

  // ファイルを開く
  const handleOpenFile = (key) => {
    if (isModified) {
      if (window.confirm('変更が保存されていません。別のファイルを開きますか？')) {
        loadSavedFile(key, hotRef.current?.hotInstance);
      }
    } else {
      loadSavedFile(key, hotRef.current?.hotInstance);
    }
    
    setShowOpenFileModal(false);
  };

  // CSVインポート
  const handleCSVImport = (csvText, parseOptions) => {
    importCSV(csvText, parseOptions, hotRef.current?.hotInstance);
    setShowCSVImportModal(false);
  };

  // Excel/CSVインポート
  const handleImportExcel = () => {
    // ファイル選択ダイアログを作成
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls, .csv';
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // ファイル拡張子で処理を分岐
      const ext = file.name.split('.').pop().toLowerCase();
      
      if (ext === 'csv') {
        setShowCSVImportModal(true);
      } else if (ext === 'xlsx' || ext === 'xls') {
        importExcel(file, { importMethod: 'newSheet' }, hotRef.current?.hotInstance);
      }
    });
    
    // ファイル選択ダイアログを表示
    fileInput.click();
  };

  // チャート追加処理
  const handleAddChart = (chartSettings) => {
    if (!selectionRange) {
      updateStatusMessage('チャートに使用するデータ範囲を選択してください', 3000);
      return;
    }
    
    const hot = hotRef.current.hotInstance;
    const chartData = prepareChartData(hot, selectionRange, chartSettings.dataOptions);
    
    if (!chartData) {
      updateStatusMessage('データを取得できませんでした', 3000);
      return;
    }
    
    const chartConfig = createChartConfig(
      chartSettings.type, 
      chartData, 
      chartSettings.options
    );
    
    // チャートを追加
    addChart({
      title: chartSettings.title || '新しいチャート',
      type: chartSettings.type,
      dataRange: selectionRange,
      sheetId: currentSheet,
      chartConfig,
      position: chartSettings.position || { x: 100, y: 100 },
      size: chartSettings.size || { width: 400, height: 300 }
    });
    
    setShowChartModal(false);
  };

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
      
      for (let col = colStart; col < (data[row] ? data[row].length : 0); col++) {
        const cellValue = data[row] && data[row][col];
        
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
    const selectedCells = hot.getSelected();
    if (!selectedCells) {
      updateStatusMessage('置換するセルが選択されていません', 3000);
      return;
    }
    
    // 変更前の状態をアンドゥスタックに保存
    pushToUndoStack(hot);
    
    const [row, col] = selectedCells[0];
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
          // 正規表現のエスケープ処理
          const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedSearchText, 'gi');
          newValue = cellText.replace(regex, replaceText);
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
    const hot = hotRef.current.hotInstance;
    pushToUndoStack(hot);
    
    const data = hot.getData();
    let replaceCount = 0;
    const updatedCells = [];
    
    // すべてのセルをチェック
    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < (data[row] ? data[row].length : 0); col++) {
        const cellValue = data[row] && data[row][col];
        
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
              updatedCells.push([row, col, newValue]);
            }
          } else {
            // 部分一致の場合は該当部分のみ置換
            // 正規表現のエスケープ処理
            const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedSearchText, caseSensitive ? 'g' : 'gi');
            
            const matches = cellText.match(regex);
            if (matches) {
              newValue = cellText.replace(regex, replaceText);
              replaceCount += matches.length;
              updatedCells.push([row, col, newValue]);
            }
          }
        }
      }
    }
    
    // 一括でセルを更新
    if (updatedCells.length > 0) {
      hot.setDataAtCell(updatedCells);
      
      // シートデータを更新
      updateCurrentSheetData(hot.getData());
      
      // 変更フラグを設定
      setModified(true);
    }
    
    updateStatusMessage(`${replaceCount}件置換しました`, 3000);
  };

  // セルの結合
  const handleMergeCells = () => {
    if (!selectionRange) {
      updateStatusMessage('結合するセルを選択してください', 3000);
      return;
    }
    
    const hot = hotRef.current.hotInstance;
    
    // 変更前の状態をアンドゥスタックに保存
    pushToUndoStack(hot);
    
    const { startRow, startCol, endRow, endCol } = selectionRange;
    
    // MergeCellsプラグインを使用してセルを結合
    const mergeCellsPlugin = hot.getPlugin('mergeCells');
    if (mergeCellsPlugin) {
      mergeCellsPlugin.merge(
        Math.min(startRow, endRow),
        Math.min(startCol, endCol),
        Math.abs(endRow - startRow) + 1,
        Math.abs(endCol - startCol) + 1
      );
      hot.render(); // 変更を反映するための再描画
      
      // シートデータを更新
      updateCurrentSheetData(hot.getData());
      
      // 変更フラグを設定
      setModified(true);
      
      updateStatusMessage('セルを結合しました', 3000);
    } else {
      console.error('MergeCellsプラグインが利用できません');
      updateStatusMessage('セル結合機能を利用できません', 3000);
    }
  };

  // セルの結合を解除
  const handleUnmergeCells = () => {
    if (!selectionRange) {
      updateStatusMessage('結合を解除するセルを選択してください', 3000);
      return;
    }
    
    const hot = hotRef.current.hotInstance;
    
    // 変更前の状態をアンドゥスタックに保存
    pushToUndoStack(hot);
    
    const { startRow, startCol, endRow, endCol } = selectionRange;
    
    // MergeCellsプラグインを使用して結合を解除
    const mergeCellsPlugin = hot.getPlugin('mergeCells');
    if (mergeCellsPlugin) {
      // 選択範囲内のすべてのマージされたセルを解除
      for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
        for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
          mergeCellsPlugin.unmerge(row, col);
        }
      }
      
      hot.render(); // 変更を反映するための再描画
      
      // シートデータを更新
      updateCurrentSheetData(hot.getData());
      
      // 変更フラグを設定
      setModified(true);
      
      updateStatusMessage('セルの結合を解除しました', 3000);
    } else {
      console.error('MergeCellsプラグインが利用できません');
      updateStatusMessage('セル結合解除機能を利用できません', 3000);
    }
  };

  // コメントを追加
  const handleAddComment = () => {
    if (!selectedCell) {
      updateStatusMessage('コメントを追加するセルを選択してください', 3000);
      return;
    }
    
    const { row, col } = selectedCell;
    const comment = prompt('コメントを入力してください:');
    
    if (comment) {
      addCommentToCurrentSheet(row, col, comment);
      
      // Handsontableを更新
      const hot = hotRef.current.hotInstance;
      hot.render();
      
      updateStatusMessage('コメントを追加しました', 3000);
    }
  };

  // データ検証を追加
  const handleAddDataValidation = (validationSettings) => {
    if (!selectionRange) {
      updateStatusMessage('データ検証を追加するセルを選択してください', 3000);
      return;
    }
    
    const { startRow, startCol, endRow, endCol } = selectionRange;
    
    // 選択範囲内のすべてのセルにデータ検証を追加
    for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
      for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
        addDataValidationToCurrentSheet(row, col, validationSettings);
      }
    }
    
    // Handsontableを更新
    const hot = hotRef.current.hotInstance;
    hot.render();
    
    setShowDataValidationModal(false);
    updateStatusMessage('データ検証を追加しました', 3000);
  };

  // Handsontableの設定
const hotSettings = {
  data: currentSheetData,
  rowHeaders: true,
  colHeaders: true,
  licenseKey: 'non-commercial-and-evaluation',
  contextMenu: true,
  manualColumnResize: true,
  manualRowResize: true,
  comments: true,
  // ここを条件付きで適用するように変更
  ...(state.hyperformulaInstance ? {
    formulas: {
      engine: state.hyperformulaInstance,
      sheetName: currentSheet
    }
  } : {}),
    stretchH: 'all',
    autoWrapRow: true,
    wordWrap: true,
    // mergeCellsプラグインを確実に有効化
    mergeCells: true,
    fixedRowsTop: 0,
    fixedColumnsLeft: 0,
    minSpareRows: 5,
    minSpareCols: 2,
    // イベントハンドラー
    afterSelectionEnd: handleAfterSelectionEnd,
    afterChange: handleAfterChange,
    afterOnCellMouseOver: handleCellMouseOver,
    afterOnCellMouseOut: handleCellMouseOut,
    afterOnCellDoubleClick: handleCellDoubleClick,
    // セルレンダラー
    cells: cellRenderer,
    className: 'htCustomStyles',
    outsideClickDeselects: false
  };

  // ===== レンダリング =====
  return (
    <div className="spreadsheet-container">
      <Helmet>
        <title>{isModified ? `*${currentFilename}` : currentFilename} - 拡張スプレッドシート</title>
      </Helmet>
      
      <div className="header">
        <h1>拡張スプレッドシート</h1>
        <div className="file-info">
          {currentFilename} {isModified && '*'}
          {lastSaved && (
            <span className="last-saved">
              （最終保存: {new Date(lastSaved).toLocaleString()}）
            </span>
          )}
        </div>
      </div>
      
      {/* メニューバー */}
      <MenuBar 
        onNewFile={handleNewFile}
        onOpenFile={() => setShowOpenFileModal(true)}
        onSave={handleSave}
        onSaveAs={() => setShowSaveAsModal(true)}
        onImportCSV={() => setShowCSVImportModal(true)}
        onImportExcel={handleImportExcel}
        onExportCSV={() => exportCSV(hotRef.current?.hotInstance)}
        onExportExcel={() => exportExcel(hotRef.current?.hotInstance)}
        onPrint={handlePrint}
        onUndo={() => undo(hotRef.current?.hotInstance)}
        onRedo={() => redo(hotRef.current?.hotInstance)}
        onCut={() => document.execCommand('cut')}
        onCopy={() => document.execCommand('copy')}
        onPaste={() => document.execCommand('paste')}
        onSearch={() => setShowSearchModal(true)}
        onAbout={() => setShowAboutModal(true)}
        onShortcuts={() => setShowShortcutsModal(true)}
        onFormatCell={handleFormatCellClick}
        onConditionalFormat={() => setShowConditionalFormatModal(true)}
        onDataCleaning={() => setShowDataCleaningModal(true)}
        onDataValidation={() => setShowDataValidationModal(true)}
        onMergeCells={handleMergeCells}
        onUnmergeCells={handleUnmergeCells}
        onInsertChart={() => setShowChartModal(true)}
        onInsertComment={handleAddComment}
        onApplyBold={() => applyStyleToSelection(hotRef.current?.hotInstance, { fontWeight: 'bold' })}
        onApplyItalic={() => applyStyleToSelection(hotRef.current?.hotInstance, { fontStyle: 'italic' })}
        onApplyUnderline={() => applyStyleToSelection(hotRef.current?.hotInstance, { textDecoration: 'underline' })}
        onAlignLeft={() => applyStyleToSelection(hotRef.current?.hotInstance, { textAlign: 'left' })}
        onAlignCenter={() => applyStyleToSelection(hotRef.current?.hotInstance, { textAlign: 'center' })}
        onAlignRight={() => applyStyleToSelection(hotRef.current?.hotInstance, { textAlign: 'right' })}
      />
      
      {/* ツールバー */}
      <Toolbar 
        onNew={handleNewFile}
        onOpen={() => setShowOpenFileModal(true)}
        onSave={handleSave}
        onUndo={() => undo(hotRef.current?.hotInstance)}
        onRedo={() => redo(hotRef.current?.hotInstance)}
        onCut={() => document.execCommand('cut')}
        onCopy={() => document.execCommand('copy')}
        onPaste={() => document.execCommand('paste')}
        onApplyBold={() => applyStyleToSelection(hotRef.current?.hotInstance, { fontWeight: 'bold' })}
        onApplyItalic={() => applyStyleToSelection(hotRef.current?.hotInstance, { fontStyle: 'italic' })}
        onApplyUnderline={() => applyStyleToSelection(hotRef.current?.hotInstance, { textDecoration: 'underline' })}
        onAlignLeft={() => applyStyleToSelection(hotRef.current?.hotInstance, { textAlign: 'left' })}
        onAlignCenter={() => applyStyleToSelection(hotRef.current?.hotInstance, { textAlign: 'center' })}
        onAlignRight={() => applyStyleToSelection(hotRef.current?.hotInstance, { textAlign: 'right' })}
        onMergeCells={handleMergeCells}
        onUnmergeCells={handleUnmergeCells}
        onFormatCell={handleFormatCellClick}
        onConditionalFormat={() => setShowConditionalFormatModal(true)}
        onDataValidation={() => setShowDataValidationModal(true)}
        onInsertChart={() => setShowChartModal(true)}
        onSearch={() => setShowSearchModal(true)}
        onImportExcel={handleImportExcel}
        onExportExcel={() => exportExcel(hotRef.current?.hotInstance)}
      />
      
      {/* 数式バー */}
      <FormulaBar 
        cellAddress={cellAddress}
        value={formulaValue}
        onChange={handleFormulaInputChange}
        onSubmit={handleFormulaSubmit}
        onFocus={() => setIsFormulaEditing(true)}
        onBlur={() => setIsFormulaEditing(false)}
      />
      
      {/* シートタブ */}
      <SheetTabs 
        sheets={sheets}
        currentSheet={currentSheet}
        onSheetChange={switchToSheet}
        onAddSheet={() => addSheet()}
        onRenameSheet={(oldId, newName) => renameSheet(oldId, newName)}
        onDeleteSheet={deleteSheet}
      />
      
      {/* スプレッドシート領域 */}
      <div className="spreadsheet-wrapper">
        {/* Handsontableコンポーネント */}
        <HotTable
          ref={hotRef}
          {...hotSettings}
        />
        
        {/* チャート表示エリア */}
        {currentSheetCharts.map(chart => (
          <ChartContainer
            key={chart.id}
            chart={chart}
            onUpdate={(chartId, updates) => updateChart(chartId, updates)}
            onRemove={(chartId) => removeChart(chartId)}
          />
        ))}
        
        {/* コメント表示 */}
        {activeCommentCell && (
          <CommentDisplay
            comment={activeCommentCell.comment}
            position={{
              x: activeCommentCell.col * 120 + 50,
              y: activeCommentCell.row * 30 + 100
            }}
            onUpdate={(text) => updateCommentInCurrentSheet(activeCommentCell.row, activeCommentCell.col, text)}
            onDelete={() => removeCommentFromCurrentSheet(activeCommentCell.row, activeCommentCell.col)}
          />
        )}
      </div>
      
      {/* ステータスバー */}
      <StatusBar 
        message={statusMessage}
        stats={selectionStats}
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
          onFileSelect={handleOpenFile}
          files={getSavedFilesList()}
        />
      )}
      
      {showSaveAsModal && (
        <SaveAsModal 
          onClose={() => setShowSaveAsModal(false)}
          onSave={handleSaveAs}
          currentFilename={currentFilename}
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

      {showCSVImportModal && (
        <CSVImportModal 
          onClose={() => setShowCSVImportModal(false)}
          onImport={handleCSVImport}
        />
      )}
      
      {showFormatCellModal && (
        <FormatCellModal 
          onClose={() => setShowFormatCellModal(false)}
          onApplyFormat={handleApplyFormat}
          initialStyles={currentCellStyles}
        />
      )}
      
      {showConditionalFormatModal && (
        <ConditionalFormatModal 
          onClose={() => setShowConditionalFormatModal(false)}
          onAddFormat={handleAddConditionalFormat}
          selectedRange={selectionRange ? getRangeAddress(selectionRange) : ''}
          existingFormats={currentSheetConditionalFormats}
          onRemoveFormat={removeConditionalFormat}
        />
      )}
      
      {showChartModal && (
        <ChartModal 
          onClose={() => setShowChartModal(false)}
          onAddChart={handleAddChart}
          selectedRange={selectionRange ? getRangeAddress(selectionRange) : ''}
        />
      )}
      
      {showDataValidationModal && (
        <DataValidationModal 
          onClose={() => setShowDataValidationModal(false)}
          onAddValidation={handleAddDataValidation}
          selectedRange={selectionRange ? getRangeAddress(selectionRange) : ''}
        />
      )}
      
      {showDataCleaningModal && (
        <DataCleaningModal 
          onClose={() => setShowDataCleaningModal(false)}
          selectedRange={selectionRange ? getRangeAddress(selectionRange) : ''}
          data={selectionRange ? hotRef.current?.hotInstance.getData(
            selectionRange.startRow,
            selectionRange.startCol,
            selectionRange.endRow,
            selectionRange.endCol
          ) : []}
        />
      )}
      
      {showPrintPreviewModal && (
        <PrintPreviewModal 
          onClose={() => setShowPrintPreviewModal(false)}
          hotInstance={hotRef.current?.hotInstance}
          sheetName={currentSheet}
        />
      )}
    </div>
  );
};

export default SpreadsheetEditor;