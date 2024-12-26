// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// // Register a new user
// // const registerUser = async (req, res) => {
// //   const { firstName, lastName, email, password, role, phoneNumber, address } = req.body;

// //   try {
// //     // Check if the email already exists
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ message: 'Email already in use' });
// //     }

// //     // Hash the password
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     // Create the new user
// //     const user = new User({
// //       firstName,
// //       lastName,
// //       email,
// //       password: hashedPassword,
// //       role: role || 'customer', // Default role to 'customer'
// //       phoneNumber,
// //       address,
// //     });

// // Register a new user
// const registerUser = async (req, res) => {
//   const { firstName, lastName, email, password, role, phoneNumber, address } = req.body;

//   // Validation logic
//   const errors = [];

//   // First Name validation
//   if (!/^[a-zA-Z]{2,50}$/.test(firstName)) {
//     errors.push('First name must be 2-50 alphabetic characters.');
//   }

//   // Last Name validation
//   if (!/^[a-zA-Z]{2,50}$/.test(lastName)) {
//     errors.push('Last name must be 2-50 alphabetic characters.');
//   }

//   // Email validation
//   if (!/^\S+@\S+\.\S+$/.test(email)) {
//     errors.push('Invalid email format.');
//   }

//   // Password validation
//   if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
//     errors.push('Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character.');
//   }

//   // Phone Number validation (Bahrain-specific)
//   if (!/^\d{8}$/.test(phoneNumber)) {
//     errors.push('Phone number must be exactly 8 digits.');
//   }

//   // Address validation
//   if (address.length < 10 || address.length > 200) {
//     errors.push('Address must be between 10 and 200 characters.');
//   }

//   // Return errors if any
//   if (errors.length > 0) {
//     return res.status(400).json({ errors });
//   }

//   try {
//     // Check if the email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already in use' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the new user
//     const user = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       role: role || 'customer', // Default role to 'customer'
//       phoneNumber,
//       address,
//     });

//     // Save the user to the database
//     const savedUser = await user.save();

//     res.status(201).json({
//       message: 'User registered successfully',
//       user: {
//         id: savedUser._id,
//         firstName: savedUser.firstName,
//         lastName: savedUser.lastName,
//         email: savedUser.email,
//         role: savedUser.role,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

//     // Save the user to the database
//     const savedUser = await user.save();

//     res.status(201).json({
//       message: 'User registered successfully',
//       user: {
//         id: savedUser._id,
//         firstName: savedUser.firstName,
//         lastName: savedUser.lastName,
//         email: savedUser.email,
//         role: savedUser.role,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Login a user
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Compare the password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     // Generate a JWT
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.status(200).json({
//       message: 'Login successful',
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//       },
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// module.exports = { registerUser, loginUser };
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register a new user
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role, phoneNumber, address } = req.body;

  // First Name validation
  if (!/^[a-zA-Z]{2,50}$/.test(firstName)) {
    return res.status(400).json({ message: 'Invalid First name.' });
  }

  // Last Name validation
  if (!/^[a-zA-Z]{2,50}$/.test(lastName)) {
    return res.status(400).json({ message: 'Invalid Last name.' });
  }

  // Email validation
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // // Password validation
  // if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d@$!%*?&._-]{8,}$/.test(password)) {
  //   return res.status(400).json({ message: 'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character.' });
  // }
  
  // Password validation
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]{8,}$/.test(password)) {
    return res.status(400).json({ 
      message: 'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character from this list: " !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~".' 
    });
  }

  // Phone Number validation (Bahrain-specific)
  if (!/^\d{8}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Phone number must be exactly 8 digits.' });
  }

  // Address validation
  if (address.length < 10 || address.length > 200) {
    return res.status(400).json({ message: 'Invalid address format.' });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'customer', // Default role to 'customer'
      phoneNumber,
      address,
    });

    // Save the user to the database
    const savedUser = await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser };
