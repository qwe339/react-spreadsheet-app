import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import '../../css/Modals.css';
import './FormatCellModal.css';

const FormatCellModal = ({ onClose, onApplyFormat, initialStyles = {} }) => {
  // スタイル設定の状態管理
  const [styles, setStyles] = useState({
    fontWeight: initialStyles.fontWeight || 'normal',
    fontStyle: initialStyles.fontStyle || 'normal',
    textDecoration: initialStyles.textDecoration || 'none',
    textAlign: initialStyles.textAlign || 'left',
    // 必要に応じて追加のスタイル設定
    fontSize: initialStyles.fontSize || 'medium',
    color: initialStyles.color || '#000000',
    backgroundColor: initialStyles.backgroundColor || 'transparent'
  });

  // 書式設定を変更するハンドラー
  const handleStyleChange = (property, value) => {
    setStyles({
      ...styles,
      [property]: value
    });
  };

  // 書式をリセットするハンドラー
  const handleReset = () => {
    setStyles({
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      fontSize: 'medium',
      color: '#000000',
      backgroundColor: 'transparent'
    });
  };

  // 書式を適用するハンドラー
  const handleApply = () => {
    onApplyFormat(styles);
    onClose();
  };

  // プレビュー用のスタイル
  const previewStyle = {
    fontWeight: styles.fontWeight,
    fontStyle: styles.fontStyle,
    textDecoration: styles.textDecoration,
    textAlign: styles.textAlign,
    fontSize: styles.fontSize === 'small' ? '12px' : 
              styles.fontSize === 'medium' ? '14px' : '16px',
    color: styles.color,
    backgroundColor: styles.backgroundColor
  };

  return (
    <Modal title="セルの書式設定" onClose={onClose}>
      <div className="modal-body">
        <div className="format-preview" style={previewStyle}>
          プレビューテキスト
        </div>

        <div className="format-section">
          <h4>テキスト</h4>
          
          <div className="format-group">
            <label>フォントスタイル:</label>
            <div className="button-toolbar">
              <button
                className={styles.fontWeight === 'bold' ? 'active' : ''}
                onClick={() => handleStyleChange('fontWeight', 
                           styles.fontWeight === 'bold' ? 'normal' : 'bold')}
              >
                <b>B</b>
              </button>
              <button
                className={styles.fontStyle === 'italic' ? 'active' : ''}
                onClick={() => handleStyleChange('fontStyle', 
                           styles.fontStyle === 'italic' ? 'normal' : 'italic')}
              >
                <i>I</i>
              </button>
              <button
                className={styles.textDecoration === 'underline' ? 'active' : ''}
                onClick={() => handleStyleChange('textDecoration', 
                           styles.textDecoration === 'underline' ? 'none' : 'underline')}
              >
                <u>U</u>
              </button>
            </div>
          </div>
          
          <div className="format-group">
            <label>テキスト配置:</label>
            <div className="button-toolbar">
              <button
                className={styles.textAlign === 'left' ? 'active' : ''}
                onClick={() => handleStyleChange('textAlign', 'left')}
              >
                <span>&#8676;</span>
              </button>
              <button
                className={styles.textAlign === 'center' ? 'active' : ''}
                onClick={() => handleStyleChange('textAlign', 'center')}
              >
                <span>&#8660;</span>
              </button>
              <button
                className={styles.textAlign === 'right' ? 'active' : ''}
                onClick={() => handleStyleChange('textAlign', 'right')}
              >
                <span>&#8677;</span>
              </button>
            </div>
          </div>
          
          <div className="format-group">
            <label>フォントサイズ:</label>
            <select
              value={styles.fontSize}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            >
              <option value="small">小</option>
              <option value="medium">中</option>
              <option value="large">大</option>
            </select>
          </div>
        </div>
        
        <div className="format-section">
          <h4>色</h4>
          <div className="format-group">
            <label>文字色:</label>
            <input
              type="color"
              value={styles.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
            />
          </div>
          
          <div className="format-group">
            <label>背景色:</label>
            <input
              type="color"
              value={styles.backgroundColor === 'transparent' ? '#ffffff' : styles.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            />
            <button 
              className="small-button" 
              onClick={() => handleStyleChange('backgroundColor', 'transparent')}
              title="背景色をクリア"
            >
              クリア
            </button>
          </div>
        </div>
      </div>
      
      <div className="modal-footer">
        <button onClick={handleReset}>リセット</button>
        <button onClick={handleApply}>適用</button>
        <button onClick={onClose}>キャンセル</button>
      </div>
    </Modal>
  );
};

export default FormatCellModal;