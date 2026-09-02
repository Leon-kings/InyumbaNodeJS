// // const UserActivity = require("../activity/UserActivity");
// // const { authenticateUser } = require("../middleware/authMiddleware");

// // exports.getUserActivities = async (req, res) => {
// //   try {
// //     const auth = await authenticateUser(req);

// //     if (!auth.success) {
// //       return res.status(auth.status).json({
// //         success: false,
// //         message: auth.message,
// //       });
// //     }

// //     const user = auth.user;

// //     let activities;

// //     // ===========================
// //     // ADMIN → ALL ACTIVITIES
// //     // ===========================

// //     if (user.role === "admin" && user.role === "manager") {
// //       activities = await UserActivity.find()
// //         .populate("userId", "name email phone role")
// //         .sort({ createdAt: -1 });
// //     }

// //     // ===========================
// //     // USER → OWN ACTIVITIES
// //     // ===========================
// //     else {
// //       activities = await UserActivity.find({
// //         userId: user.id,
// //       }).sort({ createdAt: -1 });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       count: activities.length,
// //       activities,
// //     });
// //   } catch (error) {
// //     console.error("GET USER ACTIVITIES ERROR:", error);

// //     return res.status(500).json({
// //       success: false,
// //       message: "Failed to fetch user activities",
// //     });
// //   }
// // };










// const UserActivity = require("../activity/UserActivity");
// const { authenticateUser } = require("../middleware/authMiddleware");

// // ============================================================
// // GET CLIENT IPv4
// // ============================================================

// const getClientIPv4 = (req) => {
//   try {
//     let ip =
//       req.headers["x-forwarded-for"] ||
//       req.headers["x-real-ip"] ||
//       req.socket?.remoteAddress ||
//       req.connection?.remoteAddress ||
//       req.ip ||
//       "";

//     // If proxy sends multiple IPs:
//     // client, proxy1, proxy2
//     if (typeof ip === "string" && ip.includes(",")) {
//       ip = ip.split(",")[0].trim();
//     }

//     ip = String(ip).trim();

//     // Convert:
//     // ::ffff:192.158.1.20
//     // to:
//     // 192.158.1.20
//     if (ip.startsWith("::ffff:")) {
//       ip = ip.substring(7);
//     }

//     // Remove brackets
//     ip = ip.replace(/^\[|\]$/g, "");

//     // IPv4 validation
//     const ipv4Regex =
//       /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

//     if (ipv4Regex.test(ip)) {
//       return ip;
//     }

//     // Localhost IPv6 → IPv4 localhost
//     if (ip === "::1") {
//       return "127.0.0.1";
//     }

//     return ip || null;
//   } catch (error) {
//     console.error("GET CLIENT IP ERROR:", error);

//     return null;
//   }
// };

// // ============================================================
// // GET ALL USER ACTIVITIES
// // ============================================================

// exports.getUserActivities = async (req, res) => {
//   try {
//     // const auth = await authenticateUser(req);

//     // if (!auth.success) {
//     //   return res.status(auth.status).json({
//     //     success: false,
//     //     message: auth.message,
//     //   });
//     // }

//     // ============================================
//     // GET ALL ACTIVITIES
//     // NO ID FILTER
//     // ============================================

//     const activities = await UserActivity.find({})
//       .populate("userId", "name email phone role")
//       .sort({ createdAt: -1 })
//       .lean();

//     // ============================================
//     // GET CURRENT REQUEST IPv4
//     // ============================================

//     const currentIPv4 = getClientIPv4(req);

//     // ============================================
//     // FORMAT ACTIVITIES
//     // ============================================

//     const formattedActivities = activities.map((activity) => ({
//       ...activity,

//       // Keep original IP if already stored
//       // Otherwise use current request IP
//       ipv4Address:
//         activity.ipAddress || currentIPv4 || null,

//       // ==========================================
//       // READABLE TIME
//       // ==========================================

//       timeHappened: activity.createdAt
//         ? new Date(activity.createdAt).toLocaleString("en-GB", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//             hour12: false,
//             timeZone: "Africa/Kigali",
//           })
//         : null,
//     }));

//     // ============================================
//     // RESPONSE
//     // ============================================

//     return res.status(200).json({
//       success: true,
//       count: formattedActivities.length,
//       activities: formattedActivities,
//     });
//   } catch (error) {
//     console.error("GET USER ACTIVITIES ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch user activities",
//       error: error.message,
//     });
//   }
// };









const UserActivity = require("../activity/UserActivity");

// ============================================================
// GET CLIENT IPv4
// ============================================================

