const express = require('express');
const router = express.Router();
const { 
  createBooking,
  getBookings,
  getBooking,
  updateBookingStatus,
  updateTracking,
  addRating
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Get all bookings and create new booking
router.route('/')
  .get(protect, getBookings)
  .post(protect, authorize('farmer'), createBooking);

// Get single booking
router.route('/:id')
  .get(protect, getBooking);

// Update booking status
router.put('/:id/status', protect, updateBookingStatus);

// Update tracking information
router.put('/:id/tracking', protect, authorize('owner', 'admin'), updateTracking);

// Add rating for completed booking
router.post('/:id/rating', protect, authorize('farmer'), addRating);

module.exports = router; 