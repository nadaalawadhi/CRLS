const jwt = require('jsonwebtoken');
const User = require('../models/User');  

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
} catch (err) {
  console.error('JWT Verification Error:', err.message); // Log the error message
  return res.status(401).json({ message: 'Invalid token' });
}

};

module.exports = authMiddleware;
