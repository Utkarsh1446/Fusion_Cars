const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { authUser } = require('../middleware/auth');

/**
 * Wishlist Routes
 *
 * Endpoints for managing user wishlist
 */

// All routes require authentication
router.use(authUser);

// Get user's wishlist
router.get('/', async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.userId })
      .populate({
        path: 'cars.car',
        select: 'name brand model year price image images fuelType transmission rating',
      });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.userId, cars: [] });
      await wishlist.save();
    }

    res.json({ data: wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add car to wishlist
router.post('/add', async (req, res) => {
  try {
    const { carId, notes } = req.body;

    if (!carId) {
      return res.status(400).json({ error: 'Car ID is required' });
    }

    let wishlist = await Wishlist.findOne({ user: req.userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.userId, cars: [] });
    }

    await wishlist.addCar(carId, notes);

    await wishlist.populate({
      path: 'cars.car',
      select: 'name brand model year price image',
    });

    res.json({
      message: 'Car added to wishlist',
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove car from wishlist
router.delete('/remove/:carId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.userId });

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    await wishlist.removeCar(req.params.carId);

    res.json({
      message: 'Car removed from wishlist',
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear entire wishlist
router.delete('/clear', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.userId });

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    wishlist.cars = [];
    await wishlist.save();

    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update wishlist item notes
router.patch('/notes/:carId', async (req, res) => {
  try {
    const { notes } = req.body;
    const wishlist = await Wishlist.findOne({ user: req.userId });

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    const item = wishlist.cars.find(
      (item) => item.car.toString() === req.params.carId
    );

    if (!item) {
      return res.status(404).json({ error: 'Car not in wishlist' });
    }

    item.notes = notes;
    await wishlist.save();

    res.json({
      message: 'Notes updated',
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
