const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    index: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'replied', 'archived'],
    default: 'pending'
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  repliedAt: {
    type: Date,
    default: null
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1, createdAt: -1 });

// Static method to get statistics
contactSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $facet: {
        total: [{ $count: 'count' }],
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ],
        byDate: [
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 } 
            }
          },
          { $sort: { _id: -1 } },
          { $limit: 30 }
        ],
        recent: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 }
        ]
      }
    }
  ]);

  const result = stats[0];
  return {
    total: result.total[0]?.count || 0,
    pending: result.byStatus.find(s => s._id === 'pending')?.count || 0,
    read: result.byStatus.find(s => s._id === 'read')?.count || 0,
    replied: result.byStatus.find(s => s._id === 'replied')?.count || 0,
    archived: result.byStatus.find(s => s._id === 'archived')?.count || 0,
    byDate: result.byDate,
    recent: result.recent
  };
};

module.exports = mongoose.model('Contact', contactSchema);