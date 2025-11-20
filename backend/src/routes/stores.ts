import express from 'express';
import { auth, sellerAuth } from '../middleware/auth';
import { pool } from '../config/database';

const router = express.Router();

// Get all stores
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, u.name as owner_name 
      FROM stores s 
      JOIN users u ON s.user_id = u.id 
      ORDER BY s.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get store by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT s.*, u.name as owner_name 
      FROM stores s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update store (seller only)
router.post('/', sellerAuth, async (req: any, res) => {
  try {
    const { name, description, latitude, longitude, address } = req.body;
    const userId = req.user.userId;

    // Check if store already exists for this user
    const existingStore = await pool.query(
      'SELECT id FROM stores WHERE user_id = $1',
      [userId]
    );

    let result;
    if (existingStore.rows.length > 0) {
      // Update existing store
      result = await pool.query(
        `UPDATE stores SET name = $1, description = $2, latitude = $3, 
         longitude = $4, address = $5 WHERE user_id = $6 RETURNING *`,
        [name, description, latitude, longitude, address, userId]
      );
    } else {
      // Create new store
      result = await pool.query(
        `INSERT INTO stores (user_id, name, description, latitude, longitude, address) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [userId, name, description, latitude, longitude, address]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Store creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
