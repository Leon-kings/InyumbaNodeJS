
// // ============================================================
// // MODELS / USERACTIVITY.JS
// // ============================================================

// const mongoose = require("mongoose");

// // ============================================================
// // GET CLIENT IPv4 ADDRESS
// // ============================================================

// const getClientIPv4 = (req) => {
//   try {
//     // ----------------------------------------------------------
//     // 1. x-forwarded-for
//     // Used when running behind Render, Nginx, Cloudflare, etc.
//     // ----------------------------------------------------------

//     let ip =
//       req.headers["x-forwarded-for"] ||
//       req.headers["x-real-ip"] ||
//       req.socket?.remoteAddress ||
//       req.connection?.remoteAddress ||
//       req.ip ||
//       "";

//     // x-forwarded-for can contain multiple IPs:
//     // client, proxy1, proxy2
//     if (typeof ip === "string" && ip.includes(",")) {
//       ip = ip.split(",")[0].trim();
//     }

//     ip = String(ip).trim();

//     // ----------------------------------------------------------
//     // 2. Remove IPv6 prefix
//     //
//     // ::ffff:192.158.1.20
//     // becomes
//     // 192.158.1.20
//     // ----------------------------------------------------------

//     if (ip.startsWith("::ffff:")) {
//       ip = ip.substring(7);
//     }

//     // ----------------------------------------------------------
//     // 3. Remove brackets if present
//     //
//     // [192.158.1.20]
//     // becomes
//     // 192.158.1.20
//     // ----------------------------------------------------------

//     ip = ip.replace(/^\[|\]$/g, "");

//     // ----------------------------------------------------------
//     // 4. Check if it is already a valid IPv4 address
//     // ----------------------------------------------------------

//     const ipv4Regex =
//       /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

//     if (ipv4Regex.test(ip)) {
//       return ip;
//     }

//     // ----------------------------------------------------------
//     // 5. Localhost IPv6
//     //
//     // ::1 means localhost.
//     // Use IPv4 localhost for easier display.
//     // ----------------------------------------------------------

//     if (ip === "::1") {
//       return "127.0.0.1";
//     }

//     // ----------------------------------------------------------
//     // 6. Unknown / IPv6-only address
//     //
//     // Don't invent a fake IPv4 address.
//     // ----------------------------------------------------------

//     return ip || null;
//   } catch (error) {
//     console.error("GET CLIENT IP ERROR:", error);
//     return null;
//   }
// };

// // ============================================================
// // USER ACTIVITY SCHEMA
// // ============================================================

// const userActivitySchema = new mongoose.Schema(
//   {
//     // ==========================================================
//     // USER INFORMATION
//     // ==========================================================

//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     userName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     userEmail: {
//       type: String,
//       required: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },

//     // ==========================================================
//     // ACTIVITY
//     // ==========================================================

//     action: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },

//     description: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     // ==========================================================
//     // REQUEST INFORMATION
//     // ==========================================================

//     method: {
//       type: String,
//       trim: true,
//       uppercase: true,
//       default: null,
//     },

//     route: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     url: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     // ==========================================================
//     // IP ADDRESS
//     // ==========================================================

//     ipAddress: {
//       type: String,
//       trim: true,
//       default: null,
//       index: true,
//     },

//     // ==========================================================
//     // DEVICE / BROWSER
//     // ==========================================================

//     userAgent: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     referrer: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     // ==========================================================
//     // REQUEST DATA
//     // ==========================================================

//     requestBody: {
//       type: mongoose.Schema.Types.Mixed,
//       default: null,
//     },

//     requestQuery: {
//       type: mongoose.Schema.Types.Mixed,
//       default: null,
//     },

//     requestParams: {
//       type: mongoose.Schema.Types.Mixed,
//       default: null,
//     },

//     // ==========================================================
//     // RESPONSE DATA
//     // ==========================================================

//     responseStatus: {
//       type: Number,
//       default: null,
//     },

//     responseBody: {
//       type: mongoose.Schema.Types.Mixed,
//       default: null,
//     },

//     // ==========================================================
//     // CHANGES
//     // ==========================================================

//     before: {
//       type: mongoose.Schema.Types.Mixed,
//       default: null,
//     },

//     after: {
//       type: mongoose.Schema.Types.Mixed,
//       default: null,
//     },

//     changes: {
//       type: mongoose.Schema.Types.Mixed,
//       default: null,
//     },

//     // ==========================================================
//     // PERFORMANCE
//     // ==========================================================

//     duration: {
//       type: Number,
//       default: null,
//     },

//     // ==========================================================
//     // ERROR
//     // ==========================================================

//     error: {
//       type: String,
//       trim: true,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // ============================================================
// // EXPORT MODEL + IP FUNCTION
// // ============================================================

// const UserActivity =
//   mongoose.models.UserActivity ||
//   mongoose.model("UserActivity", userActivitySchema);

// module.exports = UserActivity;

// // Export helper separately
// module.exports.getClientIPv4 = getClientIPv4;










// ============================================================
// MODELS / USERACTIVITY.JS
// ============================================================

const mongoose = require("mongoose");

// ============================================================
// GET CLIENT IPv4 ADDRESS
// ============================================================

