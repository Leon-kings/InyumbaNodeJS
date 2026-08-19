
// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema(
//   {
//     // =================================================
//     // NOTIFICATION TYPE
//     // =================================================

//     type: {
//       type: String,
//       enum: [
//         // HOUSE
//         "house_created",
//         "house_updated",
//         "house_deleted",
//         "house_status_changed",

//         // CONTACT
//         "contact_created",
//         "contact_read",
//         "contact_replied",
//         "contact_archived",

//         // REQUEST
//         "request_created",
//         "request_updated",
//         "request_deleted",
//         "request_status_changed",
//         "request_replied",
//       ],
//       required: true,
//     },

//     // =================================================
//     // HOUSE CONTEXT
//     // =================================================

//     houseId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "House",
//       default: null,
//     },

//     houseName: {
//       type: String,
//       default: null,
//     },

//     location: {
//       province: String,
//       district: String,
//       sector: String,
//     },

//     // =================================================
//     // CONTACT CONTEXT
//     // =================================================

//     contactId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Contact",
//       default: null,
//     },

//     contactName: {
//       type: String,
//       default: null,
//     },

//     contactEmail: {
//       type: String,
//       default: null,
//     },

//     // =================================================
//     // REQUEST CONTEXT
//     // =================================================

//     requestId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Request",
//       default: null,
//     },

//     requestName: {
//       type: String,
//       default: null,
//     },

//     requestEmail: {
//       type: String,
//       default: null,
//     },

//     // =================================================
//     // COMMON MESSAGE
//     // =================================================

//     message: {
//       type: String,
//       required: true,
//     },

//     // =================================================
//     // READ SYSTEM
//     // =================================================

//     readBy: [
//       {
//         userId: {
//           type: String,
//           default: "admin",
//         },

//         role: {
//           type: String,
//           enum: ["admin", "user", "host"],
//           default: "admin",
//         },

//         readAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],

//     isRead: {
//       type: Boolean,
//       default: false,
//     },

//     isGlobal: {
//       type: Boolean,
//       default: false,
//     },

//     status: {
//       type: String,
//       enum: ["new", "read", "archived"],
//       default: "new",
//     },

//     // =================================================
//     // TARGET USERS
//     // =================================================

//     targetRoles: {
//       type: [String],
//       enum: ["admin", "user", "host"],
//       default: ["admin", "user", "host"],
//     },

//     targetUserId: {
//       type: String,
//       default: null,
//     },

//     targetUserEmail: {
//       type: String,
//       default: null,
//     },

//     // =================================================
//     // EXTRA INFORMATION
//     // =================================================

//     metadata: {
//       // HOUSE
//       oldStatus: String,
//       newStatus: String,
//       changedFields: [String],
//       price: Number,
//       bedrooms: Number,
//       university: String,

//       // CONTACT
//       ipAddress: String,
//       userAgent: String,
//       replyMessage: String,
//       readAt: Date,
//       repliedAt: Date,

//       // REQUEST
//       requestMessage: String,
//       requestImage: String,
//       requestStatus: String,

//       // HOST
//       hostName: String,
//       hostEmail: String,
//       hostPhone: String,
//     },

//     // =================================================
//     // PRIORITY
//     // =================================================

//     priority: {
//       type: String,
//       enum: ["low", "normal", "high", "urgent"],
//       default: "normal",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // =================================================
// // INDEXES
// // =================================================

// notificationSchema.index({ createdAt: -1 });

// notificationSchema.index({
//   isRead: 1,
//   createdAt: -1,
// });

// notificationSchema.index({
//   status: 1,
//   createdAt: -1,
// });

// // House
// notificationSchema.index({ houseId: 1 });

// // Contact
// notificationSchema.index({ contactId: 1 });
// notificationSchema.index({ contactEmail: 1 });

// // Request
// notificationSchema.index({ requestId: 1 });
// notificationSchema.index({ requestEmail: 1 });

// // Users
// notificationSchema.index({
//   targetRoles: 1,
//   createdAt: -1,
// });

// notificationSchema.index({
//   targetUserId: 1,
//   createdAt: -1,
// });

