
// ============================================================
// CONTROLLERS / BOOKING.CONTROLLER.JS (Cloudinary Only)
// ============================================================
const Booking = require("../models/Booking");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Notification = require("../models/Notification");
dotenv.config();
const mongoose = require("mongoose");

// ===========================================
// CLOUDINARY CONFIGURATION
// ===========================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===========================================
// CLOUDINARY STORAGE
// ===========================================
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "BOOKING",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: `booking-${Date.now()}`,
  }),
});

// ===========================================
// MULTER UPLOAD
// ===========================================
const uploadBookingScreenshot = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, JPEG, PNG and WEBP images are allowed."),
        false,
      );
    }

    cb(null, true);
  },
});

// ============================================================
// BOOKING CONTROLLER FUNCTIONS
// ============================================================

// CREATE BOOKING WITH CLOUDINARY SCREENSHOT
const createBooking = async (req, res) => {
  try {
    console.log("📦 Booking body:", req.body);
    console.log("📸 Uploaded file:", req.file);

    const {
      houseId,
      houseName,
      houseType,
      district,
      sector,
      cell,
      village,
      ownerName,
      ownerContact,
      ownerEmail,
      fullName,
      email,
      phone,
      idNumber,
      university,
      studentId,
      purpose,
      checkIn,
      checkOut,
      months,
      guests,
      specialRequests,
      monthlyRent,
      serviceFee,
      totalAmount,
      paymentMethod,
      momoNumber,
    } = req.body;

    // ==========================
    // Validate required fields
    // ==========================
    if (
      !fullName ||
      !email ||
      !phone ||
      !houseId ||
      !houseName ||
      !checkIn ||
      !checkOut ||
      !months ||
      !guests
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // ==========================
    // Cloudinary Image
    // ==========================
    let paymentScreenshot = {
      url: "",
      publicId: "",
    };

    if (req.file) {
      paymentScreenshot = {
        url: req.file.path,
        publicId: req.file.filename,
      };

      console.log(
        "✅ Payment screenshot uploaded:",
        paymentScreenshot
      );
    } else {
      console.log("⚠️ No payment screenshot uploaded");
    }

    // ==========================
    // Create Booking
    // ==========================
    const booking = new Booking({
      houseId,
      houseName,
      houseType,
      district,
      sector,
      cell,
      village,

      ownerName,
      ownerContact,
      ownerEmail,

      fullName,
      email,
      phone,
      idNumber,
      university,
      studentId,
      purpose,

      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),

      months: Number(months),
      guests: Number(guests),

      specialRequests,

      monthlyRent: Number(monthlyRent),
      serviceFee: Number(serviceFee),
      totalAmount: Number(totalAmount),

      paymentMethod: paymentMethod || "momo",
      momoNumber,

      paymentScreenshot,

      paymentStatus: "pending",
      status: "pending",
    });

    await booking.save();

    // ==========================
    // Response
    // ==========================
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        bookingId: booking.bookingId,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentScreenshot: booking.paymentScreenshot.url,
      },
    });

  } catch (error) {
    console.error("❌ Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

// GET ALL BOOKINGS
const getBookings = async (req, res) => {
  try {
    const { status, paymentStatus, houseId, limit = 100, page = 1 } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (houseId) filter.houseId = houseId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BOOKINGS BY EMAIL
const getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { status, paymentStatus, limit = 50, page = 1 } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    let filter = { email: email.toLowerCase().trim() };
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BOOKINGS BY LANDLORD EMAIL
const getBookingsByOwnerEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Owner email is required",
      });
    }

    const bookings = await Booking.find({
      ownerEmail: email.toLowerCase().trim(),
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("❌ Get bookings by owner email error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// GET BOOKING BY ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ bookingId: id });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET ALL NOTIFICATIONS
// ============================================================
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error(
      "❌ Get all notifications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE NOTIFICATION
// ============================================================
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification =
      await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: notification,
    });
  } catch (error) {
    console.error(
      "❌ Delete notification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};


// ============================================================
// DELETE MULTIPLE NOTIFICATIONS
// ============================================================

const bulkDeleteNotifications = async (req, res) => {
  try {
    const { id } = req.body;

    // ===========================
    // VALIDATION
    // ===========================

    if (!Array.isArray(id) || id.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide an array of notification id",
      });
    }

    // ===========================
    // DELETE NOTIFICATIONS
    // ===========================

    const result =
      await Notification.deleteMany({
        _id: {
          $in: id,
        },
      });

    // ===========================
    // NOTHING FOUND
    // ===========================

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No notifications found",
      });
    }

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(200).json({
      success: true,
      message:
        "Notifications deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(
      "❌ Bulk delete notifications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete notifications",
      error: error.message,
    });
  }
};

