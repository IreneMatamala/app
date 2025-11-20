import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Store {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: null as File | null
  });

  useEffect(() => {
    if (user) {
      fetchStore();
      fetchProducts();
    }
  }, [user]);

  const fetchStore = async () => {
    try {
      const response = await axios.get('/api/stores');
      // Assuming the first store is the user's store
      if (response.data.length > 0) {
        setStore(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      if (store) {
        const response = await axios.get(`/api/products/store/${store.id}`);
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const response = await axios.post('/api/stores', Object.fromEntries(formData));
      setStore(response.data);
      alert('Tienda actualizada correctamente');
    } catch (error) {
      console.error('Error updating store:', error);
      alert('Error al actualizar la tienda');
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('description', productForm.description);
    formData.append('price', productForm.price);
    formData.append('storeId', store?.id.toString() || '');
    if (productForm.image) {
      formData.append('image', productForm.image);
    }

    try {
      await axios.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowProductForm(false);
      setProductForm({ name: '', description: '', price: '', image: null });
      fetchProducts();
      alert('Producto añadido correctamente');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error al añadir el producto');
    }
  };

  const deleteProduct = async (productId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.delete(`/api/products/${productId}`);
        fetchProducts();
        alert('Producto eliminado correctamente');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  if (!user || user.role !== 'seller') {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Acceso denegado. Solo los vendedores pueden acceder a esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel del Vendedor</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Store Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mi Tienda</h2>
          <form onSubmit={handleStoreSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de la tienda</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  defaultValue={store?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  name="description"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  defaultValue={store?.description}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input
                  type="text"
                  name="address"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  defaultValue={store?.address}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Latitud</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    defaultValue={store?.latitude}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Longitud</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    defaultValue={store?.longitude}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {store ? 'Actualizar Tienda' : 'Crear Tienda'}
              </button>
            </div>
          </form>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Productos</h2>
            <button
              onClick={() => setShowProductForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              + Añadir Producto
            </button>
          </div>

          {showProductForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-md">
              <h3 className="text-lg font-semibold mb-3">Nuevo Producto</h3>
              <form onSubmit={handleProductSubmit}>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                  <textarea
                    placeholder="Descripción"
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={2}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-600">{product.description}</p>
                    <p className="text-primary-600 font-bold">€{product.price}</p>
                  </div>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
                {product.image_url && (
                  <img
                    src={`http://localhost:5000${product.image_url}`}
                    alt={product.name}
                    className="mt-2 w-32 h-32 object-cover rounded-md"
                  />
                )}
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No hay productos todavía. Añade tu primer producto.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
