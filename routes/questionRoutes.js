const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

const { body } = require("express-validator");

// ===========================================
// VALIDATION RULES
// ===========================================

const validateQuestion = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("question").trim().notEmpty().withMessage("Question is required"),
  body("question").isLength({ min: 10 }).withMessage("Question must be at least 10 characters"),
];

// ===========================================
// PUBLIC ROUTES
// ===========================================

// Submit a question (public)
router.post("/submit", validateQuestion, questionController.submitQuestion);

// Get questions by email (public)
router.get("/email/:email", questionController.getQuestionsByEmail);

// ===========================================
// PROTECTED ROUTES (Authenticated Users)
// ===========================================



// Get my questions
router.get("/my-questions", questionController.getMyQuestions);

// Get a single question
router.get("/:id", questionController.getQuestionById);

// ===========================================
// ADMIN & MANAGER ROUTES
// ===========================================

// Get all questions (admin/manager)
router.get("/", questionController.getQuestions);

// Answer a question (admin/manager)
router.put(
  "/:id/answer",

  [
    body("replyMessage").trim().notEmpty().withMessage("Reply message is required"),
    body("replyMessage").isLength({ min: 5 }).withMessage("Reply must be at least 5 characters"),
  ],
  questionController.answerQuestion
);

// Update question status (admin/manager)
router.put(
  "/:id/status",

  questionController.updateQuestionStatus
);

// Delete a question (admin/manager)
router.delete(
  "/:id",

  questionController.deleteQuestion
);

// Bulk delete questions (admin/manager)
router.delete(
  "/bulk/delete",

  questionController.bulkDeleteQuestions
);

// Get question statistics (admin/manager)
router.get(
  "/stats",

  questionController.getQuestionStatistics
);

// ===========================================
// NOTIFICATION ROUTES
// ===========================================

// Get question notifications (admin/manager)
router.get(
  "/notifications",

  questionController.getQuestionNotifications
);

// Get my question notifications
router.get(
  "/notifications/my",
  questionController.getMyQuestionNotifications
);

// Mark notification as read
router.put(
  "/notifications/:id/read",
  questionController.markNotificationAsRead
);

// Mark all notifications as read
router.put(
  "/notifications/read-all",
  questionController.markAllNotificationsAsRead
);

// Get unread count
router.get(
  "/notifications/unread/count",
  questionController.getUnreadCount
);

// Delete notification
router.delete(
  "/notifications/:id",
  questionController.deleteNotification
);

// Bulk delete notifications
router.delete(
  "/notifications/bulk-delete",
  questionController.bulkDeleteNotifications
);

// Get notification statistics
router.get(
  "/notifications/stats",

  questionController.getNotificationStats
);

module.exports = router;