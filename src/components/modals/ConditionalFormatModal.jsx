import React from 'react';
import Modal from './Modal';

/**
 * 条件付き書式のモーダル
 */
const ConditionalFormatModal = ({ onClose, onAddFormat, selectedRange = '' }) => {
  return (
    <Modal title="条件付き書式" onClose={onClose}>
      <div className="modal-body">
        <p>選択範囲: {selectedRange || '（未選択）'}</p>
        <p>この機能は実装中です。</p>
      </div>
      <div className="modal-footer">
        <button onClick={onClose}>閉じる</button>
      </div>
    </Modal>
  );
};

export default ConditionalFormatModal;