const Equipment = require('../models/Equipment');
const User = require('../models/User');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Public
exports.getAllEquipment = async (req, res) => {
  try {
    const { 
      type, 
      minPrice, 
      maxPrice, 
      lat, 
      lng, 
      distance = 50000, // Default 50km
      includesOperator,
      available,
      sortBy = 'pricePerHour',
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;
    
    // Build query
    const query = { isApproved: true, isActive: true };
    
    // Filter by type
    if (type) {
      query.type = type;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.pricePerHour = {};
      if (minPrice) query.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) query.pricePerHour.$lte = Number(maxPrice);
    }
    
    // Filter by operator inclusion
    if (includesOperator) {
      query.includesOperator = includesOperator === 'true';
    }
    
    // Filter by availability
    if (available === 'true') {
      query['availability.isAvailable'] = true;
    }
    
    // Filter by location if coordinates provided
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(distance)
        }
      };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Determine sort order
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query
    const equipment = await Equipment.find(query)
      .populate('owner', 'name phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Equipment.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: equipment.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      },
      data: equipment
    });
  } catch (error) {
    console.error('Get all equipment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single equipment
// @route   GET /api/equipment/:id
// @access  Public
exports.getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('owner', 'name phone profileImage')
      .populate('reviews.user', 'name profileImage');
    
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    
    res.status(200).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Private (Owner)
exports.createEquipment = async (req, res) => {
  try {
    // Add owner to request body
    req.body.owner = req.user.id;
    
    // Create equipment
    const equipment = await Equipment.create(req.body);
    
    res.status(201).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private (Owner)
exports.updateEquipment = async (req, res) => {
  try {
    let equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    
    // Make sure user is equipment owner
    if (equipment.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this equipment' });
    }
    
    // Update equipment
    equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private (Owner)
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    
    // Make sure user is equipment owner
    if (equipment.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this equipment' });
    }
    
    await equipment.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add review to equipment
// @route   POST /api/equipment/:id/reviews
// @access  Private (Farmer)
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    
    // Check if user already reviewed this equipment
    const alreadyReviewed = equipment.reviews.find(
      review => review.user.toString() === req.user.id
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Equipment already reviewed' });
    }
    
    // Add review
    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment
    };
    
    equipment.reviews.push(review);
    
    // Update ratings average and count
    equipment.ratings.count = equipment.reviews.length;
    equipment.ratings.average = equipment.reviews.reduce((acc, item) => item.rating + acc, 0) / 
      equipment.reviews.length;
    
    await equipment.save();
    
    res.status(201).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update equipment availability
// @route   PUT /api/equipment/:id/availability
// @access  Private (Owner)
exports.updateAvailability = async (req, res) => {
  try {
    const { isAvailable, availableDates } = req.body;
    
    let equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    
    // Make sure user is equipment owner
    if (equipment.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to update this equipment availability' 
      });
    }
    
    // Update availability
    equipment.availability.isAvailable = isAvailable !== undefined ? isAvailable : equipment.availability.isAvailable;
    
    if (availableDates) {
      equipment.availability.availableDates = availableDates;
    }
    
    await equipment.save();
    
    res.status(200).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get nearby equipment
// @route   GET /api/equipment/nearby
// @access  Public
exports.getNearbyEquipment = async (req, res) => {
  try {
    const { lat, lng, distance = 10000 } = req.query; // Default 10km
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide latitude and longitude coordinates' 
      });
    }
    
    const equipment = await Equipment.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(distance)
        }
      },
      isApproved: true,
      isActive: true,
      'availability.isAvailable': true
    }).populate('owner', 'name phone');
    
    res.status(200).json({
      success: true,
      count: equipment.length,
      data: equipment
    });
  } catch (error) {
    console.error('Get nearby equipment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 