import React from 'react';
import Modal from './Modal';
import '../../css/Modals.css';

const AboutModal = ({ onClose }) => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;

  return (
    <Modal title="バージョン情報" onClose={onClose}>
      <div className="modal-body">
        <p><strong>拡張Handsontableスプレッドシート (React版)</strong></p>
        <p>バージョン: 1.0.0</p>
        <p>作成日: {formattedDate}</p>
        <p>
          このアプリケーションはHandsontableライブラリとReactを使用して構築されたブラウザベースのスプレッドシートです。
          Excel形式のファイル読み込み・書き込み、検索・置換、複数シートのサポートなど、多くの機能を備えています。
        </p>
        <p>
          オリジナルのJavaScriptコードからReactフレームワークへと移行することで、
          コンポーネントベースの構造、状態管理の向上、コードの再利用性の向上を実現しています。
        </p>
      </div>
      <div className="modal-footer">
        <button onClick={onClose}>閉じる</button>
      </div>
    </Modal>
  );
};

export default AboutModal;