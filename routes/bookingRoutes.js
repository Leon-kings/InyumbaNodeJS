// ============================================================
// ROUTES / BOOKING.ROUTES.JS
// ============================================================
const express = require('express');
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
  getBookingStats
} = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/stats', getBookingStats);
router.get('/email/:email', getBookingsByEmail);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/verify-payment', verifyPayment);
router.put('/:id/cancel', cancelBooking);
router.delete('/:id', deleteBooking);

module.exports = router;