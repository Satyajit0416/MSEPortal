const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const License = require('../models/License');
const User = require('../models/User');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorizeAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const underReviewApplications = await Application.countDocuments({ status: 'under_review' });
    const approvedApplications = await Application.countDocuments({ status: 'approved' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });
    const totalUsers = await User.countDocuments({ role: 'mse_user' });
    const totalLicenses = await License.countDocuments();

    res.json({
      stats: {
        totalApplications,
        pendingApplications,
        underReviewApplications,
        approvedApplications,
        rejectedApplications,
        totalUsers,
        totalLicenses
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/applications
// @desc    Get all applications (admin view)
// @access  Private (Admin)
router.get('/applications', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};

    const applications = await Application.find(filter)
      .populate('userId', 'name email businessName businessType registrationNumber')
      .populate('licenseId', 'licenseId type issueDate expiryDate')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(filter);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/applications/:id/approve
// @desc    Approve an application
// @access  Private (Admin)
router.put('/applications/:id/approve', async (req, res) => {
  try {
    const { adminRemarks } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('licenseId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status === 'approved') {
      return res.status(400).json({ message: 'Application already approved' });
    }

    // Update application status
    application.status = 'approved';
    application.adminRemarks = adminRemarks || 'Application approved';
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();

    // If it's a renewal, update the license
    if (application.applicationType === 'renewal' && application.licenseId) {
      const license = await License.findById(application.licenseId);
      if (license) {
        const newExpiryDate = new Date();
        newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1); // Extend by 1 year
        license.expiryDate = newExpiryDate;
        license.status = 'active';
        await license.save();
      }
    }

    await application.save();
    await application.populate('userId', 'name email businessName');
    await application.populate('licenseId', 'licenseId type expiryDate');

    res.json({
      message: 'Application approved successfully',
      application
    });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/applications/:id/reject
// @desc    Reject an application
// @access  Private (Admin)
router.put('/applications/:id/reject', async (req, res) => {
  try {
    const { adminRemarks } = req.body;

    if (!adminRemarks) {
      return res.status(400).json({ message: 'Admin remarks are required for rejection' });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status === 'rejected') {
      return res.status(400).json({ message: 'Application already rejected' });
    }

    application.status = 'rejected';
    application.adminRemarks = adminRemarks;
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();

    await application.save();
    await application.populate('userId', 'name email businessName');
    await application.populate('licenseId', 'licenseId type expiryDate');

    res.json({
      message: 'Application rejected',
      application
    });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'mse_user' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/licenses
// @desc    Get all licenses
// @access  Private (Admin)
router.get('/licenses', async (req, res) => {
  try {
    const licenses = await License.find()
      .populate('userId', 'name email businessName')
      .sort({ createdAt: -1 });

    res.json(licenses);
  } catch (error) {
    console.error('Get licenses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/licenses/:id/fee
// @desc    Update license renewal fee
// @access  Private (Admin)
router.put('/licenses/:id/fee', async (req, res) => {
  try {
    const { renewalFee } = req.body;

    if (!renewalFee || renewalFee < 0) {
      return res.status(400).json({ message: 'Valid renewal fee is required' });
    }

    const license = await License.findById(req.params.id);

    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    license.renewalFee = renewalFee;
    await license.save();

    res.json({
      message: 'Renewal fee updated successfully',
      license
    });
  } catch (error) {
    console.error('Update fee error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

