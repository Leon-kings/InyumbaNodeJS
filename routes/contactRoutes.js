// const express = require("express");
// const router = express.Router();
// const Notification = require("../models/Notification");
// const { body } = require("express-validator");
// const contactController = require("../controllers/contactController");

// // Validation rules
// const contactValidation = [
//   body("name")
//     .trim()
//     .isLength({ min: 2, max: 50 })
//     .withMessage("Name must be between 2 and 50 characters")
//     .escape(),
//   body("email")
//     .trim()
//     .isEmail()
//     .withMessage("Please enter a valid email address")
//     .normalizeEmail(),
//   body("message")
//     .trim()
//     .isLength({ min: 10, max: 1000 })
//     .withMessage("Message must be between 10 and 1000 characters")
//     .escape(),
// ];

// // ===========================
// // PUBLIC ROUTES
// // ===========================

// // Submit contact form
// router.post("/", contactValidation, contactController.submitContact);

// // ===========================
// // ADMIN ROUTES - CONTACTS
// // ===========================

// // Get all contacts with pagination, filtering, search
// router.get("/", contactController.getAllContacts);

// // Get all contact notifications (admin)
// router.get("/notifications", contactController.getContactNotifications);

// // ============================================================
// // CONTACT / ADMIN NOTIFICATION ROUTES
// // ============================================================


// router.put(
//   "/notifications/:id/read",
//   contactController.markContactNotificationAsRead
// );

// router.put(
//   "/notifications/read-all",
//   contactController.bulkMarkContactNotificationsAsRead
// );

// router.delete(
//   "/notifications/bulk",
//   contactController.bulkDeleteContactNotifications
// );

// router.delete(
//   "/notifications/:id",
//   contactController.deleteContactNotification
// );

// // Get contact statistics
// router.get("/statistics", contactController.getStatistics);

// // Export contacts to CSV
// router.get("/export/csv", contactController.exportContacts);

// // Get contacts by email
// router.get("/email/:email", contactController.getContactsByEmail);

// // Get single contact by ID
// router.get("/:id", contactController.getContactById);

// // Update contact (edit)
// router.put("/:id", contactValidation, contactController.editContact);

// // Update contact status
// router.put("/:id/status", contactController.updateContactStatus);

// // Reply to contact
// router.put("/:id/reply", contactController.replyToContact);

// // Delete contact
// router.delete("/:id", contactController.deleteContact);

// // Bulk delete contacts
// router.post("/bulk-delete", contactController.bulkDeleteContacts);

// // ===========================
// // ADMIN ROUTES - NOTIFICATIONS
// // ===========================

// // ============================================================
// // GET USER NOTIFICATIONS BY EMAIL
// // ============================================================
// // GET /api/notifications/:email
// // GET /api/notifications/:email?page=1&limit=20
// // ============================================================

// router.get("/notifications/:email", async (req, res) => {
//   try {
//     const { email } = req.params;

//     // ===========================
//     // VALIDATE EMAIL
//     // ===========================

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     // ===========================
//     // PAGINATION
//     // ===========================

//     const page = Math.max(parseInt(req.query.page) || 1, 1);

//     const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

//     const skip = (page - 1) * limit;

//     // ===========================
//     // QUERY
//     // ===========================

//     const query = {
//       type: {
//         $regex: /^contact_/,
//       },

//       target: {
//         $in: ["user", "both"],
//       },

//       "data.email": email,
//     };

//     // ===========================
//     // GET DATA + TOTAL
//     // ===========================

//     const [notifications, total] = await Promise.all([
//       Notification.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),

//       Notification.countDocuments(query),
//     ]);

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,

//       data: notifications,

//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get user notifications error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch user notifications",
//     });
//   }
// });

// // ============================================================
// // MARK USER NOTIFICATION AS READ
// // ============================================================
// // PUT /api/notifications/:email/:id/read
// // ============================================================

// router.put("/:email/:id/read", async (req, res) => {
//   try {
//     const { email, id } = req.params;

//     // ===========================
//     // VALIDATION
//     // ===========================

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Notification ID is required",
//       });
//     }

