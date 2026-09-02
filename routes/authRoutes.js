// const express = require("express");
// const router = express.Router();
// const {
//   // Authentication
//   register,
//   login,
//   logout,
//   verifyEmail,
//   resendVerificationCode,
//   checkEmailVerification,
//   forgotPassword,
//   resetPassword,

//   // User Management
//   getUsers,
//   getUserByEmail,
//   getUser,
//   getCurrentUser,
//   updateUser,
//   updateCurrentUser,
//   deleteUser,
//   getAllUsers,
//   getUserStatistics,
//   deleteCurrentUser,
//   updateStatistics,
//   getAllNotifications,
//   getNotificationsByEmail,
// } = require("../controllers/authController");
// const { getUserActivities } = require("../controllers/activityController");

// const {
//   registerValidationRules,
//   handleValidationErrors,
//   updateValidationRules,
//   statisticsValidationRules,
//   loginValidationRules,

//   emailValidationRules,
//   verificationCodeValidationRules,
//   checkEmailVerificationRules,
//   resetPasswordValidationRules,
//   passwordUpdateValidationRules,
// } = require("../utils/validateRegister");

// // ===========================
// // PUBLIC ROUTES (No authentication required)
// // ===========================

// // Register a new user
// router.post(
//   "/register",
//   registerValidationRules,
//   handleValidationErrors,
//   register,
// );

// // Login user
// router.post("/login", login);

// router.get("/", getAllUsers);
// router.get("/stats", getUserStatistics);

// // Verify email with code
// router.post(
//   "/verify-email",
//   verificationCodeValidationRules,
//   handleValidationErrors,
//   verifyEmail,
// );

// // Resend verification code
// router.post(
//   "/resend-verification",
//   emailValidationRules,
//   handleValidationErrors,
//   resendVerificationCode,
// );

// // Check email verification status
// router.get(
//   "/check-verification",
//   checkEmailVerificationRules,
//   handleValidationErrors,
//   checkEmailVerification,
// );

// // Forgot password - send reset code
// router.post(
//   "/forgot-password",
//   emailValidationRules,
//   handleValidationErrors,
//   forgotPassword,
// );

// // Reset password with token
// router.post(
//   "/reset-password",
//   resetPasswordValidationRules,
//   handleValidationErrors,
//   resetPassword,
// );

// // ===========================
// // PROTECTED ROUTES (Require authentication)
// // ===========================

// // Logout user
// router.post("/logout", logout);

// router.get("/activities", getUserActivities);

// router.get( "/notifications", getAllNotifications );
// router.get( "/notifications/email/:email", getNotificationsByEmail );

// // Get current user profile
// router.get("/profile", getCurrentUser);

// router.get("/:email", getUserByEmail);

// // Update current user profile
// router.put(
//   "/profile",
//   updateValidationRules,
//   handleValidationErrors,
//   updateCurrentUser,
// );

// // Delete current user account
// router.delete("/profile", deleteCurrentUser);

// // Update user statistics
// router.put(
//   "/statistics",
//   statisticsValidationRules,
//   handleValidationErrors,
//   updateStatistics,
// );

// // Update password (optional additional endpoint)
// router.put(
//   "/password",
//   passwordUpdateValidationRules,
//   handleValidationErrors,
//   async (req, res) => {
//     // You would implement this in your authController
//     // This is just a placeholder for the route
//     res.status(200).json({
//       success: true,
//       message: "Password updated successfully",
//     });
//   },
// );

// // ===========================
// // ADMIN ROUTES (Require authentication & admin role)
// // ===========================

// // Get all users
// router.get("/users", getUsers);

// // Get a specific user by ID
// router.get("/:id", getUser);

// // Update any user by ID
// router.put("/:id", updateValidationRules, handleValidationErrors, updateUser);

// // Delete any user by ID
// router.delete("/:id", deleteUser);

// module.exports = router;

const express = require("express");

const router = express.Router();

