const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { body } = require("express-validator");
const contactController = require("../controllers/contactController");

// Validation rules
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

// ===========================
// PUBLIC ROUTES
// ===========================

// Submit contact form
router.post("/", contactValidation, contactController.submitContact);

// ===========================
// ADMIN ROUTES - CONTACTS
// ===========================

// Get all contacts with pagination, filtering, search
router.get("/", contactController.getAllContacts);

// Get all contact notifications (admin)
router.get("/notifications", contactController.getContactNotifications);

// ============================================================
// CONTACT / ADMIN NOTIFICATION ROUTES
// ============================================================

router.get(
  "/notifications",
  contactController.getContactNotifications
);

router.put(
  "/notifications/:id/read",
  contactController.markContactNotificationAsRead
);

router.put(
  "/notifications/read-all",
  contactController.bulkMarkContactNotificationsAsRead
);

router.delete(
  "/notifications/bulk",
  contactController.bulkDeleteContactNotifications
);

router.delete(
  "/notifications/:id",
  contactController.deleteContactNotification
);

// Get contact statistics
router.get("/statistics", contactController.getStatistics);

// Export contacts to CSV
router.get("/export/csv", contactController.exportContacts);

// Get contacts by email
router.get("/email/:email", contactController.getContactsByEmail);

// Get single contact by ID
router.get("/:id", contactController.getContactById);

// Update contact (edit)
router.put("/:id", contactValidation, contactController.editContact);

// Update contact status
router.put("/:id/status", contactController.updateContactStatus);

// Reply to contact
router.put("/:id/reply", contactController.replyToContact);

// Delete contact
router.delete("/:id", contactController.deleteContact);

// Bulk delete contacts
router.post("/bulk-delete", contactController.bulkDeleteContacts);

// ===========================
// ADMIN ROUTES - NOTIFICATIONS
// ===========================

// ============================================================
// GET USER NOTIFICATIONS BY EMAIL
// ============================================================
// GET /api/notifications/:email
// GET /api/notifications/:email?page=1&limit=20
// ============================================================

router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // ===========================
    // VALIDATE EMAIL
    // ===========================

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // ===========================
    // PAGINATION
    // ===========================

    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

    const skip = (page - 1) * limit;

    // ===========================
    // QUERY
    // ===========================

    const query = {
      type: {
        $regex: /^contact_/,
      },

      target: {
        $in: ["user", "both"],
      },

      "data.email": email,
    };

    // ===========================
    // GET DATA + TOTAL
    // ===========================

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Notification.countDocuments(query),
    ]);

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(200).json({
      success: true,

      data: notifications,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get user notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user notifications",
    });
  }
});

// ============================================================
// MARK USER NOTIFICATION AS READ
// ============================================================
// PUT /api/notifications/:email/:id/read
// ============================================================

router.put("/:email/:id/read", async (req, res) => {
  try {
    const { email, id } = req.params;

    // ===========================
    // VALIDATION
    // ===========================

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    // ===========================
    // FIND USER NOTIFICATION
    // ===========================
    // IMPORTANT:
    // We check BOTH the notification ID
    // and the user's email so one user
    // cannot mark another user's
    // notification as read.

    const notification = await Notification.findOne({
      _id: id,
      "data.email": email,
      type: {
        $regex: /^contact_/,
      },
      target: {
        $in: ["user", "both"],
      },
    });

    // ===========================
    // NOT FOUND
    // ===========================

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // ===========================
    // MARK AS READ
    // ===========================

    notification.isRead = true;
    notification.status = "read";
    notification.readAt = new Date();

    await notification.save();

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark user notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
});

// ============================================================
// GET USER UNREAD NOTIFICATION COUNT
// ============================================================
// GET /api/notifications/:email/unread-count
// ============================================================

router.get("/:email/unread-count", async (req, res) => {
  try {
    const { email } = req.params;

    // ===========================
    // VALIDATE EMAIL
    // ===========================

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // ===========================
    // QUERY
    // ===========================

    const query = {
      type: {
        $regex: /^contact_/,
      },

      isRead: false,

      status: "new",

      target: {
        $in: ["user", "both"],
      },

      "data.email": email,
    };

    // ===========================
    // COUNT
    // ===========================

    const count = await Notification.countDocuments(query);

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(200).json({
      success: true,

      data: {
        unreadCount: count,
      },
    });
  } catch (error) {
    console.error("Get user unread count error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get unread count",
    });
  }
});

module.exports = router;
