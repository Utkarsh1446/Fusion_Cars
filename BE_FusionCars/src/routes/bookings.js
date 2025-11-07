const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

/**
 * Bookings Routes
 *
 * Endpoints for test drive and purchase inquiry bookings
 */

// GET all bookings (admin only)
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(filter)
      .populate('user', 'firstName lastName email phone')
      .populate('car', 'name brand model year price')
      .sort({ bookingDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Booking.countDocuments(filter);

    res.json({
      data: bookings,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET user's bookings
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate('car', 'name brand model year price image')
      .sort({ createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user')
      .populate('car')
      .lean();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new booking
router.post('/', async (req, res) => {
  try {
    const { user, car, bookingType, bookingDate, bookingTime, customerName, customerEmail, customerPhone, message } = req.body;

    // Validation
    if (!bookingDate || !bookingTime || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newBooking = new Booking({
      user,
      car,
      bookingType: bookingType || 'test-drive',
      bookingDate,
      bookingTime,
      customerName,
      customerEmail,
      customerPhone,
      message,
    });

    await newBooking.save();
    await newBooking.populate('car', 'name brand model');

    res.status(201).json({
      message: 'Booking created successfully',
      data: newBooking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update booking status (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes,
      },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking updated successfully', data: booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET booking statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = {
      totalBookings: await Booking.countDocuments(),
      pendingBookings: await Booking.countDocuments({ status: 'pending' }),
      confirmedBookings: await Booking.countDocuments({ status: 'confirmed' }),
      completedBookings: await Booking.countDocuments({ status: 'completed' }),
      byType: await Booking.aggregate([
        {
          $group: {
            _id: '$bookingType',
            count: { $sum: 1 },
          },
        },
      ]),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