const getClientIPv4 = (req) => {
  try {
    // ----------------------------------------------------------
    // 1. x-forwarded-for
    // Used when running behind Render, Nginx, Cloudflare, etc.
    // ----------------------------------------------------------

    let ip =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      req.ip ||
      "";

    // x-forwarded-for can contain multiple IPs:
    // client, proxy1, proxy2
    if (typeof ip === "string" && ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    ip = String(ip).trim();

    // ----------------------------------------------------------
    // 2. Remove IPv6 prefix
    //
    // ::ffff:192.158.1.20
    // becomes
    // 192.158.1.20
    // ----------------------------------------------------------

    if (ip.startsWith("::ffff:")) {
      ip = ip.substring(7);
    }

    // ----------------------------------------------------------
    // 3. Remove brackets if present
    //
    // [192.158.1.20]
    // becomes
    // 192.158.1.20
    // ----------------------------------------------------------

    ip = ip.replace(/^\[|\]$/g, "");

    // ----------------------------------------------------------
    // 4. Check if it is already a valid IPv4 address
    // ----------------------------------------------------------

    const ipv4Regex =
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

    if (ipv4Regex.test(ip)) {
      return ip;
    }

    // ----------------------------------------------------------
    // 5. Localhost IPv6
    //
    // ::1 means localhost.
    // Use IPv4 localhost for easier display.
    // ----------------------------------------------------------

    if (ip === "::1") {
      return "127.0.0.1";
    }

    // ----------------------------------------------------------
    // 6. Unknown / IPv6-only address
    //
    // Don't invent a fake IPv4 address.
    // ----------------------------------------------------------

    return ip || null;
  } catch (error) {
    console.error("GET CLIENT IP ERROR:", error);
    return null;
  }
};

// ============================================================
// USER ACTIVITY SCHEMA
// ============================================================

const userActivitySchema = new mongoose.Schema(
  {
    // ==========================================================
    // USER INFORMATION
    // ==========================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // ✅ FIXED: Changed from true to false
      default: null,   // ✅ Added default
      index: true,
    },

    userName: {
      type: String,
      required: false, // ✅ Changed to false for anonymous users
      trim: true,
      default: null,
    },

    userEmail: {
      type: String,
      required: false, // ✅ Changed to false for anonymous users
      lowercase: true,
      trim: true,
      index: true,
      default: null,
    },

    // ==========================================================
    // ACTIVITY
    // ==========================================================

    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      default: null,
    },

    // ==========================================================
    // REQUEST INFORMATION
    // ==========================================================

    method: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },

    route: {
      type: String,
      trim: true,
      default: null,
    },

    url: {
      type: String,
      trim: true,
      default: null,
    },

    // ==========================================================
    // IP ADDRESS
    // ==========================================================

    ipAddress: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },

    // ==========================================================
    // DEVICE / BROWSER
    // ==========================================================

    userAgent: {
      type: String,
      trim: true,
      default: null,
    },

    referrer: {
      type: String,
      trim: true,
      default: null,
    },

    // ==========================================================
    // REQUEST DATA
    // ==========================================================

    requestBody: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    requestQuery: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    requestParams: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // ==========================================================
    // RESPONSE DATA
    // ==========================================================

    responseStatus: {
      type: Number,
      default: null,
    },

    responseBody: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // ==========================================================
    // CHANGES
    // ==========================================================

    before: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    after: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // ==========================================================
    // PERFORMANCE
    // ==========================================================

    duration: {
      type: Number,
      default: null,
    },

    // ==========================================================
    // ERROR
    // ==========================================================

    error: {
      type: String,
      trim: true,
      default: null,
    },

    // ==========================================================
    // METADATA (Added for flexibility)
    // ==========================================================

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================
// INDEXES
// ============================================================
userActivitySchema.index({ createdAt: -1 });
userActivitySchema.index({ userId: 1, createdAt: -1 });
userActivitySchema.index({ userEmail: 1, createdAt: -1 });
userActivitySchema.index({ action: 1, createdAt: -1 });
userActivitySchema.index({ ipAddress: 1, createdAt: -1 });

// ============================================================
// VIRTUALS
// ============================================================
userActivitySchema.virtual("timeAgo").get(function () {
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

userActivitySchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

// ============================================================
// METHODS
// ============================================================
userActivitySchema.methods.isAnonymous = function () {
  return !this.userId;
};

// ============================================================
// STATIC METHODS
// ============================================================

// Get activities by user
userActivitySchema.statics.getByUser = async function (userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [activities, total] = await Promise.all([
    this.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments({ userId }),
  ]);

  return {
    activities,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Get activities by action
userActivitySchema.statics.getByAction = async function (action, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [activities, total] = await Promise.all([
    this.find({ action })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments({ action }),
  ]);

  return {
    activities,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Get recent activities
userActivitySchema.statics.getRecent = async function (limit = 50) {
  return await this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Get activity statistics
userActivitySchema.statics.getStatistics = async function () {
  const total = await this.countDocuments();
  const byAction = await this.aggregate([
    { $group: { _id: "$action", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayActivities = await this.countDocuments({
    createdAt: { $gte: today },
  });

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekActivities = await this.countDocuments({
    createdAt: { $gte: weekAgo },
  });

  const uniqueUsers = await this.distinct("userId").countDocuments();

  return {
    total,
    todayActivities,
    weekActivities,
    uniqueUsers,
    byAction,
  };
};

// ============================================================
// PRE-SAVE MIDDLEWARE
// ============================================================
userActivitySchema.pre("save", function (next) {
  // Sanitize email
  if (this.userEmail) {
    this.userEmail = this.userEmail.toLowerCase().trim();
  }

  // Sanitize name
  if (this.userName) {
    this.userName = this.userName.trim();
  }

  // Ensure metadata is an object
  if (!this.metadata) {
    this.metadata = {};
  }

  next();
});

// ============================================================
// EXPORT MODEL + IP FUNCTION
// ============================================================

const UserActivity =
  mongoose.models.UserActivity ||
  mongoose.model("UserActivity", userActivitySchema);

// Export both the model and the helper
module.exports = UserActivity;
module.exports.getClientIPv4 = getClientIPv4;