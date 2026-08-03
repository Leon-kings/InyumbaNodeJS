const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        // House notifications
        "house_created",
        "house_updated",
        "house_deleted",
        "house_status_changed",
        // Contact notifications
        "contact_created",
        "contact_read",
        "contact_replied",
        "contact_archived",
      ],
      required: true,
    },

    // ===========================
    // HOUSE FIELDS
    // ===========================
    houseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      default: null,
    },
    houseName: {
      type: String,
      default: null,
    },
    location: {
      province: String,
      district: String,
      sector: String,
    },

    // ===========================
    // CONTACT FIELDS
    // ===========================
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      default: null,
    },
    contactName: {
      type: String,
      default: null,
    },
    contactEmail: {
      type: String,
      default: null,
    },

    // ===========================
    // COMMON FIELDS
    // ===========================
    message: {
      type: String,
      required: true,
    },
    readBy: [
      {
        userId: {
          type: String,
          default: "admin",
        },
        role: {
          type: String,
          enum: ["admin", "user", "host"],
          default: "admin",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    isGlobal: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new",
    },

    // ===========================
    // TARGET ROLES
    // ===========================
    targetRoles: {
      type: [String],
      enum: ["admin", "user", "host"],
      default: ["admin", "user", "host"],
    },

    // ===========================
    // SPECIFIC TARGET USER (for host)
    // ===========================
    targetUserId: {
      type: String,
      default: null,
    },
    targetUserEmail: {
      type: String,
      default: null,
    },

    // ===========================
    // METADATA
    // ===========================
    metadata: {
      // For houses
      oldStatus: String,
      newStatus: String,
      changedFields: [String],
      price: Number,
      bedrooms: Number,
      university: String,
      // For contacts
      ipAddress: String,
      userAgent: String,
      replyMessage: String,
      readAt: Date,
      repliedAt: Date,
      // Host specific
      hostName: String,
      hostEmail: String,
      hostPhone: String,
    },

    // ===========================
    // PRIORITY
    // ===========================
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
  },
  {
    timestamps: true,
  },
);