// notificationSchema.index({
//   targetUserEmail: 1,
//   createdAt: -1,
// });

// // Type
// notificationSchema.index({
//   type: 1,
//   createdAt: -1,
// });

// // User notification query
// notificationSchema.index({
//   targetRoles: 1,
//   targetUserId: 1,
//   isRead: 1,
//   createdAt: -1,
// });

// // =================================================
// // VIRTUALS
// // =================================================

// notificationSchema.virtual("roleLabel").get(function () {
//   if (
//     this.targetRoles.includes("admin") &&
//     this.targetRoles.includes("user") &&
//     this.targetRoles.includes("host")
//   ) {
//     return "All Roles";
//   }

//   return this.targetRoles.join(", ");
// });

// notificationSchema.virtual("isAdminNotification").get(function () {
//   return this.targetRoles.includes("admin");
// });

// notificationSchema.virtual("isUserNotification").get(function () {
//   return this.targetRoles.includes("user");
// });

// notificationSchema.virtual("isHostNotification").get(function () {
//   return this.targetRoles.includes("host");
// });

// // Include virtuals in JSON/Object output
// notificationSchema.set("toJSON", {
//   virtuals: true,
// });

// notificationSchema.set("toObject", {
//   virtuals: true,
// });

// // =================================================
// // MODEL EXPORT
// // =================================================

// const Notification =
//   mongoose.models.Notification ||
//   mongoose.model("Notification", notificationSchema);

// module.exports = Notification;










// // models/Notification.js
// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema(
//   {
//     // =================================================
//     // NOTIFICATION TYPE - REQUIRED
//     // =================================================
//     type: {
//       type: String,
//       enum: [
//         'question_created',
//         'question_answered',
//         'question_archived',
//         'question_updated',
//         'question_deleted',
//         'question_assigned',
//         'question_escalated',
//         'question_closed',
//         'question_reopened',
//         'question_replied',
//         'comment_added',
//         'status_changed',
//         'priority_changed',
//         'system_notification',
//         'user_mentioned',
//         'reminder'
//       ],
//       required: [true, 'Notification type is required'],
//       index: true,
//     },

//     // =================================================
//     // NOTIFICATION CONTENT - REQUIRED
//     // =================================================
//     title: {
//       type: String,
//       required: [true, 'Notification title is required'],
//       trim: true,
//       maxlength: 200,
//     },
//     message: {
//       type: String,
//       required: [true, 'Notification message is required'],
//       trim: true,
//       maxlength: 2000,
//     },

//     // =================================================
//     // QUESTION REFERENCES
//     // =================================================
//     questionId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Question",
//       default: null,
//     },
//     questionName: {
//       type: String,
//       default: null,
//       trim: true,
//     },
//     questionEmail: {
//       type: String,
//       default: null,
//       trim: true,
//       lowercase: true,
//     },

