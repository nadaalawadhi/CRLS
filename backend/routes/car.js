const express = require('express');
const { createCar, getAvailableCars, getCars, getCarById, updateCar, deleteCar, 
    getUnavailableDates, checkCarReservations, updateCarAvailability, getAvailableBandC } = require('../controllers/carController');
const router = express.Router();

// Route to create a new car
router.post('/', createCar);

router.get('/available', getAvailableCars);

router.get('/b-and-c', getAvailableBandC);

// Route to check if a car has reservations
router.get('/:id/reservations', checkCarReservations);

// Route to get all cars
router.get('/', getCars);

// Route to get a specific car by ID
router.get('/:id', getCarById);

// Route to update a car
router.put('/:id', updateCar);

// Route to delete a car
router.delete('/:id', deleteCar);

// Route to get unavailable dates for a specific car
router.get('/:carId/unavailable-dates', getUnavailableDates);

// Route to update a car's availability
router.put('/:id/availability', updateCarAvailability);

module.exports = router;
