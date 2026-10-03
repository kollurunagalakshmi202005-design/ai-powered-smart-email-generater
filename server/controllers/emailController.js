const dataService = require('../services/dataService');
const geminiService = require('../services/geminiService');
const { allowedEmailTypes, allowedTones } = require('../models/Email');

// @desc    Generate email using Gemini AI / Smart Mock Fallback
// @route   POST /api/email/generate
// @access  Protected (SRS FR-3, FR-4)
const generateEmail = async (req, res, next) => {
  try {
    const { purpose, emailType, tone } = req.body;

    // Field-level validations as per SRS Section 5.1
    if (!purpose || purpose.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide the purpose or key details for the email.',
        data: null,
      });
    }

    if (!emailType || !allowedEmailTypes.includes(emailType)) {
      return res.status(400).json({
        success: false,
        message: `Please select a valid email type. Allowed types: ${allowedEmailTypes.join(', ')}`,
        data: null,
      });
    }

    if (!tone || !allowedTones.includes(tone)) {
      return res.status(400).json({
        success: false,
        message: `Please select a valid tone. Allowed tones: ${allowedTones.join(', ')}`,
        data: null,
      });
    }

    // Call AI Generation Service (with smart fallback)
    const result = await geminiService.generateEmail({
      purpose: purpose.trim(),
      emailType,
      tone,
    });

    return res.status(200).json({
      success: true,
      message: 'Email generated successfully.',
      data: {
        purpose: purpose.trim(),
        emailType,
        tone,
        subject: result.subject,
        generatedContent: result.generatedContent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save generated email to user's account
// @route   POST /api/emails
// @access  Protected (SRS FR-5.4, FR-5.5)
const saveEmail = async (req, res, next) => {
  try {
    const { purpose, emailType, tone, subject, generatedContent } = req.body;

    if (!purpose || !emailType || !tone || !subject || !generatedContent) {
      return res.status(400).json({
        success: false,
        message: 'Incomplete email data. All fields are required to save.',
        data: null,
      });
    }

    // Duplicate Prevention as per SRS Section 3.2.5 (FR-5.5)
    const existingDuplicate = await dataService.emails.findDuplicate(
      req.user._id,
      subject.trim(),
      generatedContent.trim()
    );

    if (existingDuplicate) {
      return res.status(400).json({
        success: false,
        message: 'This email draft is already saved in your history.',
        data: null,
      });
    }

    // Persist email
    const savedEmail = await dataService.emails.create({
      userId: req.user._id,
      purpose: purpose.trim(),
      emailType,
      tone,
      subject: subject.trim(),
      generatedContent: generatedContent.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Email saved to your personal history.',
      data: savedEmail,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved emails for the logged-in user
// @route   GET /api/emails
// @access  Protected (SRS FR-6.1, FR-6.2, FR-6.6)
const getSavedEmails = async (req, res, next) => {
  try {
    const emails = await dataService.emails.findUserEmails(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Saved emails retrieved successfully.',
      data: emails,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single saved email by ID
// @route   GET /api/emails/:id
// @access  Protected (SRS FR-6.3, FR-6.6)
const getEmailById = async (req, res, next) => {
  try {
    const email = await dataService.emails.findById(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found.',
        data: null,
      });
    }

    // Authorization check: Ensure only owner can access (FR-6.6)
    if (email.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: You can only view your own saved emails.',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email retrieved successfully.',
      data: email,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a saved email
// @route   DELETE /api/emails/:id
// @access  Protected (SRS FR-6.5, FR-6.6)
const deleteEmail = async (req, res, next) => {
  try {
    const email = await dataService.emails.findById(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found or already deleted.',
        data: null,
      });
    }

    // Access control check (FR-6.6)
    if (email.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: You cannot delete another user\'s email.',
        data: null,
      });
    }

    await dataService.emails.deleteById(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Email deleted successfully from history.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateEmail,
  saveEmail,
  getSavedEmails,
  getEmailById,
  deleteEmail,
};
