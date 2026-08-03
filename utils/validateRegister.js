const { body, query, validationResult } = require("express-validator");

// ===========================
// REGISTER VALIDATION
// ===========================
const registerValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("Name can only contain letters, spaces, apostrophes, and hyphens"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage("Please provide a valid phone number (7-15 digits, optional +)"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

// ===========================
// LOGIN VALIDATION
// ===========================
const loginValidationRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// ===========================
// EMAIL VALIDATION (for verification & password reset)
// ===========================
const emailValidationRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
];

// ===========================
// VERIFICATION CODE VALIDATION
// ===========================
const verificationCodeValidationRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("code")
    .trim()
    .notEmpty()
    .withMessage("Verification code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Verification code must be exactly 6 characters")
    .isAlphanumeric()
    .withMessage("Verification code must be alphanumeric")
    .toUpperCase(),
];

// ===========================
// CHECK EMAIL VERIFICATION (Query param)
// ===========================
const checkEmailVerificationRules = [
  query("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
];

// ===========================
// RESET PASSWORD VALIDATION
// ===========================
const resetPasswordValidationRules = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Reset token is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your new password")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Passwords do not match"),
];

// ===========================
// UPDATE VALIDATION
// ===========================
const updateValidationRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("Name can only contain letters, spaces, apostrophes, and hyphens"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage("Please provide a valid phone number (7-15 digits, optional +)"),

  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),

  // Statistics validation
  body("statistics")
    .optional()
    .isObject()
    .withMessage("Statistics must be an object"),

  body("statistics.totalIncome")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Total income must be a positive number"),

  body("statistics.totalExpenses")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Total expenses must be a positive number"),

  body("statistics.totalSavings")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Total savings must be a positive number"),

  body("statistics.monthlyIncome")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Monthly income must be a positive number"),

  body("statistics.monthlyExpenses")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Monthly expenses must be a positive number"),

  body("statistics.monthlyBudget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Monthly budget must be a positive number"),

  body("statistics.membersCount")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Members count must be at least 1"),
];

// ===========================
// STATISTICS VALIDATION
// ===========================
const statisticsValidationRules = [
  body("totalIncome")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Total income must be a positive number"),

  body("totalExpenses")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Total expenses must be a positive number"),

  body("totalSavings")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Total savings must be a positive number"),

  body("monthlyIncome")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Monthly income must be a positive number"),

  body("monthlyExpenses")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Monthly expenses must be a positive number"),

  body("monthlyBudget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Monthly budget must be a positive number"),

  body("membersCount")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Members count must be at least 1"),
];

// ===========================
// PASSWORD UPDATE VALIDATION (for authenticated users)
// ===========================
const passwordUpdateValidationRules = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),

  body("confirmNewPassword")
    .notEmpty()
    .withMessage("Please confirm your new password")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Passwords do not match"),
];

// ===========================
// HANDLE VALIDATION ERRORS
// ===========================
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Format errors to match frontend error state shape
    const formattedErrors = {};
    errors.array().forEach((err) => {
      if (!formattedErrors[err.path]) {
        formattedErrors[err.path] = err.msg;
      }
    });

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
      message: "Validation failed",
    });
  }

  next();
};

// ===========================
// EXPORT ALL VALIDATION RULES
// ===========================
module.exports = {
  registerValidationRules,
  loginValidationRules,
  emailValidationRules,
  verificationCodeValidationRules,
  checkEmailVerificationRules,
  resetPasswordValidationRules,
  updateValidationRules,
  statisticsValidationRules,
  passwordUpdateValidationRules,
  handleValidationErrors,
};