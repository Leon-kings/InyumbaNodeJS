

// ============================================================
// CONTROLLERS / BOOKING.CONTROLLER.JS (Enhanced with Notifications)
// ============================================================
const Booking = require("../models/Booking");
const User = require("../models/User");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Notification = require("../models/Notification");
const UserActivity = require("../activity/UserActivity");
const { sendEmail } = require("../services/emailTransporter");
const mongoose = require("mongoose");

dotenv.config();

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

// ===========================================
// EMAIL TEMPLATES
// ===========================================

const getBookingConfirmationEmail = (booking) => ({
  subject: `Booking Confirmation - ${booking.bookingId}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Booking ID: ${booking.bookingId}</p>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello ${booking.fullName},</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Your booking has been created successfully. Here are the details:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #667eea;">Booking Details</h3>
          <p style="margin: 5px 0;"><strong>Property:</strong> ${booking.houseName}</p>
          <p style="margin: 5px 0;"><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Months:</strong> ${booking.months}</p>
          <p style="margin: 5px 0;"><strong>Guests:</strong> ${booking.guests}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> $${booking.totalAmount}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> ${booking.status}</p>
          <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
        </div>
        
        <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
          <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
            📌 Please wait for the host to confirm your booking. You will receive a notification once confirmed.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          This is an automated confirmation. Please keep this email for your records.
        </p>
      </div>
    </body>
    </html>
  `,
});

const getHostNotificationEmail = (booking) => ({
  subject: `New Booking Request - ${booking.bookingId}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📩 New Booking Request</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Booking ID: ${booking.bookingId}</p>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;">
            <strong>⚠️ New booking requires your attention</strong>
          </p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #f5576c;">Guest Details</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${booking.fullName}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${booking.email}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${booking.phone}</p>
          ${booking.university ? `<p style="margin: 5px 0;"><strong>University:</strong> ${booking.university}</p>` : ""}
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #667eea;">Booking Details</h3>
          <p style="margin: 5px 0;"><strong>Property:</strong> ${booking.houseName}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${booking.district || "N/A"}, ${booking.sector || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Months:</strong> ${booking.months}</p>
          <p style="margin: 5px 0;"><strong>Guests:</strong> ${booking.guests}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> $${booking.totalAmount}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
          <p style="margin: 0; text-align: center;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/host/bookings/${booking._id}" 
               style="display: inline-block; background: #667eea; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px;">
              View & Respond
            </a>
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          Please login to the host panel to confirm or decline this booking.
        </p>
      </div>
    </body>
    </html>
  `,
});

// ===========================================
// NOTIFICATION FUNCTIONS
// ===========================================

// Create notification for specific role
// const createRoleNotification = async (booking, type, role, userInfo = null) => {
//   try {
//     let title = "";
//     let message = "";
//     let priority = "normal";
//     let targetUserId = null;
//     let targetUserEmail = "";
//     let targetUserRole = role;

//     switch (type) {
//       case "created":
//         title = "📩 New Booking Created";
//         message = `New booking ${booking.bookingId} from ${booking.fullName} for ${booking.houseName}`;
//         priority = "high";
//         targetUserId = booking.userId || null;
//         targetUserEmail = booking.email;
//         break;
//       case "request":
//         title = "📩 New Booking Request";
//         message = `New booking request ${booking.bookingId} from ${booking.fullName} for ${booking.houseName}`;
//         priority = "high";
//         targetUserId = booking.userId || null;
//         targetUserEmail = booking.email;
//         break;
//       case "review":
//         title = "📋 Booking Review Required";
//         message = `Booking ${booking.bookingId} requires review`;
//         priority = "high";
//         break;
//       case "confirmed":
//         title = "✅ Booking Confirmed";
//         message = `Booking ${booking.bookingId} has been confirmed`;
//         priority = "high";
//         break;
//       case "cancelled":
//         title = "❌ Booking Cancelled";
//         message = `Booking ${booking.bookingId} has been cancelled`;
//         priority = "high";
//         break;
//       case "completed":
//         title = "✅ Booking Completed";
//         message = `Booking ${booking.bookingId} has been completed`;
//         priority = "normal";
//         break;
//       case "payment_verified":
//         title = "💰 Payment Verified";
//         message = `Payment for booking ${booking.bookingId} has been verified`;
//         priority = "high";
//         break;
//       case "payment_failed":
//         title = "⚠️ Payment Failed";
//         message = `Payment for booking ${booking.bookingId} has failed`;
//         priority = "urgent";
//         break;
//       case "updated":
//         title = "📝 Booking Updated";
//         message = `Booking ${booking.bookingId} has been updated`;
//         priority = "normal";
//         break;
//       default:
//         title = "📩 Booking Notification";
//         message = `Update for booking ${booking.bookingId}`;
//     }

