// Este es el ARCHIVO PRINCIPAL del backend
// Aquí se inicia el servidor y se configuran todas las rutas URLs que tu app puede usar (como /api/health).
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba para verificar que el servidor funciona
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PuebloMarket Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Ruta de ejemplo para usuarios
app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Juan' }, { id: 2, name: 'Maria' }]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
