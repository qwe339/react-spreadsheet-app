import React, { useState } from 'react';
import Modal from './Modal';
import '../../css/Modals.css';

const SaveAsModal = ({ onClose, onSave }) => {
  const [filename, setFilename] = useState('新しいスプレッドシート');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filename.trim()) {
      onSave(filename);
    }
  };

  return (
    <Modal title="名前を付けて保存" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="save-filename">ファイル名:</label>
            <input
              type="text"
              id="save-filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className="modal-footer">
          <button type="submit">保存</button>
          <button type="button" onClick={onClose}>キャンセル</button>
        </div>
      </form>
    </Modal>
  );
};

export default SaveAsModal;