//     // If userInfo is provided, use that for targeting
//     if (userInfo) {
//       targetUserId = userInfo.userId || targetUserId;
//       targetUserEmail = userInfo.email || targetUserEmail;
//       targetUserRole = userInfo.role || role;
//     }

//     const notification = new Notification({
//       type: `booking_${type}`,
//       userId: booking.userId || null,
//       userName: booking.fullName || "User",
//       userEmail: booking.email || "",
//       userRole: role,
//       title,
//       message,
//       isRead: false,
//       status: "new",
//       targetRoles: [role],
//       targetUserId: targetUserId,
//       targetUserEmail: targetUserEmail,
//       targetUserRole: targetUserRole,
//       // bookingId: booking.bookingId,
//       bookingId: booking._id,
//       bookingReference: booking.bookingId || "",
//       bookingDetails: {
//         houseName: booking.houseName,
//         checkIn: booking.checkIn,
//         checkOut: booking.checkOut,
//         totalAmount: booking.totalAmount,
//         status: booking.status,
//         paymentStatus: booking.paymentStatus,
//       },
//       priority,
//       isGlobal: false,
//       metadata: {
//         bookingId: booking.bookingId,
//         houseName: booking.houseName,
//         fullName: booking.fullName,
//         email: booking.email,
//         phone: booking.phone,
//         totalAmount: booking.totalAmount,
//         status: booking.status,
//         paymentStatus: booking.paymentStatus,
//       },
//     });

//     await notification.save();
//     console.log(`✅ ${role} notification created: ${message}`);
//     return notification;
//   } catch (error) {
//     console.error(`❌ Error creating ${role} notification:`, error.message);
//     return null;
//   }
// };

