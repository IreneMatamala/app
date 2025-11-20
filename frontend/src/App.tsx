
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import StoreDetail from './pages/StoreDetail';
import Chat from './pages/Chat';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/store/:id" element={<StoreDetail />} />
            <Route path="/chat/:roomId" element={<Chat />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
