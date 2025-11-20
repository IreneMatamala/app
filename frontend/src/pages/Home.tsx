import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Store {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  owner_name: string;
}

const Home: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/stores');
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultCenter: [number, number] = [40.4168, -3.7038]; // Madrid center

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Descubre tiendas locales en tu pueblo
        </h1>
        <p className="text-lg text-gray-600">
          Encuentra productos frescos y de calidad en las tiendas de tu zona
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <MapContainer
              center={defaultCenter}
              zoom={6}
              style={{ height: '500px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {stores.map(store => (
                <Marker
                  key={store.id}
                  position={[store.latitude, store.longitude]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg">{store.name}</h3>
                      <p className="text-sm text-gray-600">{store.description}</p>
                      <p className="text-xs text-gray-500">{store.address}</p>
                      <Link
                        to={`/store/${store.id}`}
                        className="inline-block mt-2 px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
                      >
                        Ver tienda
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tiendas disponibles</h2>
            <div className="space-y-4">
              {stores.map(store => (
                <div key={store.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-lg text-gray-800">{store.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{store.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{store.address}</p>
                  <Link
                    to={`/store/${store.id}`}
                    className="inline-block mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Ver productos →
                  </Link>
                </div>
              ))}
              {stores.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No hay tiendas registradas todavía.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