const createRoleNotification = async (booking, type, role, userInfo = null) => {
  try {
    // ============================================================
    // VALIDATION
    // ============================================================

    if (!booking) {
      console.error(
        "❌ Cannot create booking notification: booking is missing",
      );
      return null;
    }

    if (!booking._id) {
      console.error(
        "❌ Cannot create booking notification: booking._id is missing",
      );
      return null;
    }

    if (!role) {
      console.error(
        "❌ Cannot create booking notification: notification role is missing",
      );
      return null;
    }

    // ============================================================
    // NOTIFICATION DATA
    // ============================================================

    let notificationType = "booking_status_changed";
    let title = "📩 Booking Notification";
    let message = `Update for booking ${booking.bookingId || booking._id}`;
    let priority = "normal";

    // ============================================================
    // TARGET USER
    // ============================================================

    let targetUserId = booking.userId || null;
    let targetUserEmail = booking.email || "";
    let targetUserRole = role;

    // ============================================================
    // BOOKING REFERENCE
    // ============================================================

    const bookingReference = booking.bookingId || booking._id.toString();

    // ============================================================
    // NOTIFICATION TYPE
    // ============================================================

    switch (type) {
      // ==========================================================
      // BOOKING CREATED
      // ==========================================================

      case "created":
      case "booking_created":
        notificationType = "booking_created";
        title = "📩 New Booking Created";
        message = `New booking ${bookingReference} from ${
          booking.fullName || "User"
        } for ${booking.houseName || "House"}`;
        priority = "high";
        break;

      // ==========================================================
      // BOOKING REQUEST
      // ==========================================================

      case "request":
      case "booking_request":
        notificationType = "booking_created";
        title = "📩 New Booking Request";
        message = `New booking request ${bookingReference} from ${
          booking.fullName || "User"
        } for ${booking.houseName || "House"}`;
        priority = "high";
        break;

      // ==========================================================
      // BOOKING REVIEW
      // ==========================================================

      case "review":
      case "booking_review":
        notificationType = "booking_updated";
        title = "📋 Booking Review Required";
        message = `Booking ${bookingReference} requires review`;
        priority = "high";
        break;

      // ==========================================================
      // BOOKING CONFIRMED
      // ==========================================================

      case "confirmed":
      case "booking_confirmed":
        notificationType = "booking_confirmed";
        title = "✅ Booking Confirmed";
        message = `Booking ${bookingReference} has been confirmed`;
        priority = "high";
        break;

      // ==========================================================
      // BOOKING CANCELLED
      // ==========================================================

      case "cancelled":
      case "booking_cancelled":
        notificationType = "booking_cancelled";
        title = "❌ Booking Cancelled";
        message = `Booking ${bookingReference} has been cancelled`;
        priority = "high";
        break;

      // ==========================================================
      // BOOKING COMPLETED
      // ==========================================================

      case "completed":
      case "booking_completed":
        notificationType = "booking_completed";
        title = "✅ Booking Completed";
        message = `Booking ${bookingReference} has been completed`;
        priority = "normal";
        break;

      // ==========================================================
      // BOOKING UPDATED
      // ==========================================================

      case "updated":
      case "booking_updated":
        notificationType = "booking_updated";
        title = "📝 Booking Updated";
        message = `Booking ${bookingReference} has been updated`;
        priority = "normal";
        break;

      // ==========================================================
      // BOOKING STATUS CHANGED
      // ==========================================================

      case "status_changed":
      case "booking_status_changed":
        notificationType = "booking_status_changed";
        title = "🔄 Booking Status Changed";
        message = `The status of booking ${bookingReference} has changed to ${
          booking.status || "updated"
        }`;
        priority = "normal";
        break;

      // ==========================================================
      // PAYMENT VERIFIED
      // ==========================================================

      case "payment_verified":
      case "booking_payment_verified":
        notificationType = "booking_payment_verified";
        title = "💰 Payment Verified";
        message = `Payment for booking ${bookingReference} has been verified`;
        priority = "high";
        break;

      // ==========================================================
      // PAYMENT FAILED
      // ==========================================================

      case "payment_failed":
      case "booking_payment_failed":
        notificationType = "booking_payment_failed";
        title = "⚠️ Payment Failed";
        message = `Payment for booking ${bookingReference} has failed`;
        priority = "urgent";
        break;

      // ==========================================================
      // PAYMENT PENDING
      // ==========================================================

      case "payment_pending":
      case "booking_payment_pending":
        notificationType = "booking_payment_pending";
        title = "⏳ Booking Payment Pending";
        message = `Payment for booking ${bookingReference} is pending`;
        priority = "high";
        break;

      // ==========================================================
      // PAYMENT REJECTED
      // ==========================================================

      case "payment_rejected":
      case "booking_payment_rejected":
        notificationType = "booking_payment_rejected";
        title = "❌ Booking Payment Rejected";
        message = `Payment for booking ${bookingReference} has been rejected`;
        priority = "high";
        break;

      // ==========================================================
      // PAYMENT RECEIVED
      // ==========================================================

      case "payment_received":
      case "booking_payment_received":
        notificationType = "booking_payment_received";
        title = "💰 Booking Payment Received";
        message = `Payment for booking ${bookingReference} has been received`;
        priority = "high";
        break;

      // ==========================================================
      // PAYMENT COMPLETED
      // ==========================================================

      case "payment_completed":
      case "booking_payment_completed":
        notificationType = "booking_payment_completed";
        title = "✅ Booking Payment Completed";
        message = `Payment for booking ${bookingReference} has been completed`;
        priority = "normal";
        break;

      // ==========================================================
      // DEFAULT
      // ==========================================================

      default:
        notificationType = "booking_status_changed";
        title = "📩 Booking Notification";
        message = `Update for booking ${bookingReference}`;
        priority = "normal";
        break;
    }

    // ============================================================
    // USER INFO OVERRIDE
    // ============================================================

    if (userInfo) {
      if (userInfo.userId) {
        targetUserId = userInfo.userId;
      }

      if (userInfo.email) {
        targetUserEmail = userInfo.email;
      }

      if (userInfo.role) {
        targetUserRole = userInfo.role;
      }
    }

    // ============================================================
    // CREATE NOTIFICATION
    // ============================================================

    const notification = new Notification({
      // ----------------------------------------------------------
      // Notification type
      // ----------------------------------------------------------
      type: notificationType,

      // ----------------------------------------------------------
      // User who caused the action
      // ----------------------------------------------------------
      userId: booking.userId || null,
      userName: booking.fullName || "User",
      userEmail: booking.email || "",

      // ----------------------------------------------------------
      // Notification content
      // ----------------------------------------------------------
      title,
      message,

      // ----------------------------------------------------------
      // Target
      // ----------------------------------------------------------
      targetRoles: [role],
      targetUserId,
      targetUserEmail,

      // ----------------------------------------------------------
      // Booking references
      //
      // bookingId MUST be MongoDB ObjectId
      // bookingReference contains BK20260818-8205
      // ----------------------------------------------------------
      bookingId: booking._id,
      bookingReference,

      // ----------------------------------------------------------
      // Priority
      // ----------------------------------------------------------
      priority,

      // ----------------------------------------------------------
      // Read status
      // ----------------------------------------------------------
      isRead: false,
      status: "new",

      // ----------------------------------------------------------
      // Metadata
      // ----------------------------------------------------------
      metadata: {
        bookingId: bookingReference,
        bookingMongoId: booking._id,
        houseName: booking.houseName || "",
        fullName: booking.fullName || "",
        email: booking.email || "",
        phone: booking.phone || "",
        totalAmount: booking.totalAmount || 0,
        status: booking.status || "",
        paymentStatus: booking.paymentStatus || "",
        targetRole: targetUserRole,
      },
    });

    // ============================================================
    // SAVE
    // ============================================================

    await notification.save();

    console.log(`✅ ${role} booking notification created: ${notificationType}`);

    return notification;
  } catch (error) {
    console.error(`❌ Error creating ${role} notification:`, error.message);

    return null;
  }
};

