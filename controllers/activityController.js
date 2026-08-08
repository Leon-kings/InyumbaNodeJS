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

    const user = auth.user;

    let activities;

    // ===========================
    // ADMIN → ALL ACTIVITIES
    // ===========================

    if (user.role === "admin") {
      activities = await UserActivity.find()
        .populate(
          "userId",
          "name email phone role"
        )
        .sort({ createdAt: -1 });
    }

    // ===========================
    // USER → OWN ACTIVITIES
    // ===========================

    else {
      activities = await UserActivity.find({
        userId: user.id,
      }).sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error(
      "GET USER ACTIVITIES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user activities",
    });
  }
};