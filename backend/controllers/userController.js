const User = require('../models/User');
const mongoose = require("mongoose");

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Reservation = require('../models/Reservation');
const Car = require('../models/Car');

// Create a new user
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, address, role } = req.body;
    const newUser = new User({ firstName, lastName, email, password, phoneNumber, address, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get a specific user by ID
const getUserById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ error: 'User not found' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Update a user
// const updateUser = async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//         return res.status(404).json({ error: 'User not found' });
//     }
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.status(200).json(updatedUser);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating user', error });
//   }
// };
const updateUser = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { email, ...updateData } = req.body;

    // Check if the new email is already in use by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updateData.email = email;
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};



const deleteUser = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Invalid user ID' });
    }

    // Find the user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deletion of admin account
    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Admin account cannot be deleted' });
    }

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user', details: error.message });
  }
};



// Function to change the password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id; // The user ID is from the JWT token (authMiddleware)
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the old password matches the one in the database
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    // Hash the new password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to send password reset email
// const sendPasswordResetEmail = async (email, resetToken) => {
//   const resetUrl = `http://localhost:3000/reset-password/${resetToken}`; // Replace with your frontend URL

//   const msg = {
//     to: email,
//     from: 'noreply.crls.bh@gmail.com',  
//     subject: 'Password Reset Request',
//     text: `You requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}`,  // Plain-text version
//     html: `<p>You requested a password reset. Please click the link below to reset your password:</p>
//            <p><a href="${resetUrl}">Reset Password</a></p>`,  // HTML version
//   };
  

//   try {
//     // Send the email using SendGrid
//     await sgMail.send(msg);
//     console.log('Password reset email sent');
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error sending password reset email');
//   }
// };
const sendPasswordResetEmail = async (email, resetToken) => {
  // Dynamically generate the reset URL using the environment variable
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Fallback to localhost if BASE_URL is not set
  const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

  const msg = {
    to: email,
    from: 'noreply.crls.bh@gmail.com',  
    subject: 'Password Reset Request',
    text: `You requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}`,  // Plain-text version
    html: `<p>You requested a password reset. Please click the link below to reset your password:</p>
           <p><a href="${resetUrl}">Reset Password</a></p>`,  // HTML version
  };

  try {
    // Send the email using SendGrid
    await sgMail.send(msg);
    console.log('Password reset email sent');
  } catch (error) {
    console.error(error);
    throw new Error('Error sending password reset email');
  }
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  // Check if the email belongs to the admin
  if (email === process.env.ADMIN_EMAIL) {
    return res.status(400).json({ message: "Admin cannot reset password." });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();


    // Send password reset email
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Function to reset the password
const resetPassword = async (req, res) => {
  const { resetToken } = req.params;  // Get the reset token from the URL parameter
  const { newPassword } = req.body;  // Get the new password from the body

  try {
    console.log('Received reset token:', resetToken);  // Log the received reset token

    // Find the user by reset token and check if the reset token is still valid
    const user = await User.findOne({ 
      resetToken, 
      resetTokenExpire: { $gt: Date.now() } // Check if the token is not expired
    });

    if (!user) {
      console.log('Invalid or expired reset token');  // Log if no user found or token expired
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and clear the reset token fields
    user.password = hashedPassword;
    user.resetToken = undefined; // Remove the reset token
    user.resetTokenExpire = undefined; // Remove the expiration time
    await user.save();  // Save the user with the updated password

    console.log('Password reset successfully');
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get the current logged-in user's profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Controller to update the current user's profile
const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email, phoneNumber, address },
      { new: true }
    );
    console.log("hello")
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const totalCars = await Car.countDocuments();

    const upcomingReservations = await Reservation.countDocuments({ status: 'upcoming' });
    const ongoingReservations = await Reservation.countDocuments({ status: 'ongoing' });
    const completedReservations = await Reservation.countDocuments({ status: 'completed' });
    const cancelledReservations = await Reservation.countDocuments({ status: 'cancelled' });

    const tRevenue = await Reservation.aggregate([
      { $match: { status: 'completed' } }, // Only include completed reservations
      {
        $group: {
          _id: null, // No grouping, calculate total revenue across all completed reservations
          totalRevenue: { $sum: '$totalPrice' }, // Sum the total price
        },
      },
    ]);
    const totalRevenue = tRevenue.length > 0 ? tRevenue[0].totalRevenue : 0;

    const revenueAggregation = await Reservation.aggregate([
      { $match: { status: 'completed' } }, // Only include completed reservations
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$endDate' } }, // Group by completion date
          totalRevenue: { $sum: '$totalPrice' }, // Sum the price for each date
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
    ]);
    const revenueDates = revenueAggregation.map((entry) => entry._id); 
    const revenueValues = revenueAggregation.map((entry) => entry.totalRevenue);  

    res.status(200).json({
      totalUsers: totalUsers || 0,
      totalReservations: totalReservations || 0,
      totalRevenue: totalRevenue || 0,
      totalCars: totalCars || 0,
      upcomingReservations: upcomingReservations || 0,
      ongoingReservations: ongoingReservations || 0,
      completedReservations: completedReservations || 0,
      cancelledReservations: cancelledReservations || 0,
      revenueDates: revenueDates || [],
      revenueValues: revenueValues || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getAdminStats,
};
