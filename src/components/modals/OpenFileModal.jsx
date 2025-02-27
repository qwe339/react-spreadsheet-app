import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import '../../css/Modals.css';

const OpenFileModal = ({ onClose, onFileSelect }) => {
  const [filesList, setFilesList] = useState([]);

  // ローカルストレージからファイル一覧を取得
  useEffect(() => {
    const loadFilesList = () => {
      try {
        const savedFilesList = JSON.parse(localStorage.getItem('handsontable_files_list') || '[]');
        setFilesList(savedFilesList);
      } catch (error) {
        console.error('ファイルリスト読み込みエラー:', error);
        setFilesList([]);
      }
    };

    loadFilesList();
  }, []);

  // ファイルがない場合
  if (filesList.length === 0) {
    return (
      <Modal title="ファイルを開く" onClose={onClose}>
        <div className="modal-body">
          <p>保存されたファイルがありません。</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>閉じる</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="ファイルを開く" onClose={onClose}>
      <div className="modal-body">
        <div className="files-list">
          {filesList.map((file) => (
            <div
              key={file.key}
              className="file-item"
              onClick={() => {
                onFileSelect(file.key);
                onClose();
              }}
            >
              <span className="file-item-name">{file.filename}</span>
              <span className="file-item-date">
                {new Date(file.savedAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="modal-footer">
        <button onClick={onClose}>キャンセル</button>
      </div>
    </Modal>
  );
};

export default OpenFileModal;