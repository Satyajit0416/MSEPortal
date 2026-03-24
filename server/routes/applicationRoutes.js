const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const License = require('../models/License');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/applications
// @desc    Get all applications for the authenticated user
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
    
    const applications = await Application.find(filter)
      .populate('userId', 'name email businessName')
      .populate('licenseId', 'licenseId type expiryDate')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/applications/:id
// @desc    Get a single application by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('userId', 'name email businessName businessType registrationNumber address phone')
      .populate('licenseId', 'licenseId type issueDate expiryDate status renewalFee')
      .populate('reviewedBy', 'name email');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user owns this application or is admin
    if (application.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/applications
// @desc    Create a new application
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    console.log('Create application body:', req.body, 'user:', req.user?._id?.toString());
    const { licenseId, applicationType } = req.body;

    // Verify license exists and belongs to user (for renewal)
    if (applicationType === 'renewal') {
      const license = await License.findById(licenseId);
      if (!license) {
        console.warn('License not found for id:', licenseId);
        return res.status(404).json({ message: 'License not found' });
      }
      if (license.userId.toString() !== req.user._id.toString()) {
        console.warn('License does not belong to user:', req.user._id.toString());
        return res.status(403).json({ message: 'License does not belong to you' });
      }
    }

    // Check if there's already a pending application for this license
    const existingApplication = await Application.findOne({
      licenseId,
      status: { $in: ['pending', 'under_review'] }
    });

    if (existingApplication) {
      console.warn('Existing pending application found for license:', licenseId);
      return res.status(400).json({ message: 'An application for this license is already pending' });
    }

    const license = await License.findById(licenseId);
    const application = new Application({
      userId: req.user._id,
      licenseId,
      applicationType,
      amount: license?.renewalFee || 1000,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await application.save();
    await application.populate('userId', 'name email businessName');
    await application.populate('licenseId', 'licenseId type expiryDate');

    res.status(201).json(application);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: error.message || 'Server error', error: error.message });
  }
});

// @route   POST /api/applications/:id/upload
// @desc    Upload documents for an application
// @access  Private
router.post('/:id/upload', authenticate, upload.array('documents', 5), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check ownership
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add uploaded files to documents array
    if (req.files && req.files.length > 0) {
      const newDocuments = req.files.map(file => ({
        name: file.originalname,
        filePath: `/uploads/${file.filename}`,
        uploadedAt: new Date()
      }));

      application.documents = [...application.documents, ...newDocuments];
      await application.save();
    }

    res.json({ message: 'Documents uploaded successfully', application });
  } catch (error) {
    console.error('Upload documents error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (admin only, handled in admin routes)
// @access  Private (Admin)

module.exports = router;

