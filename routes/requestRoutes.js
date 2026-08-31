const express = require("express");

const router = express.Router();

const {
  createRequest,

  getRequests,

  getRequestById,

  updateRequest,

  deleteRequest,
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  bulkDeleteNotifications,
  getAllNotificationsByEmail,

  upload,
} = require("../controllers/requestController");

router.post(
  "/",

  upload.single("image"),

  createRequest,
);

router.get("/", getRequests);
router.get("/notifications", getAllNotifications);

router.get("/:id", getRequestById);

router.put("/:id", updateRequest);

router.delete("/:id", deleteRequest);

router.get ("/notifications/:email", getAllNotificationsByEmail)

// ============================================================
// MARK ONE AS READ
// ============================================================

router.put("/notifications/:id/read", markNotificationAsRead);

// ============================================================
// MARK ALL AS READ
// Requires an ID only to authorize/verify existence
// ============================================================

router.put("/notifications/:id/mark-all-read", markAllNotificationsAsRead);

// ============================================================
// BULK DELETE
// ============================================================

router.delete("/notifications/bulk-delete", bulkDeleteNotifications);

// ============================================================
// DELETE ONE
// ============================================================

router.delete("/notifications/:id", deleteNotification);

module.exports = router;
