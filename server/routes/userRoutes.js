const express = require('express');
const router = express.Router();
const User = require('../models/User');
const License = require('../models/License');
const Application = require('../models/Application');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, async (req, res) => {
  try {
    console.log('Update profile body:', req.body);
    const { name, businessName, businessType, registrationNumber, address, phone, description } = req.body;

    console.log('Update profile body (description):', description);

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (businessName !== undefined) user.businessName = businessName;
    if (businessType !== undefined) user.businessType = businessType;
    if (registrationNumber !== undefined) user.registrationNumber = registrationNumber;
    if (address !== undefined) {
      // Accept either a string (saved as { street }) or an object
      if (typeof address === 'string') {
        user.address = { street: address };
      } else if (typeof address === 'object') {
        user.address = address;
      }
    }
    if (phone !== undefined) user.phone = phone;
    if (description !== undefined) user.description = description;

    await user.save();
    console.log(`Profile saved for user ${user._id}: description=`, user.description);

    res.json({
      message: 'Profile updated successfully',
      user: await User.findById(req.user._id).select('-password')
    });
  } catch (error) {
    console.error('Update profile error:', error);
    // Return the actual error message to assist debugging (safe in dev)
    res.status(500).json({ message: error.message || 'Server error', error: error.message });
  }
});

// @route   POST /api/users/profile/logo
// @desc    Upload business logo
// @access  Private
router.post('/profile/logo', authenticate, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const filePath = `/uploads/${req.file.filename}`; // served statically
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.logoUrl = filePath;
    await user.save();

    res.json({ message: 'Logo uploaded', logoUrl: filePath, user: await User.findById(req.user._id).select('-password') });
  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const licenses = await License.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const applications = await Application.find({ userId: req.user._id })
      .populate('licenseId', 'licenseId type')
      .sort({ createdAt: -1 })
      .limit(5);

    const activeLicenses = licenses.filter(lic => lic.status === 'active').length;
    const expiredLicenses = licenses.filter(lic => lic.status === 'expired').length;
    const pendingApplications = await Application.countDocuments({
      userId: req.user._id,
      status: { $in: ['pending', 'under_review'] }
    });

    // Find licenses expiring in next 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiringSoon = await License.find({
      userId: req.user._id,
      status: 'active',
      expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
    });

    res.json({
      stats: {
        totalLicenses: licenses.length,
        activeLicenses,
        expiredLicenses,
        pendingApplications,
        expiringSoon: expiringSoon.length
      },
      recentLicenses: licenses,
      recentApplications: applications,
      expiringSoon
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

