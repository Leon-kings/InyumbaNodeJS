
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










// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
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
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ["new", "read", "dismissed", "archived", "actioned"], // ✅ Fixed: removed "pending"
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent", "critical"],
      default: "normal",
    },
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
    expiresAt: {
      type: Date,
      required: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
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

// Indexes
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

// Virtuals
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

// Methods
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

const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

module.exports = Notification;