// ===========================
// INDEXES
// ===========================

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ isRead: 1, createdAt: -1 });
notificationSchema.index({ status: 1, createdAt: -1 });
notificationSchema.index({ houseId: 1 });
notificationSchema.index({ contactId: 1 });
notificationSchema.index({ contactEmail: 1 });
notificationSchema.index({ targetRoles: 1, createdAt: -1 });
notificationSchema.index({ targetUserId: 1, createdAt: -1 });
notificationSchema.index({ targetUserEmail: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

// Compound index for user specific queries
notificationSchema.index({
  targetRoles: 1,
  targetUserId: 1,
  isRead: 1,
  createdAt: -1,
});

// ===========================
// VIRTUALS
// ===========================

// Virtual for role label
notificationSchema.virtual("roleLabel").get(function () {
  if (
    this.targetRoles.includes("admin") &&
    this.targetRoles.includes("host") &&
    this.targetRoles.includes("user")
  ) {
    return "All Roles";
  }
  return this.targetRoles.join(", ");
});

// Virtual for isAdminNotification
notificationSchema.virtual("isAdminNotification").get(function () {
  return this.targetRoles.includes("admin");
});

// Virtual for isUserNotification
notificationSchema.virtual("isUserNotification").get(function () {
  return this.targetRoles.includes("user");
});

// Virtual for isHostNotification
notificationSchema.virtual("isHostNotification").get(function () {
  return this.targetRoles.includes("host");
});

// ===========================
// STATIC METHODS
// ===========================

// Get unread count by role
notificationSchema.statics.getUnreadCount = async function (
  role = "admin",
  userId = null,
) {
  const query = {
    isRead: false,
    status: "new",
    targetRoles: { $in: [role] },
  };

  // If userId is provided and role is host or user, filter by targetUserId
  if (userId && (role === "host" || role === "user")) {
    query.$or = [{ targetUserId: userId }, { targetUserEmail: userId }];
  }

  return await this.countDocuments(query);
};

// Mark all as read by role
notificationSchema.statics.markAllAsRead = async function (
  role = "admin",
  userId = null,
) {
  const query = {
    isRead: false,
    status: "new",
    targetRoles: { $in: [role] },
  };

  // If userId is provided and role is host or user, filter by targetUserId
  if (userId && (role === "host" || role === "user")) {
    query.$or = [{ targetUserId: userId }, { targetUserEmail: userId }];
  }

  return await this.updateMany(query, {
    $set: {
      isRead: true,
      status: "read",
      readBy: [
        {
          userId: userId || role,
          role: role,
          readAt: new Date(),
        },
      ],
    },
  });
};

// Get notifications by role
notificationSchema.statics.getByRole = async function (
  role = "admin",
  options = {},
) {
  const { page = 1, limit = 20, userId = null } = options;
  const skip = (page - 1) * limit;

  let query = {
    targetRoles: { $in: [role] },
  };

  // If userId is provided and role is host or user, filter by targetUserId
  if (userId && (role === "host" || role === "user")) {
    query.$or = [{ targetUserId: userId }, { targetUserEmail: userId }];
  }

  const [notifications, total] = await Promise.all([
    this.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    this.countDocuments(query),
  ]);

  return {
    data: notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get notifications by category and role
notificationSchema.statics.getByCategoryAndRole = async function (
  category,
  role = "admin",
  options = {},
) {
  const { page = 1, limit = 20, userId = null } = options;
  const skip = (page - 1) * limit;

  let query = {
    targetRoles: { $in: [role] },
  };

  if (category === "house") {
    query.type = { $regex: /^house_/ };
  } else if (category === "contact") {
    query.type = { $regex: /^contact_/ };
  }

  // If userId is provided and role is host or user, filter by targetUserId
  if (userId && (role === "host" || role === "user")) {
    query.$or = [{ targetUserId: userId }, { targetUserEmail: userId }];
  }

  const [notifications, total] = await Promise.all([
    this.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    this.countDocuments(query),
  ]);

  return {
    data: notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get notifications for a specific host
notificationSchema.statics.getByHost = async function (
  hostEmail,
  options = {},
) {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    this.find({
      targetUserEmail: hostEmail,
      targetRoles: { $in: ["host"] },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments({
      targetUserEmail: hostEmail,
      targetRoles: { $in: ["host"] },
    }),
  ]);

  return {
    data: notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get notifications for a specific user
notificationSchema.statics.getByUser = async function (
  userEmail,
  options = {},
) {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    this.find({
      targetUserEmail: userEmail,
      targetRoles: { $in: ["user"] },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments({
      targetUserEmail: userEmail,
      targetRoles: { $in: ["user"] },
    }),
  ]);

  return {
    data: notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get notifications for admin
notificationSchema.statics.getByAdmin = async function (options = {}) {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    this.find({
      targetRoles: { $in: ["admin"] },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments({
      targetRoles: { $in: ["admin"] },
    }),
  ]);

  return {
    data: notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// ===========================
// INSTANCE METHODS
// ===========================

// Mark as read with role
notificationSchema.methods.markAsRead = function (
  userId = "admin",
  role = "admin",
) {
  this.isRead = true;
  this.status = "read";

  // Check if user already in readBy
  const existing = this.readBy.find(
    (r) => r.userId === userId && r.role === role,
  );
  if (!existing) {
    this.readBy.push({
      userId: userId,
      role: role,
      readAt: new Date(),
    });
  }

  return this;
};

// Check if notification is for a specific role
notificationSchema.methods.isForRole = function (role) {
  return this.targetRoles.includes(role);
};

// Check if notification is for a specific user
notificationSchema.methods.isForUser = function (userId) {
  return this.targetUserId === userId || this.targetUserEmail === userId;
};

// Archive notification
notificationSchema.methods.archive = function () {
  this.status = "archived";
  return this;
};

// Get notification type category
notificationSchema.methods.getCategory = function () {
  if (this.type.startsWith("house_")) return "house";
  if (this.type.startsWith("contact_")) return "contact";
  return "other";
};

// Get notification icon based on type
notificationSchema.methods.getIcon = function () {
  const icons = {
    house_created: "🏠",
    house_updated: "📝",
    house_deleted: "🗑️",
    house_status_changed: "🔄",
    contact_created: "📩",
    contact_read: "👀",
    contact_replied: "✅",
    contact_archived: "📦",
  };
  return icons[this.type] || "📢";
};

// ===========================
// PRE-SAVE MIDDLEWARE (FIXED)
// ===========================

notificationSchema.pre("save", function (next) {
  try {
    // Auto-generate message if not provided
    if (!this.message) {
      if (this.type.startsWith("house_")) {
        const action = this.type.replace("house_", "");
        this.message = `${action.charAt(0).toUpperCase() + action.slice(1)}: ${this.houseName || "House"}`;
      } else if (this.type.startsWith("contact_")) {
        const action = this.type.replace("contact_", "");
        this.message = `${action.charAt(0).toUpperCase() + action.slice(1)}: ${this.contactName || "Contact"}`;
      }
    }

    // Set isGlobal for house notifications
    if (this.type.startsWith("house_")) {
      this.isGlobal = true;
    }

    // Set priority based on type
    if (!this.priority) {
      if (this.type === "contact_created" || this.type === "house_created") {
        this.priority = "high";
      } else {
        this.priority = "normal";
      }
    }

    // Ensure targetRoles is always an array
    if (typeof this.targetRoles === "string") {
      this.targetRoles = [this.targetRoles];
    }

    return next();
  } catch (error) {
    return next(error);
  }
});

// ===========================
// POST-SAVE MIDDLEWARE
// ===========================

notificationSchema.post("save", function (doc) {
  setImmediate(() => {
    const roles = doc.targetRoles.join(", ");
    console.log(
      `📢 Notification created for [${roles}]: ${doc.type} - ${doc.message}`,
    );
  });
});

module.exports = mongoose.model("Notification", notificationSchema);
