import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { HyperFormula } from 'hyperformula';
import { v4 as uuidv4 } from 'uuid';

// 初期状態
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

// 初期シート
const initialSheets = ['sheet1', 'sheet2', 'sheet3'];

// スプレッドシートの初期状態
const initialState = {
  currentSheet: 'sheet1',
  sheets: initialSheets,
  sheetData: initialSheets.reduce((acc, sheetId) => {
    acc[sheetId] = generateInitialData(100, 30);
    return acc;
  }, {}),
  cellStyles: initialSheets.reduce((acc, sheetId) => {
    acc[sheetId] = {};
    return acc;
  }, {}),
  conditionalFormats: initialSheets.reduce((acc, sheetId) => {
    acc[sheetId] = [];
    return acc;
  }, {}),
  comments: initialSheets.reduce((acc, sheetId) => {
    acc[sheetId] = {};
    return acc;
  }, {}),
  protectedCells: initialSheets.reduce((acc, sheetId) => {
    acc[sheetId] = {};
    return acc;
  }, {}),
  dataValidations: initialSheets.reduce((acc, sheetId) => {
    acc[sheetId] = {};
    return acc;
  }, {}),
  selectedCell: { row: 0, col: 0 },
  selectionRange: null,
  cellAddress: 'A1',
  formulaValue: '',
  undoStack: [],
  redoStack: [],
  statusMessage: 'スプレッドシートへようこそ',
  selectionStats: { sum: 0, average: 0, selection: 'なし' },
  charts: [],
  hyperformulaInstance: HyperFormula.buildEmpty({
    licenseKey: 'gpl-v3',
    precisionRounding: 8,
    sheets: initialSheets.reduce((acc, sheetId) => {
      acc[sheetId] = [];
      return acc;
    }, {})
  }),
  isModified: false,
  currentFilename: '新しいスプレッドシート',
  lastSaved: null
};

// アクションタイプ
const actionTypes = {
  SET_CURRENT_SHEET: 'SET_CURRENT_SHEET',
  ADD_SHEET: 'ADD_SHEET',
  RENAME_SHEET: 'RENAME_SHEET',
  DELETE_SHEET: 'DELETE_SHEET',
  UPDATE_SHEET_DATA: 'UPDATE_SHEET_DATA',
  UPDATE_CELL_STYLES: 'UPDATE_CELL_STYLES',
  ADD_CONDITIONAL_FORMAT: 'ADD_CONDITIONAL_FORMAT',
  REMOVE_CONDITIONAL_FORMAT: 'REMOVE_CONDITIONAL_FORMAT',
  ADD_COMMENT: 'ADD_COMMENT',
  UPDATE_COMMENT: 'UPDATE_COMMENT',
  REMOVE_COMMENT: 'REMOVE_COMMENT',
  PROTECT_CELLS: 'PROTECT_CELLS',
  UNPROTECT_CELLS: 'UNPROTECT_CELLS',
  ADD_DATA_VALIDATION: 'ADD_DATA_VALIDATION',
  REMOVE_DATA_VALIDATION: 'REMOVE_DATA_VALIDATION',
  SET_SELECTED_CELL: 'SET_SELECTED_CELL',
  SET_SELECTION_RANGE: 'SET_SELECTION_RANGE',
  SET_CELL_ADDRESS: 'SET_CELL_ADDRESS',
  SET_FORMULA_VALUE: 'SET_FORMULA_VALUE',
  PUSH_UNDO: 'PUSH_UNDO',
  UNDO: 'UNDO',
  REDO: 'REDO',
  CLEAR_UNDO_REDO: 'CLEAR_UNDO_REDO',
  SET_STATUS_MESSAGE: 'SET_STATUS_MESSAGE',
  UPDATE_SELECTION_STATS: 'UPDATE_SELECTION_STATS',
  ADD_CHART: 'ADD_CHART',
  UPDATE_CHART: 'UPDATE_CHART',
  REMOVE_CHART: 'REMOVE_CHART',
  LOAD_SPREADSHEET: 'LOAD_SPREADSHEET',
  RESET_SPREADSHEET: 'RESET_SPREADSHEET',
  SET_MODIFIED: 'SET_MODIFIED',
  SET_FILENAME: 'SET_FILENAME',
  SET_LAST_SAVED: 'SET_LAST_SAVED'
};

