const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

/**
 * Cars Routes
 *
 * Endpoints for car listings, filtering, and search
 */

// GET all cars with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { brand, fuelType, minPrice, maxPrice, page = 1, limit = 12, sort = 'featured' } = req.query;

    // Build filter object
    const filter = {};
    if (brand) filter.brand = brand;
    if (fuelType) filter.fuelType = fuelType;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build sort object
    let sortOptions = {};
    switch (sort) {
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1 };
        break;
      case 'newest':
        sortOptions = { year: -1 };
        break;
      default:
        sortOptions = { featured: -1, createdAt: -1 };
    }

    // Execute query with pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const cars = await Car.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Car.countDocuments(filter);

    res.json({
      data: cars,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET featured cars
router.get('/featured', async (req, res) => {
  try {
    const cars = await Car.find({ featured: true }).limit(3).lean();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).lean();
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new car (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, brand, model, year, price, fuelType, transmission, mileage, engineCapacity, color, seating, features, image } = req.body;

    // Basic validation
    if (!name || !brand || !model || !year || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newCar = new Car({
      name,
      brand,
      model,
      year,
      price,
      fuelType,
      transmission,
      mileage,
      engineCapacity,
      color,
      seating,
      features,
      image,
    });

    await newCar.save();
    res.status(201).json({ message: 'Car created successfully', data: newCar });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update car (admin only)
router.put('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json({ message: 'Car updated successfully', data: car });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE car (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET car statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = {
      totalCars: await Car.countDocuments(),
      featuredCars: await Car.countDocuments({ featured: true }),
      averagePrice: await Car.aggregate([
        {
          $group: {
            _id: null,
            avgPrice: { $avg: '$price' },
          },
        },
      ]),
      byFuelType: await Car.aggregate([
        {
          $group: {
            _id: '$fuelType',
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
