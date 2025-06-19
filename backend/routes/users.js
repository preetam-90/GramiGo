const express = require('express');
const router = express.Router();
const { 
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyUser,
  getDashboardStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Get dashboard stats
router.get('/dashboard', protect, getDashboardStats);

// Get all users (admin only)
router.route('/')
  .get(protect, authorize('admin'), getUsers);

// Get, update and delete user
router.route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

// Verify user (admin only)
router.put('/:id/verify', protect, authorize('admin'), verifyUser);

module.exports = router; 