// Create notifications for all roles
const createAllRoleNotifications = async (booking, type, userInfo = null) => {
  const roles = ["admin", "manager", "host", "user"];
  const notifications = [];

  for (const role of roles) {
    // Skip user notification if it's a host request
    if (type === "request" && role === "user") continue;

    const notification = await createRoleNotification(
      booking,
      type,
      role,
      userInfo,
    );
    if (notification) {
      notifications.push(notification);
    }
  }

  return notifications;
};

// ===========================================
// SEND EMAIL NOTIFICATIONS
// ===========================================

const sendBookingEmails = async (booking, type) => {
  try {
    // Send confirmation to user
    if (type === "created" || type === "confirmed") {
      const userEmailTemplate = getBookingConfirmationEmail(booking);
      await sendEmail({
        to: booking.email,
        subject: userEmailTemplate.subject,
        html: userEmailTemplate.html,
      });
      console.log(`✅ Booking confirmation email sent to ${booking.email}`);
    }

    // Send notification to host
    if (type === "created" || type === "request") {
      const hostEmailTemplate = getHostNotificationEmail(booking);
      if (booking.ownerEmail) {
        await sendEmail({
          to: booking.ownerEmail,
          subject: hostEmailTemplate.subject,
          html: hostEmailTemplate.html,
        });
        console.log(`✅ Host notification email sent to ${booking.ownerEmail}`);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ Failed to send booking emails:", error.message);
    return false;
  }
};

// ============================================================
// BOOKING CONTROLLER FUNCTIONS
// ============================================================

// CREATE BOOKING WITH CLOUDINARY SCREENSHOT
// const createBooking = async (req, res) => {
//   try {
//     console.log("📦 Booking body:", req.body);
//     console.log("📸 Uploaded file:", req.file);

//     const {
//       houseId,
//       houseName,
//       houseType,
//       district,
//       sector,
//       cell,
//       village,
//       ownerName,
//       ownerContact,
//       ownerEmail,
//       fullName,
//       email,
//       phone,
//       idNumber,
//       university,
//       studentId,
//       purpose,
//       checkIn,
//       checkOut,
//       months,
//       guests,
//       specialRequests,
//       monthlyRent,
//       serviceFee,
//       totalAmount,
//       paymentMethod,
//       momoNumber,
//     } = req.body;

//     // ==========================
//     // Validate required fields
//     // ==========================
//     if (
//       !fullName ||
//       !email ||
//       !phone ||
//       !houseId ||
//       !houseName ||
//       !checkIn ||
//       !checkOut ||
//       !months ||
//       !guests
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields",
//       });
//     }

//     // ==========================
//     // Get user info from request
//     // ==========================
//     const userId = req.user?.id || null;
//     const userRole = req.user?.role || "user";

//     // ==========================
//     // Cloudinary Image
//     // ==========================
//     let paymentScreenshot = {
//       url: "",
//       publicId: "",
//     };

//     if (req.file) {
//       paymentScreenshot = {
//         url: req.file.path,
//         publicId: req.file.filename,
//       };

//       console.log("✅ Payment screenshot uploaded:", paymentScreenshot);
//     } else {
//       console.log("⚠️ No payment screenshot uploaded");
//     }

//     // ==========================
//     // Create Booking
//     // ==========================
//     const booking = new Booking({
//       userId,
//       houseId,
//       houseName,
//       houseType,
//       district,
//       sector,
//       cell,
//       village,
//       ownerName,
//       ownerContact,
//       ownerEmail,
//       fullName,
//       email,
//       phone,
//       idNumber,
//       university,
//       studentId,
//       purpose,
//       checkIn: new Date(checkIn),
//       checkOut: new Date(checkOut),
//       months: Number(months),
//       guests: Number(guests),
//       specialRequests,
//       monthlyRent: Number(monthlyRent),
//       serviceFee: Number(serviceFee),
//       totalAmount: Number(totalAmount),
//       paymentMethod: paymentMethod || "momo",
//       momoNumber,
//       paymentScreenshot,
//       paymentStatus: "pending",
//       status: "pending",
//     });

//     await booking.save();
//     console.log(`✅ Booking created: ${booking.bookingId}`);

//     // ==========================
//     // SEND EMAILS
//     // ==========================
//     await sendBookingEmails(booking, "created");

//     // ==========================
//     // CREATE ROLE-BASED NOTIFICATIONS
//     // ==========================
//     const userInfo = {
//       userId: userId,
//       email: email,
//       role: userRole,
//     };
//     await createAllRoleNotifications(booking, "created", userInfo);

//     // ==========================
//     // CREATE USER ACTIVITY
//     // ==========================
//     try {
//       await UserActivity.create({
//         userId: userId,
//         userName: fullName,
//         userEmail: email,
//         action: "booking_created",
//         description: `User ${fullName} created a booking for ${houseName}`,
//         ipAddress: req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || null,
//         userAgent: req.headers["user-agent"] || null,
//         metadata: {
//           bookingId: booking.bookingId,
//           houseId: booking.houseId,
//           totalAmount: booking.totalAmount,
//         },
//       });
//       console.log(`✅ User activity created for ${email}`);
//     } catch (activityError) {
//       console.error("❌ Failed to create user activity:", activityError.message);
//     }

//     // ==========================
//     // Response
//     // ==========================
//     return res.status(201).json({
//       success: true,
//       message: "Booking created successfully. Notifications have been sent.",
//       data: {
//         bookingId: booking.bookingId,
//         status: booking.status,
//         paymentStatus: booking.paymentStatus,
//         paymentScreenshot: booking.paymentScreenshot.url,
//       },
//     });

//   } catch (error) {
//     console.error("❌ Create booking error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create booking",
//     });
//   }
// };

const createBooking = async (req, res) => {
  try {
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

    // ============================================================
    // VALIDATE REQUIRED FIELDS
    // ============================================================

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

    // ============================================================
    // USER INFORMATION
    // ============================================================

    const userId = req.user?.id || null;
    const userRole = req.user?.role || "user";

    // ============================================================
    // PAYMENT SCREENSHOT
    // ============================================================

    let paymentScreenshot = {
      url: "",
      publicId: "",
    };

    if (req.file) {
      paymentScreenshot = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    // ============================================================
    // CREATE BOOKING
    // ============================================================

    const booking = new Booking({
      userId,

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

      monthlyRent: Number(monthlyRent) || 0,
      serviceFee: Number(serviceFee) || 0,
      totalAmount: Number(totalAmount) || 0,

      paymentMethod: paymentMethod || "momo",
      momoNumber,

      paymentScreenshot,

      paymentStatus: "pending",
      status: "pending",
    });

    // ============================================================
    // SAVE BOOKING FIRST
    // ============================================================

    await booking.save();

    // ============================================================
    // PREPARE RESPONSE DATA
    // ============================================================

    const responseData = {
      bookingId: booking.bookingId,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentScreenshot: booking.paymentScreenshot?.url || "",
    };

    // ============================================================
    // SEND RESPONSE IMMEDIATELY
    // ============================================================

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: responseData,
    });

    // ============================================================
    // EVERYTHING BELOW RUNS AFTER RESPONSE
    // ============================================================

    // ------------------------------------------------------------
    // SEND EMAILS
    // ------------------------------------------------------------

    Promise.resolve().then(async () => {
      try {
        await sendBookingEmails(booking, "created");
      } catch (emailError) {
        console.error("❌ Failed to send booking emails:", emailError.message);
      }
    });

    // ------------------------------------------------------------
    // CREATE ROLE-BASED NOTIFICATIONS
    // ------------------------------------------------------------

    Promise.resolve().then(async () => {
      try {
        const userInfo = {
          userId,
          email,
          role: userRole,
        };

        await createAllRoleNotifications(booking, "created", userInfo);
      } catch (notificationError) {
        console.error(
          "❌ Failed to create booking notifications:",
          notificationError.message,
        );
      }
    });

    // ------------------------------------------------------------
    // CREATE USER ACTIVITY
    // ------------------------------------------------------------

    Promise.resolve().then(async () => {
      try {
        const ipAddress =
          req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
          req.socket.remoteAddress ||
          null;

        await UserActivity.create({
          userId,
          userName: fullName,
          userEmail: email,
          action: "booking_created",

          description: `User ${fullName} created a booking for ${houseName}`,

          ipAddress,

          userAgent: req.headers["user-agent"] || null,

          metadata: {
            bookingId: booking.bookingId,
            houseId: booking.houseId,
            totalAmount: booking.totalAmount,
          },
        });
      } catch (activityError) {
        console.error(
          "❌ Failed to create user activity:",
          activityError.message,
        );
      }
    });
  } catch (error) {
    console.error("❌ Create booking error:", error.message);

    // Only send this if the response hasn't already been sent.
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create booking",
      });
    }
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
    console.error("❌ Get bookings error:", error);
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
    console.error("❌ Get bookings by email error:", error);
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
    console.error("❌ Get booking by ID error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
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
      if (booking.paymentScreenshot && booking.paymentScreenshot.publicId) {
        try {
          await cloudinary.uploader.destroy(booking.paymentScreenshot.publicId);
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
      },
    );

    // Create notification for update
    await createAllRoleNotifications(updatedBooking, "updated");

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
// const updateBookingStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, notes } = req.body;

//     if (!status) {
//       return res.status(400).json({
//         success: false,
//         message: "Status is required",
//       });
//     }

//     const booking = await Booking.findById(id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     const oldStatus = booking.status;
//     booking.status = status;

//     if (notes) {
//       booking.notes = notes;
//     }

//     await booking.save();

//     // Create notification based on status
//     let notificationType = "updated";
//     if (status === "confirmed") notificationType = "confirmed";
//     else if (status === "cancelled") notificationType = "cancelled";
//     else if (status === "completed") notificationType = "completed";

//     await createAllRoleNotifications(booking, notificationType);

//     // Send email confirmation for status change
//     if (status === "confirmed" || status === "cancelled") {
//       await sendBookingEmails(booking, status);
//     }

//     res.json({
//       success: true,
//       message: "Booking status updated",
//       data: booking,
//     });
//   } catch (error) {
//     console.error("❌ Update booking status error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // ============================================================
    // VALIDATE STATUS
    // ============================================================

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // ============================================================
    // FIND BOOKING
    // ============================================================

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ============================================================
    // SAVE OLD STATUS
    // ============================================================

    const oldStatus = booking.status;

    // ============================================================
    // UPDATE STATUS
    // ============================================================

    booking.status = status;

    if (notes !== undefined) {
      booking.notes = notes;
    }

    await booking.save();

    // ============================================================
    // CREATE NOTIFICATION TYPE
    // ============================================================

    let notificationType = "booking_status_changed";

    if (status === "confirmed") {
      notificationType = "booking_confirmed";
    } else if (status === "cancelled") {
      notificationType = "booking_cancelled";
    } else if (status === "completed") {
      notificationType = "booking_completed";
    } else if (status === "pending") {
      notificationType = "booking_status_changed";
    } else if (status === "booked") {
      notificationType = "booking_status_changed";
    }

    // ============================================================
    // CREATE NOTIFICATIONS FOR ALL ROLES
    // ============================================================

    await createAllRoleNotifications(booking, notificationType);

    // ============================================================
    // SEND EMAIL FOR CONFIRMED / CANCELLED
    // ============================================================

    if (status === "confirmed" || status === "cancelled") {
      await sendBookingEmails(booking, status);
    }

    // ============================================================
    // RESPONSE
    // ============================================================

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: {
        booking,
        oldStatus,
        newStatus: status,
        notificationType,
      },
    });
  } catch (error) {
    console.error("❌ Update booking status error:", error);

    return res.status(500).json({
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

    const oldPaymentStatus = booking.paymentStatus;
    booking.paymentStatus = paymentStatus || "verified";

    if (notes) {
      booking.notes = notes;
    }

    await booking.save();

    // Create notification based on payment status
    const notificationType =
      paymentStatus === "verified" ? "payment_verified" : "payment_failed";
    await createAllRoleNotifications(booking, notificationType);

    res.json({
      success: true,
      message: "Payment status updated",
      data: booking,
    });
  } catch (error) {
    console.error("❌ Verify payment error:", error);
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

    // Create notification for deletion
    await createAllRoleNotifications(booking, "deleted");

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
    console.error("❌ Delete booking error:", error);
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

    // Create notification for cancellation
    await createAllRoleNotifications(booking, "cancelled");

    res.json({
      success: true,
      message: "Booking cancelled",
      data: booking,
    });
  } catch (error) {
    console.error("❌ Cancel booking error:", error);
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
    console.error("❌ Get booking stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// NOTIFICATION FUNCTIONS (Booking Related)
// ============================================================

// GET ALL NOTIFICATIONS
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("❌ Get all notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// GET NOTIFICATIONS BY EMAIL
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
    console.error("❌ Get notifications by email error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// GET NOTIFICATIONS BY ROLE
const getNotificationsByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { page = 1, limit = 20, isRead } = req.query;

    const validRoles = ["user", "admin", "manager", "host"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be: user, admin, manager, or host",
      });
    }

    const filter = {
      targetRoles: { $in: [role] },
    };

    if (isRead !== undefined) {
      filter.isRead = isRead === "true";
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments(filter),
    ]);

    const unreadCount = await Notification.countDocuments({
      ...filter,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      role,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("❌ Get notifications by role error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// GET MY NOTIFICATIONS
const getMyNotifications = async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 20, isRead } = req.query;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const filter = {
      $or: [
        { targetRoles: { $in: [user.role] } },
        { targetUserId: user.id },
        { targetUserEmail: user.email },
        { userId: user.id },
      ],
    };

    if (isRead !== undefined) {
      filter.isRead = isRead === "true";
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments(filter),
    ]);

    const unreadCount = await Notification.countDocuments({
      ...filter,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      userRole: user.role,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("❌ Get my notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// DELETE NOTIFICATION
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

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
    console.error("❌ Delete notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

// BULK DELETE NOTIFICATIONS
const bulkDeleteNotifications = async (req, res) => {
  try {
    const { ids } = req.body;

    // ===========================
    // VALIDATION
    // ===========================

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of notification IDs",
      });
    }

    // ===========================
    // DELETE NOTIFICATIONS
    // ===========================

    const result = await Notification.deleteMany({
      _id: {
        $in: ids,
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
      message: "Notifications deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("❌ Bulk delete notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notifications",
      error: error.message,
    });
  }
};

// MARK NOTIFICATION AS READ
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Check permission
    const hasPermission =
      notification.targetRoles.includes(user.role) ||
      notification.targetUserId?.toString() === user.id ||
      notification.targetUserEmail === user.email ||
      notification.userId?.toString() === user.id ||
      user.role === "admin";

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to mark this notification as read",
      });
    }

    notification.isRead = true;
    notification.status = "read";
    notification.readAt = new Date();

    if (!notification.readBy) {
      notification.readBy = [];
    }

    notification.readBy.push({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
    });

    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("❌ Mark notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// MARK ALL NOTIFICATIONS AS READ
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const user = req.user;
    const { role } = req.query;

    let filter = {
      isRead: false,
    };

    if (role) {
      filter.targetRoles = { $in: [role] };
    } else if (user) {
      filter.$or = [
        { targetRoles: { $in: [user.role] } },
        { targetUserId: user.id },
        { targetUserEmail: user.email },
        { userId: user.id },
      ];
    }

    const result = await Notification.updateMany(filter, {
      $set: {
        isRead: true,
        status: "read",
        readAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("❌ Mark all notifications as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

// GET UNREAD COUNT
const getUnreadCount = async (req, res) => {
  try {
    const user = req.user;
    const { role } = req.query;

    let filter = {
      isRead: false,
    };

    if (role) {
      filter.targetRoles = { $in: [role] };
    } else if (user) {
      filter.$or = [
        { targetRoles: { $in: [user.role] } },
        { targetUserId: user.id },
        { targetUserEmail: user.email },
        { userId: user.id },
      ];
    }

    const count = await Notification.countDocuments(filter);

    // Get counts by role
    const roleCounts = await Notification.aggregate([
      {
        $match: filter,
      },
      {
        $unwind: "$targetRoles",
      },
      {
        $group: {
          _id: "$targetRoles",
          count: { $sum: 1 },
        },
      },
    ]);

    const countsByRole = {};
    roleCounts.forEach((item) => {
      countsByRole[item._id] = item.count;
    });

    return res.status(200).json({
      success: true,
      totalUnread: count,
      byRole: countsByRole,
    });
  } catch (error) {
    console.error("❌ Get unread count error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get unread count",
      error: error.message,
    });
  }
};

// ============================================================
// EXPORT MODULES
// ============================================================
module.exports = {
  // Booking CRUD
  createBooking,
  getBookings,
  getBookingsByEmail,
  getBookingsByOwnerEmail,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  verifyPayment,
  deleteBooking,
  cancelBooking,
  getBookingStats,

  // Notification Management
  getAllNotifications,
  getNotificationsByEmail,
  getNotificationsByRole,
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  bulkDeleteNotifications,
  getUnreadCount,

  // Upload middleware
  uploadBookingScreenshot,
};
