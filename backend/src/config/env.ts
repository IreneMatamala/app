export const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000'),
  
  // Database
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  DB_NAME: process.env.DB_NAME!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  
  // Redis
  REDIS_URL: process.env.REDIS_URL!,
  REDIS_TLS: process.env.REDIS_TLS === 'true',
  
  // Auth
  JWT_SECRET: process.env.JWT_SECRET!,
  
  // URLs
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  
  // Validation
  validate: function() {
    const required = [
      'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD',
      'JWT_SECRET', 'REDIS_URL'
    ];
    
    for (const key of required) {
      if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }
  }
};
