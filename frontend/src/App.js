import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import FileUpload from './components/FileUpload';
import AdminDashboard from './components/AdminDashboard';
import RegisterPage from './components/Registration';
import Home from './components/Home';
import { Box } from '@mui/material';

function App() {
  return (
    <Router>
      <Header />
      <Box sx={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Box>
      <Footer />
    </Router>
  );
}

export default App;
