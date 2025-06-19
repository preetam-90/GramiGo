const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['tractor', 'harvester', 'seeder', 'sprayer', 'plow', 'irrigation', 'drone', 'other']
  },
  subCategory: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number
  },
  images: [{
    type: String
  }],
  specifications: {
    horsepower: Number,
    fuelType: String,
    width: Number,
    height: Number,
    weight: Number,
    additionalSpecs: mongoose.Schema.Types.Mixed
  },
  pricing: {
    ratePerHour: {
      type: Number,
      required: true
    },
    ratePerDay: Number,
    ratePerWeek: Number,
    minimumRentalHours: {
      type: Number,
      default: 1
    },
    deposit: Number,
    discounts: [{
      type: {
        type: String,
        enum: ['seasonal', 'duration', 'repeat-customer']
      },
      percentage: Number,
      startDate: Date,
      endDate: Date,
      minRentalDuration: Number
    }]
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availabilitySchedule: [{
      startDate: Date,
      endDate: Date,
      isBooked: Boolean
    }]
  },
  features: [String],
  operatorIncluded: {
    type: Boolean,
    default: false
  },
  deliveryOptions: {
    isDeliveryAvailable: {
      type: Boolean,
      default: false
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    maxDeliveryDistance: Number
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active'
  },
  maintenanceHistory: [{
    date: Date,
    description: String,
    cost: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create 2dsphere index for location-based queries
EquipmentSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Equipment', EquipmentSchema); 