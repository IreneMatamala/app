import { Pool } from 'pg';
import { createClient } from 'redis';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connected successfully');
    client.release();
    await createTables();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export const connectRedis = async () => {
  try {
    const redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: process.env.REDIS_TLS === 'true',
        rejectUnauthorized: false
      }
    });

    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    
    await redisClient.connect();
    console.log('Redis connected successfully');
    return redisClient;
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
};

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) CHECK (role IN ('buyer', 'seller')) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        store_id INTEGER REFERENCES stores(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(500),
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_rooms (
        id SERIAL PRIMARY KEY,
        store_id INTEGER REFERENCES stores(id),
        buyer_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(store_id, buyer_id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        chat_room_id INTEGER REFERENCES chat_rooms(id),
        sender_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created/verified');
  } finally {
    client.release();
  }
};

export { pool };
