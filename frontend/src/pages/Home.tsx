// Esta es la PÁGINA PRINCIPAL que ven los usuarios
// Muestra el mapa y las tiendas disponibles
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home: React.FC = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llama a tu backend para obtener las tiendas
    axios.get('/api/stores')
      .then(response => {
        setStores(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading stores:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando tiendas...</div>;
  }

  return (
    <div>
      <h1>Bienvenido a PuebloMarket</h1>
      <p>Encuentra tiendas locales cerca de ti</p>
      
      <div className="stores-list">
        {stores.map((store: any) => (
          <div key={store.id} className="store-card">
            <h3>{store.name}</h3>
            <p>{store.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
