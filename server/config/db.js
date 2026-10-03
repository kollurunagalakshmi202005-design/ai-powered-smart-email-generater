const mongoose = require('mongoose');

let isConnected = false;
let isInMemoryFallback = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-email-generator';

  // Attempt connection with short timeout so it doesn't block startup if MongoDB is not installed
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500, // 2.5 seconds timeout
    });
    isConnected = true;
    isInMemoryFallback = false;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    isInMemoryFallback = true;
    console.warn(`[Database] Warning: Could not connect to MongoDB at "${mongoURI}".`);
    console.log(`[Database] Notice: Activated In-Memory Resilience Fallback. App will run seamlessly without local MongoDB.`);
  }
};

const getStatus = () => ({
  isConnected,
  isInMemoryFallback,
  type: isConnected ? 'MongoDB' : 'In-Memory Store',
});

module.exports = { connectDB, getStatus };
