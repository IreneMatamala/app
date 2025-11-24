
import React from 'react';

const Login: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Iniciar Sesión</h2>
      <p>Funcionalidad de login en desarrollo...</p>
      <button 
        style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}
        onClick={() => alert('Login sería aquí')}
      >
        Entrar
      </button>
    </div>
  );
};

export default Login;
