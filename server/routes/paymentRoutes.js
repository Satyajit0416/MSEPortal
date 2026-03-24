const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const License = require('../models/License');
const { authenticate } = require('../middleware/auth');
const crypto = require('crypto');

// Mock payment gateway for development
// In production, replace with actual Razorpay integration

// @route   POST /api/payments/create-order
// @desc    Create payment order
// @access  Private
router.post('/create-order', authenticate, async (req, res) => {
  try {
    const { applicationId } = req.body;

    const application = await Application.findById(applicationId)
      .populate('userId', 'name email')
      .populate('licenseId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check ownership
    if (application.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate mock order ID
    const orderId = 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Store order ID in application temporarily
    application.paymentId = orderId;
    await application.save();

    res.json({
      orderId,
      amount: application.amount,
      currency: 'INR',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify payment (mock verification)
// @access  Private
router.post('/verify', authenticate, async (req, res) => {
  try {
    const { applicationId, paymentId, paymentSignature } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check ownership
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mock verification - in production, verify with Razorpay
    // For now, accept any payment with paymentId
    if (paymentId && paymentId.startsWith('ORDER_')) {
      application.paymentStatus = 'completed';
      application.paymentId = paymentId;
      application.status = 'under_review'; // Move to under_review after payment
      await application.save();

      res.json({
        success: true,
        message: 'Payment verified successfully',
        application
      });
    } else {
      res.status(400).json({ message: 'Invalid payment' });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/payments/:applicationId
// @desc    Get payment status for an application
// @access  Private
router.get('/:applicationId', authenticate, async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .select('paymentStatus paymentId amount');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check ownership
    if (application.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      paymentStatus: application.paymentStatus,
      paymentId: application.paymentId,
      amount: application.amount
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