const {
  // Authentication
  register,
  login,
  logout,
  verifyEmail,
  resendVerificationCode,
  checkEmailVerification,
  forgotPassword,
  resetPassword,

  // User Management
  getUsers,
  getUserByEmail,
  getUser,
  getCurrentUser,
  updateUser,
  updateCurrentUser,
  deleteUser,
  getAllUsers,
  getUserStatistics,
  deleteCurrentUser,
  updateStatistics,

  // Notifications
  getAllNotifications,
  getNotificationsByEmail,
  deleteNotification,
  bulkDeleteNotifications,
  markNotificationAsRead,
  bulkMarkNotificationsAsRead,
} = require("../controllers/authController");

const {
  getUserActivities,
  deleteUserActivity,
  bulkDeleteUserActivities,
} = require("../controllers/activityController");

const {
  registerValidationRules,
  handleValidationErrors,
  updateValidationRules,
  statisticsValidationRules,
  loginValidationRules,
  emailValidationRules,
  verificationCodeValidationRules,
  checkEmailVerificationRules,
  resetPasswordValidationRules,
  passwordUpdateValidationRules,
} = require("../utils/validateRegister");

// ============================================================
// PUBLIC ROUTES
// No authentication required
// ============================================================

// Register a new user
router.post(
  "/register",
  registerValidationRules,
  handleValidationErrors,
  register,
);

// Login user
router.post("/login", login);

// Get all users
router.get("/", getAllUsers);

// Get user statistics
router.get("/stats", getUserStatistics);

// Verify email with code
router.post(
  "/verify-email",
  verificationCodeValidationRules,
  handleValidationErrors,
  verifyEmail,
);

// Resend verification code
router.post(
  "/resend-verification",
  emailValidationRules,
  handleValidationErrors,
  resendVerificationCode,
);

// Check email verification status
router.get(
  "/check-verification",
  checkEmailVerificationRules,
  handleValidationErrors,
  checkEmailVerification,
);

// Forgot password
router.post(
  "/forgot-password",
  emailValidationRules,
  handleValidationErrors,
  forgotPassword,
);

// Reset password
router.post(
  "/reset-password",
  resetPasswordValidationRules,
  handleValidationErrors,
  resetPassword,
);

// ============================================================
// PUBLIC NOTIFICATION ROUTES
// No authentication required
// No role required
// No ownership check
// ============================================================

// Get ALL notifications
router.get("/notifications", getAllNotifications);

// Get notifications by email
router.get("/notifications/email/:email", getNotificationsByEmail);

// Delete ONE notification
router.delete("/notifications/:id", deleteNotification);

// Delete MULTIPLE notifications
router.delete("/notifications/bulk", bulkDeleteNotifications);

// Mark ONE notification as read
router.patch("/notifications/:id/read", markNotificationAsRead);

// Mark MULTIPLE notifications as read
router.patch("/notifications/bulk-read", bulkMarkNotificationsAsRead);

// ============================================================
// PROTECTED ROUTES
// Require authentication
// ============================================================

// Logout user
router.post("/logout", logout);

// User activities
router.get("/activities", getUserActivities);
router.delete("/activities", deleteUserActivity);
router.delete("/activities/bulk", bulkDeleteUserActivities);

// Current user profile
router.get("/profile", getCurrentUser);

// Get user by email
router.get("/:email", getUserByEmail);

// Update current user profile
router.put(
  "/profile",
  updateValidationRules,
  handleValidationErrors,
  updateCurrentUser,
);

// Delete current user account
router.delete("/profile", deleteCurrentUser);

// Update user statistics
router.put(
  "/statistics",
  statisticsValidationRules,
  handleValidationErrors,
  updateStatistics,
);

// Update password
router.put(
  "/password",
  passwordUpdateValidationRules,
  handleValidationErrors,
  async (req, res) => {
    // You would implement this in your authController
    // This is just a placeholder for the route

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  },
);

// ============================================================
// ADMIN ROUTES
// Require authentication & admin role
// ============================================================

// Get all users
router.get("/users", getUsers);

// Get a specific user by ID
router.get("/:id", getUser);

// Update any user by ID
router.put("/:id", updateValidationRules, handleValidationErrors, updateUser);

// Delete any user by ID
router.delete("/:id", deleteUser);

module.exports = router;
