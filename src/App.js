import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import DetailPage from './components/DetailPage';
import MainPage from './components/MainPage';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/details/:id" element={<DetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;

