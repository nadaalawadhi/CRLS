const Reservation = require('../models/Reservation');
const Car = require('../models/Car');
const User = require('../models/User');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create a new reservation
const createReservation = async (req, res) => {
  try {
    const {
      car,
      user,
      startDate,
      endDate,
      pickupLocation,
      returnLocation,
      baseRentalFee,
      vatPrice,
      insurancePrice,
      totalPrice,
      isPaid,
      paymentMethod,
      paidAt,
      paymentResult,
      status,
    } = req.body;

    console.log("Request body:", req.body); // Debugging line

    const newReservation = new Reservation({
      car,
      user,
      startDate,
      endDate,
      pickupLocation,
      returnLocation,
      baseRentalFee,
      vatPrice,
      insurancePrice,
      totalPrice,
      isPaid,
      paymentMethod,
      paidAt,
      paymentResult,
      status,
    });

    await newReservation.save();

    // Fetch car and user details for email
    const carDetails = await Car.findById(car);
    const userDetails = await User.findById(user);

    if (!carDetails || !userDetails) {
      return res.status(400).json({ message: 'Invalid car or user ID' });
    }

    console.log("Sending confirmation email..."); // Debugging line
    await sendReservationConfirmationEmail(userDetails.email, {
      car: carDetails,
      startDate,
      endDate,
      pickupLocation,
      returnLocation,
      totalPrice,
    });

    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: 'Error creating reservation', error });
  }
};

// Get all reservations
const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({})
      .populate('car')
      .populate('user')
      .sort({ createdAt: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error });
  }
};

// Get a specific reservation by ID
const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('car')
      .populate('user');
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservation', error });
  }
};

// Update a reservation
const updateReservation = async (req, res) => {
  try {
    const {
      car,
      user,
      startDate,
      endDate,
      pickupLocation,
      returnLocation,
      baseRentalFee,
      vatPrice,
      insurancePrice,
      totalPrice,
      isPaid,
      paymentMethod,
      paidAt,
      paymentResult,
      status,
    } = req.body;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        car,
        user,
        startDate,
        endDate,
        pickupLocation,
        returnLocation,
        baseRentalFee,
        vatPrice,
        insurancePrice,
        totalPrice,
        isPaid,
        paymentMethod,
        paidAt,
        paymentResult,
        status,
      },
      { new: true }
    )
      .populate('car')
      .populate('user');

    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reservation', error });
  }
};

// Delete a reservation
const deleteReservation = async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!deletedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json({ message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reservation', error });
  }
};

const updateReservationStatus = async (req, res) => {
  const { status } = req.body;
  const reservationId = req.params.id;
  const reservation = await Reservation.findById(reservationId);

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  // Validate allowed status changes
  if (reservation.status === 'cancelled' || reservation.status === 'completed') {
    return res.status(400).json({ message: 'Cannot change status of cancelled or completed reservations' });
  }

  if (reservation.status === 'upcoming' && !['ongoing', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status change for upcoming reservation' });
  }

  if (reservation.status === 'ongoing' && status !== 'completed') {
    return res.status(400).json({ message: 'Invalid status change for ongoing reservation' });
  }

  // Proceed to update the status
  reservation.status = status;
  await reservation.save();

  res.status(200).json({ status: reservation.status });
};


// Get all reservations for a specific user
const getReservationsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch reservations for the user and populate car details
    const reservations = await Reservation.find({ user: userId })
      .populate('car')  // Ensure this correctly populates the car data
      .populate('user')  // Optionally populate user details
      .sort({ createdAt: -1 });  // Sort by most recent first

    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found for this user' });
    }

    res.status(200).json(reservations);  // Send populated reservation data back to frontend
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations for user', error });
  }
};


// Cancel a reservation
const cancelReservation = async (req, res) => {
  const reservationId = req.params.id;

  try {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.status !== 'upcoming') {
      return res.status(400).json({ message: 'Only upcoming reservations can be cancelled' });
    }

    reservation.status = 'cancelled'; // Update the status to "cancelled"
    await reservation.save();

    res.status(200).json({ message: 'Reservation cancelled successfully', reservation });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling reservation', error: err.message });
  }
};

const sendReservationConfirmationEmail = async (email, reservationDetails) => {
  const {
    car,
    startDate,
    endDate,
    pickupLocation,
    returnLocation,
    totalPrice,
  } = reservationDetails;

  const msg = {
    to: email,
    from: 'noreply.crls.bh@gmail.com', // Replace with your verified sender email
    subject: 'Reservation Confirmation',
    html: `
      <h1>Reservation Confirmation</h1>
      <p>Thank you for booking with us. Here are your reservation details:</p>
      <ul>
        <li><strong>Car:</strong> ${car.make} ${car.model}</li>
        <li><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</li>
        <li><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString()}</li>
        <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
        <li><strong>Return Location:</strong> ${returnLocation}</li>
        <li><strong>Total Price:</strong> ${totalPrice} BHD</li>
      </ul>
      <p>We look forward to serving you!</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Reservation confirmation email sent');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error('Error sending confirmation email');
  }
};

const sendCarUnavailableEmail = async (email, reservation, baseUrl) => {
  const { car, _id: reservationId, startDate, endDate } = reservation;

  const reservationLink = `${baseUrl}/MyReservations?reservationId=${reservationId}`;

  const msg = {
    to: email,
    from: 'noreply.crls.bh@gmail.com', // Replace with your verified sender email
    subject: 'Important Update About Your Reservation',
    html: `
      <h1>Car Unavailability Notification</h1>
      <p>We regret to inform you that the car you reserved (${car.make} ${car.model}) will not be available due to unforeseen circumstances.</p>
      <p>We have assigned a car with similar specifications to fulfill your reservation. If this does not suit your needs, you can cancel the reservation and make a new one.</p>
      <p><strong>Rental Dates:</strong> ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</p>
      <p>Please <a href="${reservationLink}">click here</a> to view or manage your reservation.</p>
      <p>We sincerely apologize for any inconvenience caused. Thank you for your understanding.</p>
      <p>Best regards,<br/>Customer Support Team</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Unavailability notification sent to ${email}`);
  } catch (error) {
    console.error('Error sending unavailability email:', error);
  }
};

const notifyCustomersAboutCarUnavailability = async (req, res) => {
  const { carId } = req.body;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  try {
    const reservations = await Reservation.find({
      car: carId,
      status: { $in: ['ongoing', 'upcoming'] },
    }).populate('car user');

    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations to notify' });
    }

    for (const reservation of reservations) {
      const { user } = reservation;
      await sendCarUnavailableEmail(user.email, reservation, baseUrl);
    }

    res.status(200).json({ message: 'Customers notified successfully' });
  } catch (error) {
    console.error('Error notifying customers:', error);
    res.status(500).json({ message: 'Error notifying customers', error });
  }
};


module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  updateReservationStatus,
  getReservationsByUserId,
  cancelReservation,
  notifyCustomersAboutCarUnavailability
};
