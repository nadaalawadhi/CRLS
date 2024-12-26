const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    pickupLocation: {
      type: String,
      enum: ['Manama Branch', 'Riffa Branch', 'Muharraq Branch'],
      required: true,
    },
    returnLocation: {
      type: String,
      enum: ['Manama Branch', 'Riffa Branch', 'Muharraq Branch'],
      required: true,
    },
    baseRentalFee: {
      type: Number,
      required: true,
    },
    vatPrice: {
      type: Number,
      required: true,
    },
    insurancePrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: ['completed', 'cancelled', 'ongoing', 'upcoming'],
      default: 'upcoming',
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['PayPal'], // Add more methods if required in the future
    },
    paidAt: {
      type: Date,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      updateTime: { type: String },
      email: { type: String },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);
