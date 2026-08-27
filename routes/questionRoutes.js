// const express = require("express");
// const router = express.Router();
// const questionController = require("../controllers/questionController");

// const { body } = require("express-validator");

// // ===========================================
// // VALIDATION RULES
// // ===========================================

// const validateQuestion = [
//   body("name").trim().notEmpty().withMessage("Name is required"),
//   body("email").isEmail().withMessage("Valid email is required"),
//   body("question").trim().notEmpty().withMessage("Question is required"),
//   body("question")
//     .isLength({ min: 10 })
//     .withMessage("Question must be at least 10 characters"),
// ];

// // ===========================================
// // PUBLIC ROUTES
// // ===========================================

// // Submit a question (public)
// router.post("/submit", validateQuestion, questionController.submitQuestion);

// // Get questions by email (public)
// router.get("/email/:email", questionController.getQuestionsByEmail);

// // ===========================================
// // PROTECTED ROUTES (Authenticated Users)
// // ===========================================

// // Get my questions
// router.get("/my-questions", questionController.getMyQuestions);

// // Get a single question
// router.get("/:id", questionController.getQuestionById);

// // ===========================================
// // ADMIN & MANAGER ROUTES
// // ===========================================

// // Get all questions (admin/manager)
// router.get("/", questionController.getQuestions);

// // Answer a question (admin/manager)
// router.put(
//   "/:id/answer",

//   [
//     body("replyMessage")
//       .trim()
//       .notEmpty()
//       .withMessage("Reply message is required"),
//     body("replyMessage")
//       .isLength({ min: 5 })
//       .withMessage("Reply must be at least 5 characters"),
//   ],
//   questionController.answerQuestion,
// );
// router.put("/:id/reply", questionController.replyQuestion);

// // Update question status (admin/manager)
// router.put(
//   "/:id",

//   questionController.updateQuestionStatus,
// );

// // Delete a question (admin/manager)
// router.delete(
//   "/:id",

//   questionController.deleteQuestion,
// );

// // Bulk delete questions (admin/manager)
// router.delete(
//   "/bulk/delete",

//   questionController.bulkDeleteQuestions,
// );

// // Get question statistics (admin/manager)
// router.get(
//   "/stats",

//   questionController.getQuestionStatistics,
// );

// // ===========================================
// // NOTIFICATION ROUTES
// // ===========================================

// // Get question notifications (admin/manager)
// router.get(
//   "/notifications",

//   questionController.getQuestionNotifications,
// );

// // Get my question notifications
// router.get("/notifications/my", questionController.getMyQuestionNotifications);

// // Mark notification as read
// router.put(
//   "/notifications/:id/read",
//   questionController.markNotificationAsRead,
// );

// // Mark all notifications as read
// router.put(
//   "/notifications/read-all",
//   questionController.markAllNotificationsAsRead,
// );

// // Get unread count
// router.get("/notifications/unread/count", questionController.getUnreadCount);

// // Delete notification
// router.delete("/notifications/:id", questionController.deleteNotification);

// // Bulk delete notifications
// router.delete(
//   "/notifications/bulk-delete",
//   questionController.bulkDeleteNotifications,
// );

// // Get notification statistics
// router.get(
//   "/notifications/stats",

//   questionController.getNotificationStats,
// );

// module.exports = router;







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
  body("question")
    .isLength({ min: 10 })
    .withMessage("Question must be at least 10 characters"),
];

const validateAnswer = [
  body("replyMessage")
    .trim()
    .notEmpty()
    .withMessage("Reply message is required"),
  body("replyMessage")
    .isLength({ min: 5 })
    .withMessage("Reply must be at least 5 characters"),
];

// ===========================================
// ===========================================
// NOTIFICATION ROUTES (Must come BEFORE /:id routes)
// ===========================================
// ===========================================

// 1. Get question notifications (admin/manager)
router.get(
  "/notifications",
  questionController.getQuestionNotifications
);

router.get(
  "/notifications/email/:email",
  questionController.getQuestionNotificationsByEmail
);

// 2. Get my question notifications
router.get(
  "/notifications/my",
  questionController.getMyQuestionNotifications
);

// 3. Mark notification as read
router.put(
  "/notifications/:id/read",
  questionController.markNotificationAsRead
);

// 4. Mark all notifications as read
router.put(
  "/notifications/read-all",
  questionController.markAllNotificationsAsRead
);

// 5. Get unread count
router.get(
  "/notifications/unread/count",
  questionController.getUnreadCount
);

// 6. Delete notification
router.delete(
  "/notifications/:id",
  questionController.deleteNotification
);

// 7. Bulk delete notifications
router.delete(
  "/notifications/bulk-delete",
  questionController.bulkDeleteNotifications
);

// 8. Get notification statistics
router.get(
  "/notifications/stats",
  questionController.getNotificationStats
);

// ===========================================
// ===========================================
// PUBLIC ROUTES
// ===========================================
// ===========================================

// 9. Submit a question (public)
router.post("/submit", validateQuestion, questionController.submitQuestion);

// 10. Get questions by email (public)
router.get("/email/:email", questionController.getQuestionsByEmail);

// ===========================================
// ===========================================
// PROTECTED ROUTES (Authenticated Users)
// ===========================================
// ===========================================

// 11. Get my questions
router.get("/my-questions", questionController.getMyQuestions);

// ===========================================
// ===========================================
// ADMIN & MANAGER ROUTES (Must come AFTER /notifications and /email routes)
// ===========================================
// ===========================================

// 12. Get all questions (admin/manager)
router.get("/", questionController.getQuestions);

// 13. Get a single question (Must come AFTER /notifications and /email routes)
router.get("/:id", questionController.getQuestionById);

// 14. Answer a question (admin/manager)
router.put(
  "/:id/answer",
  validateAnswer,
  questionController.answerQuestion
);

// 15. Reply to a question (admin/manager)
router.put(
  "/:id/reply",
  validateAnswer,
  questionController.replyQuestion
);

// 16. Update question status (admin/manager)
router.put(
  "/:id/status",
  questionController.updateQuestionStatus
);

// 17. Delete a question (admin/manager)
router.delete(
  "/:id",
  questionController.deleteQuestion
);

// 18. Bulk delete questions (admin/manager)
router.delete(
  "/bulk/delete",
  questionController.bulkDeleteQuestions
);

// 19. Get question statistics (admin/manager)
router.get(
  "/stats",
  questionController.getQuestionStatistics
);

module.exports = router;