//     // =================================================
//     // USER INFORMATION
//     // =================================================
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     userName: {
//       type: String,
//       default: null,
//       trim: true,
//     },
//     userEmail: {
//       type: String,
//       default: null,
//       trim: true,
//       lowercase: true,
//     },
//     userRole: {
//       type: String,
//       enum: ["admin", "manager", "user", "superadmin", "support", "guest"],
//       default: null,
//     },

//     // =================================================
//     // STATUS & PRIORITY
//     // =================================================
//     isRead: {
//       type: Boolean,
//       default: false,
//       index: true,
//     },
//     status: {
//       type: String,
//       enum: ["new", "read", "dismissed", "archived", "actioned"], // ✅ NO "pending" here
//       default: "new",
//     },
//     priority: {
//       type: String,
//       enum: ["low", "normal", "high", "urgent", "critical"],
//       default: "normal",
//     },

//     // =================================================
//     // TARGETING
//     // =================================================
//     targetRoles: {
//       type: [String],
//       enum: ["admin", "manager", "user", "superadmin", "support", "guest", "all"],
//       default: ["user"],
//     },
//     targetUserId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     targetUserEmail: {
//       type: String,
//       default: null,
//       trim: true,
//       lowercase: true,
//     },
//     targetUserRole: {
//       type: String,
//       enum: ["admin", "manager", "user", "superadmin", "support", "guest"],
//       default: null,
//     },

//     // =================================================
//     // SCOPE & READ RECEIPTS
//     // =================================================
//     isGlobal: {
//       type: Boolean,
//       default: false,
//     },
//     readAt: {
//       type: Date,
//       default: null,
//     },
//     readBy: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         userEmail: {
//           type: String,
//           trim: true,
//           lowercase: true,
//         },
//         userRole: {
//           type: String,
//           enum: ["admin", "manager", "user", "superadmin", "support", "guest"],
//         },
//         readAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],

//     // =================================================
//     // EXPIRY
//     // =================================================
//     expiresAt: {
//       type: Date,
//       default: null,
//     },

//     // =================================================
//     // METADATA
//     // =================================================
//     metadata: {
//       type: mongoose.Schema.Types.Mixed,
//       default: {},
//     },

//     // =================================================
//     // ACTIONS
//     // =================================================
//     actions: {
//       type: [
//         {
//           label: {
//             type: String,
//             required: true,
//           },
//           url: {
//             type: String,
//             required: true,
//           },
//           method: {
//             type: String,
//             enum: ["GET", "POST", "PUT", "DELETE"],
//             default: "GET",
//           },
//           type: {
//             type: String,
//             enum: ["primary", "secondary", "danger", "success", "warning"],
//             default: "primary",
//           },
//         },
//       ],
//       default: [],
//     },

//     // =================================================
//     // CREATOR INFO
//     // =================================================
//     createdBy: {
//       userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         default: null,
//       },
//       userName: {
//         type: String,
//         trim: true,
//         default: null,
//       },
//       userEmail: {
//         type: String,
//         trim: true,
//         lowercase: true,
//         default: null,
//       },
//     },

//     // =================================================
//     // SYSTEM FIELDS
//     // =================================================
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // Indexes
// notificationSchema.index({ createdAt: -1 });
// notificationSchema.index({ isRead: 1, createdAt: -1 });
// notificationSchema.index({ targetRoles: 1, isRead: 1 });
// notificationSchema.index({ type: 1, createdAt: -1 });
// notificationSchema.index({ status: 1, createdAt: -1 });

// // Virtuals
// notificationSchema.virtual("timeAgo").get(function () {
//   const diff = Date.now() - this.createdAt.getTime();
//   const minutes = Math.floor(diff / 60000);
//   const hours = Math.floor(diff / 3600000);
//   const days = Math.floor(diff / 86400000);

//   if (minutes < 1) return "Just now";
//   if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
//   if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
//   if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
//   return this.createdAt.toLocaleDateString();
// });

// // Methods
// notificationSchema.methods.markAsRead = async function (user) {
//   this.isRead = true;
//   this.status = "read";
//   this.readAt = new Date();

//   if (!this.readBy) {
//     this.readBy = [];
//   }

//   this.readBy.push({
//     userId: user?.id || null,
//     userEmail: user?.email || null,
//     userRole: user?.role || null,
//     readAt: new Date(),
//   });

//   return await this.save();
// };

// const Notification =
//   mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

// module.exports = Notification;












const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // =================================================
    // NOTIFICATION TYPE
    // =================================================
    type: {
      type: String,

      enum: [
        "question_created",
        "question_answered",
        "question_archived",
        "question_updated",
        "question_deleted",
        "question_assigned",
        "question_escalated",
        "question_closed",
        "question_reopened",
        "question_replied",
        "comment_added",
        "status_changed",
        "priority_changed",
        "system_notification",
        "user_mentioned",
        "reminder",
      ],

      required: [
        true,
        "Notification type is required",
      ],

      index: true,
    },

    // =================================================
    // QUESTION REFERENCES
    // =================================================
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      default: null,
    },

    questionName: {
      type: String,
      default: null,
      trim: true,
    },

    questionEmail: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },

    // =================================================
    // USER INFORMATION
    // =================================================
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    userName: {
      type: String,
      default: null,
      trim: true,
    },

    userEmail: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },

    userRole: {
      type: String,

      enum: [
        "admin",
        "manager",
        "user",
        "superadmin",
        "support",
        "guest",
      ],

      default: null,
    },

    // =================================================
    // NOTIFICATION CONTENT
    // =================================================
    title: {
      type: String,

      required: [
        true,
        "Notification title is required",
      ],

      trim: true,

      maxlength: 200,
    },

    message: {
      type: String,

      required: [
        true,
        "Notification message is required",
      ],

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

      enum: [
        "new",
        "read",
        "dismissed",
        "archived",
        "actioned",
      ],

      default: "new",
    },

    priority: {
      type: String,

      enum: [
        "low",
        "normal",
        "high",
        "urgent",
        "critical",
      ],

      default: "normal",
    },

    // =================================================
    // TARGETING
    // =================================================
    targetRoles: {
      type: [String],

      enum: [
        "admin",
        "manager",
        "user",
        "superadmin",
        "support",
        "guest",
        "all",
      ],

      default: ["user"],
    },

    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    targetUserEmail: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },

    targetUserRole: {
      type: String,

      enum: [
        "admin",
        "manager",
        "user",
        "superadmin",
        "support",
        "guest",
      ],

      default: null,
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
      default: null,
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

          enum: [
            "admin",
            "manager",
            "user",
            "superadmin",
            "support",
            "guest",
          ],
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
      default: null,
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

            enum: [
              "GET",
              "POST",
              "PUT",
              "DELETE",
            ],

            default: "GET",
          },

          type: {
            type: String,

            enum: [
              "primary",
              "secondary",
              "danger",
              "success",
              "warning",
            ],

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
        default: null,
      },

      userName: {
        type: String,
        trim: true,
        default: null,
      },

      userEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
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

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  }
);

