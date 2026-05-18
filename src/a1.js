// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import EntryPage from './pages/EntryPage';
import WelcomeAdmin from './pages/WelcomeAdmin';
import WelcomeUser from './pages/WelcomeUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/admin" element={<WelcomeAdmin />} />
        <Route path="/user" element={<WelcomeUser />} />
      </Routes>
    </Router>
  );
}

export default App;
