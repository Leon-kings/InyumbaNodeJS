
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // =================================================
    // NOTIFICATION TYPE
    // =================================================

    type: {
      type: String,
      enum: [
        // HOUSE
        "house_created",
        "house_updated",
        "house_deleted",
        "house_status_changed",

        // CONTACT
        "contact_created",
        "contact_read",
        "contact_replied",
        "contact_archived",

        // REQUEST
        "request_created",
        "request_updated",
        "request_deleted",
        "request_status_changed",
        "request_replied",
      ],
      required: true,
    },

    // =================================================
    // HOUSE CONTEXT
    // =================================================

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

    // =================================================
    // CONTACT CONTEXT
    // =================================================

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

    // =================================================
    // REQUEST CONTEXT
    // =================================================

    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },

    requestName: {
      type: String,
      default: null,
    },

    requestEmail: {
      type: String,
      default: null,
    },

    // =================================================
    // COMMON MESSAGE
    // =================================================

    message: {
      type: String,
      required: true,
    },

    // =================================================
    // READ SYSTEM
    // =================================================

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

    // =================================================
    // TARGET USERS
    // =================================================

    targetRoles: {
      type: [String],
      enum: ["admin", "user", "host"],
      default: ["admin", "user", "host"],
    },

    targetUserId: {
      type: String,
      default: null,
    },

    targetUserEmail: {
      type: String,
      default: null,
    },

    // =================================================
    // EXTRA INFORMATION
    // =================================================

    metadata: {
      // HOUSE
      oldStatus: String,
      newStatus: String,
      changedFields: [String],
      price: Number,
      bedrooms: Number,
      university: String,

      // CONTACT
      ipAddress: String,
      userAgent: String,
      replyMessage: String,
      readAt: Date,
      repliedAt: Date,

      // REQUEST
      requestMessage: String,
      requestImage: String,
      requestStatus: String,

      // HOST
      hostName: String,
      hostEmail: String,
      hostPhone: String,
    },

    // =================================================
    // PRIORITY
    // =================================================

    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
  },
  {
    timestamps: true,
  }
);

// =================================================
// INDEXES
// =================================================

notificationSchema.index({ createdAt: -1 });

notificationSchema.index({
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  status: 1,
  createdAt: -1,
});

// House
notificationSchema.index({ houseId: 1 });

// Contact
notificationSchema.index({ contactId: 1 });
notificationSchema.index({ contactEmail: 1 });

// Request
notificationSchema.index({ requestId: 1 });
notificationSchema.index({ requestEmail: 1 });

// Users
notificationSchema.index({
  targetRoles: 1,
  createdAt: -1,
});

notificationSchema.index({
  targetUserId: 1,
  createdAt: -1,
});

notificationSchema.index({
  targetUserEmail: 1,
  createdAt: -1,
});

// Type
notificationSchema.index({
  type: 1,
  createdAt: -1,
});

// User notification query
notificationSchema.index({
  targetRoles: 1,
  targetUserId: 1,
  isRead: 1,
  createdAt: -1,
});

// =================================================
// VIRTUALS
// =================================================

notificationSchema.virtual("roleLabel").get(function () {
  if (
    this.targetRoles.includes("admin") &&
    this.targetRoles.includes("user") &&
    this.targetRoles.includes("host")
  ) {
    return "All Roles";
  }

  return this.targetRoles.join(", ");
});

notificationSchema.virtual("isAdminNotification").get(function () {
  return this.targetRoles.includes("admin");
});

notificationSchema.virtual("isUserNotification").get(function () {
  return this.targetRoles.includes("user");
});

notificationSchema.virtual("isHostNotification").get(function () {
  return this.targetRoles.includes("host");
});

// Include virtuals in JSON/Object output
notificationSchema.set("toJSON", {
  virtuals: true,
});

notificationSchema.set("toObject", {
  virtuals: true,
});

// =================================================
// MODEL EXPORT
// =================================================

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

module.exports = Notification;