const getClientIPv4 = (req) => {
  try {
    let ip =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      req.ip ||
      "";

    // If proxy sends multiple IPs:
    // client, proxy1, proxy2
    if (typeof ip === "string" && ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    ip = String(ip).trim();

    // Convert:
    // ::ffff:192.158.1.20
    // to:
    // 192.158.1.20
    if (ip.startsWith("::ffff:")) {
      ip = ip.substring(7);
    }

    // Remove brackets
    ip = ip.replace(/^\[|\]$/g, "");

    // IPv4 validation
    const ipv4Regex =
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

    if (ipv4Regex.test(ip)) {
      return ip;
    }

    // Localhost IPv6 → IPv4 localhost
    if (ip === "::1") {
      return "127.0.0.1";
    }

    return ip || null;
  } catch (error) {
    console.error("GET CLIENT IP ERROR:", error);
    return null;
  }
};

// ============================================================
// GET ALL USER ACTIVITIES
// ============================================================

exports.getUserActivities = async (req, res) => {
  try {
    // ============================================
    // GET ALL ACTIVITIES
    // NO USER/ID/ROLE FILTER
    // ============================================

    const activities = await UserActivity.find({})
      .populate("userId", "name email phone role")
      .sort({ createdAt: -1 })
      .lean();

    // ============================================
    // GET CURRENT REQUEST IPv4
    // ============================================

    const currentIPv4 = getClientIPv4(req);

    // ============================================
    // FORMAT ACTIVITIES
    // ============================================

    const formattedActivities = activities.map((activity) => ({
      ...activity,

      // Keep original IP if already stored
      // Otherwise use current request IP
      ipv4Address:
        activity.ipAddress || currentIPv4 || null,

      // ==========================================
      // READABLE TIME
      // ==========================================

      timeHappened: activity.createdAt
        ? new Date(activity.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "Africa/Kigali",
          })
        : null,
    }));

    // ============================================
    // RESPONSE
    // ============================================

    return res.status(200).json({
      success: true,
      count: formattedActivities.length,
      activities: formattedActivities,
    });
  } catch (error) {
    console.error("GET USER ACTIVITIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user activities",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE ONE USER ACTIVITY
// ============================================================

exports.deleteUserActivity = async (req, res) => {
  try {
    const { id } = req.params;

    // ============================================
    // VALIDATE ID
    // ============================================

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Activity ID is required",
      });
    }

    // ============================================
    // FIND AND DELETE
    // ============================================

    const activity = await UserActivity.findByIdAndDelete(id);

    // ============================================
    // NOT FOUND
    // ============================================

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "User activity not found",
      });
    }

    // ============================================
    // SUCCESS
    // ============================================

    return res.status(200).json({
      success: true,
      message: "User activity deleted successfully",
      data: activity,
    });
  } catch (error) {
    console.error("DELETE USER ACTIVITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user activity",
      error: error.message,
    });
  }
};

// ============================================================
// BULK DELETE USER ACTIVITIES
// ============================================================

// exports.bulkDeleteUserActivities = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     // ============================================
//     // VALIDATE IDS
//     // ============================================

//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide an array of activity IDs",
//       });
//     }

//     // ============================================
//     // REMOVE DUPLICATE IDS
//     // ============================================

//     const uniqueIds = [...new Set(ids)];

//     // ============================================
//     // DELETE ACTIVITIES
//     // ============================================

//     const result = await UserActivity.deleteMany({
//       _id: { $in: uniqueIds },
//     });

//     // ============================================
//     // SUCCESS
//     // ============================================

//     return res.status(200).json({
//       success: true,
//       message: `${result.deletedCount} user activities deleted successfully`,
//       deletedCount: result.deletedCount,
//     });
//   } catch (error) {
//     console.error("BULK DELETE USER ACTIVITIES ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete user activities",
//       error: error.message,
//     });
//   }
// };

// exports.bulkDeleteUserActivities = async (req, res) => {
//   try {
//     const { ids } = req.body || {};

//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide an array of activity IDs",
//       });
//     }

//     const uniqueIds = [...new Set(ids)];

//     const result = await UserActivity.deleteMany({
//       _id: { $in: uniqueIds },
//     });

//     return res.status(200).json({
//       success: true,
//       message: `${result.deletedCount} user activities deleted successfully`,
//       deletedCount: result.deletedCount,
//     });
//   } catch (error) {
//     console.error("BULK DELETE USER ACTIVITIES ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete user activities",
//       error: error.message,
//     });
//   }
// };

exports.bulkDeleteUserActivities = async (req, res) => {
  try {
    const { ids } = req.body || {};

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of activity IDs",
      });
    }

    const result = await UserActivity.deleteMany({
      _id: { $in: ids },
    });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} user activities deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("BULK DELETE USER ACTIVITIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user activities",
      error: error.message,
    });
  }
};