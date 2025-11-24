// Este es el COMPONENTE PRINCIPAL de tu aplicación
// Define la estructura básica y las rutas de tu app
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {/* Navegación simple */}
        <nav style={{ 
          padding: '1rem', 
          backgroundColor: 'white', 
          borderBottom: '1px solid #ddd',
          display: 'flex',
          gap: '1rem'
        }}>
          <Link to="/">🏠 Inicio</Link>
          <Link to="/login">🔐 Login</Link>
        </nav>

        {/* Contenido principal */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
