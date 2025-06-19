const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // MongoDB configuration
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/gramigo',
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'gramigo_jwt_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  
  // Twilio configuration
  TWILIO: {
    ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER
  },
  
  // File upload configuration
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads/',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  
  // CORS configuration
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:8081'],
    
  // Payment gateway configuration
  PAYMENT: {
    API_KEY: process.env.PAYMENT_GATEWAY_API_KEY,
    SECRET: process.env.PAYMENT_GATEWAY_SECRET
  }
}; 