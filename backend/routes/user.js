const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser, forgotPassword, changePassword, resetPassword, getUserProfile, updateUserProfile, getAdminStats } = require('../controllers/userController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Route to create a new user
router.post('/register', createUser);

// Route to get all users
router.get('/', getUsers);

// Route to get a specific user by ID
router.get('/:id', getUserById);

// Route to get the statistics for the admin dashboard
router.get('/admin/stats', getAdminStats);

// Route for changing password
router.put('/changePassword', authMiddleware, changePassword);

// Route to update a user 
router.patch('/:id', updateUser);
router.put('/:id', updateUser);


// Route to delete a user
router.delete('/:id', deleteUser);

// Route for forgot password
router.post('/forgot-password', forgotPassword);

// Route for resetting password 
router.post('/reset-password/:resetToken', resetPassword);

// Route to get the current logged-in user's profile
router.get('/me', authMiddleware, getUserProfile);

// Route to update the current logged-in user's profile
router.put('/me', authMiddleware, updateUserProfile);

module.exports = router;
