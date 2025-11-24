// Esta es la PÁGINA PRINCIPAL que ven los usuarios
// Muestra el mapa y las tiendas disponibles


import React from 'react';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>🛒 PuebloMarket</h1>
      <p>Bienvenido a la app de tiendas locales</p>
      <div style={{ marginTop: '2rem' }}>
        <h3>Tiendas de ejemplo:</h3>
        <ul>
          <li>Tienda María - Verduras frescas</li>
          <li>Panadería Luis - Pan recién hecho</li>
          <li>Frutas Juan - Fruta de temporada</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
