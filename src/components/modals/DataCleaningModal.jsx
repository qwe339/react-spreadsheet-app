import React from 'react';
import Modal from './Modal';

/**
 * データクリーニングモーダル
 */
const DataCleaningModal = ({ onClose, selectedRange = '' }) => {
  return (
    <Modal title="データクリーニング" onClose={onClose}>
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

export default DataCleaningModal;