const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: [
      'Economy',
      'Compact',
      'Mid-size',
      'Full-size',
      'Luxury',
      'SUV',
      'Crossover',
      'Convertible',
      'Sports Car',
      'Van/Minivan',
      'Pickup Truck',
      'Electric',
      'Hybrid',
      'Premium SUV',
      'Sedan',
    ],
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Car', carSchema);
