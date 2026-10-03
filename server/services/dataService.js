const User = require('../models/User');
const { Email } = require('../models/Email');
const memoryStore = require('../config/memoryStore');
const { getStatus } = require('../config/db');

// Unified Data Service that abstracts Mongoose and MemoryStore
const dataService = {
  users: {
    findByEmail: async (email) => {
      const { isConnected } = getStatus();
      if (isConnected) {
        return await User.findOne({ email: email.toLowerCase().trim() });
      }
      return await memoryStore.users.findOne({ email: email.toLowerCase().trim() });
    },
    findById: async (id) => {
      const { isConnected } = getStatus();
      if (isConnected) {
        return await User.findById(id).select('-password');
      }
      const user = await memoryStore.users.findById(id);
      if (user) {
        const { password, ...rest } = user;
        return rest;
      }
      return null;
    },
    create: async ({ name, email, password }) => {
      const { isConnected } = getStatus();
      if (isConnected) {
        const newUser = new User({ name, email, password });
        return await newUser.save();
      }
      return await memoryStore.users.create({ name, email, password });
    },
  },

  emails: {
    findUserEmails: async (userId) => {
      const { isConnected } = getStatus();
      if (isConnected) {
        return await Email.find({ userId }).sort({ createdAt: -1 });
      }
      return await memoryStore.emails.find({ userId });
    },
    findById: async (id) => {
      const { isConnected } = getStatus();
      if (isConnected) {
        return await Email.findById(id);
      }
      return await memoryStore.emails.findById(id);
    },
    findDuplicate: async (userId, subject, generatedContent) => {
      const { isConnected } = getStatus();
      if (isConnected) {
        return await Email.findOne({ userId, subject, generatedContent });
      }
      const userEmails = await memoryStore.emails.find({ userId });
      return userEmails.find(e => e.subject === subject && e.generatedContent === generatedContent) || null;
    },
    create: async (emailData) => {
      const { isConnected } = getStatus();
      if (isConnected) {
        const email = new Email(emailData);
        return await email.save();
      }
      return await memoryStore.emails.create(emailData);
    },
    deleteById: async (id) => {
      const { isConnected } = getStatus();
      if (isConnected) {
        return await Email.findByIdAndDelete(id);
      }
      return await memoryStore.emails.findByIdAndDelete(id);
    }
  }
};

module.exports = dataService;
