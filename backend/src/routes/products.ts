import express from 'express';
import multer from 'multer';
import { sellerAuth } from '../middleware/auth';
import { pool } from '../config/database';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Get products by store
router.get('/store/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const result = await pool.query(
      'SELECT * FROM products WHERE store_id = $1 ORDER BY created_at DESC',
      [storeId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product (seller only)
router.post('/', sellerAuth, upload.single('image'), async (req: any, res) => {
  try {
    const { name, description, price, storeId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO products (store_id, name, description, price, image_url) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [storeId, name, description, parseFloat(price), imageUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (seller only)
router.delete('/:id', sellerAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
