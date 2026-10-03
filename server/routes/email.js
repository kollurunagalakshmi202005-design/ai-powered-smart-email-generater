const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { protect } = require('../middleware/authMiddleware');

// Protected AI Email Generation (SRS FR-3, FR-4)
router.post('/generate', protect, emailController.generateEmail);

// Protected Email Management (SRS FR-5, FR-6)
router.post('/', protect, emailController.saveEmail);
router.get('/', protect, emailController.getSavedEmails);
router.get('/:id', protect, emailController.getEmailById);
router.delete('/:id', protect, emailController.deleteEmail);

module.exports = router;
