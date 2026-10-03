const mongoose = require('mongoose');

const allowedEmailTypes = [
  'Leave Request',
  'Permission Request',
  'Complaint',
  'Job/Internship',
  'Thank You',
  'General Request'
];

const allowedTones = ['Formal', 'Professional', 'Friendly', 'Polite'];

const emailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    purpose: {
      type: String,
      required: [true, 'Purpose is required'],
      trim: true,
    },
    emailType: {
      type: String,
      required: [true, 'Email type is required'],
      enum: {
        values: allowedEmailTypes,
        message: '{VALUE} is not a supported email type',
      },
    },
    tone: {
      type: String,
      required: [true, 'Tone is required'],
      enum: {
        values: allowedTones,
        message: '{VALUE} is not a supported tone',
      },
    },
    subject: {
      type: String,
      required: [true, 'Generated subject is required'],
      trim: true,
    },
    generatedContent: {
      type: String,
      required: [true, 'Generated content is required'],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = {
  Email: mongoose.models.Email || mongoose.model('Email', emailSchema),
  allowedEmailTypes,
  allowedTones,
};