// リデューサー
const spreadsheetReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_SHEET:
      return {
        ...state,
        currentSheet: action.payload
      };
      
    case actionTypes.ADD_SHEET:
      const newSheetId = action.payload || `sheet${state.sheets.length + 1}`;
      return {
        ...state,
        sheets: [...state.sheets, newSheetId],
        sheetData: {
          ...state.sheetData,
          [newSheetId]: generateInitialData(100, 30)
        },
        cellStyles: {
          ...state.cellStyles,
          [newSheetId]: {}
        },
        conditionalFormats: {
          ...state.conditionalFormats,
          [newSheetId]: []
        },
        comments: {
          ...state.comments,
          [newSheetId]: {}
        },
        protectedCells: {
          ...state.protectedCells,
          [newSheetId]: {}
        },
        dataValidations: {
          ...state.dataValidations,
          [newSheetId]: {}
        },
        isModified: true
      };
      
    case actionTypes.RENAME_SHEET:
      const { oldSheetId, newSheetId } = action.payload;
      const updatedSheets = state.sheets.map(id => id === oldSheetId ? newSheetId : id);
      
      return (
    <SpreadsheetContext.Provider value={{ state, dispatch, actionTypes }}>
      {children}
    </SpreadsheetContext.Provider>
  );
};

