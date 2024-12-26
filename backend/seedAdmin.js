const bcrypt = require('bcrypt');
const User = require('./models/User'); // Import your User model

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin account already exists');
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create the admin user
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      phoneNumber: '0000000000',
      address: 'Admin Office',
    });

    await admin.save();
    console.log('Admin account created successfully');
  } catch (error) {
    console.error('Error seeding admin account:', error.message);
  }
};

module.exports = seedAdmin;
