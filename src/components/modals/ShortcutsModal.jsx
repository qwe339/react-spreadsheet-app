import React from 'react';
import Modal from './Modal';
import '../../css/Modals.css';

const ShortcutsModal = ({ onClose }) => {
  const shortcuts = [
    { key: 'Ctrl+S', description: '保存' },
    { key: 'Ctrl+O', description: '開く' },
    { key: 'Ctrl+N', description: '新規作成' },
    { key: 'Ctrl+Z', description: '元に戻す' },
    { key: 'Ctrl+Y', description: 'やり直し' },
    { key: 'Ctrl+F', description: '検索' },
    { key: 'Ctrl+H', description: '置換' },
    { key: 'Ctrl+B', description: '太字' },
    { key: 'Ctrl+I', description: '斜体' },
    { key: 'Ctrl+U', description: '下線' },
    { key: 'Delete', description: '選択したセルの内容を削除' },
    { key: 'F2', description: 'セル編集モード' },
    { key: 'Ctrl+P', description: '印刷' }
  ];

  return (
    <Modal title="キーボードショートカット" onClose={onClose}>
      <div className="modal-body">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>
                ショートカット
              </th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>
                機能
              </th>
            </tr>
          </thead>
          <tbody>
            {shortcuts.map((shortcut, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  {shortcut.key}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  {shortcut.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="modal-footer">
        <button onClick={onClose}>閉じる</button>
      </div>
    </Modal>
  );
};

export default ShortcutsModal;