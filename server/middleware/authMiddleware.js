const jwt = require('jsonwebtoken');
const dataService = require('../services/dataService');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'ai_smart_email_generator_secure_jwt_secret_key_2026'
      );

      const user = await dataService.users.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
          data: null,
        });
      }

      // Attach user to request
      req.user = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
      };

      return next();
    } catch (error) {
      console.warn('[Auth Middleware] Invalid or expired token:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.',
        data: null,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.',
      data: null,
    });
  }
};

module.exports = { protect };
