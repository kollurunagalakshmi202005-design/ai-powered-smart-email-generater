const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getStatus } = require('./config/db');
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/email');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (with automatic graceful in-memory fallback)
connectDB();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health and System Diagnostics
app.get('/api/health', (req, res) => {
  const dbStatus = getStatus();
  res.status(200).json({
    success: true,
    message: 'AI-Powered Smart Email Generator API is running smoothly.',
    system: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStatus.type,
      aiEngine: process.env.GEMINI_API_KEY ? 'Google Gemini API' : 'High-Fidelity Contextual Mock AI',
    }
  });
});

// Mount Routes as specified in SRS Section 4.2
app.use('/api/auth', authRoutes);
// Mount for both /api/email and /api/emails to support exact SRS paths:
// POST /api/email/generate AND POST /api/emails / GET /api/emails
app.use('/api/email', emailRoutes);
app.use('/api/emails', emailRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` AI-Powered Smart Email Generator Server`);
    console.log(` Running on port: http://localhost:${PORT}`);
    console.log(` Health check:    http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

module.exports = app;
