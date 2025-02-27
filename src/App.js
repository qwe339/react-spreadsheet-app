import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpreadsheetEditor from './components/SpreadsheetEditor';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SpreadsheetEditor />} />
      </Routes>
    </Router>
  );
}

export default App;