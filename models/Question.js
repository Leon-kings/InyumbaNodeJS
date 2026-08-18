// const mongoose = require("mongoose");

// const questionSchema = new mongoose.Schema(
//   {
//     // =================================================
//     // USER INFORMATION
//     // =================================================
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       trim: true,
//       lowercase: true,
//     },
//     phone: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     // =================================================
//     // QUESTION DETAILS
//     // =================================================
//     question: {
//       type: String,
//       required: [true, "Question is required"],
//       trim: true,
//       minlength: [10, "Question must be at least 10 characters"],
//     },
//     category: {
//       type: String,
//       enum: ["general", "house", "booking", "payment", "technical", "other"],
//       default: "general",
//     },

//     // =================================================
//     // STATUS
//     // =================================================
//     status: {
//       type: String,
//       enum: ["pending", "answered", "replied", "archived"],
//       default: "pending",
//     },
//     priority: {
//       type: String,
//       enum: ["low", "normal", "high", "urgent"],
//       default: "normal",
//     },

//     // =================================================
//     // REPLY
//     // =================================================
//     replyMessage: {
//       type: String,
//       default: null,
//     },
//     repliedAt: {
//       type: Date,
//       default: null,
//     },
//     repliedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     // =================================================
//     // METADATA
//     // =================================================
//     ipAddress: {
//       type: String,
//       default: null,
//     },
//     userAgent: {
//       type: String,
//       default: null,
//     },
//     readAt: {
//       type: Date,
//       default: null,
//     },

//     // =================================================
//     // IS ACTIVE
//     // =================================================
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // =================================================
// // INDEXES
// // =================================================
// questionSchema.index({ email: 1, createdAt: -1 });
// questionSchema.index({ status: 1, createdAt: -1 });
// questionSchema.index({ category: 1, createdAt: -1 });
// questionSchema.index({ userId: 1, createdAt: -1 });
// questionSchema.index({ priority: 1, status: 1 });

// // =================================================
// // VIRTUALS
// // =================================================
// questionSchema.virtual("timeAgo").get(function () {
//   const now = new Date();
//   const diff = Math.floor((now - this.createdAt) / 1000);

//   if (diff < 60) return `${diff} seconds ago`;
//   if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
//   if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
//   return `${Math.floor(diff / 604800)} weeks ago`;
// });

// questionSchema.virtual("isAnswered").get(function () {
//   return this.status === "answered" || this.status === "replied";
// });

// // =================================================
// // STATIC METHODS
// // =================================================
// questionSchema.statics.getStatistics = async function () {
//   const total = await this.countDocuments();
//   const pending = await this.countDocuments({ status: "pending" });
//   const answered = await this.countDocuments({ status: "answered" });
//   const replied = await this.countDocuments({ status: "replied" });
//   const archived = await this.countDocuments({ status: "archived" });

//   const byCategory = await this.aggregate([
//     { $group: { _id: "$category", count: { $sum: 1 } } },
//     { $sort: { count: -1 } },
//   ]);

