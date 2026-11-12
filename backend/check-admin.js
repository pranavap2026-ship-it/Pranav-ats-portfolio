require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const M = require('./models');

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    console.log('Admin email configured:', !!email);
    console.log('Admin password configured:', !!password);

    const admin = await M.Admin.findOne({ email }).select('+password');

    console.log('Admin account exists:', !!admin);

    if (admin) {
      console.log('Stored password hash exists:', !!admin.password);
      console.log(
        'Password matches .env:',
        await bcrypt.compare(password, admin.password)
      );
    }
  } catch (error) {
    console.error('Check failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdmin();