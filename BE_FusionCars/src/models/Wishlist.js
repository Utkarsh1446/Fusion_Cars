const mongoose = require('mongoose');

/**
 * Wishlist Model
 *
 * User's saved/favorite cars
 */

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    cars: [{
      car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
      notes: {
        type: String,
        maxlength: 500,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Ensure one wishlist per user
wishlistSchema.index({ user: 1 }, { unique: true });

// Method to add car to wishlist
wishlistSchema.methods.addCar = function (carId, notes = '') {
  const carExists = this.cars.some(item => item.car.toString() === carId.toString());

  if (!carExists) {
    this.cars.push({ car: carId, notes });
  }

  return this.save();
};

// Method to remove car from wishlist
wishlistSchema.methods.removeCar = function (carId) {
  this.cars = this.cars.filter(item => item.car.toString() !== carId.toString());
  return this.save();
};

module.exports = mongoose.model('Wishlist', wishlistSchema);