// ============================================================
// MARK NOTIFICATION AS READ
// ============================================================
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification =
      await Notification.findByIdAndUpdate(
        id,
        {
          $set: {
            isRead: true,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error(
      "❌ Mark notification as read error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// ============================================================
// MARK ALL NOTIFICATIONS AS READ
// Requires only an ID to confirm the request
// ============================================================

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Check that the provided ID exists
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Mark ALL notifications as read
    const result = await Notification.updateMany(
      {},
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(
      "❌ Mark all notifications as read error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};
// ============================================================
// GET NOTIFICATIONS BY EMAIL
// ============================================================
const getNotificationsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const notifications = await Notification.find({
      email: email.toLowerCase().trim(),
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error(
      "❌ Get notifications by email error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// UPDATE BOOKING
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const allowedUpdates = [
      "fullName",
      "email",
      "phone",
      "idNumber",
      "university",
      "studentId",
      "purpose",
      "houseName",
      "houseType",
      "district",
      "sector",
      "cell",
      "village",
      "ownerName",
      "ownerContact",
      "ownerEmail",
      "checkIn",
      "checkOut",
      "months",
      "guests",
      "specialRequests",
      "monthlyRent",
      "serviceFee",
      "totalAmount",
      "paymentMethod",
      "momoNumber",
      "paymentStatus",
      "status",
      "notes",
    ];

    const updates = {};

    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    // Convert dates
    if (updates.checkIn) {
      updates.checkIn = new Date(updates.checkIn);
    }

    if (updates.checkOut) {
      updates.checkOut = new Date(updates.checkOut);
    }

    // ==========================================================
    // Replace payment screenshot if a new one is uploaded
    // ==========================================================
    if (req.file) {
      // Delete old Cloudinary image
      if (
        booking.paymentScreenshot &&
        booking.paymentScreenshot.publicId
      ) {
        try {
          await cloudinary.uploader.destroy(
            booking.paymentScreenshot.publicId
          );
          console.log("🗑️ Old payment screenshot deleted");
        } catch (err) {
          console.error("Failed to delete old image:", err.message);
        }
      }

      updates.paymentScreenshot = {
        url: req.file.path,
        publicId: req.file.filename,
      };

      console.log("📸 New payment screenshot:", updates.paymentScreenshot);
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update booking",
    });
  }
};

// UPDATE BOOKING STATUS
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = status;

    if (notes) {
      booking.notes = notes;
    }

    await booking.save();

    res.json({
      success: true,
      message: "Booking status updated",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// VERIFY PAYMENT
const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, notes } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.paymentStatus = paymentStatus || "verified";

    if (notes) {
      booking.notes = notes;
    }

    await booking.save();

    res.json({
      success: true,
      message: "Payment status updated",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE BOOKING
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Delete screenshot from Cloudinary if exists
    if (booking.paymentScreenshot?.url) {
      try {
        const publicId = booking.paymentScreenshot.publicId;

        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          console.log("🗑️ Deleted screenshot from Cloudinary:", publicId);
        }
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete screenshot from Cloudinary:",
          cloudinaryError,
        );
      }
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
      data: {
        id: booking._id,
        bookingId: booking.bookingId,
        fullName: booking.fullName,
        email: booking.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CANCEL BOOKING
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "cancelled";

    if (reason) {
      booking.notes = `Cancelled: ${reason}`;
    }

    await booking.save();

    res.json({
      success: true,
      message: "Booking cancelled",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BOOKING STATISTICS
const getBookingStats = async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: "pending" });
    const confirmed = await Booking.countDocuments({ status: "confirmed" });
    const cancelled = await Booking.countDocuments({ status: "cancelled" });
    const completed = await Booking.countDocuments({ status: "completed" });

    const paymentPending = await Booking.countDocuments({
      paymentStatus: "pending",
    });
    const paymentVerified = await Booking.countDocuments({
      paymentStatus: "verified",
    });
    const paymentFailed = await Booking.countDocuments({
      paymentStatus: "failed",
    });

    const revenueResult = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "verified",
          status: { $in: ["confirmed", "completed"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ["$paymentStatus", "verified"] },
                "$totalAmount",
                0,
              ],
            },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: {
        total,
        byStatus: { pending, confirmed, cancelled, completed },
        byPayment: {
          pending: paymentPending,
          verified: paymentVerified,
          failed: paymentFailed,
        },
        totalRevenue,
        monthlyBookings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// EXPORT MODULES
// ============================================================
module.exports = {
  createBooking,
  getBookings,
  getBookingsByEmail,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  verifyPayment,
  deleteBooking,
  markAllNotificationsAsRead,
  cancelBooking,
  getBookingStats,
  getBookingsByOwnerEmail,
  getNotificationsByEmail,
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
  bulkDeleteNotifications,
  uploadBookingScreenshot, // Export the multer middleware
};