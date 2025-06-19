const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Farmer)
exports.createBooking = async (req, res) => {
  try {
    // Get equipment details
    const equipment = await Equipment.findById(req.body.equipment);
    
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    
    // Check if equipment is available
    if (!equipment.availability.isAvailable) {
      return res.status(400).json({ success: false, message: 'Equipment is not available for booking' });
    }
    
    // Calculate duration and amount
    const startTime = new Date(req.body.startTime);
    const endTime = new Date(req.body.endTime);
    
    // Calculate duration in hours or days
    let duration;
    let amount;
    
    if (req.body.bookingType === 'hourly') {
      duration = (endTime - startTime) / (1000 * 60 * 60); // hours
      amount = duration * equipment.pricePerHour;
    } else {
      duration = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24)); // days
      amount = duration * (equipment.pricePerDay || equipment.pricePerHour * 8); // Default day rate if not specified
    }
    
    // Create booking object
    const bookingData = {
      equipment: equipment._id,
      farmer: req.user._id,
      owner: equipment.owner,
      operator: equipment.includesOperator ? equipment.operatorDetails : null,
      bookingType: req.body.bookingType,
      startTime,
      endTime,
      duration,
      location: req.body.location,
      workDescription: req.body.workDescription,
      payment: {
        amount,
        method: req.body.paymentMethod || 'cash'
      },
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(),
          updatedBy: req.user._id
        }
      ]
    };
    
    // Create booking
    const booking = await Booking.create(bookingData);
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
  try {
    let query = {};
    
    // Filter by role
    if (req.user.role === 'farmer') {
      query.farmer = req.user._id;
    } else if (req.user.role === 'owner') {
      query.owner = req.user._id;
    }
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
      query.startTime = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    const bookings = await Booking.find(query)
      .populate({
        path: 'equipment',
        select: 'name type images pricePerHour'
      })
      .populate({
        path: 'farmer',
        select: 'name phone profileImage'
      })
      .populate({
        path: 'owner',
        select: 'name phone profileImage'
      })
      .sort({ startTime: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'equipment',
        select: 'name type images pricePerHour specifications'
      })
      .populate({
        path: 'farmer',
        select: 'name phone profileImage'
      })
      .populate({
        path: 'owner',
        select: 'name phone profileImage'
      });
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Check if user is authorized to view this booking
    if (
      booking.farmer._id.toString() !== req.user.id &&
      booking.owner._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this booking' });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Please provide status' });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Check if user is authorized to update this booking
    if (
      (status === 'confirmed' || status === 'rejected') && 
      booking.owner.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ 
        success: false, 
        message: 'Only equipment owner or admin can confirm or reject bookings' 
      });
    }
    
    if (
      (status === 'cancelled') && 
      booking.farmer.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ 
        success: false, 
        message: 'Only farmer or admin can cancel bookings' 
      });
    }
    
    if (
      (status === 'on_the_way' || status === 'working' || status === 'completed') && 
      booking.owner.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ 
        success: false, 
        message: 'Only equipment owner or admin can update working status' 
      });
    }
    
    // Update status
    booking.status = status;
    
    // Add to status history
    booking.statusHistory.push({
      status,
      timestamp: new Date(),
      updatedBy: req.user._id
    });
    
    // If status is completed, update payment status
    if (status === 'completed' && booking.payment.method === 'cash') {
      booking.payment.status = 'completed';
      booking.payment.paidAt = new Date();
    }
    
    await booking.save();
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update tracking information
// @route   PUT /api/bookings/:id/tracking
// @access  Private (Owner)
exports.updateTracking = async (req, res) => {
  try {
    const { currentLocation, estimatedArrival } = req.body;
    
    if (!currentLocation || !currentLocation.coordinates) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide current location coordinates' 
      });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Check if user is authorized to update tracking
    if (booking.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        message: 'Only equipment owner or admin can update tracking information' 
      });
    }
    
    // Update tracking information
    booking.tracking = {
      currentLocation: {
        type: 'Point',
        coordinates: currentLocation.coordinates,
        lastUpdated: new Date()
      },
      estimatedArrival: estimatedArrival || booking.tracking.estimatedArrival
    };
    
    await booking.save();
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Update tracking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add rating and review for completed booking
// @route   POST /api/bookings/:id/rating
// @access  Private (Farmer)
exports.addRating = async (req, res) => {
  try {
    const { equipmentRating, equipmentReview, operatorRating, operatorReview } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Can only rate completed bookings' 
      });
    }
    
    // Check if user is the farmer who made the booking
    if (booking.farmer.toString() !== req.user.id) {
      return res.status(401).json({ 
        success: false, 
        message: 'Only the farmer who made the booking can add ratings' 
      });
    }
    
    // Add ratings to booking
    booking.rating = {
      equipment: {
        rating: equipmentRating,
        review: equipmentReview
      },
      operator: {
        rating: operatorRating,
        review: operatorReview
      }
    };
    
    await booking.save();
    
    // Update equipment ratings
    if (equipmentRating) {
      const equipment = await Equipment.findById(booking.equipment);
      
      if (equipment) {
        // Add review to equipment
        equipment.reviews.push({
          user: req.user._id,
          rating: equipmentRating,
          comment: equipmentReview
        });
        
        // Update ratings average and count
        equipment.ratings.count = equipment.reviews.length;
        equipment.ratings.average = equipment.reviews.reduce((acc, item) => item.rating + acc, 0) / 
          equipment.reviews.length;
        
        await equipment.save();
      }
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 