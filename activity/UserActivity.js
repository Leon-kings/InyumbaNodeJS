const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    action: {
      type: String,
      enum: [
        "user_created",
        "user_updated",
        "user_deleted",
        "user_login",
        "user_logout",
        "email_verified",
        "password_changed",
      ],
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.UserActivity ||
  mongoose.model("UserActivity", userActivitySchema);