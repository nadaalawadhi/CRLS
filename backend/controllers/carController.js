const Car = require('../models/Car');
const Booking = require('../models/Reservation');
const fs = require('fs');
const path = require('path');

// Create a new car
const createCar = async (req, res) => {
  try {
    const { make, model, year, category, pricePerDay, availability, color, imageUrl, description } = req.body;
    const newCar = new Car({
      make,
      model,
      year,
      category,
      pricePerDay,
      availability,
      color,
      imageUrl,
      description,
    });
    await newCar.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: 'Error adding car', error });
  }
};

const getCars = async (req, res) => {
  try {
    const { availability } = req.query; // Get the query parameter
    const filter = {};

    if (availability) {
      filter.availability = availability === 'true'; // Convert string to boolean
    }

    const cars = await Car.find(filter).sort({createdAt: -1}); // Use the filter object
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Error fetching cars' });
  }
};


// Get a specific car by ID
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching car', error });
  }
};

// Update a car
const updateCar = async (req, res) => {
  try {
    const { make, model, year, category, pricePerDay, availability, color, imageUrl, description } = req.body;
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { make, model, year, category, pricePerDay, availability, color, imageUrl, description },
      { new: true }
    );
    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating car', error });
  }
};

// Delete a car
const deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if the car has an associated image and delete it
    if (deletedCar.imageUrl) {
      const imagePath = path.join(__dirname, '..', deletedCar.imageUrl); // Adjust path to match the uploads folder location
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Failed to delete image file: ${imagePath}`, err);
        } else {
          console.log(`Image file deleted: ${imagePath}`);
        }
      });
    }

    res.status(200).json({ message: 'Car and associated image deleted' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Error deleting car', error });
  }
};

module.exports = {
  deleteCar,
};

// Get unavailable dates for a specific car
const getUnavailableDates = async (req, res) => {
  const { carId } = req.params;

  try {
    // Fetch reservations for the given car ID, excluding cancelled ones
    const bookings = await Booking.find({
      car: carId,
      startDate: { $gte: new Date() },
      status: { $ne: 'cancelled' }, // Exclude cancelled reservations
    });

    // Generate a list of unavailable dates
    const unavailableDates = bookings
      .map((booking) => {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        let currentDate = start;

        const datesInRange = [];
        while (currentDate <= end) {
          datesInRange.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return datesInRange;
      })
      .flat();

    res.json(unavailableDates);
  } catch (error) {
    console.error('Error fetching unavailable dates:', error);
    res.status(500).json({ error: 'Failed to fetch unavailable dates' });
  }
};

const checkCarReservations = async (req, res) => {
  try {
    const carId = req.params.id;
    const reservations = await Booking.find({ car: carId });
    // const reservations = await Booking.find({ carId });
    console.log("Reservations:", reservations); // Add this for debugging
    res.json({ hasReservations: reservations.length > 0 });
  } catch (err) {
    console.error("Error checking reservations:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateCarAvailability = async (req, res) => {
  try {
    const carId = req.params.id;
    const { availability } = req.body;

    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { availability },
      { new: true }
    );

    if (updatedCar) {
      res.json({ message: 'Car availability updated', car: updatedCar });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (err) {
    console.error('Error updating car availability:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAvailableBandC = async (req, res) => {
  try {

    const filter = { availability: true };

    const availableCars = await Car.find(filter);

    res.status(200).json(availableCars);

  } catch (error) {
    console.error('Error in getAvailableCars:', error);
    res.status(500).json({ message: 'Error fetching available cars', error });
  }
};

const getAvailableCars = async (req, res) => {
  try {
    const { startDate, endDate, keyword, carMake, category, minPrice, maxPrice } = req.query;

    const filter = { availability: true };

    // Apply keyword filter
    if (keyword) {
      filter.$or = [
        { make: { $regex: keyword, $options: 'i' } },
        { model: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Apply car make filter
    if (carMake) {
      filter.make = carMake;
    }

    // Apply category filter
    if (category) {
      filter.category = category;
    }

    // Apply price range filter
    // if (minPrice && maxPrice) {
    //   filter.pricePerDay = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    // }
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) {
        filter.pricePerDay.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter.pricePerDay.$lte = parseFloat(maxPrice);
      }
    }
    

    // Apply date filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const carsWithReservations = await Booking.find({
        status: { $ne: 'cancelled' },
        $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
      }).distinct('car');

      filter._id = { $nin: carsWithReservations }; // Exclude cars with conflicting reservations
    }

    const availableCars = await Car.find(filter);
    res.status(200).json(availableCars);
  } catch (error) {
    console.error('Error in getAvailableCars:', error);
    res.status(500).json({ message: 'Error fetching available cars', error });
  }
};



module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  getUnavailableDates,
  checkCarReservations, 
  updateCarAvailability,
  getAvailableCars,
  getAvailableBandC
};
