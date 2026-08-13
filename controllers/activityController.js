// const UserActivity = require("../activity/UserActivity");
// const { authenticateUser } = require("../middleware/authMiddleware");

// exports.getUserActivities = async (req, res) => {
//   try {
//     const auth = await authenticateUser(req);

//     if (!auth.success) {
//       return res.status(auth.status).json({
//         success: false,
//         message: auth.message,
//       });
//     }

//     const user = auth.user;

//     let activities;

//     // ===========================
//     // ADMIN → ALL ACTIVITIES
//     // ===========================

//     if (user.role === "admin" && user.role === "manager") {
//       activities = await UserActivity.find()
//         .populate("userId", "name email phone role")
//         .sort({ createdAt: -1 });
//     }

//     // ===========================
//     // USER → OWN ACTIVITIES
//     // ===========================
//     else {
//       activities = await UserActivity.find({
//         userId: user.id,
//       }).sort({ createdAt: -1 });
//     }

//     return res.status(200).json({
//       success: true,
//       count: activities.length,
//       activities,
//     });
//   } catch (error) {
//     console.error("GET USER ACTIVITIES ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch user activities",
//     });
//   }
// };












const UserActivity = require("../activity/UserActivity");
const { authenticateUser } = require("../middleware/authMiddleware");

exports.getUserActivities = async (req, res) => {
  try {
    const auth = await authenticateUser(req);

    if (!auth.success) {
      return res.status(auth.status).json({
        success: false,
        message: auth.message,
      });
    }

    // ============================================
    // GET ALL ACTIVITIES
    // No ID filter
    // ============================================

    const activities = await UserActivity.find({})
      .populate("userId", "name email phone role")
      .sort({ createdAt: -1 })
      .lean();

    // ============================================
    // ADD READABLE TIME
    // ============================================

    const formattedActivities = activities.map((activity) => ({
      ...activity,

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