// const express = require("express");

// const router = express.Router();

// const {
//   createPayment,
//   checkPaymentStatus,
//   getPayment,
//   getBookingPayments,
//   kpayCallback,
//   getPaymentStatistics,
// } = require("../controllers/paymentController");

// // Create payment
// router.post("/create", createPayment);

// // KPay callback
// router.post("/kpay/callback", kpayCallback);

// // Payment status
// router.get("/status/:referenceId", checkPaymentStatus);

// // Payment statistics
// router.get("/statistics", getPaymentStatistics);

// // Booking payments
// router.get("/booking/:bookingId", getBookingPayments);

// // Single payment
// router.get("/:referenceId", getPayment);

// module.exports = router;

const express = require("express");

const router = express.Router();

const {
  createPayment,
  checkPaymentStatus,
  getPayment,
  getBookingPayments,
  kpayCallback,
  getPaymentStatistics,
} = require("../controllers/paymentController");

router.post("/create", createPayment);

router.post("/kpay/callback", kpayCallback);

router.get("/statistics", getPaymentStatistics);

router.get("/status/:referenceId", checkPaymentStatus);

router.get("/booking/:bookingId", getBookingPayments);

router.get("/:referenceId", getPayment);

module.exports = router;
