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
  },
  replyMessage: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===========================
// VIRTUALS
// ===========================

// Virtual for contact name with status
contactSchema.virtual('contactWithStatus').get(function() {
  return `${this.name} (${this.status})`;
});

// Virtual for notification message
contactSchema.virtual('notificationMessage').get(function() {
  const statusMessages = {
    pending: `📩 New contact from ${this.name} (${this.email})`,
    read: `👀 Contact from ${this.name} has been read`,
    replied: `✅ Reply sent to ${this.name} (${this.email})`,
    archived: `📦 Contact from ${this.name} has been archived`
  };
  return statusMessages[this.status] || `📩 New contact from ${this.name}`;
});

// Virtual for short message preview
contactSchema.virtual('messagePreview').get(function() {
  return this.message.length > 100 
    ? this.message.substring(0, 100) + '...' 
    : this.message;
});

// Virtual for response time
contactSchema.virtual('responseTime').get(function() {
  if (!this.repliedAt) return null;
  const diff = this.repliedAt - this.createdAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

// ===========================
// INDEXES
// ===========================

// Index for better query performance
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ createdAt: -1 });

// Compound index for search
contactSchema.index({
  name: 'text',
  email: 'text',
  message: 'text'
});

// ===========================
// STATIC METHODS
// ===========================

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
        byEmail: [
          {
            $group: {
              _id: '$email',
              count: { $sum: 1 },
              name: { $first: '$name' }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        recent: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 }
        ],
        pendingCount: [
          { $match: { status: 'pending' } },
          { $count: 'count' }
        ],
        avgResponseTime: [
          {
            $match: { 
              repliedAt: { $ne: null },
              status: 'replied'
            }
          },
          {
            $group: {
              _id: null,
              avgTime: {
                $avg: {
                  $subtract: ['$repliedAt', '$createdAt']
                }
              }
            }
          }
        ]
      }
    }
  ]);

  const result = stats[0];
  
  // Calculate average response time in hours
  let avgResponseTimeHours = 0;
  if (result.avgResponseTime[0]?.avgTime) {
    avgResponseTimeHours = (result.avgResponseTime[0].avgTime / (1000 * 60 * 60)).toFixed(1);
  }

  return {
    total: result.total[0]?.count || 0,
    pending: result.byStatus.find(s => s._id === 'pending')?.count || 0,
    read: result.byStatus.find(s => s._id === 'read')?.count || 0,
    replied: result.byStatus.find(s => s._id === 'replied')?.count || 0,
    archived: result.byStatus.find(s => s._id === 'archived')?.count || 0,
    byDate: result.byDate,
    byEmail: result.byEmail,
    recent: result.recent,
    pendingCount: result.pendingCount[0]?.count || 0,
    avgResponseTime: avgResponseTimeHours
  };
};

// ===========================
// INSTANCE METHODS
// ===========================

// Get notification data for admin
contactSchema.methods.getAdminNotification = function() {
  return {
    type: 'contact_created',
    contactId: this._id,
    name: this.name,
    email: this.email,
    message: this.message,
    messagePreview: this.messagePreview,
    status: this.status,
    createdAt: this.createdAt,
    ipAddress: this.ipAddress,
    userAgent: this.userAgent,
    notificationMessage: `📩 New contact message from ${this.name} (${this.email})`,
    priority: this.status === 'pending' ? 'high' : 'normal',
    actionUrl: `/admin/contacts/${this._id}`
  };
};

// Get notification data for user (when replied)
contactSchema.methods.getUserNotification = function() {
  return {
    type: 'contact_replied',
    contactId: this._id,
    name: this.name,
    email: this.email,
    message: this.message,
    replyMessage: this.replyMessage,
    repliedAt: this.repliedAt,
    notificationMessage: `✅ Your message has been replied to by our team`,
    actionUrl: `/contact/${this._id}/view`
  };
};

// Get notification message based on action
contactSchema.methods.getNotificationMessage = function(action) {
  const messages = {
    created: `📩 New contact from ${this.name} (${this.email})`,
    read: `👀 Contact from ${this.name} has been marked as read`,
    replied: `✅ Reply sent to ${this.name} (${this.email})`,
    archived: `📦 Contact from ${this.name} has been archived`
  };
  return messages[action] || messages.created;
};

// Mark as read
contactSchema.methods.markAsRead = function() {
  if (this.status === 'pending') {
    this.status = 'read';
    this.readAt = new Date();
  }
  return this;
};

// Mark as replied
contactSchema.methods.markAsReplied = function(replyMessage) {
  this.status = 'replied';
  this.repliedAt = new Date();
  this.replyMessage = replyMessage;
  return this;
};

// Get response time in hours
contactSchema.methods.getResponseTimeHours = function() {
  if (!this.repliedAt) return null;
  const diff = this.repliedAt - this.createdAt;
  return (diff / (1000 * 60 * 60)).toFixed(1);
};

// ===========================
// QUERY HELPERS
// ===========================

// Query helper for pending contacts
contactSchema.query.pending = function() {
  return this.where('status').equals('pending');
};

// Query helper for unread contacts
contactSchema.query.unread = function() {
  return this.where('status').in(['pending', 'read']);
};

// Query helper by email
contactSchema.query.byEmail = function(email) {
  return this.where('email').regex(new RegExp(email, 'i'));
};

// Query helper by date range
contactSchema.query.byDateRange = function(startDate, endDate) {
  let query = this;
  if (startDate) query = query.where('createdAt').gte(new Date(startDate));
  if (endDate) query = query.where('createdAt').lte(new Date(endDate));
  return query;
};

// ===========================
// PRE-SAVE MIDDLEWARE (FIXED)
// ===========================

// Update timestamps on status change - Using function with explicit return
contactSchema.pre('save', function(next) {
  try {
    if (this.isModified('status')) {
      if (this.status === 'read' && !this.readAt) {
        this.readAt = new Date();
      }
      if (this.status === 'replied' && !this.repliedAt) {
        this.repliedAt = new Date();
      }
    }
    return next();
  } catch (error) {
    return next(error);
  }
});

// ===========================
// POST-SAVE MIDDLEWARE (For notifications)
// ===========================

// After save, trigger notification creation (optional)
contactSchema.post('save', function(doc) {
  // This runs after save - can be used for external notifications
  // Using setImmediate to avoid blocking
  setImmediate(() => {
    if (doc.isNew) {
      console.log(`📩 New contact saved: ${doc.name} (${doc.email})`);
    }
  });
});

module.exports = mongoose.model('Contact', contactSchema);