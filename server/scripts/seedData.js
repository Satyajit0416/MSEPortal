const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const License = require('../models/License');
const Application = require('../models/Application');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mse_license_portal';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await License.deleteMany({});
    await Application.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin User
    const admin = new User({
      name: 'Admin User',
      email: 'admin@mseportal.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created: admin@mseportal.com / admin123');

    // Create Sample MSE Users
    const users = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: 'user123',
        businessName: 'Rajesh Enterprises',
        businessType: 'Manufacturing',
        registrationNumber: 'REG-001',
        address: {
          street: '123 Industrial Area',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        phone: '9876543210'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: 'user123',
        businessName: 'Priya Trading Co.',
        businessType: 'Trade',
        registrationNumber: 'REG-002',
        address: {
          street: '456 Market Street',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        phone: '9876543211'
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        password: 'user123',
        businessName: 'Amit Services',
        businessType: 'Service',
        registrationNumber: 'REG-003',
        address: {
          street: '789 Service Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        },
        phone: '9876543212'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`User created: ${user.email} / user123`);
    }

    // Create Licenses for users
    const licenses = [];
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const types = ['trade', 'manufacturing', 'service'];
      const type = types[i % types.length];

      // Active license
      const activeLicense = new License({
        licenseId: `LIC-${Date.now()}-${i}A`,
        userId: user._id,
        type: type,
        issueDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000), // 300 days ago
        expiryDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000), // 65 days from now
        status: 'active',
        renewalFee: 1000 + (i * 100)
      });
      await activeLicense.save();
      licenses.push(activeLicense);
      console.log(`Active license created for ${user.email}`);

      // Expired license (for testing renewal)
      const expiredLicense = new License({
        licenseId: `LIC-${Date.now()}-${i}E`,
        userId: user._id,
        type: type,
        issueDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000), // 400 days ago
        expiryDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // Expired 35 days ago
        status: 'expired',
        renewalFee: 1000 + (i * 100)
      });
      await expiredLicense.save();
      licenses.push(expiredLicense);
      console.log(`Expired license created for ${user.email}`);
    }

    // Create Sample Applications
    const applications = [
      {
        userId: createdUsers[0]._id,
        licenseId: licenses.find(l => l.userId.toString() === createdUsers[0]._id.toString() && l.status === 'expired')._id,
        applicationType: 'renewal',
        status: 'pending',
        paymentStatus: 'pending',
        amount: 1000,
        documents: []
      },
      {
        userId: createdUsers[1]._id,
        licenseId: licenses.find(l => l.userId.toString() === createdUsers[1]._id.toString() && l.status === 'active')._id,
        applicationType: 'renewal',
        status: 'under_review',
        paymentStatus: 'completed',
        amount: 1100,
        documents: [
          {
            name: 'document1.pdf',
            filePath: '/uploads/sample-doc.pdf',
            uploadedAt: new Date()
          }
        ]
      },
      {
        userId: createdUsers[2]._id,
        licenseId: licenses.find(l => l.userId.toString() === createdUsers[2]._id.toString() && l.status === 'active')._id,
        applicationType: 'renewal',
        status: 'approved',
        paymentStatus: 'completed',
        amount: 1200,
        reviewedBy: admin._id,
        reviewedAt: new Date(),
        adminRemarks: 'All documents verified. Application approved.',
        documents: []
      }
    ];

    for (const appData of applications) {
      const application = new Application(appData);
      await application.save();
      console.log(`Application created for user ${appData.userId}`);
    }

    console.log('\n✅ Seed data created successfully!');
    console.log('\nSample Login Credentials:');
    console.log('Admin: admin@mseportal.com / admin123');
    console.log('User 1: rajesh@example.com / user123');
    console.log('User 2: priya@example.com / user123');
    console.log('User 3: amit@example.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

