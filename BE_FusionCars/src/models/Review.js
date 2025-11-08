const mongoose = require('mongoose');

/**
 * Review Model
 *
 * Customer reviews and ratings for cars
 */

const reviewSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    images: [{
      url: String,
      caption: String,
    }],
    verified: {
      type: Boolean,
      default: false, // Verified purchase
    },
    helpful: {
      type: Number,
      default: 0, // Number of users who found this helpful
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ car: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });

// Ensure one review per user per car
reviewSchema.index({ car: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
