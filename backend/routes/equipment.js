const express = require('express');
const router = express.Router();
const { 
  getAllEquipment,
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  addReview,
  updateAvailability,
  getNearbyEquipment
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/auth');

// Get nearby equipment
router.get('/nearby', getNearbyEquipment);

// Get all equipment and create new equipment
router.route('/')
  .get(getAllEquipment)
  .post(protect, authorize('owner', 'admin'), createEquipment);

// Get, update and delete equipment
router.route('/:id')
  .get(getEquipment)
  .put(protect, authorize('owner', 'admin'), updateEquipment)
  .delete(protect, authorize('owner', 'admin'), deleteEquipment);

// Add review to equipment
router.post('/:id/reviews', protect, authorize('farmer'), addReview);

// Update equipment availability
router.put('/:id/availability', protect, authorize('owner', 'admin'), updateAvailability);

module.exports = router; 