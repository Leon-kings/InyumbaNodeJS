const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      default: "en",
    },

    image: {
      public_id: {
        type: String,
        default: null,
      },

      url: {
        type: String,
        default: null,
      },

      format: {
        type: String,
        default: null,
      },
    },

    // ============================
    // REQUEST STATUS
    // ============================

    status: {
      type: String,

      enum: ["Pending", "Approved", "Rejected", "Completed"],

      default: "Pending",
    },

    // ============================
    // ADMIN RESPONSE
    // ============================

    adminReply: {
      type: String,

      default: "",
    },

    // ============================
    // USER IDENTIFICATION
    // ============================

    userId: {
      type: String,

      default: null,
    },

    // ============================
    // NOTIFICATION CONTEXT
    // ============================

    // Main notification connected
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Notification",

      default: null,
    },

    // Notification history
    notifications: [
      {
        notificationId: {
          type: mongoose.Schema.Types.ObjectId,

          ref: "Notification",
        },

        type: {
          type: String,

          default: null,
        },

        message: {
          type: String,

          default: null,
        },

        targetRoles: [
          {
            type: String,

            enum: ["admin", "user", "host"],
          },
        ],

        createdAt: {
          type: Date,

          default: Date.now,
        },
      },
    ],

    // Latest notification snapshot

    lastNotification: {
      type: {
        type: String,

        default: null,
      },

      message: {
        type: String,

        default: null,
      },

      status: {
        type: String,

        enum: ["new", "read", "archived"],

        default: "new",
      },

      createdAt: {
        type: Date,

        default: null,
      },
    },
  },
  {
    timestamps: true,
  },
);

// ============================
// INDEXES
// ============================

requestSchema.index({
  email: 1,
});

requestSchema.index({
  status: 1,
});

requestSchema.index({
  notificationId: 1,
});

requestSchema.index({
  createdAt: -1,
});

// ============================
// VIRTUALS
// ============================

requestSchema.virtual("hasNotification").get(function () {
  return this.notifications.length > 0;
});

// ============================
// INSTANCE METHODS
// ============================

requestSchema.methods.attachNotification = function (notification) {
  this.notificationId = notification._id;

  this.notifications.push({
    notificationId: notification._id,

    type: notification.type,

    message: notification.message,

    targetRoles: notification.targetRoles,

    createdAt: new Date(),
  });

  this.lastNotification = {
    type: notification.type,

    message: notification.message,

    status: "new",

    createdAt: new Date(),
  };

  return this;
};

// module.exports = mongoose.model("Request", requestSchema);
const Request =
  mongoose.models.Request || mongoose.model("Request", requestSchema);

module.exports = Request;
