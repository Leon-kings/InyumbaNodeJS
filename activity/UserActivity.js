// const mongoose = require("mongoose");

// const userActivitySchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
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
//     },

//     action: {
//       type: String,
//       enum: [
//         "user_created",
//         "user_updated",
//         "user_deleted",
//         "user_login",
//         "user_logout",
//         "email_verified",
//         "password_changed",
//       ],
//       required: true,
//     },

//     description: {
//       type: String,
//       trim: true,
//     },

//     ipAddress: {
//       type: String,
//       default: null,
//     },

//     userAgent: {
//       type: String,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports =
//   mongoose.models.UserActivity ||
//   mongoose.model("UserActivity", userActivitySchema);












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
      required: true,
      index: true,
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
      index: true,
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
  },
  {
    timestamps: true,
  }
);

// ============================================================
// EXPORT MODEL + IP FUNCTION
// ============================================================

const UserActivity =
  mongoose.models.UserActivity ||
  mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;

// Export helper separately
module.exports.getClientIPv4 = getClientIPv4;