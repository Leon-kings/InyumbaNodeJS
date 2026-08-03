const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    trim: true
  },
  image: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    secure_url: {
      type: String,
      required: true
    }
  },
  social: {
    linkedin: {
      type: String,
      trim: true,
      default: '#'
    },
    twitter: {
      type: String,
      trim: true,
      default: '#'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);