//   const byPriority = await this.aggregate([
//     { $group: { _id: "$priority", count: { $sum: 1 } } },
//   ]);

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const todayQuestions = await this.countDocuments({
//     createdAt: { $gte: today },
//   });

//   const weekAgo = new Date();
//   weekAgo.setDate(weekAgo.getDate() - 7);
//   const weekQuestions = await this.countDocuments({
//     createdAt: { $gte: weekAgo },
//   });

//   return {
//     total,
//     pending,
//     answered,
//     replied,
//     archived,
//     byCategory,
//     byPriority,
//     todayQuestions,
//     weekQuestions,
//   };
// };

// // =================================================
// // MODEL EXPORT
// // =================================================
// const Question =
//   mongoose.models.Question || mongoose.model("Question", questionSchema);

// module.exports = Question;









const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // =================================================
    // NOTIFICATION TYPE
    // =================================================
    type: {
      type: String,
      enum: [
        'question_created',
        'question_answered',
        'question_archived',
        'question_updated',
        'question_deleted',
        'question_assigned',
        'question_escalated',
        'question_closed',
        'question_reopened',
        'question_replied',
        'comment_added',
        'status_changed',
        'priority_changed',
        'system_notification',
        'user_mentioned',
        'reminder'
      ],
      required: [true, 'Notification type is required'],
      index: true,
    },

    // =================================================
    // QUESTION REFERENCES
    // =================================================
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: false,
    },
    questionName: {
      type: String,
      required: false,
      trim: true,
    },
    questionEmail: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },

    // =================================================
    // USER INFORMATION
    // =================================================
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userName: {
      type: String,
      required: false,
      trim: true,
    },
    userEmail: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    userRole: {
      type: String,
      enum: ["admin", "manager", "user", "superadmin", "support", "guest"],
      required: false,
    },

    // =================================================
    // NOTIFICATION CONTENT
    // =================================================
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: 2000,
    },

    // =================================================
    // STATUS & PRIORITY
    // =================================================
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ["new", "read", "dismissed", "archived", "actioned"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent", "critical"],
      default: "normal",
    },

    // =================================================
    // TARGETING
    // =================================================
    targetRoles: {
      type: [String],
      enum: ["admin", "manager", "user", "superadmin", "support", "guest", "all"],
      required: true,
      default: ["user"],
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    targetUserEmail: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    targetUserRole: {
      type: String,
      enum: ["admin", "manager", "user", "superadmin", "support", "guest"],
      required: false,
    },

    // =================================================
    // SCOPE & READ RECEIPTS
    // =================================================
    isGlobal: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      required: false,
    },
    readBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        userEmail: {
          type: String,
          trim: true,
          lowercase: true,
        },
        userRole: {
          type: String,
          enum: ["admin", "manager", "user", "superadmin", "support", "guest"],
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // =================================================
    // EXPIRY
    // =================================================
    expiresAt: {
      type: Date,
      required: false,
    },

    // =================================================
    // METADATA
    // =================================================
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // =================================================
    // ACTIONS
    // =================================================
    actions: {
      type: [
        {
          label: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
          method: {
            type: String,
            enum: ["GET", "POST", "PUT", "DELETE"],
            default: "GET",
          },
          type: {
            type: String,
            enum: ["primary", "secondary", "danger", "success", "warning"],
            default: "primary",
          },
        },
      ],
      default: [],
    },

    // =================================================
    // CREATOR INFO
    // =================================================
    createdBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      userName: {
        type: String,
        trim: true,
      },
      userEmail: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },

    // =================================================
    // SYSTEM FIELDS
    // =================================================
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// =================================================
// INDEXES
// =================================================
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ isRead: 1, createdAt: -1 });
notificationSchema.index({ targetRoles: 1, isRead: 1 });
notificationSchema.index({ targetUserId: 1, isRead: 1 });
notificationSchema.index({ targetUserEmail: 1, isRead: 1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ status: 1, createdAt: -1 });
notificationSchema.index({ priority: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// =================================================
// VIRTUALS
// =================================================
notificationSchema.virtual("timeAgo").get(function () {
  const diff = Date.now() - this.createdAt.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return this.createdAt.toLocaleDateString();
});

notificationSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

notificationSchema.virtual("isExpired").get(function () {
  if (!this.expiresAt) return false;
  return this.expiresAt < new Date();
});

notificationSchema.virtual("isActionable").get(function () {
  return this.actions && this.actions.length > 0;
});

// =================================================
// METHODS
// =================================================
notificationSchema.methods.markAsRead = async function (user) {
  this.isRead = true;
  this.status = "read";
  this.readAt = new Date();

  if (!this.readBy) {
    this.readBy = [];
  }

  this.readBy.push({
    userId: user?.id || null,
    userEmail: user?.email || null,
    userRole: user?.role || null,
    readAt: new Date(),
  });

  return await this.save();
};

notificationSchema.methods.markAsUnread = async function () {
  this.isRead = false;
  this.status = "new";
  this.readAt = null;
  return await this.save();
};

notificationSchema.methods.addAction = function (action) {
  if (!this.actions) {
    this.actions = [];
  }
  this.actions.push(action);
  return this;
};

notificationSchema.methods.dismiss = async function () {
  this.status = "dismissed";
  return await this.save();
};

notificationSchema.methods.archive = async function () {
  this.status = "archived";
  this.isActive = false;
  return await this.save();
};

notificationSchema.methods.isTargetedForUser = function (user) {
  if (this.isGlobal) return true;
  if (this.targetUserId && this.targetUserId.toString() === user.id) return true;
  if (this.targetUserEmail && this.targetUserEmail === user.email) return true;
  if (this.targetRoles && this.targetRoles.includes(user.role)) return true;
  if (this.userId && this.userId.toString() === user.id) return true;
  return false;
};

// =================================================
// STATIC METHODS
// =================================================
notificationSchema.statics.getUnreadCount = async function (user) {
  const filter = {
    isRead: false,
    isActive: true,
    $or: [
      { targetRoles: { $in: [user.role] } },
      { targetUserId: user.id },
      { targetUserEmail: user.email },
      { userId: user.id },
      { isGlobal: true },
    ],
  };

  return await this.countDocuments(filter);
};

notificationSchema.statics.markAllAsRead = async function (user) {
  const filter = {
    isRead: false,
    isActive: true,
    $or: [
      { targetRoles: { $in: [user.role] } },
      { targetUserId: user.id },
      { targetUserEmail: user.email },
      { userId: user.id },
      { isGlobal: true },
    ],
  };

  const result = await this.updateMany(
    filter,
    {
      $set: {
        isRead: true,
        status: "read",
        readAt: new Date(),
      },
    }
  );

  return result;
};

notificationSchema.statics.getForUser = async function (user, options = {}) {
  const {
    page = 1,
    limit = 20,
    isRead,
    status,
    type,
    priority,
    startDate,
    endDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  const filter = {
    isActive: true,
    $or: [
      { targetRoles: { $in: [user.role] } },
      { targetUserId: user.id },
      { targetUserEmail: user.email },
      { userId: user.id },
      { isGlobal: true },
    ],
  };

  if (isRead !== undefined) {
    filter.isRead = isRead === "true" || isRead === true;
  }

  if (status) {
    filter.status = status;
  }

  if (type) {
    filter.type = type;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (startDate) {
    filter.createdAt = { $gte: new Date(startDate) };
  }

  if (endDate) {
    filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  const [notifications, total, unreadCount] = await Promise.all([
    this.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    this.countDocuments(filter),
    this.countDocuments({ ...filter, isRead: false }),
  ]);

  return {
    notifications,
    total,
    unreadCount,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(total / parseInt(limit)),
  };
};

notificationSchema.statics.createNotification = async function (data) {
  const notificationData = {
    ...data,
    status: data.status || "new",
    priority: data.priority || "normal",
    isRead: false,
    isActive: true,
  };

  const notification = new this(notificationData);
  return await notification.save();
};

// Get notifications by type
notificationSchema.statics.getByType = async function (type, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    this.find({ type, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments({ type, isActive: true }),
  ]);

  return {
    notifications,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Get notifications by role
notificationSchema.statics.getByRole = async function (role, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    this.find({ 
      targetRoles: { $in: [role] },
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments({ 
      targetRoles: { $in: [role] },
      isActive: true,
    }),
  ]);

  return {
    notifications,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Get notifications by user ID
notificationSchema.statics.getByUserId = async function (userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    this.find({ 
      userId: userId,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments({ 
      userId: userId,
      isActive: true,
    }),
  ]);

  return {
    notifications,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Get unread notifications for user
notificationSchema.statics.getUnreadForUser = async function (user, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const filter = {
    isRead: false,
    isActive: true,
    $or: [
      { targetRoles: { $in: [user.role] } },
      { targetUserId: user.id },
      { targetUserEmail: user.email },
      { userId: user.id },
      { isGlobal: true },
    ],
  };

  const [notifications, total] = await Promise.all([
    this.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments(filter),
  ]);

  return {
    notifications,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Get notification statistics
notificationSchema.statics.getStatistics = async function () {
  const total = await this.countDocuments({ isActive: true });
  const unread = await this.countDocuments({ isRead: false, isActive: true });
  const read = await this.countDocuments({ isRead: true, isActive: true });

  const byType = await this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$type", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const byRole = await this.aggregate([
    { $match: { isActive: true } },
    { $unwind: "$targetRoles" },
    { $group: { _id: "$targetRoles", count: { $sum: 1 } } },
  ]);

  const byPriority = await this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayNotifications = await this.countDocuments({
    createdAt: { $gte: today },
    isActive: true,
  });

  return {
    total,
    unread,
    read,
    byType,
    byRole,
    byPriority,
    todayNotifications,
  };
};

// =================================================
// PRE-SAVE MIDDLEWARE
// =================================================
notificationSchema.pre("save", function (next) {
  // If isRead is set to true, set readAt
  if (this.isRead && !this.readAt) {
    this.readAt = new Date();
  }

  // If status is read but isRead is false, fix it
  if (this.status === "read" && !this.isRead) {
    this.isRead = true;
    if (!this.readAt) {
      this.readAt = new Date();
    }
  }

  // Ensure readBy entries have readAt
  if (this.readBy && this.readBy.length > 0) {
    this.readBy.forEach((entry) => {
      if (!entry.readAt) {
        entry.readAt = new Date();
      }
    });
  }

  // If targetRoles is not set, set default based on userRole
  if (!this.targetRoles || this.targetRoles.length === 0) {
    if (this.userRole) {
      this.targetRoles = [this.userRole];
    } else {
      this.targetRoles = ["user"];
    }
  }

  // If message is too long, truncate
  if (this.message && this.message.length > 2000) {
    this.message = this.message.substring(0, 1997) + "...";
  }

  next();
});

// =================================================
// MODEL EXPORT
// =================================================
const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

module.exports = Notification;