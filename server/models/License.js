const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
  licenseId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['trade', 'manufacturing', 'service', 'composite'],
    trim: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'renewed', 'cancelled'],
    default: 'active'
  },
  renewalFee: {
    type: Number,
    default: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
licenseSchema.index({ userId: 1 });
licenseSchema.index({ status: 1 });

module.exports = mongoose.model('License', licenseSchema);

