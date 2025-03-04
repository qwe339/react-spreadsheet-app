// index.js の内容
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// public/index.html の内容
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="拡張Handsontableスプレッドシート (React版)"
    />
    <title>拡張Handsontableスプレッドシート</title>
  </head>
  <body>
    <noscript>このアプリケーションを実行するにはJavaScriptを有効にしてください。</noscript>
    <div id="root"></div>
  </body>
</html>