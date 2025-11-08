const mongoose = require('mongoose');

/**
 * Enhanced Car Model for Premium Luxury Car Reselling Platform
 *
 * Features:
 * - Multiple high-quality images
 * - 360-degree view images
 * - Detailed inspection reports
 * - Service history
 * - Advanced specifications
 * - Location tracking
 * - Insurance & financing details
 */

const carSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    variant: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      index: true,
    },
    originalPrice: {
      type: Number,
    },
    negotiable: {
      type: Boolean,
      default: true,
    },

    // Vehicle Details
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'],
      required: true,
      index: true,
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic', 'Semi-Automatic'],
      required: true,
    },
    mileage: {
      type: String,
      required: true,
    },
    kmsDriven: {
      type: Number,
      required: true,
      index: true,
    },
    engineCapacity: {
      type: String,
      required: true,
    },
    horsepower: {
      type: Number,
    },
    torque: {
      type: String,
    },
    color: {
      type: String,
      required: true,
    },
    seating: {
      type: Number,
      required: true,
    },
    doors: {
      type: Number,
      default: 4,
    },
    bodyType: {
      type: String,
      enum: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Sports', 'Luxury', 'MPV'],
    },

    // Images & Media
    images: [{
      url: String,
      type: {
        type: String,
        enum: ['exterior', 'interior', 'engine', 'dashboard', 'wheels', 'other'],
        default: 'other'
      },
      isPrimary: {
        type: Boolean,
        default: false
      }
    }],
    image: {
      type: String, // Primary image for backward compatibility
    },
    video360Url: {
      type: String, // 360-degree video URL
    },
    virtualTourUrl: {
      type: String, // Virtual tour link
    },

    // Features & Specifications
    features: [{
      type: String,
    }],
    safetyFeatures: [{
      type: String,
    }],
    comfortFeatures: [{
      type: String,
    }],
    technologyFeatures: [{
      type: String,
    }],

    // Condition & Inspection
    condition: {
      type: String,
      enum: ['Excellent', 'Very Good', 'Good', 'Fair'],
      default: 'Good',
    },
    inspectionReport: {
      inspectionDate: Date,
      inspectorName: String,
      overallScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      exteriorCondition: Number,
      interiorCondition: Number,
      engineCondition: Number,
      reportPdfUrl: String,
      notes: String,
    },

    // Service & Ownership History
    owners: {
      type: Number,
      default: 1,
      min: 0,
    },
    serviceHistory: [{
      date: Date,
      type: String,
      mileage: Number,
      description: String,
      cost: Number,
    }],
    accidentHistory: {
      hasAccidents: {
        type: Boolean,
        default: false,
      },
      accidents: [{
        date: Date,
        description: String,
        repairCost: Number,
      }]
    },

    // Documents
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
    },
    registrationState: String,
    registrationYear: Number,
    insuranceValid: {
      type: Boolean,
      default: false,
    },
    insuranceExpiry: Date,

    // Location
    location: {
      city: String,
      state: String,
      pincode: String,
      showroom: String,
    },

    // Availability
    stock: {
      type: Number,
      default: 1,
    },
    available: {
      type: Boolean,
      default: true,
      index: true,
    },
    sold: {
      type: Boolean,
      default: false,
      index: true,
    },
    soldDate: Date,

    // Marketing
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
    certified: {
      type: Boolean,
      default: false,
    },

    // Reviews & Rating
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    // Description
    description: {
      type: String,
      default: '',
    },
    highlights: [{
      type: String,
    }],

    // Financing Options
    financingAvailable: {
      type: Boolean,
      default: true,
    },
    loanEMI: {
      minEMI: Number,
      maxEMI: Number,
      tenure: Number, // in months
    },

    // Exchange
    exchangeAvailable: {
      type: Boolean,
      default: true,
    },

    // Views & Stats
    views: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
    testDrives: {
      type: Number,
      default: 0,
    },

    // Admin fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'sold', 'reserved', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for optimized queries
carSchema.index({ brand: 1, fuelType: 1 });
carSchema.index({ featured: 1, createdAt: -1 });
carSchema.index({ price: 1 });
carSchema.index({ available: 1, sold: 1 });
carSchema.index({ 'location.city': 1 });
carSchema.index({ bodyType: 1 });
carSchema.index({ year: -1 });
carSchema.index({ kmsDriven: 1 });
carSchema.index({ status: 1 });

// Text index for search
carSchema.index({
  name: 'text',
  brand: 'text',
  model: 'text',
  description: 'text'
});

// Virtual for primary image
carSchema.virtual('primaryImage').get(function() {
  if (this.images && this.images.length > 0) {
    const primary = this.images.find(img => img.isPrimary);
    return primary ? primary.url : this.images[0].url;
  }
  return this.image;
});

// Method to increment views
carSchema.methods.incrementViews = function() {
  this.views = (this.views || 0) + 1;
  return this.save();
};

// Method to increment inquiries
carSchema.methods.incrementInquiries = function() {
  this.inquiries = (this.inquiries || 0) + 1;
  return this.save();
};

module.exports = mongoose.model('Car', carSchema);
