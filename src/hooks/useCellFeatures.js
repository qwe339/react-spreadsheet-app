import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // UUIDを生成するライブラリ
import { useSpreadsheet } from '../context/SpreadsheetContext';
import useSpreadsheetData from './useSpreadsheetData';

/**
 * セルの特殊機能（コメント、保護、データ検証）を管理するためのカスタムフック
 */
const useCellFeatures = () => {
  const { state, dispatch, actionTypes } = useSpreadsheet();
  const { updateStatusMessage } = useSpreadsheetData();
  
  /**
   * 現在のシートにコメントを追加する
   * @param {number} row 行インデックス
   * @param {number} col 列インデックス
   * @param {string} text コメントテキスト
   */
  const addCommentToCurrentSheet = useCallback((row, col, text) => {
    const cellKey = `${row},${col}`;
    
    // 現在のシートのコメントを取得または初期化
    const currentSheetComments = state.comments[state.currentSheet] || {};
    
    // コメントを追加
    dispatch({
      type: actionTypes.UPDATE_COMMENTS,
      payload: {
        sheetId: state.currentSheet,
        comments: {
          ...currentSheetComments,
          [cellKey]: {
            text,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      }
    });
    
    updateStatusMessage('コメントを追加しました', 3000);
  }, [state.currentSheet, state.comments, dispatch, actionTypes, updateStatusMessage]);
  
  /**
   * 現在のシートのコメントを更新する
   * @param {number} row 行インデックス
   * @param {number} col 列インデックス
   * @param {string} text 新しいコメントテキスト
   */
  const updateCommentInCurrentSheet = useCallback((row, col, text) => {
    const cellKey = `${row},${col}`;
    
    // 現在のシートのコメントを取得
    const currentSheetComments = state.comments[state.currentSheet] || {};
    
    // コメントが存在するか確認
    if (!currentSheetComments[cellKey]) {
      updateStatusMessage('更新するコメントが存在しません', 3000);
      return;
    }
    
    // コメントを更新
    dispatch({
      type: actionTypes.UPDATE_COMMENTS,
      payload: {
        sheetId: state.currentSheet,
        comments: {
          ...currentSheetComments,
          [cellKey]: {
            ...currentSheetComments[cellKey],
            text,
            updatedAt: new Date().toISOString()
          }
        }
      }
    });
    
    updateStatusMessage('コメントを更新しました', 3000);
  }, [state.currentSheet, state.comments, dispatch, actionTypes, updateStatusMessage]);
  
  /**
   * 現在のシートからコメントを削除する
   * @param {number} row 行インデックス
   * @param {number} col 列インデックス
   */
  const removeCommentFromCurrentSheet = useCallback((row, col) => {
    const cellKey = `${row},${col}`;
    
    // 現在のシートのコメントを取得
    const currentSheetComments = state.comments[state.currentSheet] || {};
    
    // コメントが存在するか確認
    if (!currentSheetComments[cellKey]) {
      updateStatusMessage('削除するコメントが存在しません', 3000);
      return;
    }
    
    // コメントを削除
    const updatedComments = { ...currentSheetComments };
    delete updatedComments[cellKey];
    
    dispatch({
      type: actionTypes.UPDATE_COMMENTS,
      payload: {
        sheetId: state.currentSheet,
        comments: updatedComments
      }
    });
    
    updateStatusMessage('コメントを削除しました', 3000);
  }, [state.currentSheet, state.comments, dispatch, actionTypes, updateStatusMessage]);
  
  /**
   * 現在のシートからコメントを取得する
   * @param {number} row 行インデックス
   * @param {number} col 列インデックス
   * @returns {Object|null} コメント情報
   */
  const getCommentFromCurrentSheet = useCallback((row, col) => {
    const cellKey = `${row},${col}`;
    const currentSheetComments = state.comments[state.currentSheet] || {};
    return currentSheetComments[cellKey] || null;
  }, [state.currentSheet, state.comments]);
  
  /**
   * 現在のシートのセルを保護する
   * @param {number} row 行インデックス
   * @param {number} col 列インデックス
   * @param {Object} options 保護オプション
   */
  const protectCellsInCurrentSheet = useCallback((row, col, options = {}) => {
    const cellKey = `${row},${col}`;
    
    // 現在のシートの保護セルを取得または初期化
    const currentSheetProtected = state.protectedCells[state.currentSheet] || {};
    
    // セルを保護
    dispatch({
      type: actionTypes.UPDATE_PROTECTED_CELLS,
      payload: {
        sheetId: state.currentSheet,
        protectedCells: {
          ...currentSheetProtected,
          [cellKey]: {
            ...options,
            protectedAt: new Date().toISOString()
          }
        }
      }
    });
    
    updateStatusMessage('セルを保護しました', 3000);
  }, [state.currentSheet, state.protectedCells, dispatch, actionTypes, updateStatusMessage]);
  
  /**
   * 現在のシートのセルの保護を解除する
   * @param {number} row 行インデックス
   * @param {number} col 列インデックス
   */
  const unprotectCellsInCurrentSheet = useCallback((row, col) => {
    const cellKey = `${row},${col}`;
    
    // 現在のシートの保護セルを取得
    const currentSheetProtected = state.protectedCells[state.currentSheet] || {};
    
    // 保護が存在するか確認
    if (!currentSheetProtected[cellKey]) {
      updateStatusMessage('保護を解除するセルが存在しません', 3000);
      return;
    }
    
    // 保護を解除
    const updatedProtected = { ...currentSheetProtected };
    delete updatedProtected[cellKey];
    
    dispatch({
      type: actionTypes.UPDATE_PROTECTED_CELLS,
      payload: {
        sheetId: state.currentSheet,
        protectedCells: updatedProtected
      }
    });
    
    updateStatusMessage('セルの保護を解除しました', 3000);
  }, [state.currentSheet, state.protectedCells, dispatch, actionTypes, updateStatusMessage]);
  
  /**
   * 範囲を保護する
   * @param {Object} range {startRow, startCol, endRow, endCol}
   * @param {Object} options 保護オプション
   */
  const protectRange = useCallback((range, options = {}) => {
    const { startRow, startCol, endRow, endCol } = range;
    
    // 範囲内のすべてのセルを保護
    for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
      for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
        protectCellsInCurrentSheet(row, col, options);
      }
    }
  }, [protectCellsInCurrentSheet]);
  
  /**
   * 範囲の保護を解除する
   * @param {Object} range {startRow, startCol, endRow, endCol}
   */
  const unprotectRange = useCallback((range) => {
    const { startRow, startCol, endRow, endCol } = range;
    
    // 範囲内のすべてのセルの保護を解除
    for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
      for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
        unprotectCellsInCurrentSheet(row, col);
      }
    }
  }, [unprotectCellsInCurrentSheet]);
  
  /**
   * 現在のシートでセルが保護されているかを確認する
   * @param {number} row 行インデックス
   * @param {number} col 列インデックス
   * @returns {boolean} 保護されている場合はtrue
   */
  const isCellProtectedInCurrentSheet = useCallback((row, col) => {
    const cellKey = `${row},${col}`;
    const currentSheetProtected = state.protectedCells[state.currentSheet] || {};
    return Boolean(currentSheetProtected[cellKey]);
  }, [state.currentSheet, state.protectedCells]);
  
  /**
   * 現在のシートにデータ検証を追加する
   * @param {number} row 行インデックス
   * @param {number} col 列インデックス
   * @param {Object} validationRule 検証ルール
   */
  const addDataValidationToCurrentSheet = useCallback((row, col, validationRule) => {
    const cellKey = `${row},${col}`;
    
    // 現在のシートのデータ検証を取得または初期化
    const currentSheetValidations = state.dataValidations[state.currentSheet] || {};
    
    // 検証ルールにIDを追加
    const ruleWithId = {
      ...validationRule,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    // データ検証を追加
    dispatch({
      type: actionTypes.UPDATE_DATA_VALIDATIONS,
      payload: {
        sheetId: state.currentSheet,
        dataValidations: {
          ...currentSheetValidations,
          [cellKey]: ruleWithId
        }
      }
    });
    
    updateStatusMessage('データ検証を追加しました', 3000);
  }, [state.currentSheet, state.dataValidations, dispatch, actionTypes, updateStatusMessage]);
  
  /**
   * 現在のシートからデータ検証を削除する
   * @param {number} row 行インデックス
   * @param {number} col 列インデックス
   */
  const removeDataValidationFromCurrentSheet = useCallback((row, col) => {
    const cellKey = `${row},${col}`;
    
    // 現在のシートのデータ検証を取得
    const currentSheetValidations = state.dataValidations[state.currentSheet] || {};
    
    // 検証ルールが存在するか確認
    if (!currentSheetValidations[cellKey]) {
      updateStatusMessage('削除するデータ検証が存在しません', 3000);
      return;
    }
    
    // データ検証を削除
    const updatedValidations = { ...currentSheetValidations };
    delete updatedValidations[cellKey];
    
    dispatch({
      type: actionTypes.UPDATE_DATA_VALIDATIONS,
      payload: {
        sheetId: state.currentSheet,
        dataValidations: updatedValidations
      }
    });
    
    updateStatusMessage('データ検証を削除しました', 3000);
  }, [state.currentSheet, state.dataValidations, dispatch, actionTypes, updateStatusMessage]);
  
  /**
   * 現在のシートのデータ検証を取得する
   * @param {number} row 行インデックス
   * @param {number} col 列インデックス
   * @returns {Object|null} 検証ルール
   */
  const getDataValidationFromCurrentSheet = useCallback((row, col) => {
    const cellKey = `${row},${col}`;
    const currentSheetValidations = state.dataValidations[state.currentSheet] || {};
    return currentSheetValidations[cellKey] || null;
  }, [state.currentSheet, state.dataValidations]);
  
  /**
   * セルの値を検証する
   * @param {number} row 行インデックス
   * @param {number} col 列インデックス
   * @param {any} value 検証する値
   * @returns {Object} {isValid, message}
   */
  const validateCellValueInCurrentSheet = useCallback((row, col, value) => {
    const validation = getDataValidationFromCurrentSheet(row, col);
    
    if (!validation) {
      return { isValid: true, message: '' };
    }
    
    // 型を調整
    let typedValue = value;
    
    switch (validation.type) {
      case 'number':
        typedValue = Number(value);
        
        if (isNaN(typedValue)) {
          return { isValid: false, message: '数値を入力してください' };
        }
        
        if (validation.min !== undefined && typedValue < validation.min) {
          return { isValid: false, message: `${validation.min}以上の値を入力してください` };
        }
        
        if (validation.max !== undefined && typedValue > validation.max) {
          return { isValid: false, message: `${validation.max}以下の値を入力してください` };
        }
        
        break;
        
      case 'list':
        if (!validation.options || !validation.options.includes(value)) {
          return { isValid: false, message: 'リストの値から選択してください' };
        }
        break;
        
      case 'textLength':
        const textLength = String(value).length;
        
        if (validation.min !== undefined && textLength < validation.min) {
          return { isValid: false, message: `${validation.min}文字以上入力してください` };
        }
        
        if (validation.max !== undefined && textLength > validation.max) {
          return { isValid: false, message: `${validation.max}文字以下で入力してください` };
        }
        
        break;
        
      // 他の検証タイプの実装も追加する
        
      case 'custom':
        if (validation.expression) {
          try {
            const isValid = new Function('value', `return ${validation.expression}`)(value);
            if (!isValid) {
              return { isValid: false, message: validation.errorMessage || '入力が無効です' };
            }
          } catch (e) {
            console.error('カスタム検証式のエラー:', e);
            return { isValid: false, message: '検証中にエラーが発生しました' };
          }
        }
        break;
        
      default:
        break;
    }
    
    return { isValid: true, message: '' };
  }, [getDataValidationFromCurrentSheet]);
  
  return {
    // コメント関連
    comments: state.comments,
    currentSheetComments: state.comments[state.currentSheet] || {},
    addCommentToCurrentSheet,
    updateCommentInCurrentSheet,
    removeCommentFromCurrentSheet,
    getCommentFromCurrentSheet,
    
    // セル保護関連
    protectedCells: state.protectedCells,
    currentSheetProtectedCells: state.protectedCells[state.currentSheet] || {},
    protectCellsInCurrentSheet,
    unprotectCellsInCurrentSheet,
    protectRange,
    unprotectRange,
    isCellProtectedInCurrentSheet,
    
    // データ検証関連
    dataValidations: state.dataValidations,
    currentSheetDataValidations: state.dataValidations[state.currentSheet] || {},
    addDataValidationToCurrentSheet,
    removeDataValidationFromCurrentSheet,
    getDataValidationFromCurrentSheet,
    validateCellValueInCurrentSheet
  };
};

export default useCellFeatures;