import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './screens/home.jsx';
import Records from './screens/records.jsx';
import Scan from './screens/scan.jsx';
import Manning from './screens/manning';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/records" element={<Records />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/manning" element={<Manning />} />
      </Routes>
    </Router>
  );
}

export default App;