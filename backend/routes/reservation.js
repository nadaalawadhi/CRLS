const express = require('express');
const { createReservation, getReservations, getReservationById, 
    updateReservation, deleteReservation, updateReservationStatus, cancelReservation, 
    getReservationsByUserId, notifyCustomersAboutCarUnavailability, } = require('../controllers/reservationController');

const router = express.Router();

// Route to create a new reservation
router.post('/', createReservation);

// Route to get all reservations
router.get('/', getReservations);

// Route to get a specific reservation by ID
router.get('/:id', getReservationById);

// Route to update a reservation
router.put('/:id', updateReservation);

// Route to delete a reservation
router.delete('/:id', deleteReservation);

// PUT route to update reservation status
router.put('/:id/status', updateReservationStatus);

// Route to get reservations by user ID
router.get('/user/:userId', getReservationsByUserId);

// Route to cancel a reservation
router.put('/:id/cancel', cancelReservation);

router.post('/notify', notifyCustomersAboutCarUnavailability);

module.exports = router;

