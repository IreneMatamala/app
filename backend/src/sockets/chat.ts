import { Server, Socket } from 'socket.io';
import { pool } from '../config/database';

export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Join chat room
    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Send message
    socket.on('send_message', async (data: any) => {
      try {
        const { roomId, senderId, content } = data;

        // Save message to database
        const result = await pool.query(
          'INSERT INTO messages (chat_room_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
          [roomId, senderId, content]
        );

        // Get sender info
        const senderResult = await pool.query(
          'SELECT name, role FROM users WHERE id = $1',
          [senderId]
        );

        const message = {
          ...result.rows[0],
          sender_name: senderResult.rows[0].name,
          sender_role: senderResult.rows[0].role
        };

        // Send to all in room
        io.to(roomId).emit('receive_message', message);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // Leave room
    socket.on('leave_room', (roomId: string) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
