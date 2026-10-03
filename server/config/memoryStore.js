const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// In-Memory store arrays for zero-dependency execution
const users = [];
const emails = [];

const generateId = () => crypto.randomBytes(12).toString('hex');

const memoryStore = {
  users: {
    find: async (query = {}) => {
      return users.filter(u => {
        for (const key of Object.keys(query)) {
          if (u[key] !== query[key]) return false;
        }
        return true;
      });
    },
    findOne: async (query = {}) => {
      return users.find(u => {
        for (const key of Object.keys(query)) {
          if (key === 'email' && u.email && query.email) {
            if (u.email.toLowerCase() !== query.email.toLowerCase()) return false;
          } else if (u[key] !== query[key]) {
            return false;
          }
        }
        return true;
      }) || null;
    },
    findById: async (id) => {
      return users.find(u => u._id.toString() === id.toString()) || null;
    },
    create: async (userData) => {
      const newUser = {
        _id: generateId(),
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        createdAt: new Date(),
      };
      users.push(newUser);
      return newUser;
    },
  },
  emails: {
    find: async (query = {}) => {
      let filtered = emails.filter(e => {
        for (const key of Object.keys(query)) {
          if (key === 'userId') {
            if (e.userId.toString() !== query.userId.toString()) return false;
          } else if (e[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
      // Sort newest first by createdAt
      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    findOne: async (query = {}) => {
      return emails.find(e => {
        for (const key of Object.keys(query)) {
          if (key === 'userId') {
            if (e.userId.toString() !== query.userId.toString()) return false;
          } else if (e[key] !== query[key]) {
            return false;
          }
        }
        return true;
      }) || null;
    },
    findById: async (id) => {
      return emails.find(e => e._id.toString() === id.toString()) || null;
    },
    create: async (emailData) => {
      const newEmail = {
        _id: generateId(),
        userId: emailData.userId,
        purpose: emailData.purpose,
        emailType: emailData.emailType,
        tone: emailData.tone,
        subject: emailData.subject,
        generatedContent: emailData.generatedContent,
        createdAt: new Date(),
      };
      emails.push(newEmail);
      return newEmail;
    },
    findByIdAndDelete: async (id) => {
      const index = emails.findIndex(e => e._id.toString() === id.toString());
      if (index !== -1) {
        const removed = emails.splice(index, 1);
        return removed[0];
      }
      return null;
    }
  }
};

module.exports = memoryStore;
