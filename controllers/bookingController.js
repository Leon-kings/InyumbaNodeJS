// // ============================================================
// // CONTROLLERS / BOOKING.CONTROLLER.JS (Combined with Email & Cloudinary)
// // ============================================================
// const Booking = require("../models/Booking");
// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");
// const cloudinary = require("cloudinary").v2;
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

// dotenv.config();

// // ===========================================
// // CLOUDINARY CONFIGURATION
// // ===========================================
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ===========================================
// // CLOUDINARY STORAGE
// // ===========================================
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => ({
//     folder: "BOOKING",
//     resource_type: "image",
//     allowed_formats: ["jpg", "jpeg", "png", "webp"],
//     public_id: `booking-${Date.now()}`,
//   }),
// });

// // ===========================================
// // MULTER UPLOAD
// // ===========================================
// const uploadBookingScreenshot = multer({
//   storage,
//   limits: {
//     fileSize: 1 * 1024 * 1024, // 1MB
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

//     if (!allowedTypes.includes(file.mimetype)) {
//       return cb(
//         new Error("Only JPG, JPEG, PNG and WEBP images are allowed."),
//         false,
//       );
//     }

//     cb(null, true);
//   },
// });

// // ============================================================
// // EMAIL TRANSPORTER
// // ============================================================
// const dns = require("dns");

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: Number(process.env.SMTP_PORT) === 465,

//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },

//   family: 4,

//   connectionTimeout: 30000,
//   greetingTimeout: 30000,
//   socketTimeout: 30000,
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error(
//       "❌ SMTP connection failed:",
//       error.message
//     );
//   } else {
//     console.log(
//       "✅ SMTP server for book is ready"
//     );
//   }
// });
// // ============================================================
// // SEND EMAIL FUNCTION
// // ============================================================
// const sendEmail = async (to, subject, html) => {
//   try {
//     const info = await transporter.sendMail({
//       from: process.env.ADMIN_EMAIL,
//       to,
//       subject,
//       html,
//     });
//     console.log(`📧 Email sent to ${to}: ${info.messageId}`);
//     return { success: true };
//   } catch (error) {
//     console.error("❌ Email error:", error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ============================================================
// // EMAIL TEMPLATES
// // ============================================================
// const guestConfirmationEmail = (data) => ({
//   subject: `Booking Confirmed - ${data.bookingId}`,
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background: #FF385C; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
//         .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
//         .details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
//         .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
//         .row:last-child { border-bottom: none; }
//         .total { font-size: 20px; font-weight: bold; color: #FF385C; }
//         .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
//         .badge { display: inline-block; background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
//         .screenshot { max-width: 100%; border-radius: 8px; margin: 10px 0; border: 1px solid #ddd; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>🏠 Booking Confirmed!</h1>
//         </div>
//         <div class="content">
//           <p>Dear <strong>${data.fullName}</strong>,</p>
//           <p>Your booking has been confirmed successfully.</p>
          
//           <div class="details">
//             <h3>Booking #${data.bookingId} <span class="badge">CONFIRMED</span></h3>
//             <div class="row"><span>Property:</span><span><strong>${data.houseName}</strong></span></div>
//             <div class="row"><span>Location:</span><span>${data.district}, ${data.sector}</span></div>
//             <div class="row"><span>Check-in:</span><span>${new Date(data.checkIn).toLocaleDateString()}</span></div>
//             <div class="row"><span>Check-out:</span><span>${new Date(data.checkOut).toLocaleDateString()}</span></div>
//             <div class="row"><span>Duration:</span><span>${data.months} month(s)</span></div>
//             <div class="row"><span>Guests:</span><span>${data.guests}</span></div>
//             <div class="row"><span>Monthly Rent:</span><span>${data.monthlyRent.toLocaleString()} RWF</span></div>
//             <div class="row"><span>Service Fee:</span><span>${data.serviceFee.toLocaleString()} RWF</span></div>
//             <div class="row total"><span>Total Paid:</span><span>${data.totalAmount.toLocaleString()} RWF</span></div>
//           </div>
          
//           ${
//             data.paymentScreenshot
//               ? `
//           <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center;">
//             <p><strong>📸 Payment Screenshot</strong></p>
//             <img src="${data.paymentScreenshot}" alt="Payment Screenshot" class="screenshot" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 1px solid #ddd;" />
//           </div>
//           `
//               : ""
//           }
          
//           <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; border-left: 4px solid #FF385C; margin: 15px 0;">
//             <p><strong>🏢 Landlord:</strong> ${data.ownerName || "N/A"}</p>
//             <p><strong>📞 Contact:</strong> ${data.ownerContact || "N/A"}</p>
//           </div>
          
//           ${
//             data.specialRequests
//               ? `
//           <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p><strong>📝 Special Requests:</strong> ${data.specialRequests}</p>
//           </div>
//           `
//               : ""
//           }
          
//           <p>Questions? Contact: <a href="mailto:${process.env.SMTP_USER}">${process.env.SMTP_USER}</a></p>
//         </div>
//         <div class="footer">
//           <p>© ${new Date().getFullYear()} Student Housing Booking. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `,
// });

// const ownerNotificationEmail = (data) => ({
//   subject: `New Booking - ${data.bookingId}`,
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
//         .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
//         .details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
//         .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
//         .row:last-child { border-bottom: none; }
//         .total { font-size: 18px; font-weight: bold; color: #2563eb; }
//         .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
//         .badge { display: inline-block; background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
//         .screenshot { max-width: 100%; border-radius: 8px; margin: 10px 0; border: 1px solid #ddd; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>📋 New Booking Received!</h1>
//         </div>
//         <div class="content">
//           <p>Dear <strong>${data.ownerName || "Property Owner"}</strong>,</p>
//           <p>You have received a new booking for your property.</p>
          
//           <div class="details">
//             <h3>Booking #${data.bookingId} <span class="badge">NEW</span></h3>
            
//             <h4 style="margin: 15px 0 10px; color: #2563eb;">👤 Guest</h4>
//             <div class="row"><span>Name:</span><span>${data.fullName}</span></div>
//             <div class="row"><span>Email:</span><span>${data.email}</span></div>
//             <div class="row"><span>Phone:</span><span>${data.phone}</span></div>
//             ${data.university ? `<div class="row"><span>University:</span><span>${data.university}</span></div>` : ""}
            
//             <h4 style="margin: 15px 0 10px; color: #2563eb;">📅 Booking</h4>
//             <div class="row"><span>Property:</span><span><strong>${data.houseName}</strong></span></div>
//             <div class="row"><span>Location:</span><span>${data.district}, ${data.sector}</span></div>
//             <div class="row"><span>Check-in:</span><span>${new Date(data.checkIn).toLocaleDateString()}</span></div>
//             <div class="row"><span>Check-out:</span><span>${new Date(data.checkOut).toLocaleDateString()}</span></div>
//             <div class="row"><span>Duration:</span><span>${data.months} month(s)</span></div>
//             <div class="row"><span>Guests:</span><span>${data.guests}</span></div>
            
//             <h4 style="margin: 15px 0 10px; color: #2563eb;">💰 Payment</h4>
//             <div class="row"><span>Monthly Rent:</span><span>${data.monthlyRent.toLocaleString()} RWF</span></div>
//             <div class="row"><span>Service Fee:</span><span>${data.serviceFee.toLocaleString()} RWF</span></div>
//             <div class="row total"><span>Total:</span><span>${data.totalAmount.toLocaleString()} RWF</span></div>
//             <div class="row"><span>Payment Status:</span><span style="color: #22c55e; font-weight: bold;">${data.paymentStatus.toUpperCase()}</span></div>
//           </div>
          
//           ${
//             data.paymentScreenshot
//               ? `
//           <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center;">
//             <p><strong>📸 Payment Screenshot</strong></p>
//             <img src="${data.paymentScreenshot}" alt="Payment Screenshot" class="screenshot" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 1px solid #ddd;" />
//           </div>
//           `
//               : ""
//           }
          
//           ${
//             data.specialRequests
//               ? `
//           <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p><strong>📝 Special Requests:</strong> ${data.specialRequests}</p>
//           </div>
//           `
//               : ""
//           }
//         </div>
//         <div class="footer">
//           <p>© ${new Date().getFullYear()} Student Housing Booking. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `,
// });

// const paymentVerifiedEmail = (data) => ({
//   subject: `Payment Verified - ${data.bookingId}`,
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
//         .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
//         .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>✅ Payment Verified!</h1>
//         </div>
//         <div class="content">
//           <p>Dear <strong>${data.fullName}</strong>,</p>
//           <p>Your payment for booking <strong>#${data.bookingId}</strong> has been verified.</p>
//           <p>Your booking is now fully confirmed.</p>
//           <p>Thank you for choosing us!</p>
//         </div>
//         <div class="footer">
//           <p>© ${new Date().getFullYear()} Student Housing Booking</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `,
// });

// const bookingCancelledEmail = (data) => ({
//   subject: `Booking Cancelled - ${data.bookingId}`,
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
//         .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
//         .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>❌ Booking Cancelled</h1>
//         </div>
//         <div class="content">
//           <p>Dear <strong>${data.fullName}</strong>,</p>
//           <p>Your booking <strong>#${data.bookingId}</strong> has been cancelled.</p>
//           ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ""}
//           <p>If you have questions, contact us.</p>
//         </div>
//         <div class="footer">
//           <p>© ${new Date().getFullYear()} Student Housing Booking</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `,
// });

// // ============================================================
// // BOOKING CONTROLLER FUNCTIONS
// // ============================================================

// // CREATE BOOKING WITH CLOUDINARY SCREENSHOT
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

//       console.log(
//         "✅ Payment screenshot uploaded:",
//         paymentScreenshot
//       );
//     } else {
//       console.log("⚠️ No payment screenshot uploaded");
//     }


//     // ==========================
//     // Create Booking
//     // ==========================
//     const booking = new Booking({
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


//     // ==========================
//     // Email Data
//     // ==========================
//     const emailData = {
//       bookingId: booking.bookingId,

//       fullName,
//       email,
//       phone,

//       houseName,
//       district,
//       sector,

//       checkIn: booking.checkIn,
//       checkOut: booking.checkOut,

//       months: booking.months,
//       guests: booking.guests,

//       specialRequests,

//       monthlyRent: booking.monthlyRent,
//       serviceFee: booking.serviceFee,
//       totalAmount: booking.totalAmount,

//       ownerName,
//       ownerContact,
//       university,

//       paymentStatus: booking.paymentStatus,

//       paymentScreenshot:
//         booking.paymentScreenshot.url,
//     };


//     // ==========================
//     // Guest Email
//     // ==========================
//     const guestEmail = guestConfirmationEmail(emailData);

//     await sendEmail(
//       email,
//       guestEmail.subject,
//       guestEmail.html
//     );


//     // ==========================
//     // Owner Email
//     // ==========================
//     const ownerEmailTemplate =
//       ownerNotificationEmail(emailData);


//     await sendEmail(
//       ownerEmail || process.env.SMTP_USER,
//       ownerEmailTemplate.subject,
//       ownerEmailTemplate.html
//     );


//     // ==========================
//     // Response
//     // ==========================
//     return res.status(201).json({
//       success: true,
//       message: "Booking created successfully",

//       data: {
//         bookingId: booking.bookingId,
//         status: booking.status,
//         paymentStatus: booking.paymentStatus,

//         paymentScreenshot:
//           booking.paymentScreenshot.url,
//       },
//     });


//   } catch (error) {

//     console.error(
//       "❌ Create booking error:",
//       error
//     );


//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Failed to create booking",
//     });
//   }
// };

// // GET ALL BOOKINGS
// const getBookings = async (req, res) => {
//   try {
//     const { status, paymentStatus, houseId, limit = 100, page = 1 } = req.query;

//     let filter = {};
//     if (status) filter.status = status;
//     if (paymentStatus) filter.paymentStatus = paymentStatus;
//     if (houseId) filter.houseId = houseId;

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const bookings = await Booking.find(filter)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Booking.countDocuments(filter);

//     res.json({
//       success: true,
//       data: bookings,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / parseInt(limit)),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // GET BOOKINGS BY EMAIL
// const getBookingsByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const { status, paymentStatus, limit = 50, page = 1 } = req.query;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     let filter = { email: email.toLowerCase().trim() };
//     if (status) filter.status = status;
//     if (paymentStatus) filter.paymentStatus = paymentStatus;

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const bookings = await Booking.find(filter)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Booking.countDocuments(filter);

//     res.json({
//       success: true,
//       data: bookings,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / parseInt(limit)),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================
// // GET BOOKINGS BY LANDLORD EMAIL
// // ==========================
// const getBookingsByOwnerEmail = async (req, res) => {
//   try {
//     const { email } = req.params;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Owner email is required",
//       });
//     }

//     const bookings = await Booking.find({
//       ownerEmail: email.toLowerCase().trim(),
//     }).sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       total: bookings.length,
//       data: bookings,
//     });
//   } catch (error) {
//     console.error(
//       "❌ Get bookings by owner email error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch bookings",
//       error:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : undefined,
//     });
//   }
// };


// // GET BOOKING BY ID
// const getBookingById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const booking = await Booking.findOne({ bookingId: id });

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: booking,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // UPDATE BOOKING (with optional screenshot update)

// // UPDATE BOOKING
// const updateBooking = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const booking = await Booking.findById(id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     const allowedUpdates = [
//       "fullName",
//       "email",
//       "phone",
//       "idNumber",
//       "university",
//       "studentId",
//       "purpose",
//       "houseName",
//       "houseType",
//       "district",
//       "sector",
//       "cell",
//       "village",
//       "ownerName",
//       "ownerContact",
//       "ownerEmail",
//       "checkIn",
//       "checkOut",
//       "months",
//       "guests",
//       "specialRequests",
//       "monthlyRent",
//       "serviceFee",
//       "totalAmount",
//       "paymentMethod",
//       "momoNumber",
//       "paymentStatus",
//       "status",
//       "notes",
//     ];

//     const updates = {};

//     allowedUpdates.forEach((field) => {
//       if (updateData[field] !== undefined) {
//         updates[field] = updateData[field];
//       }
//     });

//     // Convert dates
//     if (updates.checkIn) {
//       updates.checkIn = new Date(updates.checkIn);
//     }

//     if (updates.checkOut) {
//       updates.checkOut = new Date(updates.checkOut);
//     }

//     // ==========================================================
//     // Replace payment screenshot if a new one is uploaded
//     // ==========================================================
//     if (req.file) {
//       // Delete old Cloudinary image
//       if (
//         booking.paymentScreenshot &&
//         booking.paymentScreenshot.publicId
//       ) {
//         try {
//           await cloudinary.uploader.destroy(
//             booking.paymentScreenshot.publicId
//           );
//           console.log("🗑️ Old payment screenshot deleted");
//         } catch (err) {
//           console.error("Failed to delete old image:", err.message);
//         }
//       }

//       updates.paymentScreenshot = {
//         url: req.file.path,
//         publicId: req.file.filename,
//       };

//       console.log("📸 New payment screenshot:", updates.paymentScreenshot);
//     }

//     const updatedBooking = await Booking.findByIdAndUpdate(
//       id,
//       {
//         $set: updates,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Booking updated successfully",
//       data: updatedBooking,
//     });
//   } catch (error) {
//     console.error("Update booking error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update booking",
//     });
//   }
// };

// // UPDATE BOOKING STATUS
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

//     booking.status = status;

//     if (notes) {
//       booking.notes = notes;
//     }

//     await booking.save();

//     res.json({
//       success: true,
//       message: "Booking status updated",
//       data: booking,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // VERIFY PAYMENT
// const verifyPayment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { paymentStatus, notes } = req.body;

//     const booking = await Booking.findById(id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     booking.paymentStatus = paymentStatus || "verified";

//     if (notes) {
//       booking.notes = notes;
//     }

//     await booking.save();

//     if (booking.paymentStatus === "verified") {
//       const emailData = {
//         bookingId: booking.bookingId,
//         fullName: booking.fullName,
//         houseName: booking.houseName,
//         totalAmount: booking.totalAmount,
//       };

//       const verifiedEmail = paymentVerifiedEmail(emailData);

//       await sendEmail(booking.email, verifiedEmail.subject, verifiedEmail.html);
//     }

//     res.json({
//       success: true,
//       message: "Payment status updated",
//       data: booking,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // DELETE BOOKING
// const deleteBooking = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const booking = await Booking.findByIdAndDelete(id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     // Delete screenshot from Cloudinary if exists
//     if (booking.paymentScreenshot?.url) {
//       try {
//         const publicId = booking.paymentScreenshot.publicId;

//         if (publicId) {
//           await cloudinary.uploader.destroy(publicId);
//           console.log("🗑️ Deleted screenshot from Cloudinary:", publicId);
//         }
//       } catch (cloudinaryError) {
//         console.error(
//           "Failed to delete screenshot from Cloudinary:",
//           cloudinaryError,
//         );
//       }
//     }

//     res.json({
//       success: true,
//       message: "Booking deleted successfully",
//       data: {
//         id: booking._id,
//         bookingId: booking.bookingId,
//         fullName: booking.fullName,
//         email: booking.email,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // CANCEL BOOKING
// const cancelBooking = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;

//     const booking = await Booking.findById(id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     booking.status = "cancelled";

//     if (reason) {
//       booking.notes = `Cancelled: ${reason}`;
//     }

//     await booking.save();

//     const cancelEmail = bookingCancelledEmail({
//       bookingId: booking.bookingId,
//       fullName: booking.fullName,
//       reason: reason || "No reason provided",
//     });

//     await sendEmail(booking.email, cancelEmail.subject, cancelEmail.html);

//     res.json({
//       success: true,
//       message: "Booking cancelled",
//       data: booking,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // GET BOOKING STATISTICS
// const getBookingStats = async (req, res) => {
//   try {
//     const total = await Booking.countDocuments();
//     const pending = await Booking.countDocuments({ status: "pending" });
//     const confirmed = await Booking.countDocuments({ status: "confirmed" });
//     const cancelled = await Booking.countDocuments({ status: "cancelled" });
//     const completed = await Booking.countDocuments({ status: "completed" });

//     const paymentPending = await Booking.countDocuments({
//       paymentStatus: "pending",
//     });
//     const paymentVerified = await Booking.countDocuments({
//       paymentStatus: "verified",
//     });
//     const paymentFailed = await Booking.countDocuments({
//       paymentStatus: "failed",
//     });

//     const revenueResult = await Booking.aggregate([
//       {
//         $match: {
//           paymentStatus: "verified",
//           status: { $in: ["confirmed", "completed"] },
//         },
//       },
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } },
//     ]);
//     const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

//     const monthlyBookings = await Booking.aggregate([
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//           },
//           count: { $sum: 1 },
//           revenue: {
//             $sum: {
//               $cond: [
//                 { $eq: ["$paymentStatus", "verified"] },
//                 "$totalAmount",
//                 0,
//               ],
//             },
//           },
//         },
//       },
//       { $sort: { "_id.year": -1, "_id.month": -1 } },
//       { $limit: 12 },
//     ]);

//     res.json({
//       success: true,
//       data: {
//         total,
//         byStatus: { pending, confirmed, cancelled, completed },
//         byPayment: {
//           pending: paymentPending,
//           verified: paymentVerified,
//           failed: paymentFailed,
//         },
//         totalRevenue,
//         monthlyBookings,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ============================================================
// // EXPORT MODULES
// // ============================================================
// module.exports = {
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
//   uploadBookingScreenshot, // Export the multer middleware
// };







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
  uploadBookingScreenshot, // Export the multer middleware
};