//     // ===========================
//     // FIND USER NOTIFICATION
//     // ===========================
//     // IMPORTANT:
//     // We check BOTH the notification ID
//     // and the user's email so one user
//     // cannot mark another user's
//     // notification as read.

//     const notification = await Notification.findOne({
//       _id: id,
//       "data.email": email,
//       type: {
//         $regex: /^contact_/,
//       },
//       target: {
//         $in: ["user", "both"],
//       },
//     });

//     // ===========================
//     // NOT FOUND
//     // ===========================

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: "Notification not found",
//       });
//     }

//     // ===========================
//     // MARK AS READ
//     // ===========================

//     notification.isRead = true;
//     notification.status = "read";
//     notification.readAt = new Date();

//     await notification.save();

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,
//       message: "Notification marked as read",
//       data: notification,
//     });
//   } catch (error) {
//     console.error("Mark user notification as read error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to mark notification as read",
//     });
//   }
// });

// // ============================================================
// // GET USER UNREAD NOTIFICATION COUNT
// // ============================================================
// // GET /api/notifications/:email/unread-count
// // ============================================================

// router.get("/:email/unread-count", async (req, res) => {
//   try {
//     const { email } = req.params;

//     // ===========================
//     // VALIDATE EMAIL
//     // ===========================

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     // ===========================
//     // QUERY
//     // ===========================

//     const query = {
//       type: {
//         $regex: /^contact_/,
//       },

//       isRead: false,

//       status: "new",

//       target: {
//         $in: ["user", "both"],
//       },

//       "data.email": email,
//     };

//     // ===========================
//     // COUNT
//     // ===========================

//     const count = await Notification.countDocuments(query);

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,

//       data: {
//         unreadCount: count,
//       },
//     });
//   } catch (error) {
//     console.error("Get user unread count error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to get unread count",
//     });
//   }
// });

// module.exports = router;












const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const contactController = require("../controllers/contactController");

// ============================================================
// CONTACT VALIDATION
// ============================================================

const contactValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .escape(),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("message")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters")
    .escape(),
];


// ============================================================
// PUBLIC ROUTES
// ============================================================

// Submit contact form
router.post(
  "/",
  contactValidation,
  contactController.submitContact
);


// ============================================================
// CONTACT NOTIFICATIONS
// ============================================================

// ------------------------------------------------------------
// GET ALL CONTACT NOTIFICATIONS
// ------------------------------------------------------------
// GET /api/contact/notifications
// GET /api/contact/notifications?page=1&limit=20
//
// IMPORTANT:
// No role checking
// No user checking
// No target checking
// No email checking
// Returns ALL contact notifications
// ------------------------------------------------------------

router.get(
  "/notifications",
  contactController.getContactNotifications
);


// ------------------------------------------------------------
// MARK ONE NOTIFICATION AS READ
// ------------------------------------------------------------
// PUT /api/contact/notifications/:id/read
// ------------------------------------------------------------

router.put(
  "/notifications/:id/read",
  contactController.markContactNotificationAsRead
);


// ------------------------------------------------------------
// MARK NOTIFICATIONS AS READ
// ------------------------------------------------------------
// PUT /api/contact/notifications/read-all
//
// Body:
// {
//   "ids": ["notificationId1", "notificationId2"]
// }
//
// If ids are omitted or empty:
// ALL contact notifications are marked as read.
// ------------------------------------------------------------

router.put(
  "/notifications/read-all",
  contactController.bulkMarkContactNotificationsAsRead
);


// ------------------------------------------------------------
// MARK ALL NOTIFICATIONS AS READ
// ------------------------------------------------------------
// PUT /api/contact/notifications/mark-all-read
//
// This endpoint marks every contact notification as read.
// ------------------------------------------------------------

router.put(
  "/notifications/mark-all-read",
  contactController.markAllContactNotificationsAsRead
);


// ------------------------------------------------------------
// DELETE ONE NOTIFICATION
// ------------------------------------------------------------
// DELETE /api/contact/notifications/:id
// ------------------------------------------------------------

