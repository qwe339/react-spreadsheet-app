import React from 'react';
import Modal from './Modal';

/**
 * 印刷プレビューモーダル
 */
const PrintPreviewModal = ({ onClose, hotInstance, sheetName }) => {
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Modal title="印刷プレビュー" onClose={onClose}>
      <div className="modal-body">
        <p>シート: {sheetName}</p>
        <div className="print-preview">
          <p>印刷プレビューは実装中です。</p>
        </div>
      </div>
      <div className="modal-footer">
        <button onClick={handlePrint}>印刷</button>
        <button onClick={onClose}>閉じる</button>
      </div>
    </Modal>
  );
};

export default PrintPreviewModal;