const User = require('../models/User');
const Equipment = require('../models/Equipment');
const Booking = require('../models/Booking');

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const { role, isVerified, isActive, search, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    // Filter by verification status
    if (isVerified) {
      query.isVerified = isVerified === 'true';
    }
    
    // Filter by active status
    if (isActive) {
      query.isActive = isActive === 'true';
    }
    
    // Search by name or email or phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      },
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin or Owner)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if user is authorized to view this user
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to view this user' });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (Owner or Admin)
exports.updateUser = async (req, res) => {
  try {
    // Check if user is authorized to update this user
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this user' });
    }
    
    // Remove password field if included
    if (req.body.password) {
      delete req.body.password;
    }
    
    // Remove role field if not admin
    if (req.body.role && req.user.role !== 'admin') {
      delete req.body.role;
    }
    
    // Remove verification status if not admin
    if (req.body.isVerified !== undefined && req.user.role !== 'admin') {
      delete req.body.isVerified;
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    await user.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Verify user
// @route   PUT /api/users/:id/verify
// @access  Private (Admin)
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    let stats = {};
    
    if (req.user.role === 'farmer') {
      // Farmer dashboard stats
      const bookings = await Booking.find({ farmer: req.user._id });
      
      stats = {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(booking => booking.status === 'pending').length,
        confirmedBookings: bookings.filter(booking => booking.status === 'confirmed').length,
        completedBookings: bookings.filter(booking => booking.status === 'completed').length,
        cancelledBookings: bookings.filter(booking => booking.status === 'cancelled').length,
        totalSpent: bookings
          .filter(booking => booking.status === 'completed')
          .reduce((total, booking) => total + booking.payment.amount, 0)
      };
    } else if (req.user.role === 'owner') {
      // Owner dashboard stats
      const equipment = await Equipment.find({ owner: req.user._id });
      const bookings = await Booking.find({ owner: req.user._id });
      
      stats = {
        totalEquipment: equipment.length,
        activeEquipment: equipment.filter(eq => eq.isActive && eq.isApproved).length,
        pendingEquipment: equipment.filter(eq => !eq.isApproved).length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(booking => booking.status === 'pending').length,
        confirmedBookings: bookings.filter(booking => booking.status === 'confirmed').length,
        completedBookings: bookings.filter(booking => booking.status === 'completed').length,
        totalEarnings: bookings
          .filter(booking => booking.status === 'completed')
          .reduce((total, booking) => total + booking.payment.amount, 0)
      };
    } else if (req.user.role === 'admin') {
      // Admin dashboard stats
      const users = await User.find();
      const equipment = await Equipment.find();
      const bookings = await Booking.find();
      
      stats = {
        totalUsers: users.length,
        farmers: users.filter(user => user.role === 'farmer').length,
        owners: users.filter(user => user.role === 'owner').length,
        totalEquipment: equipment.length,
        pendingEquipment: equipment.filter(eq => !eq.isApproved).length,
        totalBookings: bookings.length,
        completedBookings: bookings.filter(booking => booking.status === 'completed').length,
        totalRevenue: bookings
          .filter(booking => booking.status === 'completed')
          .reduce((total, booking) => total + booking.payment.amount, 0)
      };
    }
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 