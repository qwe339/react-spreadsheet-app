import React, { useState } from 'react';
import Modal from './Modal';
import '../../css/Modals.css';
import './CSVImportModal.css';

const CSVImportModal = ({ onClose, onImport }) => {
  // CSV設定のステート
  const [csvSettings, setCsvSettings] = useState({
    encoding: 'Shift_JIS',
    delimiter: '',
    hasHeader: true,
    ignoreFieldMismatch: true,
    file: null
  });

  // ファイル選択ハンドラー
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCsvSettings({
        ...csvSettings,
        file: e.target.files[0]
      });
    }
  };

  // 設定変更ハンドラー
  const handleSettingChange = (setting, value) => {
    setCsvSettings({
      ...csvSettings,
      [setting]: value
    });
  };

  // インポート実行
  const handleImport = () => {
    if (!csvSettings.file) {
      alert('CSVファイルを選択してください');
      return;
    }

    // ファイルを読み込む
    const reader = new FileReader();
    
    reader.onload = (e) => {
      // CSVパースオプションを設定
      const parseOptions = {
        header: csvSettings.hasHeader,
        dynamicTyping: true,
        skipEmptyLines: true,
        delimiter: csvSettings.delimiter || undefined, // 空文字の場合は自動検出
        delimitersToGuess: [',', '\t', ';', '|', ':'], // 自動検出する区切り文字の候補
        transformHeader: (header) => header ? header.trim() : header,
        // 結果をコールバックで返す
        complete: (results) => {
          // 列数の不一致エラーを処理
          if (csvSettings.ignoreFieldMismatch && results.errors && results.errors.length > 0) {
            const nonFieldMismatchErrors = results.errors.filter(err => 
              err.type !== 'FieldMismatch' && err.code !== 'TooManyFields' && err.code !== 'TooFewFields'
            );
            
            const fieldMismatchCount = results.errors.length - nonFieldMismatchErrors.length;
            results.errors = nonFieldMismatchErrors;
            
            if (fieldMismatchCount > 0) {
              console.log(`列数の不一致エラーを ${fieldMismatchCount} 件無視しました。`);
            }
          }
          
          // インポート完了時のコールバック
          onImport(results);
          onClose();
        },
        error: (error) => {
          console.error('CSVパースエラー:', error);
          alert(`CSVファイルの解析に失敗しました: ${error.message}`);
        }
      };
      
      // ファイルの内容をテキストとして取得
      const csvText = e.target.result;
      
      // CSVをパースする
      onImport(csvText, parseOptions);
    };
    
    reader.onerror = () => {
      alert('ファイルの読み込み中にエラーが発生しました。');
    };
    
    // 選択したエンコーディングでファイルを読み込む
    reader.readAsText(csvSettings.file, csvSettings.encoding);
  };

  return (
    <Modal title="CSVインポート設定" onClose={onClose}>
      <div className="modal-body">
        <div className="form-group">
          <label htmlFor="csv-file">CSVファイル:</label>
          <div className="csv-file-input">
            <input
              type="file"
              id="csv-file"
              accept=".csv"
              onChange={handleFileChange}
              className="csv-file-selector"
            />
          </div>
          {csvSettings.file && (
            <div className="selected-file">
              選択されたファイル: {csvSettings.file.name}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="encoding-select">文字コード:</label>
          <select
            id="encoding-select"
            value={csvSettings.encoding}
            onChange={(e) => handleSettingChange('encoding', e.target.value)}
            className="csv-select"
          >
            <option value="Shift_JIS">Shift-JIS</option>
            <option value="UTF-8">UTF-8</option>
            <option value="EUC-JP">EUC-JP</option>
            <option value="ISO-8859-1">ISO-8859-1</option>
            <option value="CP932">CP932</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="delimiter-select">区切り文字:</label>
          <select
            id="delimiter-select"
            value={csvSettings.delimiter}
            onChange={(e) => handleSettingChange('delimiter', e.target.value)}
            className="csv-select"
          >
            <option value="">自動検出</option>
            <option value=",">カンマ (,)</option>
            <option value=";">セミコロン (;)</option>
            <option value="\t">タブ</option>
            <option value="|">パイプ (|)</option>
          </select>
        </div>
        
        <div className="form-check">
          <input
            type="checkbox"
            id="has-header"
            checked={csvSettings.hasHeader}
            onChange={(e) => handleSettingChange('hasHeader', e.target.checked)}
          />
          <label htmlFor="has-header">ヘッダー行を含む</label>
        </div>
        
        <div className="form-check">
          <input
            type="checkbox"
            id="ignore-field-mismatch"
            checked={csvSettings.ignoreFieldMismatch}
            onChange={(e) => handleSettingChange('ignoreFieldMismatch', e.target.checked)}
          />
          <label htmlFor="ignore-field-mismatch">列数の不一致を無視</label>
        </div>
      </div>
      <div className="modal-footer">
        <button
          className="button-primary"
          onClick={handleImport}
          disabled={!csvSettings.file}
        >
          インポート
        </button>
        <button onClick={onClose}>キャンセル</button>
      </div>
    </Modal>
  );
};

export default CSVImportModal;