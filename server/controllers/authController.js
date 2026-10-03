const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dataService = require('../services/dataService');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'ai_smart_email_generator_secure_jwt_secret_key_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (SRS FR-1)
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation as per SRS Section 3.2.1 (FR-1) & Section 5.1
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Name is required.',
        data: null,
      });
    }

    if (!email || email.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
        data: null,
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
        data: null,
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
        data: null,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
        data: null,
      });
    }

    // Check if user already exists
    const existingUser = await dataService.users.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email is already registered.',
        data: null,
      });
    }

    // Hash password if using memory fallback (Mongoose model has pre-save hook)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const user = await dataService.users.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        token,
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public (SRS FR-2)
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
        data: null,
      });
    }

    const user = await dataService.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        data: null,
      });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        token,
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Protected
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully.',
    data: {
      user: req.user,
    },
  });
};

module.exports = {
  register,
  login,
  getMe,
};
