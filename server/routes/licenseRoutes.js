const express = require('express');
const router = express.Router();
const License = require('../models/License');
const { authenticate } = require('../middleware/auth');

// @route   GET /api/licenses
// @desc    Get all licenses for the authenticated user
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const licenses = await License.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email businessName');
    
    res.json(licenses);
  } catch (error) {
    console.error('Get licenses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/licenses/:id
// @desc    Get a single license by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const license = await License.findById(req.params.id)
      .populate('userId', 'name email businessName');
    
    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    // Check if user owns this license or is admin
    if (license.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(license);
  } catch (error) {
    console.error('Get license error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/licenses
// @desc    Create a new license (for new applications)
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { type, issueDate, expiryDate, renewalFee } = req.body;

    // Generate unique license ID
    const licenseId = 'LIC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const license = new License({
      licenseId,
      userId: req.user._id,
      type,
      issueDate: issueDate || new Date(),
      expiryDate: expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      renewalFee: renewalFee || 1000,
      status: 'active'
    });

    await license.save();
    await license.populate('userId', 'name email businessName');

    res.status(201).json(license);
  } catch (error) {
    console.error('Create license error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

