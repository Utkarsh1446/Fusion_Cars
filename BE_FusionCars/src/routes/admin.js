const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Admin = require('../models/Admin');
const { authAdmin, checkPermission } = require('../middleware/auth');

/**
 * Admin Routes
 *
 * Protected endpoints for admin operations
 */

// All routes require admin authentication
router.use(authAdmin);

// ======================
// CAR MANAGEMENT
// ======================

// Create new car listing
router.post('/cars', checkPermission('manage_cars'), async (req, res) => {
  try {
    const carData = {
      ...req.body,
      createdBy: req.adminId,
      lastUpdatedBy: req.adminId,
    };

    const car = new Car(carData);
    await car.save();

    res.status(201).json({
      message: 'Car listing created successfully',
      data: car,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update car listing
router.put('/cars/:id', checkPermission('manage_cars'), async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        lastUpdatedBy: req.adminId,
      },
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json({
      message: 'Car listing updated successfully',
      data: car,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete car listing
router.delete('/cars/:id', checkPermission('manage_cars'), async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json({ message: 'Car listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark car as sold
router.patch('/cars/:id/sold', checkPermission('manage_cars'), async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      {
        sold: true,
        soldDate: new Date(),
        available: false,
        status: 'sold',
        lastUpdatedBy: req.adminId,
      },
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json({
      message: 'Car marked as sold',
      data: car,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle featured status
router.patch('/cars/:id/featured', checkPermission('manage_cars'), async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    car.featured = !car.featured;
    car.lastUpdatedBy = req.adminId;
    await car.save();

    res.json({
      message: `Car ${car.featured ? 'featured' : 'unfeatured'}`,
      data: car,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================
// DASHBOARD ANALYTICS
// ======================

router.get('/dashboard/stats', checkPermission('view_analytics'), async (req, res) => {
  try {
    const [
      totalCars,
      availableCars,
      soldCars,
      totalUsers,
      totalBookings,
      pendingBookings,
      totalReviews,
      avgRating,
    ] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ available: true, sold: false }),
      Car.countDocuments({ sold: true }),
      User.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Review.countDocuments({ status: 'approved' }),
      Review.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } },
      ]),
    ]);

    // Sales analytics
    const recentSales = await Car.find({ sold: true })
      .sort({ soldDate: -1 })
      .limit(10)
      .select('name brand model price soldDate');

    // Popular brands
    const popularBrands = await Car.aggregate([
      { $match: { available: true } },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Revenue calculation (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRevenue = await Car.aggregate([
      { $match: { sold: true, soldDate: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    res.json({
      overview: {
        totalCars,
        availableCars,
        soldCars,
        totalUsers,
        totalBookings,
        pendingBookings,
        totalReviews,
        averageRating: avgRating[0]?.avgRating || 0,
      },
      sales: {
        recentSales,
        last30DaysRevenue: recentRevenue[0]?.total || 0,
      },
      insights: {
        popularBrands,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================
// USER MANAGEMENT
// ======================

router.get('/users', checkPermission('manage_users'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const query = search
      ? {
          $or: [
            { firstName: new RegExp(search, 'i') },
            { lastName: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
          ],
        }
      : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================
// BOOKING MANAGEMENT
// ======================

router.get('/bookings', checkPermission('manage_bookings'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = status ? { status } : {};

    const bookings = await Booking.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('car', 'name brand model price image')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.patch('/bookings/:id/status', checkPermission('manage_bookings'), async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('car user');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      message: 'Booking status updated',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================
// REVIEW MANAGEMENT
// ======================

router.get('/reviews', checkPermission('manage_reviews'), async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;

    const reviews = await Review.find({ status })
      .populate('user', 'firstName lastName email')
      .populate('car', 'name brand model')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ status });

    res.json({
      data: reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/Reject review
router.patch('/reviews/:id/status', checkPermission('manage_reviews'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Update car rating if approved
    if (status === 'approved') {
      const car = await Car.findById(review.car);
      if (car) {
        const approvedReviews = await Review.find({ car: car._id, status: 'approved' });
        const avgRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
        car.rating = avgRating;
        car.reviewCount = approvedReviews.length;
        await car.save();
      }
    }

    res.json({
      message: `Review ${status}`,
      data: review,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