// カスタムフック
export const useSpreadsheet = () => {
  const context = useContext(SpreadsheetContext);
  if (!context) {
    throw new Error('useSpreadsheet must be used within a SpreadsheetProvider');
  }
  return context;
};全ての状態オブジェクトを更新
      const updatedState = {
        ...state,
        sheets: updatedSheets,
        currentSheet: state.currentSheet === oldSheetId ? newSheetId : state.currentSheet
      };
      
      // シートデータのIDを更新
      updatedState.sheetData = Object.entries(state.sheetData).reduce((acc, [id, data]) => {
        acc[id === oldSheetId ? newSheetId : id] = data;
        return acc;
      }, {});
      
      // 他の関連データも同様に更新
      ['cellStyles', 'conditionalFormats', 'comments', 'protectedCells', 'dataValidations'].forEach(prop => {
        updatedState[prop] = Object.entries(state[prop]).reduce((acc, [id, data]) => {
          acc[id === oldSheetId ? newSheetId : id] = data;
          return acc;
        }, {});
      });
      
      updatedState.isModified = true;
      return updatedState;
      
    case actionTypes.DELETE_SHEET:
      const sheetIdToDelete = action.payload;
      if (state.sheets.length <= 1) {
        return state; // 最後のシートは削除できない
      }
      
      // 削除対象のシートを除いたシートリスト
      const sheetsAfterDelete = state.sheets.filter(id => id !== sheetIdToDelete);
      
      // 削除対象のシートがアクティブな場合、別のシートをアクティブにする
      const newCurrentSheet = state.currentSheet === sheetIdToDelete 
        ? sheetsAfterDelete[0] 
        : state.currentSheet;
        
      // 全ての状態オブジェクトから削除対象のシートを除去
      const stateAfterDelete = {
        ...state,
        sheets: sheetsAfterDelete,
        currentSheet: newCurrentSheet,
        isModified: true
      };
      
      // 各プロパティから削除対象のシートを除去
      ['sheetData', 'cellStyles', 'conditionalFormats', 'comments', 'protectedCells', 'dataValidations'].forEach(prop => {
        const { [sheetIdToDelete]: _, ...rest } = state[prop];
        stateAfterDelete[prop] = rest;
      });
      
      return stateAfterDelete;
      
    case actionTypes.UPDATE_SHEET_DATA:
      return {
        ...state,
        sheetData: {
          ...state.sheetData,
          [action.payload.sheetId]: action.payload.data
        },
        isModified: true
      };
      
    case actionTypes.UPDATE_CELL_STYLES:
      return {
        ...state,
        cellStyles: {
          ...state.cellStyles,
          [action.payload.sheetId]: {
            ...state.cellStyles[action.payload.sheetId],
            ...action.payload.styles
          }
        },
        isModified: true
      };
      
    case actionTypes.ADD_CONDITIONAL_FORMAT:
      return {
        ...state,
        conditionalFormats: {
          ...state.conditionalFormats,
          [action.payload.sheetId]: [
            ...state.conditionalFormats[action.payload.sheetId],
            {
              id: uuidv4(),
              ...action.payload.format
            }
          ]
        },
        isModified: true
      };
      
    case actionTypes.REMOVE_CONDITIONAL_FORMAT:
      return {
        ...state,
        conditionalFormats: {
          ...state.conditionalFormats,
          [action.payload.sheetId]: state.conditionalFormats[action.payload.sheetId]
            .filter(format => format.id !== action.payload.formatId)
        },
        isModified: true
      };
      
    case actionTypes.ADD_COMMENT:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.sheetId]: {
            ...state.comments[action.payload.sheetId],
            [action.payload.cellKey]: {
              id: uuidv4(),
              text: action.payload.text,
              author: action.payload.author,
              timestamp: new Date().toISOString()
            }
          }
        },
        isModified: true
      };
      
    case actionTypes.UPDATE_COMMENT:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.sheetId]: {
            ...state.comments[action.payload.sheetId],
            [action.payload.cellKey]: {
              ...state.comments[action.payload.sheetId][action.payload.cellKey],
              text: action.payload.text,
              timestamp: new Date().toISOString()
            }
          }
        },
        isModified: true
      };
      
    case actionTypes.REMOVE_COMMENT:
      const updatedComments = { ...state.comments };
      const { [action.payload.cellKey]: _, ...restComments } = updatedComments[action.payload.sheetId];
      updatedComments[action.payload.sheetId] = restComments;
      
      return {
        ...state,
        comments: updatedComments,
        isModified: true
      };
      
    case actionTypes.PROTECT_CELLS:
      return {
        ...state,
        protectedCells: {
          ...state.protectedCells,
          [action.payload.sheetId]: {
            ...state.protectedCells[action.payload.sheetId],
            ...action.payload.cells
          }
        },
        isModified: true
      };
      
    case actionTypes.UNPROTECT_CELLS:
      const updatedProtectedCells = { ...state.protectedCells };
      action.payload.cellKeys.forEach(cellKey => {
        const { [cellKey]: _, ...rest } = updatedProtectedCells[action.payload.sheetId];
        updatedProtectedCells[action.payload.sheetId] = rest;
      });
      
      return {
        ...state,
        protectedCells: updatedProtectedCells,
        isModified: true
      };
      
    case actionTypes.ADD_DATA_VALIDATION:
      return {
        ...state,
        dataValidations: {
          ...state.dataValidations,
          [action.payload.sheetId]: {
            ...state.dataValidations[action.payload.sheetId],
            [action.payload.cellKey]: {
              id: uuidv4(),
              ...action.payload.validation
            }
          }
        },
        isModified: true
      };
      
    case actionTypes.REMOVE_DATA_VALIDATION:
      const updatedValidations = { ...state.dataValidations };
      const { [action.payload.cellKey]: __, ...restValidations } = updatedValidations[action.payload.sheetId];
      updatedValidations[action.payload.sheetId] = restValidations;
      
      return {
        ...state,
        dataValidations: updatedValidations,
        isModified: true
      };
      
    case actionTypes.SET_SELECTED_CELL:
      return {
        ...state,
        selectedCell: action.payload
      };
      
    case actionTypes.SET_SELECTION_RANGE:
      return {
        ...state,
        selectionRange: action.payload
      };
      
    case actionTypes.SET_CELL_ADDRESS:
      return {
        ...state,
        cellAddress: action.payload
      };
      
    case actionTypes.SET_FORMULA_VALUE:
      return {
        ...state,
        formulaValue: action.payload
      };
      
    case actionTypes.PUSH_UNDO:
      const undoStack = [...state.undoStack];
      // スタックが大きくなりすぎないよう制限
      if (undoStack.length >= 20) {
        undoStack.shift();
      }
      return {
        ...state,
        undoStack: [...undoStack, action.payload],
        redoStack: [], // UndoスタックにプッシュするとRedoスタックはクリア
        isModified: true
      };
      
    case actionTypes.UNDO:
      if (state.undoStack.length === 0) return state;
      
      const newUndoStack = [...state.undoStack];
      const prevState = newUndoStack.pop();
      
      // 現在の状態をRedoスタックに保存
      const currentState = {
        sheetData: { ...state.sheetData },
        cellStyles: { ...state.cellStyles },
        currentSheet: state.currentSheet
      };
      
      return {
        ...state,
        sheetData: prevState.sheetData,
        cellStyles: prevState.cellStyles,
        currentSheet: prevState.currentSheet,
        undoStack: newUndoStack,
        redoStack: [...state.redoStack, currentState],
        isModified: true
      };
      
    case actionTypes.REDO:
      if (state.redoStack.length === 0) return state;
      
      const newRedoStack = [...state.redoStack];
      const nextState = newRedoStack.pop();
      
      // 現在の状態をUndoスタックに保存
      const currentUndoState = {
        sheetData: { ...state.sheetData },
        cellStyles: { ...state.cellStyles },
        currentSheet: state.currentSheet
      };
      
      return {
        ...state,
        sheetData: nextState.sheetData,
        cellStyles: nextState.cellStyles,
        currentSheet: nextState.currentSheet,
        undoStack: [...state.undoStack, currentUndoState],
        redoStack: newRedoStack,
        isModified: true
      };
      
    case actionTypes.CLEAR_UNDO_REDO:
      return {
        ...state,
        undoStack: [],
        redoStack: []
      };
      
    case actionTypes.SET_STATUS_MESSAGE:
      return {
        ...state,
        statusMessage: action.payload
      };
      
    case actionTypes.UPDATE_SELECTION_STATS:
      return {
        ...state,
        selectionStats: action.payload
      };
      
    case actionTypes.ADD_CHART:
      return {
        ...state,
        charts: [...state.charts, { id: uuidv4(), ...action.payload }],
        isModified: true
      };
      
    case actionTypes.UPDATE_CHART:
      return {
        ...state,
        charts: state.charts.map(chart => 
          chart.id === action.payload.id 
            ? { ...chart, ...action.payload.chartData } 
            : chart
        ),
        isModified: true
      };
      
    case actionTypes.REMOVE_CHART:
      return {
        ...state,
        charts: state.charts.filter(chart => chart.id !== action.payload),
        isModified: true
      };
      
    case actionTypes.LOAD_SPREADSHEET:
      return {
        ...state,
        ...action.payload,
        isModified: false
      };
      
    case actionTypes.RESET_SPREADSHEET:
      return {
        ...initialState,
        hyperformulaInstance: state.hyperformulaInstance
      };
      
    case actionTypes.SET_MODIFIED:
      return {
        ...state,
        isModified: action.payload
      };
      
    case actionTypes.SET_FILENAME:
      return {
        ...state,
        currentFilename: action.payload
      };
      
    case actionTypes.SET_LAST_SAVED:
      return {
        ...state,
        lastSaved: action.payload
      };
      
    default:
      return state;
  }
};

