const express = require("express");
const router = express.Router();
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



// Get unread notification count
router.get("/notifications/unread-count", async (req, res) => {
  try {
    const Notification = require("../models/Notification");
    const count = await Notification.countDocuments({
      type: { $regex: /^contact_/ },
      isRead: false,
      status: "new",
      target: { $in: ["admin", "both"] },
    });

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get unread count",
    });
  }
});

// ===========================
// USER ROUTES - NOTIFICATIONS
// ===========================

// Get user notifications by email
router.get("/notifications/:email", async (req, res) => {
  try {
    const Notification = require("../models/Notification");

    const email = req.params.email.toLowerCase().trim();

    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const query = {
      type: {
        $regex: /^contact_/,
      },

      target: {
        $in: ["user", "both"],
      },

      "data.email": email,
    };

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Notification.countDocuments(query),
    ]);

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

// ===========================
// MARK USER NOTIFICATION AS READ
// ===========================

router.put("/notifications/:id/read", async (req, res) => {
  try {
    const Notification = require("../models/Notification");

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    notification.status = "read";

    notification.readAt = new Date();

    await notification.save();

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

// ===========================
// DELETE USER NOTIFICATION
// ===========================

router.delete("/notifications/:id", async (req, res) => {
  try {
    const Notification = require("../models/Notification");

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: {
        id: req.params.id,
      },
    });
  } catch (error) {
    console.error("Delete user notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
});

// ===========================
// GET USER UNREAD COUNT BY EMAIL
// ===========================

router.get("/notifications/:email/unread-count", async (req, res) => {
  try {
    const Notification = require("../models/Notification");

    const email = req.params.email.toLowerCase().trim();

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

    const count = await Notification.countDocuments(query);

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

// Mark notification as read
router.put("/notifications/:id/read", contactController.markNotificationAsRead);

// Mark all notifications as read
router.put(
  "/notifications/mark-all-read",
  contactController.markAllNotificationsAsRead,
);

// ===========================
// USER ROUTES - NOTIFICATIONS (for frontend display)
// ===========================

// Get user notifications (for logged-in users)
router.get("/user/notifications", async (req, res) => {
  try {
    const Notification = require("../models/Notification");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get user email from query or header (in production, use JWT)
    const userEmail = req.query.email || req.headers["x-user-email"];

    let query = {
      type: { $regex: /^contact_/ },
      target: { $in: ["user", "both"] },
    };

    // If user email is provided, filter by it
    if (userEmail) {
      query["data.email"] = userEmail;
    }

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
    ]);

    res.status(200).json({
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
    res.status(500).json({
      success: false,
      message: "Failed to fetch user notifications",
    });
  }
});

// Mark user notification as read
router.put("/user/notifications/:id/read", async (req, res) => {
  try {
    const Notification = require("../models/Notification");
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    notification.status = "read";
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark user notification as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
});

// Get user unread notification count
router.get("/user/notifications/unread-count", async (req, res) => {
  try {
    const Notification = require("../models/Notification");
    const userEmail = req.query.email || req.headers["x-user-email"];

    let query = {
      type: { $regex: /^contact_/ },
      isRead: false,
      status: "new",
      target: { $in: ["user", "both"] },
    };

    if (userEmail) {
      query["data.email"] = userEmail;
    }

    const count = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    console.error("Get user unread count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get unread count",
    });
  }
});

module.exports = router;
