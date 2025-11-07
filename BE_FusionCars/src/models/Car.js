const mongoose = require('mongoose');

/**
 * Car Model
 *
 * Schema for car documents in MongoDB
 */

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
      required: true,
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic'],
      required: true,
    },
    mileage: {
      type: String,
      required: true,
    },
    engineCapacity: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    seating: {
      type: Number,
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    image: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
carSchema.index({ brand: 1, fuelType: 1 });
carSchema.index({ featured: 1 });
carSchema.index({ price: 1 });

module.exports = mongoose.model('Car', carSchema);
