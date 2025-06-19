const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  sendOTP, 
  verifyOTP 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current user route
router.get('/me', protect, getMe);

// OTP routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router; 