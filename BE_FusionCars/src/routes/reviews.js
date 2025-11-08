const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Car = require('../models/Car');
const { authUser, optionalAuth } = require('../middleware/auth');

/**
 * Review Routes
 *
 * Endpoints for managing car reviews
 */

// Get reviews for a specific car
router.get('/car/:carId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'recent' } = req.query;

    let sortOptions = {};
    switch (sort) {
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'rating-high':
        sortOptions = { rating: -1 };
        break;
      case 'rating-low':
        sortOptions = { rating: 1 };
        break;
      case 'helpful':
        sortOptions = { helpful: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const reviews = await Review.find({
      car: req.params.carId,
      status: 'approved',
    })
      .populate('user', 'firstName lastName')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      car: req.params.carId,
      status: 'approved',
    });

    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { car: req.params.carId, status: 'approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    res.json({
      data: reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
      ratingDistribution,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a review (requires authentication)
router.post('/', authUser, async (req, res) => {
  try {
    const { carId, rating, title, comment, images } = req.body;

    // Validate required fields
    if (!carId || !rating || !title || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Check if user already reviewed this car
    const existingReview = await Review.findOne({
      car: carId,
      user: req.userId,
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this car' });
    }

    // Create review
    const review = new Review({
      car: carId,
      user: req.userId,
      rating,
      title,
      comment,
      images: images || [],
    });

    await review.save();

    res.status(201).json({
      message: 'Review submitted successfully. It will be visible after approval.',
      data: review,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a review (user's own review only)
router.put('/:id', authUser, async (req, res) => {
  try {
    const { rating, title, comment, images } = req.body;

    const review = await Review.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.images = images || review.images;
    review.status = 'pending'; // Reset to pending after edit

    await review.save();

    res.json({
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a review (user's own review only)
router.delete('/:id', authUser, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark review as helpful
router.post('/:id/helpful', optionalAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      message: 'Thank you for your feedback',
      helpful: review.helpful,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's own reviews
router.get('/my-reviews', authUser, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.userId })
      .populate('car', 'name brand model image')
      .sort({ createdAt: -1 });

    res.json({ data: reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
