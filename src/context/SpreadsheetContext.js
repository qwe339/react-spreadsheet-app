import React, { createContext, useContext, useReducer } from 'react';

// 初期状態
const initialState = {
  currentSheet: 'sheet1',
  sheets: ['sheet1'],
  sheetData: {
    sheet1: [["", "", ""], ["", "", ""], ["", "", ""]]
  },
  cellStyles: {},
  conditionalFormats: {},
  charts: [],
  comments: {},
  protectedCells: {},
  dataValidations: {},
  selectedCell: null,
  selectionRange: null,
  cellAddress: '',
  formulaValue: '',
  statusMessage: 'Ready',
  selectionStats: { sum: '0', average: '0', count: 0, selection: '' },
  isModified: false,
  currentFilename: '新しいスプレッドシート',
  lastSaved: null,
  hyperformulaInstance: null
};

// アクションタイプ
const actionTypes = {
  SET_CURRENT_SHEET: 'SET_CURRENT_SHEET',
  ADD_SHEET: 'ADD_SHEET',
  RENAME_SHEET: 'RENAME_SHEET',
  DELETE_SHEET: 'DELETE_SHEET',
  UPDATE_SHEET_DATA: 'UPDATE_SHEET_DATA',
  SET_SELECTED_CELL: 'SET_SELECTED_CELL',
  SET_SELECTION_RANGE: 'SET_SELECTION_RANGE',
  SET_CELL_ADDRESS: 'SET_CELL_ADDRESS',
  SET_FORMULA_VALUE: 'SET_FORMULA_VALUE',
  SET_STATUS_MESSAGE: 'SET_STATUS_MESSAGE',
  UPDATE_SELECTION_STATS: 'UPDATE_SELECTION_STATS',
  UPDATE_CELL_STYLES: 'UPDATE_CELL_STYLES',
  ADD_CONDITIONAL_FORMAT: 'ADD_CONDITIONAL_FORMAT',
  REMOVE_CONDITIONAL_FORMAT: 'REMOVE_CONDITIONAL_FORMAT',
  ADD_CHART: 'ADD_CHART',
  UPDATE_CHART: 'UPDATE_CHART',
  REMOVE_CHART: 'REMOVE_CHART',
  RESET_SPREADSHEET: 'RESET_SPREADSHEET',
  SET_MODIFIED: 'SET_MODIFIED',
  SET_FILENAME: 'SET_FILENAME',
  SET_LAST_SAVED: 'SET_LAST_SAVED'
};

// リデューサー
function spreadsheetReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_CURRENT_SHEET:
      return { ...state, currentSheet: action.payload };
    case actionTypes.ADD_SHEET:
      return {
        ...state,
        sheets: [...state.sheets, action.payload],
        sheetData: {
          ...state.sheetData,
          [action.payload]: [["", "", ""], ["", "", ""], ["", "", ""]]
        }
      };
    // 他のアクションタイプの処理...
    default:
      return state;
  }
}

// コンテキスト
const SpreadsheetContext = createContext();

// プロバイダーコンポーネント
export function SpreadsheetProvider({ children }) {
  const [state, dispatch] = useReducer(spreadsheetReducer, initialState);

  return (
    <SpreadsheetContext.Provider value={{ state, dispatch, actionTypes }}>
      {children}
    </SpreadsheetContext.Provider>
  );
}

// カスタムフック
export function useSpreadsheet() {
  const context = useContext(SpreadsheetContext);
  if (!context) {
    throw new Error('useSpreadsheet must be used within a SpreadsheetProvider');
  }
  return context;
}