import express from 'express';
import { auth } from '../middleware/auth';
import { pool } from '../config/database';

const router = express.Router();

// Get chat rooms for user
router.get('/rooms', auth, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.userId;
    
    let query = '';
    let params = [userId];

    if ((req as any).user.role === 'seller') {
      query = `
        SELECT cr.*, u.name as buyer_name, s.name as store_name
        FROM chat_rooms cr
        JOIN users u ON cr.buyer_id = u.id
        JOIN stores s ON cr.store_id = s.id
        WHERE s.user_id = $1
        ORDER BY cr.created_at DESC
      `;
    } else {
      query = `
        SELECT cr.*, u.name as seller_name, s.name as store_name
        FROM chat_rooms cr
        JOIN stores s ON cr.store_id = s.id
        JOIN users u ON s.user_id = u.id
        WHERE cr.buyer_id = $1
        ORDER BY cr.created_at DESC
      `;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get chat rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a chat room
router.get('/rooms/:roomId/messages', auth, async (req: express.Request, res: express.Response) => {
  try {
    const { roomId } = req.params;
    
    const result = await pool.query(
      `SELECT m.*, u.name as sender_name, u.role as sender_role
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.chat_room_id = $1
       ORDER BY m.created_at ASC`,
      [roomId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or get chat room
router.post('/rooms', auth, async (req: express.Request, res: express.Response) => {
  try {
    const { storeId } = req.body;
    const buyerId = (req as any).user.userId;

    // Check if room already exists
    let result = await pool.query(
      'SELECT * FROM chat_rooms WHERE store_id = $1 AND buyer_id = $2',
      [storeId, buyerId]
    );

    if (result.rows.length === 0) {
      // Create new room
      result = await pool.query(
        'INSERT INTO chat_rooms (store_id, buyer_id) VALUES ($1, $2) RETURNING *',
        [storeId, buyerId]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create chat room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