router.delete(
  "/notifications/:id",
  contactController.deleteContactNotification
);


// ------------------------------------------------------------
// DELETE MULTIPLE NOTIFICATIONS
// ------------------------------------------------------------
// DELETE /api/contact/notifications/bulk
//
// Body:
// {
//   "ids": ["id1", "id2"]
// }
// ------------------------------------------------------------

router.delete(
  "/notifications/bulk",
  contactController.bulkDeleteContactNotifications
);


// ============================================================
// CONTACT MANAGEMENT ROUTES
// ============================================================

// ------------------------------------------------------------
// GET ALL CONTACTS
// ------------------------------------------------------------
// GET /api/contact
// GET /api/contact?page=1&limit=20
// GET /api/contact?status=pending
// GET /api/contact?search=john
// ------------------------------------------------------------

router.get(
  "/",
  contactController.getAllContacts
);


// ------------------------------------------------------------
// GET CONTACT STATISTICS
// ------------------------------------------------------------
// GET /api/contact/statistics
// ------------------------------------------------------------

router.get(
  "/statistics",
  contactController.getStatistics
);


// ------------------------------------------------------------
// EXPORT CONTACTS
// ------------------------------------------------------------
// GET /api/contact/export/csv
// ------------------------------------------------------------

router.get(
  "/export/csv",
  contactController.exportContacts
);


// ------------------------------------------------------------
// GET CONTACTS BY EMAIL
// ------------------------------------------------------------
// GET /api/contact/email/user@example.com
// ------------------------------------------------------------

router.get(
  "/email/:email",
  contactController.getContactsByEmail
);


// ------------------------------------------------------------
// BULK DELETE CONTACTS
// ------------------------------------------------------------
// POST /api/contact/bulk-delete
//
// Body:
// {
//   "ids": ["id1", "id2"]
// }
// ------------------------------------------------------------

router.post(
  "/bulk-delete",
  contactController.bulkDeleteContacts
);


// ------------------------------------------------------------
// GET SINGLE CONTACT
// ------------------------------------------------------------
// GET /api/contact/:id
// ------------------------------------------------------------

router.get(
  "/:id",
  contactController.getContactById
);


// ------------------------------------------------------------
// EDIT CONTACT
// ------------------------------------------------------------
// PUT /api/contact/:id
// ------------------------------------------------------------

router.put(
  "/:id",
  contactValidation,
  contactController.editContact
);


// ------------------------------------------------------------
// UPDATE CONTACT STATUS
// ------------------------------------------------------------
// PUT /api/contact/:id/status
//
// Body:
// {
//   "status": "read"
// }
//
// Allowed:
// pending
// read
// replied
// archived
// ------------------------------------------------------------

router.put(
  "/:id/status",
  contactController.updateContactStatus
);


// ------------------------------------------------------------
// REPLY TO CONTACT
// ------------------------------------------------------------
// PUT /api/contact/:id/reply
//
// Body:
// {
//   "replyMessage": "Thank you for contacting us..."
// }
// ------------------------------------------------------------

router.put(
  "/:id/reply",
  contactController.replyToContact
);


// ------------------------------------------------------------
// DELETE CONTACT
// ------------------------------------------------------------
// DELETE /api/contact/:id
// ------------------------------------------------------------

router.delete(
  "/:id",
  contactController.deleteContact
);


// ============================================================
// LEGACY / EMAIL NOTIFICATION ROUTES
// ============================================================
//
// These routes intentionally DO NOT check:
// - role
// - target
// - target user
// - target email
//
// They operate on ALL contact notifications.
//
// ============================================================


// ------------------------------------------------------------
// GET NOTIFICATIONS
// ------------------------------------------------------------
// GET /api/contact/notifications-by-email/:email
//
// The email is accepted for backwards compatibility,
// but it is NOT used to filter notifications.
//
// Returns ALL contact notifications.
// ------------------------------------------------------------

router.get(
  "/notifications/:email",
  contactController.getMyContactNotifications
);

// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;

