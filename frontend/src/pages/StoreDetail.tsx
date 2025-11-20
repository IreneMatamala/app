import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Store {
  id: number;
  name: string;
  description: string;
  address: string;
  owner_name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStore();
    fetchProducts();
  }, [id]);

  const fetchStore = async () => {
    try {
      const response = await axios.get(`/api/stores/${id}`);
      setStore(response.data);
    } catch (error) {
      console.error('Error fetching store:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/products/store/${id}`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const startChat = async () => {
    if (!user) {
      alert('Debes iniciar sesión para chatear con el vendedor');
      return;
    }

    try {
      const response = await axios.post('/api/chat/rooms', { storeId: id });
      window.location.href = `/chat/${response.data.id}`;
    } catch (error) {
      console.error('Error creating chat room:', error);
      alert('Error al iniciar chat');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Tienda no encontrada
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{store.name}</h1>
            <p className="text-gray-600 mb-4">{store.description}</p>
            <p className="text-gray-500">
              <strong>Dirección:</strong> {store.address}
            </p>
            <p className="text-gray-500">
              <strong>Vendedor:</strong> {store.owner_name}
            </p>
          </div>
          {user && user.role === 'buyer' && (
            <button
              onClick={startChat}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Chatear con vendedor
            </button>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos disponibles</h2>
      
      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">Esta tienda no tiene productos disponibles todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {product.image_url && (
                <img
                  src={`http://localhost:5000${product.image_url}`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-600">€{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreDetail;
