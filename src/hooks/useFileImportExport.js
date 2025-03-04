import { useCallback } from 'react';
import { useSpreadsheet } from '../context/SpreadsheetContext';
import useSpreadsheetData from './useSpreadsheetData';

/**
 * ファイルのインポート/エクスポート機能を管理するためのカスタムフック
 */
const useFileImportExport = () => {
  const { state, dispatch, actionTypes } = useSpreadsheet();
  const { setModified, setFilename, setLastSaved, updateStatusMessage } = useSpreadsheetData();
  
  /**
   * スプレッドシートをローカルストレージに保存する
   */
  const saveToLocalStorage = useCallback(() => {
    try {
      // 保存するデータの作成
      const saveData = {
        sheets: state.sheets,
        sheetData: state.sheetData,
        cellStyles: state.cellStyles,
        conditionalFormats: state.conditionalFormats,
        charts: state.charts,
        comments: state.comments,
        protectedCells: state.protectedCells,
        dataValidations: state.dataValidations,
        filename: state.currentFilename,
        savedAt: new Date().toISOString()
      };
      
      // キーの作成 (filename_timestamp)
      const saveKey = `spreadsheet_${state.currentFilename}_${Date.now()}`;
      
      // ローカルストレージに保存
      localStorage.setItem(saveKey, JSON.stringify(saveData));
      
      // 保存リストを更新
      const savedFiles = JSON.parse(localStorage.getItem('handsontable_files_list') || '[]');
      const fileInfo = {
        key: saveKey,
        filename: state.currentFilename,
        savedAt: new Date().toISOString()
      };
      
      // 同じファイル名の古い保存を検索し置換
      const existingIndex = savedFiles.findIndex(f => f.filename === state.currentFilename);
      if (existingIndex >= 0) {
        savedFiles[existingIndex] = fileInfo;
      } else {
        savedFiles.push(fileInfo);
      }
      
      localStorage.setItem('handsontable_files_list', JSON.stringify(savedFiles));
      
      // 状態の更新
      setModified(false);
      setLastSaved(new Date().toISOString());
      
      updateStatusMessage('ファイルを保存しました', 3000);
      
      return true;
    } catch (error) {
      console.error('保存エラー:', error);
      updateStatusMessage('保存に失敗しました', 3000);
      return false;
    }
  }, [state, setModified, setLastSaved, updateStatusMessage]);
  
  /**
   * 名前を付けて保存
   * @param {string} filename ファイル名
   */
  const saveAs = useCallback((filename) => {
    // ファイル名を設定
    setFilename(filename);
    
    // ローカルストレージに保存
    return saveToLocalStorage();
  }, [setFilename, saveToLocalStorage]);
  
  /**
   * 保存済みファイルを読み込む
   * @param {string} key 保存キー
   * @param {Object} hotInstance Handsontableインスタンス
   */
  const loadSavedFile = useCallback((key, hotInstance) => {
    try {
      // ローカルストレージから読み込み
      const savedDataStr = localStorage.getItem(key);
      if (!savedDataStr) {
        updateStatusMessage('ファイルが見つかりません', 3000);
        return false;
      }
      
      const savedData = JSON.parse(savedDataStr);
      
      // データをステートに読み込み
      dispatch({
        type: actionTypes.LOAD_SPREADSHEET,
        payload: {
          sheets: savedData.sheets,
          sheetData: savedData.sheetData,
          cellStyles: savedData.cellStyles || {},
          conditionalFormats: savedData.conditionalFormats || {},
          charts: savedData.charts || [],
          comments: savedData.comments || {},
          protectedCells: savedData.protectedCells || {},
          dataValidations: savedData.dataValidations || {}
        }
      });
      
      // ファイル情報を更新
      setFilename(savedData.filename);
      setLastSaved(savedData.savedAt);
      setModified(false);
      
      // Handsontableの更新
      if (hotInstance) {
        hotInstance.loadData(savedData.sheetData[savedData.sheets[0]]);
      }
      
      updateStatusMessage('ファイルを読み込みました', 3000);
      
      return true;
    } catch (error) {
      console.error('読み込みエラー:', error);
      updateStatusMessage('ファイルの読み込みに失敗しました', 3000);
      return false;
    }
  }, [dispatch, actionTypes, setFilename, setLastSaved, setModified, updateStatusMessage]);
  
  /**
   * 保存済みファイルのリストを取得
   * @returns {Array} 保存済みファイルのリスト
   */
  const getSavedFilesList = useCallback(() => {
    try {
      const savedFiles = JSON.parse(localStorage.getItem('handsontable_files_list') || '[]');
      return savedFiles.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    } catch (error) {
      console.error('ファイルリスト取得エラー:', error);
      return [];
    }
  }, []);
  
  /**
   * CSVファイルをインポート
   * @param {string} csvText CSVテキスト
   * @param {Object} options オプション
   * @param {Object} hotInstance Handsontableインスタンス
   */
  const importCSV = useCallback((csvText, options, hotInstance) => {
    try {
      // この実装は簡略化しています。実際にはPapaParseなどのライブラリを使用して
      // CSVをパースする処理が必要です。
      
      // 新しいシートを作成
      const newSheetId = `imported_sheet_${Date.now()}`;
      
      dispatch({
        type: actionTypes.ADD_SHEET,
        payload: newSheetId
      });
      
      // シンプルなCSVパース (実際にはより堅牢な実装が必要)
      const rows = csvText.split('\n').map(row => row.split(','));
      
      // シートデータを更新
      dispatch({
        type: actionTypes.UPDATE_SHEET_DATA,
        payload: {
          sheetId: newSheetId,
          data: rows
        }
      });
      
      // 現在のシートを変更
      dispatch({
        type: actionTypes.SET_CURRENT_SHEET,
        payload: newSheetId
      });
      
      // Handsontableを更新
      if (hotInstance) {
        hotInstance.loadData(rows);
      }
      
      setModified(true);
      updateStatusMessage('CSVをインポートしました', 3000);
      
      return true;
    } catch (error) {
      console.error('CSVインポートエラー:', error);
      updateStatusMessage('CSVのインポートに失敗しました', 3000);
      return false;
    }
  }, [dispatch, actionTypes, setModified, updateStatusMessage]);
  
  /**
   * Excelファイルをインポート
   * @param {File} file Excelファイル
   * @param {Object} options オプション
   * @param {Object} hotInstance Handsontableインスタンス
   */
  const importExcel = useCallback((file, options, hotInstance) => {
    // 実装では、xlsx.jsライブラリを使用してExcelファイルを読み込む必要があります
    updateStatusMessage('Excelインポート機能は実装中です', 3000);
    return false;
  }, [updateStatusMessage]);
  
  /**
   * CSVファイルをエクスポート
   * @param {Object} hotInstance Handsontableインスタンス
   */
  const exportCSV = useCallback((hotInstance) => {
    if (!hotInstance) return false;
    
    try {
      const data = hotInstance.getData();
      
      // シンプルなCSV変換 (実際にはより堅牢な実装が必要)
      const csvContent = data
        .map(row => row.map(cell => {
          // 引用符を処理
          const cellStr = cell !== null ? String(cell) : '';
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(','))
        .join('\n');
      
      // ダウンロードリンクを作成
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${state.currentFilename}.csv`);
      document.body.appendChild(link);
      
      // ダウンロード実行
      link.click();
      document.body.removeChild(link);
      
      updateStatusMessage('CSVをエクスポートしました', 3000);
      
      return true;
    } catch (error) {
      console.error('CSVエクスポートエラー:', error);
      updateStatusMessage('CSVのエクスポートに失敗しました', 3000);
      return false;
    }
  }, [state.currentFilename, updateStatusMessage]);
  
  /**
   * Excelファイルをエクスポート
   * @param {Object} hotInstance Handsontableインスタンス
   */
  const exportExcel = useCallback((hotInstance) => {
    // 実装では、xlsx.jsライブラリを使用してExcelファイルを生成する必要があります
    updateStatusMessage('Excelエクスポート機能は実装中です', 3000);
    return false;
  }, [updateStatusMessage]);
  
  return {
    saveToLocalStorage,
    saveAs,
    loadSavedFile,
    getSavedFilesList,
    importCSV,
    importExcel,
    exportCSV,
    exportExcel
  };
};

export default useFileImportExport;