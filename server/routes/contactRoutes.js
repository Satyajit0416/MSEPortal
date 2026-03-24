const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @route POST /api/contact
// @desc  Submit a contact/support message
// @access Public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const contact = await Contact.create({ name, email, subject, message });

    // In a real app, you might send an email to support or notify admins here

    res.status(201).json({ message: 'Message received', contact });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;

module.exports = router;