// =================================================
// INDEXES
// =================================================

notificationSchema.index({
  createdAt: -1,
});

notificationSchema.index({
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  targetRoles: 1,
  isRead: 1,
});

notificationSchema.index({
  targetUserId: 1,
  isRead: 1,
});

notificationSchema.index({
  targetUserEmail: 1,
  isRead: 1,
});

notificationSchema.index({
  userId: 1,
  isRead: 1,
});

notificationSchema.index({
  type: 1,
  createdAt: -1,
});

notificationSchema.index({
  status: 1,
  createdAt: -1,
});

notificationSchema.index({
  priority: 1,
  createdAt: -1,
});

notificationSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  }
);

// =================================================
// VIRTUALS
// =================================================

notificationSchema.virtual("timeAgo").get(
  function () {
    const diff =
      Date.now() -
      this.createdAt.getTime();

    const minutes = Math.floor(
      diff / 60000
    );

    const hours = Math.floor(
      diff / 3600000
    );

    const days = Math.floor(
      diff / 86400000
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} minute${
        minutes > 1 ? "s" : ""
      } ago`;
    }

    if (hours < 24) {
      return `${hours} hour${
        hours > 1 ? "s" : ""
      } ago`;
    }

    if (days < 7) {
      return `${days} day${
        days > 1 ? "s" : ""
      } ago`;
    }

    return this.createdAt.toLocaleDateString();
  }
);

notificationSchema.virtual(
  "formattedDate"
).get(function () {
  return this.createdAt.toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
});

notificationSchema.virtual(
  "isExpired"
).get(function () {
  if (!this.expiresAt) {
    return false;
  }

  return this.expiresAt < new Date();
});

notificationSchema.virtual(
  "isActionable"
).get(function () {
  return (
    this.actions &&
    this.actions.length > 0
  );
});

// =================================================
// METHODS
// =================================================

notificationSchema.methods.markAsRead =
  async function (user) {
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

notificationSchema.methods.markAsUnread =
  async function () {
    this.isRead = false;
    this.status = "new";
    this.readAt = null;

    return await this.save();
  };

notificationSchema.methods.addAction =
  function (action) {
    if (!this.actions) {
      this.actions = [];
    }

    this.actions.push(action);

    return this;
  };

notificationSchema.methods.dismiss =
  async function () {
    this.status = "dismissed";

    return await this.save();
  };

notificationSchema.methods.archive =
  async function () {
    this.status = "archived";
    this.isActive = false;

    return await this.save();
  };

notificationSchema.methods.isTargetedForUser =
  function (user) {
    if (this.isGlobal) {
      return true;
    }

    if (
      this.targetUserId &&
      this.targetUserId.toString() ===
        user.id
    ) {
      return true;
    }

    if (
      this.targetUserEmail &&
      this.targetUserEmail ===
        user.email
    ) {
      return true;
    }

    if (
      this.targetRoles &&
      this.targetRoles.includes(user.role)
    ) {
      return true;
    }

    if (
      this.userId &&
      this.userId.toString() ===
        user.id
    ) {
      return true;
    }

    return false;
  };

// =================================================
// STATIC METHODS
// =================================================

notificationSchema.statics.getUnreadCount =
  async function (user) {
    const filter = {
      isRead: false,

      isActive: true,

      $or: [
        {
          targetRoles: {
            $in: [user.role],
          },
        },

        {
          targetUserId: user.id,
        },

        {
          targetUserEmail: user.email,
        },

        {
          userId: user.id,
        },

        {
          isGlobal: true,
        },
      ],
    };

    return await this.countDocuments(
      filter
    );
  };

notificationSchema.statics.markAllAsRead =
  async function (user) {
    const filter = {
      isRead: false,

      isActive: true,

      $or: [
        {
          targetRoles: {
            $in: [user.role],
          },
        },

        {
          targetUserId: user.id,
        },

        {
          targetUserEmail: user.email,
        },

        {
          userId: user.id,
        },

        {
          isGlobal: true,
        },
      ],
    };

    return await this.updateMany(
      filter,
      {
        $set: {
          isRead: true,
          status: "read",
          readAt: new Date(),
        },
      }
    );
  };

notificationSchema.statics.getForUser =
  async function (
    user,
    options = {}
  ) {
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
        {
          targetRoles: {
            $in: [user.role],
          },
        },

        {
          targetUserId: user.id,
        },

        {
          targetUserEmail: user.email,
        },

        {
          userId: user.id,
        },

        {
          isGlobal: true,
        },
      ],
    };

    if (isRead !== undefined) {
      filter.isRead =
        isRead === "true" ||
        isRead === true;
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
      filter.createdAt = {
        $gte: new Date(startDate),
      };
    }

    if (endDate) {
      filter.createdAt = {
        ...filter.createdAt,
        $lte: new Date(endDate),
      };
    }

    const parsedPage =
      parseInt(page);

    const parsedLimit =
      parseInt(limit);

    const skip =
      (parsedPage - 1) *
      parsedLimit;

    const sort = {};

    sort[sortBy] =
      sortOrder === "desc"
        ? -1
        : 1;

    const [
      notifications,
      total,
      unreadCount,
    ] = await Promise.all([
      this.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),

      this.countDocuments(filter),

      this.countDocuments({
        ...filter,
        isRead: false,
      }),
    ]);

    return {
      notifications,
      total,
      unreadCount,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(
        total / parsedLimit
      ),
    };
  };

notificationSchema.statics.createNotification =
  async function (data) {
    const notificationData = {
      ...data,

      status:
        data.status || "new",

      priority:
        data.priority || "normal",

      isRead: false,

      isActive: true,
    };

    const notification =
      new this(notificationData);

    return await notification.save();
  };

notificationSchema.statics.getByType =
  async function (
    type,
    page = 1,
    limit = 20
  ) {
    const skip =
      (page - 1) * limit;

    const [
      notifications,
      total,
    ] = await Promise.all([
      this.find({
        type,
        isActive: true,
      })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.countDocuments({
        type,
        isActive: true,
      }),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      pages: Math.ceil(
        total / limit
      ),
    };
  };

notificationSchema.statics.getByRole =
  async function (
    role,
    page = 1,
    limit = 20
  ) {
    const skip =
      (page - 1) * limit;

    const [
      notifications,
      total,
    ] = await Promise.all([
      this.find({
        targetRoles: {
          $in: [role],
        },

        isActive: true,
      })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.countDocuments({
        targetRoles: {
          $in: [role],
        },

        isActive: true,
      }),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      pages: Math.ceil(
        total / limit
      ),
    };
  };

notificationSchema.statics.getByUserId =
  async function (
    userId,
    page = 1,
    limit = 20
  ) {
    const skip =
      (page - 1) * limit;

    const [
      notifications,
      total,
    ] = await Promise.all([
      this.find({
        userId,

        isActive: true,
      })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.countDocuments({
        userId,

        isActive: true,
      }),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      pages: Math.ceil(
        total / limit
      ),
    };
  };

notificationSchema.statics.getUnreadForUser =
  async function (
    user,
    page = 1,
    limit = 20
  ) {
    const skip =
      (page - 1) * limit;

    const filter = {
      isRead: false,

      isActive: true,

      $or: [
        {
          targetRoles: {
            $in: [user.role],
          },
        },

        {
          targetUserId: user.id,
        },

        {
          targetUserEmail:
            user.email,
        },

        {
          userId: user.id,
        },

        {
          isGlobal: true,
        },
      ],
    };

    const [
      notifications,
      total,
    ] = await Promise.all([
      this.find(filter)
        .sort({
          createdAt: -1,
        })
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
      pages: Math.ceil(
        total / limit
      ),
    };
  };

notificationSchema.statics.getStatistics =
  async function () {
    const total =
      await this.countDocuments({
        isActive: true,
      });

    const unread =
      await this.countDocuments({
        isRead: false,
        isActive: true,
      });

    const read =
      await this.countDocuments({
        isRead: true,
        isActive: true,
      });

    const byType =
      await this.aggregate([
        {
          $match: {
            isActive: true,
          },
        },

        {
          $group: {
            _id: "$type",
            count: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            count: -1,
          },
        },

        {
          $limit: 10,
        },
      ]);

    const byRole =
      await this.aggregate([
        {
          $match: {
            isActive: true,
          },
        },

        {
          $unwind:
            "$targetRoles",
        },

        {
          $group: {
            _id: "$targetRoles",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const byPriority =
      await this.aggregate([
        {
          $match: {
            isActive: true,
          },
        },

        {
          $group: {
            _id: "$priority",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayNotifications =
      await this.countDocuments({
        createdAt: {
          $gte: today,
        },

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

notificationSchema.pre(
  "save",
  function (next) {
    // ---------------------------------------------
    // READ STATUS
    // ---------------------------------------------
    if (
      this.isRead &&
      !this.readAt
    ) {
      this.readAt = new Date();
    }

    // ---------------------------------------------
    // STATUS READ
    // ---------------------------------------------
    if (
      this.status === "read" &&
      !this.isRead
    ) {
      this.isRead = true;

      if (!this.readAt) {
        this.readAt = new Date();
      }
    }

    // ---------------------------------------------
    // READ BY
    // ---------------------------------------------
    if (
      this.readBy &&
      this.readBy.length > 0
    ) {
      this.readBy.forEach(
        (entry) => {
          if (!entry.readAt) {
            entry.readAt =
              new Date();
          }
        }
      );
    }

    // ---------------------------------------------
    // TARGET ROLES
    // ---------------------------------------------
    if (
      !this.targetRoles ||
      this.targetRoles.length === 0
    ) {
      if (this.userRole) {
        this.targetRoles = [
          this.userRole,
        ];
      } else {
        this.targetRoles = [
          "user",
        ];
      }
    }

    // ---------------------------------------------
    // MESSAGE LENGTH
    // ---------------------------------------------
    if (
      this.message &&
      this.message.length > 2000
    ) {
      this.message =
        this.message.substring(
          0,
          1997
        ) + "...";
    }

    next();
  }
);

// =================================================
// MODEL EXPORT
// =================================================

// =================================================
// MODEL EXPORT
// =================================================

const Notification =
  mongoose.models.Notification ||
  mongoose.model(
    "Notification",
    notificationSchema
  );

module.exports = Notification;