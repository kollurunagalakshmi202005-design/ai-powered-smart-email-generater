const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public auth routes (SRS FR-1, FR-2)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected session route
router.get('/me', protect, authController.getMe);

module.exports = router;
