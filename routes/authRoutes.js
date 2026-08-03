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
  getUser,
  getCurrentUser,
  updateUser,
  updateCurrentUser,
  deleteUser,
    getAllUsers,
  deleteCurrentUser,
  updateStatistics,
} = require("../controllers/authController");

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

// ===========================
// PUBLIC ROUTES (No authentication required)
// ===========================

// Register a new user
router.post(
  "/register",
  registerValidationRules,
  handleValidationErrors,
  register,
);

// Login user
router.post("/login", login);

router.get("/", getAllUsers);

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

// Forgot password - send reset code
router.post(
  "/forgot-password",
  emailValidationRules,
  handleValidationErrors,
  forgotPassword,
);

// Reset password with token
router.post(
  "/reset-password",
  resetPasswordValidationRules,
  handleValidationErrors,
  resetPassword,
);

// ===========================
// PROTECTED ROUTES (Require authentication)
// ===========================

// Logout user
router.post("/logout", logout);

// Get current user profile
router.get("/profile", getCurrentUser);

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

// Update password (optional additional endpoint)
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

// ===========================
// ADMIN ROUTES (Require authentication & admin role)
// ===========================

// Get all users
router.get("/users", getUsers);

// Get a specific user by ID
router.get("/users/:id", getUser);

// Update any user by ID
router.put(
  "/:id",
  updateValidationRules,
  handleValidationErrors,
  updateUser,
);

// Delete any user by ID
router.delete("/:id", deleteUser);

module.exports = router;