// コンテキスト作成
const SpreadsheetContext = createContext();

// コンテキストプロバイダーコンポーネント
export const SpreadsheetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(spreadsheetReducer, initialState);
  
  // ローカルストレージからの読み込み（初回のみ）
  useEffect(() => {
    const savedData = localStorage.getItem('enhanced_spreadsheet_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.sheets) {
          dispatch({ 
            type: actionTypes.LOAD_SPREADSHEET, 
            payload: {
              sheets: data.sheets ? Object.keys(data.sheets) : initialSheets,
              sheetData: data.sheets || initialState.sheetData,
              cellStyles: data.styles || initialState.cellStyles,
              conditionalFormats: data.conditionalFormats || initialState.conditionalFormats,
              comments: data.comments || initialState.comments,
              protectedCells: data.protectedCells || initialState.protectedCells,
              dataValidations: data.dataValidations || initialState.dataValidations,
              charts: data.charts || [],
              currentSheet: data.currentSheet || 'sheet1',
              currentFilename: data.filename || '新しいスプレッドシート',
              lastSaved: data.lastSaved || null
            }
          });
          dispatch({ 
            type: actionTypes.SET_STATUS_MESSAGE, 
            payload: '前回のデータを読み込みました'
          });
        }
      } catch (error) {
        console.error('保存データの読み込みエラー:', error);
      }
    }
  }, []);
  
  // 変更されたときにデータを自動保存
  useEffect(() => {
    if (state.isModified) {
      const autoSaveData = {
        sheets: state.sheetData,
        styles: state.cellStyles,
        conditionalFormats: state.conditionalFormats,
        comments: state.comments,
        protectedCells: state.protectedCells,
        dataValidations: state.dataValidations,
        charts: state.charts,
        currentSheet: state.currentSheet,
        filename: state.currentFilename,
        lastSaved: new Date().toISOString()
      };
      
      localStorage.setItem('enhanced_spreadsheet_data', JSON.stringify(autoSaveData));
    }
  }, [state.isModified, state.sheetData, state.cellStyles, state.conditionalFormats, 
      state.comments, state.protectedCells, state.dataValidations, state.charts, 
      state.currentSheet, state.currentFilename]);
  
  //