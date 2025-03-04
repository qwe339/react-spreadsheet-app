import { useCallback } from 'react';
import { useSpreadsheet } from '../context/SpreadsheetContext';

/**
 * 元に戻す/やり直し機能を管理するためのカスタムフック
 */
const useUndoRedo = () => {
  const { state, dispatch, actionTypes } = useSpreadsheet();
  
  /**
   * 現在の状態をアンドゥスタックにプッシュする
   * @param {Object} hotInstance Handsontableインスタンス
   */
  const pushToUndoStack = useCallback((hotInstance) => {
    if (!hotInstance) return;
    
    // 現在のデータをスナップショットとして保存
    const currentData = hotInstance.getData();
    
    dispatch({
      type: actionTypes.PUSH_TO_UNDO_STACK,
      payload: {
        sheetId: state.currentSheet,
        data: JSON.parse(JSON.stringify(currentData))
      }
    });
  }, [state.currentSheet, dispatch, actionTypes]);
  
  /**
   * 元に戻す操作
   * @param {Object} hotInstance Handsontableインスタンス
   */
  const undo = useCallback((hotInstance) => {
    if (!hotInstance || state.undoStack.length === 0) return;
    
    // 現在の状態をリドゥスタックにプッシュ
    const currentData = hotInstance.getData();
    
    dispatch({
      type: actionTypes.PUSH_TO_REDO_STACK,
      payload: {
        sheetId: state.currentSheet,
        data: JSON.parse(JSON.stringify(currentData))
      }
    });
    
    // アンドゥスタックから前の状態を取得
    const lastState = state.undoStack[state.undoStack.length - 1];
    if (lastState && lastState.sheetId === state.currentSheet) {
      // 前の状態に戻す
      hotInstance.loadData(lastState.data);
      
      // アンドゥスタックから取り出す
      dispatch({ type: actionTypes.POP_FROM_UNDO_STACK });
    }
  }, [state.currentSheet, state.undoStack, dispatch, actionTypes]);
  
  /**
   * やり直し操作
   * @param {Object} hotInstance Handsontableインスタンス
   */
  const redo = useCallback((hotInstance) => {
    if (!hotInstance || state.redoStack.length === 0) return;
    
    // 現在の状態をアンドゥスタックにプッシュ
    const currentData = hotInstance.getData();
    
    dispatch({
      type: actionTypes.PUSH_TO_UNDO_STACK,
      payload: {
        sheetId: state.currentSheet,
        data: JSON.parse(JSON.stringify(currentData))
      }
    });
    
    // リドゥスタックから次の状態を取得
    const nextState = state.redoStack[state.redoStack.length - 1];
    if (nextState && nextState.sheetId === state.currentSheet) {
      // 次の状態に進む
      hotInstance.loadData(nextState.data);
      
      // リドゥスタックから取り出す
      dispatch({ type: actionTypes.POP_FROM_REDO_STACK });
    }
  }, [state.currentSheet, state.redoStack, dispatch, actionTypes]);
  
  /**
   * アンドゥ/リドゥスタックをクリアする
   */
  const clearUndoRedoStack = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_UNDO_REDO_STACK });
  }, [dispatch, actionTypes]);
  
  return {
    undoStack: state.undoStack,
    redoStack: state.redoStack,
    pushToUndoStack,
    undo,
    redo,
    clearUndoRedoStack
  };
};

export default useUndoRedo;