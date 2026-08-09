// // ============================================================
// // ROUTES / BOOKING.ROUTES.JS
// // ============================================================
// const express = require("express");
// const router = express.Router();
// const {
//   createBooking,
//   getBookings,
//   getBookingsByEmail,
//   getBookingById,
//   updateBooking,
//   updateBookingStatus,
//   verifyPayment,
//   deleteBooking,
//   cancelBooking,
//   getBookingStats,
//   getBookingsByOwnerEmail,
// } = require("../controllers/bookingController");
// const { uploadBookingScreenshot } = require("../controllers/bookingController");

// router.post(
//   "/",
//   uploadBookingScreenshot.single("paymentScreenshot"),
//   createBooking,
// );
// router.get("/", getBookings);
// router.get("/stats", getBookingStats);
// router.get("/email/:email", getBookingsByEmail);
// router.get("/:email", getBookingsByOwnerEmail);
// router.get("/:id", getBookingById);
// // Update booking
// router.put(
//   "/:id",
//   uploadBookingScreenshot.single("paymentScreenshot"),
//   updateBooking
// );
// router.put("/:id/status", updateBookingStatus);
// router.put("/:id/verify-payment", verifyPayment);
// router.put("/:id/cancel", cancelBooking);
// router.delete("/:id", deleteBooking);

// module.exports = router;











// ============================================================
// ROUTES / BOOKING.ROUTES.JS
// ============================================================
const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookings,
  getBookingsByEmail,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  verifyPayment,
  deleteBooking,
  cancelBooking,
  getBookingStats,
  getBookingsByOwnerEmail,

  // Notifications
  getAllNotifications,
  getNotificationsByEmail,
} = require("../controllers/bookingController");

const {
  uploadBookingScreenshot,
} = require("../controllers/bookingController");

// ============================================================
// BOOKING ROUTES
// ============================================================

router.post(
  "/",
  uploadBookingScreenshot.single("paymentScreenshot"),
  createBooking,
);

router.get("/", getBookings);

router.get("/stats", getBookingStats);

router.get(
  "/email/:email",
  getBookingsByEmail,
);

// ============================================================
// NOTIFICATION ROUTES
// ============================================================

// Get all notifications
router.get(
  "/notifications",
  getAllNotifications,
);

// Get notifications by email
router.get(
  "/notifications/email/:email",
  getNotificationsByEmail,
);

// ============================================================
// EXISTING BOOKING ROUTES
// ============================================================

router.get(
  "/:email",
  getBookingsByOwnerEmail,
);

router.get(
  "/:id",
  getBookingById,
);

// Update booking
router.put(
  "/:id",
  uploadBookingScreenshot.single("paymentScreenshot"),
  updateBooking,
);

router.put(
  "/:id/status",
  updateBookingStatus,
);

router.put(
  "/:id/verify-payment",
  verifyPayment,
);

router.put(
  "/:id/cancel",
  cancelBooking,
);

router.delete(
  "/:id",
  deleteBooking,
);

module.exports = router;