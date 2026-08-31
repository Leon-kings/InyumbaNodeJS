

// const Testimonial = require("../models/Testimonial");
// const Notification = require("../models/Notification");
// const User = require("../models/User");
// const cloudinary = require("cloudinary").v2;
// const { validationResult } = require("express-validator");
// const { sendEmail } = require("../services/emailTransporter");
// const mongoose = require("mongoose");

// // ===================== CLOUDINARY CONFIG =====================

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ===================== EMAIL TEMPLATES =====================

// const getTestimonialConfirmationEmail = (testimonial) => ({
//   subject: "Thank You for Your Testimonial",
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Testimonial Confirmation</title>
//     </head>
//     <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//       <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//         <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Your Testimonial!</h1>
//       </div>
//       <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
//         <p style="font-size: 16px; margin-bottom: 20px;">Hello ${testimonial.name},</p>
//         <p style="font-size: 16px; margin-bottom: 20px;">Thank you for sharing your experience with us! Your testimonial has been submitted successfully.</p>
        
//         <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
//           <h3 style="margin: 0 0 15px; color: #667eea;">Your Testimonial</h3>
//           <p style="margin: 5px 0;"><strong>Name:</strong> ${testimonial.name}</p>
//           ${testimonial.university ? `<p style="margin: 5px 0;"><strong>University:</strong> ${testimonial.university}</p>` : ""}
//           ${testimonial.houseName ? `<p style="margin: 5px 0;"><strong>House:</strong> ${testimonial.houseName}</p>` : ""}
//           <p style="margin: 5px 0;"><strong>Rating:</strong> ${"⭐".repeat(testimonial.rating)}</p>
//           ${testimonial.title ? `<p style="margin: 5px 0;"><strong>Title:</strong> ${testimonial.title}</p>` : ""}
//           <p style="margin: 15px 0 5px;"><strong>Your Story:</strong></p>
//           <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${testimonial.content}</p>
//         </div>
        
//         <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
//           <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
//             📌 Your testimonial is pending review. You will receive a notification once it's approved.
//           </p>
//         </div>
        
//         <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
//         <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
//           This is an automated confirmation. Thank you for sharing your experience!
//         </p>
//       </div>
//     </body>
//     </html>
//   `,
// });

// const getAdminTestimonialNotificationEmail = (testimonial) => ({
//   subject: `📩 New Testimonial from ${testimonial.name}`,
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>New Testimonial</title>
//     </head>
//     <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//       <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//         <h1 style="color: white; margin: 0; font-size: 24px;">📩 New Testimonial Received</h1>
//       </div>
//       <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
//         <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
//           <p style="margin: 0; color: #856404;">
//             <strong>⚠️ New testimonial requires your review</strong>
//           </p>
//         </div>
        
//         <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
//           <h3 style="margin: 0 0 15px; color: #f5576c;">Testimonial Details</h3>
//           <p style="margin: 5px 0;"><strong>Name:</strong> ${testimonial.name}</p>
//           ${testimonial.email ? `<p style="margin: 5px 0;"><strong>Email:</strong> ${testimonial.email}</p>` : ""}
//           ${testimonial.university ? `<p style="margin: 5px 0;"><strong>University:</strong> ${testimonial.university}</p>` : ""}
//           ${testimonial.houseName ? `<p style="margin: 5px 0;"><strong>House:</strong> ${testimonial.houseName}</p>` : ""}
//           <p style="margin: 5px 0;"><strong>Rating:</strong> ${"⭐".repeat(testimonial.rating)}</p>
//           <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date(testimonial.createdAt).toLocaleString()}</p>
//           ${testimonial.title ? `<p style="margin: 5px 0;"><strong>Title:</strong> ${testimonial.title}</p>` : ""}
//           <p style="margin: 15px 0 5px;"><strong>Content:</strong></p>
//           <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${testimonial.content}</p>
//           ${
//             testimonial.image?.secure_url
//               ? `
//             <p style="margin: 15px 0 5px;"><strong>Image:</strong></p>
//             <img src="${testimonial.image.secure_url}" style="max-width: 100%; border-radius: 5px; max-height: 300px;" />
//           `
//               : ""
//           }
//         </div>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
//           <p style="margin: 0; text-align: center;">
//             <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/testimonials/${testimonial._id}" 
//                style="display: inline-block; background: #667eea; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px;">
//               Review & Approve
//             </a>
//           </p>
//         </div>
        
//         <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
//         <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
//           Please login to the admin panel to approve or reject this testimonial.
//         </p>
//       </div>
//     </body>
//     </html>
//   `,
// });

// const getTestimonialStatusUpdateEmail = (testimonial, status) => ({
//   subject: `Testimonial ${status.charAt(0).toUpperCase() + status.slice(1)} - ${testimonial.name}`,
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Testimonial ${status}</title>
//     </head>
//     <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//       <div style="background: ${status === "approved" ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"}; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//         <h1 style="color: white; margin: 0; font-size: 24px;">Testimonial ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
//       </div>
//       <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
//         <p style="font-size: 16px; margin-bottom: 20px;">Hello ${testimonial.name},</p>
//         <p style="font-size: 16px; margin-bottom: 20px;">
//           Your testimonial has been <strong>${status}</strong> by our team.
//         </p>
        
//         ${
//           status === "approved"
//             ? `
//           <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
//             <p style="margin: 0; color: #155724;">
//               ✅ Congratulations! Your testimonial is now live and visible to the public.
//             </p>
//           </div>
//         `
//             : status === "rejected"
//               ? `
//           <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
//             <p style="margin: 0; color: #721c24;">
//               ❌ Unfortunately, your testimonial was not approved. Please contact support for more information.
//             </p>
//           </div>
//         `
//               : ""
//         }
        
//         <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
//           <h3 style="margin: 0 0 15px; color: #667eea;">Your Testimonial</h3>
//           <p style="margin: 5px 0;"><strong>Rating:</strong> ${"⭐".repeat(testimonial.rating)}</p>
//           ${testimonial.title ? `<p style="margin: 5px 0;"><strong>Title:</strong> ${testimonial.title}</p>` : ""}
//           <p style="margin: 15px 0 5px;"><strong>Content:</strong></p>
//           <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${testimonial.content}</p>
//         </div>
        
//         <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
//         <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
//           Thank you for sharing your experience with us!
//         </p>
//       </div>
//     </body>
//     </html>
//   `,
// });

// // ===================== NOTIFICATION FUNCTIONS =====================

// // Create notification for specific role
// const createRoleNotification = async (
//   testimonial,
//   type,
//   role,
//   userInfo = null,
// ) => {
//   try {
//     let title = "";
//     let message = "";
//     let priority = "normal";
//     let targetUserId = null;
//     let targetUserEmail = testimonial.email || "";
//     let targetUserRole = role;

//     switch (type) {
//       case "testimonial_created":
//         title = "📩 New Testimonial Submitted";
//         message = `New testimonial from ${testimonial.name}`;
//         priority = "high";
//         targetUserId = testimonial.userId || null;
//         break;
//       case "testimonial_approved":
//         title = "✅ Testimonial Approved";
//         message = `Testimonial from ${testimonial.name} has been approved`;
//         priority = "high";
//         break;
//       case "testimonial_rejected":
//         title = "❌ Testimonial Rejected";
//         message = `Testimonial from ${testimonial.name} has been rejected`;
//         priority = "high";
//         break;
//       case "testimonial_featured":
//         title = "⭐ Testimonial Featured";
//         message = `Testimonial from ${testimonial.name} has been featured`;
//         priority = "high";
//         break;
//       case "testimonial_unfeatured":
//         title = "⭐ Testimonial Unfeatured";
//         message = `Testimonial from ${testimonial.name} has been unfeatured`;
//         priority = "normal";
//         break;
//       case "testimonial_updated":
//         title = "📝 Testimonial Updated";
//         message = `Testimonial from ${testimonial.name} has been updated`;
//         priority = "normal";
//         break;
//       case "testimonial_deleted":
//         title = "🗑️ Testimonial Deleted";
//         message = `Testimonial from ${testimonial.name} was deleted`;
//         priority = "high";
//         break;
//       default:
//         title = "📩 Testimonial Notification";
//         message = `Update for testimonial from ${testimonial.name}`;
//     }

//     // If userInfo is provided, use that for targeting
//     if (userInfo) {
//       targetUserId = userInfo.userId || targetUserId;
//       targetUserEmail = userInfo.email || targetUserEmail;
//       targetUserRole = userInfo.role || role;
//     }

//     // const notification = new Notification({
//     //   type: type,
//     //   testimonialId: testimonial._id,
//     //   testimonialName: testimonial.name,
//     //   testimonialEmail: testimonial.email || "",
//     //   userId: testimonial.userId || null,
//     //   userName: testimonial.name,
//     //   userEmail: testimonial.email || "",
//     //   userRole: role,
//     //   title,
//     //   message,
//     //   isRead: false,
//     //   status: "new",
//     //   targetRoles: [role],
//     //   targetUserId: targetUserId,
//     //   targetUserEmail: targetUserEmail,
//     //   targetUserRole: targetUserRole,
//     //   priority,
//     //   isGlobal: type === "testimonial_created" || type === "testimonial_approved",
//     //   metadata: {
//     //     testimonialName: testimonial.name,
//     //     university: testimonial.university,
//     //     rating: testimonial.rating,
//     //     houseName: testimonial.houseName,
//     //     status: testimonial.status,
//     //     featured: testimonial.featured,
//     //     verified: testimonial.verified,
//     //   },
//     // });

//     const notification = new Notification({
//       type: notificationType,

//       testimonialId: testimonial._id,
//       testimonialName: testimonial.name,
//       testimonialEmail: testimonial.email || "",

//       userId: testimonial.userId || null,
//       userName: testimonial.name,
//       userEmail: testimonial.email || "",

//       title,
//       message,

//       isRead: false,
//       status: "new",

//       targetRoles: [role],
//       targetUserId,
//       targetUserEmail,

//       priority,

//       metadata: {
//         testimonialName: testimonial.name,
//         university: testimonial.university,
//         rating: testimonial.rating,
//         houseName: testimonial.houseName,
//         status: testimonial.status,
//         featured: testimonial.featured,
//         verified: testimonial.verified,
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

// // Create notifications for all roles
// const createAllRoleNotifications = async (
//   testimonial,
//   type,
//   userInfo = null,
// ) => {
//   const roles = ["admin", "manager", "host", "user"];
//   const notifications = [];

//   for (const role of roles) {
//     const notification = await createRoleNotification(
//       testimonial,
//       type,
//       role,
//       userInfo,
//     );
//     if (notification) {
//       notifications.push(notification);
//     }
//   }

//   return notifications;
// };

// // ===================== SEND EMAIL NOTIFICATIONS =====================

// const sendTestimonialEmails = async (testimonial, type, userInfo = null) => {
//   try {
//     const emailsSent = [];

//     // Send confirmation to user
//     if (type === "testimonial_created") {
//       const userEmailTemplate = getTestimonialConfirmationEmail(testimonial);
//       const result = await sendEmail({
//         to: testimonial.email,
//         subject: userEmailTemplate.subject,
//         html: userEmailTemplate.html,
//       });
//       if (result.success) {
//         emailsSent.push({ to: testimonial.email, role: "user" });
//         console.log(
//           `✅ Testimonial confirmation email sent to ${testimonial.email}`,
//         );
//       }
//     }

//     // Send notification to admin
//     if (type === "testimonial_created") {
//       const adminEmailTemplate =
//         getAdminTestimonialNotificationEmail(testimonial);
//       const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

//       if (adminEmail) {
//         const result = await sendEmail({
//           to: adminEmail,
//           subject: adminEmailTemplate.subject,
//           html: adminEmailTemplate.html,
//         });
//         if (result.success) {
//           emailsSent.push({ to: adminEmail, role: "admin" });
//           console.log(`✅ Admin notification email sent to ${adminEmail}`);
//         }
//       }
//     }

//     // Send status update to user
//     if (type === "testimonial_approved" || type === "testimonial_rejected") {
//       const statusEmailTemplate = getTestimonialStatusUpdateEmail(
//         testimonial,
//         type === "testimonial_approved" ? "approved" : "rejected",
//       );
//       const result = await sendEmail({
//         to: testimonial.email,
//         subject: statusEmailTemplate.subject,
//         html: statusEmailTemplate.html,
//       });
//       if (result.success) {
//         emailsSent.push({ to: testimonial.email, role: "user" });
//         console.log(`✅ Status update email sent to ${testimonial.email}`);
//       }
//     }

//     // Send to Managers
//     const managers = await User.find({ role: "manager", isActive: true });
//     for (const manager of managers) {
//       const managerTemplate = getAdminTestimonialNotificationEmail(testimonial);
//       const result = await sendEmail({
//         to: manager.email,
//         subject: `📩 New Testimonial from ${testimonial.name}`,
//         html: managerTemplate.html,
//       });
//       if (result.success) {
//         emailsSent.push({ to: manager.email, role: "manager" });
//         console.log(`✅ Manager email sent to ${manager.email}`);
//       }
//     }

//     return { success: true, emailsSent };
//   } catch (error) {
//     console.error("❌ Failed to send testimonial emails:", error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ===================== CONTROLLER FUNCTIONS =====================

// // 1. Submit Testimonial
// exports.submitTestimonial = async (req, res) => {
//   try {
//     // Validate request
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       // If there's an uploaded image, delete it from Cloudinary
//       if (req.file) {
//         await cloudinary.uploader.destroy(req.file.filename);
//       }
//       return res.status(400).json({
//         success: false,
//         errors: errors.array().map((e) => ({
//           field: e.path,
//           message: e.msg,
//         })),
//       });
//     }

//     const {
//       name,
//       university,
//       location,
//       rating,
//       title,
//       content,
//       houseName,
//       email,
//     } = req.body;

//     // Get user info from request
//     const userId = req.user?.id || null;
//     const userRole = req.user?.role || "user";

//     // Check if image was uploaded
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Image is required",
//       });
//     }

//     // Create testimonial
//     const testimonial = new Testimonial({
//       userId,
//       name,
//       university,
//       location,
//       rating: parseInt(rating),
//       title,
//       content,
//       houseName,
//       email: email || "",
//       image: {
//         public_id: req.file.filename,
//         url: req.file.path,
//         secure_url: req.file.path,
//       },
//       verified: false,
//       status: "pending",
//       featured: false,
//     });

//     await testimonial.save();
//     console.log(`✅ Testimonial created: ${testimonial._id}`);

//     // =====================
//     // USER INFO FOR NOTIFICATIONS
//     // =====================
//     const userInfo = {
//       userId: userId,
//       email: email || "",
//       role: userRole,
//     };

//     // =====================
//     // CREATE ROLE-BASED NOTIFICATIONS
//     // =====================
//     await createAllRoleNotifications(
//       testimonial,
//       "testimonial_created",
//       userInfo,
//     );

//     // =====================
//     // SEND EMAILS
//     // =====================
//     await sendTestimonialEmails(testimonial, "testimonial_created", userInfo);

//     res.status(201).json({
//       success: true,
//       message: "Testimonial submitted successfully",
//       data: {
//         id: testimonial._id,
//         name: testimonial.name,
//         university: testimonial.university,
//         rating: testimonial.rating,
//         status: testimonial.status,
//         image: testimonial.image.secure_url,
//       },
//     });
//   } catch (error) {
//     console.error("Submit testimonial error:", error);
//     // If there's an uploaded image, delete it from Cloudinary
//     if (req.file) {
//       await cloudinary.uploader.destroy(req.file.filename);
//     }
//     res.status(500).json({
//       success: false,
//       message: "Failed to submit testimonial",
//     });
//   }
// };

// // 2. Get All Testimonials (with filters)
// exports.getAllTestimonials = async (req, res) => {
//   try {
//     const page = Math.max(parseInt(req.query.page) || 1, 1);
//     const limit = Math.max(parseInt(req.query.limit) || 20, 1);
//     const skip = (page - 1) * limit;
//     const status = req.query.status;
//     const university = req.query.university;
//     const featured = req.query.featured;

//     let query = {};
//     if (status) query.status = status;
//     if (university) query.university = { $regex: university, $options: "i" };
//     if (featured !== undefined) query.featured = featured === "true";

//     const [testimonials, total] = await Promise.all([
//       Testimonial.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Testimonial.countDocuments(query),
//     ]);

//     res.status(200).json({
//       success: true,
//       data: testimonials,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get all testimonials error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch testimonials",
//       error: error.message,
//     });
//   }
// };

// // 3. Get Testimonial by ID
// exports.getTestimonialById = async (req, res) => {
//   try {
//     const testimonial = await Testimonial.findById(req.params.id);

//     if (!testimonial) {
//       return res.status(404).json({
//         success: false,
//         message: "Testimonial not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: testimonial,
//     });
//   } catch (error) {
//     console.error("Get testimonial by ID error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch testimonial",
//     });
//   }
// };

// // 4. Get Testimonials by University
// exports.getTestimonialsByUniversity = async (req, res) => {
//   try {
//     const university = req.params.university;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const [testimonials, total] = await Promise.all([
//       Testimonial.find({
//         university: { $regex: university, $options: "i" },
//         status: "approved",
//       })
//         .sort({ rating: -1, createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Testimonial.countDocuments({
//         university: { $regex: university, $options: "i" },
//         status: "approved",
//       }),
//     ]);

//     res.status(200).json({
//       success: true,
//       data: testimonials,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get testimonials by university error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch testimonials",
//     });
//   }
// };

// // 5. Get Featured Testimonials
// exports.getFeaturedTestimonials = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 6;

//     const testimonials = await Testimonial.find({
//       featured: true,
//       status: "approved",
//     })
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .lean();

//     res.status(200).json({
//       success: true,
//       data: testimonials,
//     });
//   } catch (error) {
//     console.error("Get featured testimonials error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch featured testimonials",
//     });
//   }
// };

// // 6. Update Testimonial Status (Approve/Reject)

// // ============================================================
// // UPDATE TESTIMONIAL STATUS
// // ============================================================

// // exports.updateTestimonialStatus = async (req, res) => {
// //   try {
// //     const { status } = req.body;

// //     // ==========================================================
// //     // VALID STATUS VALUES
// //     // ==========================================================

// //     const validStatuses = [
// //       "pending",
// //       "approved",
// //       "rejected",
// //     ];

// //     // ==========================================================
// //     // VALIDATE STATUS
// //     // ==========================================================

// //     const requestedStatus = String(status || "")
// //       .trim()
// //       .toLowerCase();

// //     if (!requestedStatus) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Status is required",
// //         data: {
// //           validStatuses,
// //         },
// //       });
// //     }

// //     if (!validStatuses.includes(requestedStatus)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: `Invalid status. Must be one of: ${validStatuses.join(
// //           ", "
// //         )}`,
// //         data: {
// //           requestedStatus,
// //           validStatuses,
// //         },
// //       });
// //     }

// //     // ==========================================================
// //     // FIND TESTIMONIAL
// //     // ==========================================================

// //     const testimonial = await Testimonial.findById(req.params.id);

// //     if (!testimonial) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Testimonial not found",
// //       });
// //     }

// //     // ==========================================================
// //     // UPDATE STATUS DIRECTLY
// //     // ==========================================================
// //     // No old-status comparison.
// //     // No user information.
// //     // No verified field.
// //     // No notification.
// //     // No email.
// //     // ==========================================================

// //     testimonial.status = requestedStatus;

// //     await testimonial.save();

// //     // ==========================================================
// //     // RESPONSE
// //     // ==========================================================

// //     return res.status(200).json({
// //       success: true,
// //       message: "Testimonial status updated successfully",
// //       data: testimonial,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "❌ Update testimonial status error:",
// //       error.message
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message: "Failed to update testimonial status",
// //       error: error.message,
// //     });
// //   }
// // };

// exports.updateTestimonialStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const validStatuses = ["pending", "approved", "rejected"];

//     const requestedStatus = String(status || "")
//       .trim()
//       .toLowerCase();

//     if (!requestedStatus) {
//       return res.status(400).json({
//         success: false,
//         message: "Status is required",
//         data: {
//           validStatuses,
//         },
//       });
//     }

//     if (!validStatuses.includes(requestedStatus)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
//         data: {
//           requestedStatus,
//           validStatuses,
//         },
//       });
//     }

//     const testimonial = await Testimonial.findById(req.params.id);

//     if (!testimonial) {
//       return res.status(404).json({
//         success: false,
//         message: "Testimonial not found",
//       });
//     }

//     testimonial.status = requestedStatus;

//     await testimonial.save();

//     // ============================================================
//     // CREATE NOTIFICATION TYPE
//     // ============================================================

//     let notificationType = "testimonial_updated";

//     if (requestedStatus === "approved") {
//       notificationType = "testimonial_approved";
//     } else if (requestedStatus === "rejected") {
//       notificationType = "testimonial_rejected";
//     }

//     // ============================================================
//     // CREATE NOTIFICATIONS
//     // ============================================================

//     await createAllRoleNotifications(testimonial, notificationType);

//     return res.status(200).json({
//       success: true,
//       message: "Testimonial status updated successfully",
//       data: testimonial,
//     });
//   } catch (error) {
//     console.error("❌ Update testimonial status error:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update testimonial status",
//       error: error.message,
//     });
//   }
// };

// // 7. Toggle Featured Status
// exports.toggleFeatured = async (req, res) => {
//   try {
//     const testimonial = await Testimonial.findById(req.params.id);

//     if (!testimonial) {
//       return res.status(404).json({
//         success: false,
//         message: "Testimonial not found",
//       });
//     }

//     const oldFeatured = testimonial.featured;
//     testimonial.featured = !testimonial.featured;
//     await testimonial.save();

//     // =====================
//     // CREATE NOTIFICATIONS
//     // =====================
//     const userInfo = {
//       userId: testimonial.userId || null,
//       email: testimonial.email || "",
//       role: "user",
//     };

//     const notificationType = testimonial.featured
//       ? "testimonial_featured"
//       : "testimonial_unfeatured";
//     await createAllRoleNotifications(testimonial, notificationType, userInfo);

//     res.status(200).json({
//       success: true,
//       message: `Testimonial ${testimonial.featured ? "featured" : "unfeatured"} successfully`,
//       data: testimonial,
//     });
//   } catch (error) {
//     console.error("Toggle featured error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to toggle featured status",
//     });
//   }
// };

// // 8. Delete Testimonial
// exports.deleteTestimonial = async (req, res) => {
//   try {
//     const testimonial = await Testimonial.findById(req.params.id);

//     if (!testimonial) {
//       return res.status(404).json({
//         success: false,
//         message: "Testimonial not found",
//       });
//     }

//     // =====================
//     // CREATE NOTIFICATIONS BEFORE DELETE
//     // =====================
//     const userInfo = {
//       userId: testimonial.userId || null,
//       email: testimonial.email || "",
//       role: "user",
//     };

//     await createAllRoleNotifications(
//       testimonial,
//       "testimonial_deleted",
//       userInfo,
//     );

//     // Delete image from Cloudinary
//     if (testimonial.image?.public_id) {
//       await cloudinary.uploader.destroy(testimonial.image.public_id);
//     }

//     await testimonial.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Testimonial deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete testimonial error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete testimonial",
//     });
//   }
// };

// // 9. Update Testimonial (with image update)
// exports.updateTestimonial = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array(),
//       });
//     }

//     const testimonial = await Testimonial.findById(req.params.id);
//     if (!testimonial) {
//       return res.status(404).json({
//         success: false,
//         message: "Testimonial not found",
//       });
//     }

//     const { name, university, location, rating, title, content, houseName } =
//       req.body;

//     // Update fields
//     if (name) testimonial.name = name;
//     if (university) testimonial.university = university;
//     if (location) testimonial.location = location;
//     if (rating) testimonial.rating = parseInt(rating);
//     if (title) testimonial.title = title;
//     if (content) testimonial.content = content;
//     if (houseName) testimonial.houseName = houseName;

//     // Update image if new one uploaded
//     if (req.file) {
//       // Delete old image from Cloudinary
//       if (testimonial.image?.public_id) {
//         await cloudinary.uploader.destroy(testimonial.image.public_id);
//       }

//       testimonial.image = {
//         public_id: req.file.filename,
//         url: req.file.path,
//         secure_url: req.file.path,
//       };
//     }

//     await testimonial.save();

//     // =====================
//     // CREATE NOTIFICATIONS
//     // =====================
//     const userInfo = {
//       userId: testimonial.userId || null,
//       email: testimonial.email || "",
//       role: "user",
//     };

//     await createAllRoleNotifications(
//       testimonial,
//       "testimonial_updated",
//       userInfo,
//     );

//     res.status(200).json({
//       success: true,
//       message: "Testimonial updated successfully",
//       data: testimonial,
//     });
//   } catch (error) {
//     console.error("Update testimonial error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update testimonial",
//     });
//   }
// };

// // 10. Get Testimonial Statistics
// exports.getTestimonialStatistics = async (req, res) => {
//   try {
//     const stats = await Testimonial.getStatistics();

//     res.status(200).json({
//       success: true,
//       data: stats,
//     });
//   } catch (error) {
//     console.error("Get testimonial statistics error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get statistics",
//     });
//   }
// };

// // 11. Get Top Rated Testimonials
// exports.getTopRated = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;

//     const testimonials = await Testimonial.find({
//       status: "approved",
//     })
//       .sort({ rating: -1, createdAt: -1 })
//       .limit(limit)
//       .lean();

//     res.status(200).json({
//       success: true,
//       data: testimonials,
//     });
//   } catch (error) {
//     console.error("Get top rated testimonials error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch top rated testimonials",
//     });
//   }
// };

// // 12. Get Recent Testimonials
// exports.getRecentTestimonials = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;

//     const testimonials = await Testimonial.find({
//       status: "approved",
//     })
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .lean();

//     res.status(200).json({
//       success: true,
//       data: testimonials,
//     });
//   } catch (error) {
//     console.error("Get recent testimonials error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch recent testimonials",
//     });
//   }
// };

// // ============================================================
// // NOTIFICATION CONTROLLER FUNCTIONS
// // ============================================================

// // 13. Get Testimonial Notifications
// exports.getTestimonialNotifications = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const skip = (page - 1) * limit;
//     const status = req.query.status;
//     const role = req.query.role;

//     let query = {
//       type: { $regex: /^testimonial_/ },
//     };

//     if (status) query.status = status;
//     if (role) query.targetRoles = { $in: [role] };

//     const [notifications, total, unreadCount] = await Promise.all([
//       Notification.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Notification.countDocuments(query),
//       Notification.countDocuments({
//         ...query,
//         isRead: false,
//       }),
//     ]);

//     return res.status(200).json({
//       success: true,
//       data: notifications,
//       unreadCount,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("❌ Get testimonial notifications error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch notifications",
//       error: error.message,
//     });
//   }
// };

// // 14. Get My Testimonial Notifications
// exports.getMyTestimonialNotifications = async (req, res) => {
//   try {
//     const user = req.user;
//     const { page = 1, limit = 20, isRead } = req.query;

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not authenticated",
//       });
//     }

//     const query = {
//       type: { $regex: /^testimonial_/ },
//       $or: [
//         { targetRoles: { $in: [user.role] } },
//         { targetUserId: user.id },
//         { targetUserEmail: user.email },
//         { userId: user.id },
//       ],
//     };

//     if (isRead !== undefined) {
//       query.isRead = isRead === "true";
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [notifications, total, unreadCount] = await Promise.all([
//       Notification.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit))
//         .lean(),
//       Notification.countDocuments(query),
//       Notification.countDocuments({
//         ...query,
//         isRead: false,
//       }),
//     ]);

//     return res.status(200).json({
//       success: true,
//       userRole: user.role,
//       data: notifications,
//       unreadCount,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / parseInt(limit)),
//       },
//     });
//   } catch (error) {
//     console.error("❌ Get my testimonial notifications error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch notifications",
//       error: error.message,
//     });
//   }
// };

// // 15. Mark Notification as Read
// exports.markNotificationAsRead = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = req.user;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid notification ID",
//       });
//     }

//     const notification = await Notification.findById(id);

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: "Notification not found",
//       });
//     }

//     // Check permission
//     const hasPermission =
//       notification.targetRoles.includes(user.role) ||
//       notification.targetUserId?.toString() === user.id ||
//       notification.targetUserEmail === user.email ||
//       notification.userId?.toString() === user.id ||
//       user.role === "admin";

//     if (!hasPermission) {
//       return res.status(403).json({
//         success: false,
//         message: "You don't have permission to mark this notification as read",
//       });
//     }

//     notification.isRead = true;
//     notification.status = "read";
//     notification.readAt = new Date();

//     if (!notification.readBy) {
//       notification.readBy = [];
//     }

//     notification.readBy.push({
//       userId: user.id,
//       userEmail: user.email,
//       userRole: user.role,
//     });

//     await notification.save();

//     return res.status(200).json({
//       success: true,
//       message: "Notification marked as read",
//       data: notification,
//     });
//   } catch (error) {
//     console.error("❌ Mark notification as read error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to mark notification as read",
//       error: error.message,
//     });
//   }
// };

// // 16. Mark All Notifications as Read
// exports.markAllNotificationsAsRead = async (req, res) => {
//   try {
//     const user = req.user;
//     const { role } = req.query;

//     let filter = {
//       type: { $regex: /^testimonial_/ },
//       isRead: false,
//     };

//     if (role) {
//       filter.targetRoles = { $in: [role] };
//     } else if (user) {
//       filter.$or = [
//         { targetRoles: { $in: [user.role] } },
//         { targetUserId: user.id },
//         { targetUserEmail: user.email },
//         { userId: user.id },
//       ];
//     }

//     const result = await Notification.updateMany(filter, {
//       $set: {
//         isRead: true,
//         status: "read",
//         readAt: new Date(),
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       message: `${result.modifiedCount} notifications marked as read`,
//       modifiedCount: result.modifiedCount,
//     });
//   } catch (error) {
//     console.error("❌ Mark all notifications as read error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to mark all notifications as read",
//       error: error.message,
//     });
//   }
// };

// // 17. Get Unread Count
// exports.getUnreadCount = async (req, res) => {
//   try {
//     const user = req.user;
//     const { role } = req.query;

//     let filter = {
//       type: { $regex: /^testimonial_/ },
//       isRead: false,
//     };

//     if (role) {
//       filter.targetRoles = { $in: [role] };
//     } else if (user) {
//       filter.$or = [
//         { targetRoles: { $in: [user.role] } },
//         { targetUserId: user.id },
//         { targetUserEmail: user.email },
//         { userId: user.id },
//       ];
//     }

//     const count = await Notification.countDocuments(filter);

//     // Get counts by role
//     const roleCounts = await Notification.aggregate([
//       {
//         $match: filter,
//       },
//       {
//         $unwind: "$targetRoles",
//       },
//       {
//         $group: {
//           _id: "$targetRoles",
//           count: { $sum: 1 },
//         },
//       },
//     ]);

//     const countsByRole = {};
//     roleCounts.forEach((item) => {
//       countsByRole[item._id] = item.count;
//     });

//     return res.status(200).json({
//       success: true,
//       totalUnread: count,
//       byRole: countsByRole,
//     });
//   } catch (error) {
//     console.error("❌ Get unread count error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to get unread count",
//       error: error.message,
//     });
//   }
// };

// // 18. Delete Notification
// exports.deleteNotification = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = req.user;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid notification ID",
//       });
//     }

//     const notification = await Notification.findById(id);

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: "Notification not found",
//       });
//     }

//     // Check permission
//     const hasPermission =
//       user.role === "admin" ||
//       notification.targetUserId?.toString() === user.id ||
//       notification.userId?.toString() === user.id;

//     if (!hasPermission) {
//       return res.status(403).json({
//         success: false,
//         message: "You don't have permission to delete this notification",
//       });
//     }

//     await notification.deleteOne();

//     return res.status(200).json({
//       success: true,
//       message: "Notification deleted successfully",
//       data: notification,
//     });
//   } catch (error) {
//     console.error("❌ Delete notification error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete notification",
//       error: error.message,
//     });
//   }
// };

// // 19. Bulk Delete Notifications
// exports.bulkDeleteNotifications = async (req, res) => {
//   try {
//     const { ids } = req.body;
//     const user = req.user;

//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide an array of notification IDs",
//       });
//     }

//     // Validate every ID
//     const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

//     if (invalidIds.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "One or more notification IDs are invalid",
//         invalidIds,
//       });
//     }

//     let query = {
//       _id: { $in: ids },
//       type: { $regex: /^testimonial_/ },
//     };

//     // Non-admin users can only delete their own notifications
//     if (user.role !== "admin") {
//       query.$or = [
//         { targetUserId: user.id },
//         { userId: user.id },
//         { targetUserEmail: user.email },
//       ];
//     }

//     const result = await Notification.deleteMany(query);

//     if (result.deletedCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No notifications found to delete",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: `${result.deletedCount} notifications deleted successfully`,
//       deletedCount: result.deletedCount,
//     });
//   } catch (error) {
//     console.error("❌ Bulk delete notifications error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete notifications",
//       error: error.message,
//     });
//   }
// };

// // 20. Get Notification Statistics
// exports.getNotificationStats = async (req, res) => {
//   try {
//     const user = req.user;

//     const query = {
//       type: { $regex: /^testimonial_/ },
//     };

//     // If not admin, only show user's notifications
//     if (user.role !== "admin") {
//       query.$or = [
//         { targetRoles: { $in: [user.role] } },
//         { targetUserId: user.id },
//         { targetUserEmail: user.email },
//         { userId: user.id },
//       ];
//     }

//     const [total, unread, read, byType, byRole] = await Promise.all([
//       Notification.countDocuments(query),
//       Notification.countDocuments({ ...query, isRead: false }),
//       Notification.countDocuments({ ...query, isRead: true }),
//       Notification.aggregate([
//         { $match: query },
//         { $group: { _id: "$type", count: { $sum: 1 } } },
//         { $sort: { count: -1 } },
//         { $limit: 10 },
//       ]),
//       Notification.aggregate([
//         { $match: query },
//         { $unwind: "$targetRoles" },
//         { $group: { _id: "$targetRoles", count: { $sum: 1 } } },
//       ]),
//     ]);

//     res.status(200).json({
//       success: true,
//       statistics: {
//         total,
//         unread,
//         read,
//         byType,
//         byRole,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Get notification stats error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get notification statistics",
//       error: error.message,
//     });
//   }
// };









const Testimonial = require("../models/Testimonial");
const Notification = require("../models/Notification");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const { validationResult } = require("express-validator");
const { sendEmail } = require("../services/emailTransporter");
const mongoose = require("mongoose");

// ===================== CLOUDINARY CONFIG =====================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===================== EMAIL TEMPLATES =====================

const getTestimonialConfirmationEmail = (testimonial) => ({
  subject: "Thank You for Your Testimonial",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Testimonial Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Your Testimonial!</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello ${testimonial.name},</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Thank you for sharing your experience with us! Your testimonial has been submitted successfully.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #667eea;">Your Testimonial</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${testimonial.name}</p>
          ${testimonial.university ? `<p style="margin: 5px 0;"><strong>University:</strong> ${testimonial.university}</p>` : ""}
          ${testimonial.houseName ? `<p style="margin: 5px 0;"><strong>House:</strong> ${testimonial.houseName}</p>` : ""}
          <p style="margin: 5px 0;"><strong>Rating:</strong> ${"⭐".repeat(testimonial.rating)}</p>
          ${testimonial.title ? `<p style="margin: 5px 0;"><strong>Title:</strong> ${testimonial.title}</p>` : ""}
          <p style="margin: 15px 0 5px;"><strong>Your Story:</strong></p>
          <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${testimonial.content}</p>
        </div>
        
        <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
          <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
            📌 Your testimonial is pending review. You will receive a notification once it's approved.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          This is an automated confirmation. Thank you for sharing your experience!
        </p>
      </div>
    </body>
    </html>
  `,
});

const getTestimonialStatusUpdateEmail = (testimonial, status) => ({
  subject: `Testimonial ${status.charAt(0).toUpperCase() + status.slice(1)} - ${testimonial.name}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Testimonial ${status}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: ${status === "approved" ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"}; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Testimonial ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello ${testimonial.name},</p>
        <p style="font-size: 16px; margin-bottom: 20px;">
          Your testimonial has been <strong>${status}</strong> by our team.
        </p>
        
        ${
          status === "approved"
            ? `
          <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <p style="margin: 0; color: #155724;">
              ✅ Congratulations! Your testimonial is now live and visible to the public.
            </p>
          </div>
        `
            : status === "rejected"
              ? `
          <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <p style="margin: 0; color: #721c24;">
              ❌ Unfortunately, your testimonial was not approved. Please contact support for more information.
            </p>
          </div>
        `
              : ""
        }
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #667eea;">Your Testimonial</h3>
          <p style="margin: 5px 0;"><strong>Rating:</strong> ${"⭐".repeat(testimonial.rating)}</p>
          ${testimonial.title ? `<p style="margin: 5px 0;"><strong>Title:</strong> ${testimonial.title}</p>` : ""}
          <p style="margin: 15px 0 5px;"><strong>Content:</strong></p>
          <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${testimonial.content}</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          Thank you for sharing your experience with us!
        </p>
      </div>
    </body>
    </html>
  `,
});

// ===================== NOTIFICATION FUNCTIONS =====================

// Create notification for specific role
const createRoleNotification = async (
  testimonial,
  type,
  role,
  userInfo = null,
) => {
  try {
    let title = "";
    let message = "";
    let priority = "normal";
    let targetUserId = null;
    let targetUserEmail = testimonial.email || "";
    let targetUserRole = role;

    switch (type) {
      case "testimonial_created":
        title = "📩 New Testimonial Submitted";
        message = `New testimonial from ${testimonial.name}`;
        priority = "high";
        targetUserId = testimonial.userId || null;
        break;
      case "testimonial_approved":
        title = "✅ Testimonial Approved";
        message = `Testimonial from ${testimonial.name} has been approved`;
        priority = "high";
        break;
      case "testimonial_rejected":
        title = "❌ Testimonial Rejected";
        message = `Testimonial from ${testimonial.name} has been rejected`;
        priority = "high";
        break;
      case "testimonial_featured":
        title = "⭐ Testimonial Featured";
        message = `Testimonial from ${testimonial.name} has been featured`;
        priority = "high";
        break;
      case "testimonial_unfeatured":
        title = "⭐ Testimonial Unfeatured";
        message = `Testimonial from ${testimonial.name} has been unfeatured`;
        priority = "normal";
        break;
      case "testimonial_updated":
        title = "📝 Testimonial Updated";
        message = `Testimonial from ${testimonial.name} has been updated`;
        priority = "normal";
        break;
      case "testimonial_deleted":
        title = "🗑️ Testimonial Deleted";
        message = `Testimonial from ${testimonial.name} was deleted`;
        priority = "high";
        break;
      default:
        title = "📩 Testimonial Notification";
        message = `Update for testimonial from ${testimonial.name}`;
    }

    // If userInfo is provided, use that for targeting
    if (userInfo) {
      targetUserId = userInfo.userId || targetUserId;
      targetUserEmail = userInfo.email || targetUserEmail;
      targetUserRole = userInfo.role || role;
    }

    const notification = new Notification({
      type: type,
      testimonialId: testimonial._id,
      testimonialName: testimonial.name,
      testimonialEmail: testimonial.email || "",
      userId: testimonial.userId || null,
      userName: testimonial.name,
      userEmail: testimonial.email || "",
      userRole: role,
      title,
      message,
      isRead: false,
      status: "new",
      targetRoles: [role],
      targetUserId: targetUserId,
      targetUserEmail: targetUserEmail,
      targetUserRole: targetUserRole,
      priority,
      isGlobal: type === "testimonial_created" || type === "testimonial_approved",
      metadata: {
        testimonialName: testimonial.name,
        university: testimonial.university,
        rating: testimonial.rating,
        houseName: testimonial.houseName,
        status: testimonial.status,
        featured: testimonial.featured,
        verified: testimonial.verified,
      },
    });

    await notification.save();
    console.log(`✅ ${role} notification created: ${message}`);
    return notification;
  } catch (error) {
    console.error(`❌ Error creating ${role} notification:`, error.message);
    return null;
  }
};

// Create notifications for all roles
const createAllRoleNotifications = async (
  testimonial,
  type,
  userInfo = null,
) => {
  const roles = ["admin", "manager", "host", "user"];
  const notifications = [];

  for (const role of roles) {
    const notification = await createRoleNotification(
      testimonial,
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

// ===================== SEND EMAIL NOTIFICATIONS =====================

const sendTestimonialEmails = async (testimonial, type, userInfo = null) => {
  try {
    const emailsSent = [];

    // Send confirmation to user
    if (type === "testimonial_created") {
      const userEmailTemplate = getTestimonialConfirmationEmail(testimonial);
      const result = await sendEmail({
        to: testimonial.email,
        subject: userEmailTemplate.subject,
        html: userEmailTemplate.html,
      });
      if (result.success) {
        emailsSent.push({ to: testimonial.email, role: "user" });
        console.log(
          `✅ Testimonial confirmation email sent to ${testimonial.email}`,
        );
      }
    }

    // Send status update to user
    if (type === "testimonial_approved" || type === "testimonial_rejected") {
      const statusEmailTemplate = getTestimonialStatusUpdateEmail(
        testimonial,
        type === "testimonial_approved" ? "approved" : "rejected",
      );
      const result = await sendEmail({
        to: testimonial.email,
        subject: statusEmailTemplate.subject,
        html: statusEmailTemplate.html,
      });
      if (result.success) {
        emailsSent.push({ to: testimonial.email, role: "user" });
        console.log(`✅ Status update email sent to ${testimonial.email}`);
      }
    }

    // Send to Managers
    const managers = await User.find({ role: "manager", isActive: true });
    for (const manager of managers) {
      const managerTemplate = getTestimonialConfirmationEmail(testimonial);
      const result = await sendEmail({
        to: manager.email,
        subject: `📩 New Testimonial from ${testimonial.name}`,
        html: managerTemplate.html,
      });
      if (result.success) {
        emailsSent.push({ to: manager.email, role: "manager" });
        console.log(`✅ Manager email sent to ${manager.email}`);
      }
    }

    return { success: true, emailsSent };
  } catch (error) {
    console.error("❌ Failed to send testimonial emails:", error.message);
    return { success: false, error: error.message };
  }
};

// ===================== CONTROLLER FUNCTIONS =====================

// 1. Submit Testimonial
exports.submitTestimonial = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there's an uploaded image, delete it from Cloudinary
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
        })),
      });
    }

    const {
      name,
      university,
      location,
      rating,
      title,
      content,
      houseName,
      email,
    } = req.body;

    // Get user info from request
    const userId = req.user?.id || null;
    const userRole = req.user?.role || "user";

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Create testimonial
    const testimonial = new Testimonial({
      userId,
      name,
      university,
      location,
      rating: parseInt(rating),
      title,
      content,
      houseName,
      email: email || "",
      image: {
        public_id: req.file.filename,
        url: req.file.path,
        secure_url: req.file.path,
      },
      verified: false,
      status: "pending",
      featured: false,
    });

    await testimonial.save();
    console.log(`✅ Testimonial created: ${testimonial._id}`);

    // =====================
    // USER INFO FOR NOTIFICATIONS
    // =====================
    const userInfo = {
      userId: userId,
      email: email || "",
      role: userRole,
    };

    // =====================
    // CREATE ROLE-BASED NOTIFICATIONS
    // =====================
    await createAllRoleNotifications(
      testimonial,
      "testimonial_created",
      userInfo,
    );

    // =====================
    // SEND EMAILS
    // =====================
    await sendTestimonialEmails(testimonial, "testimonial_created", userInfo);

    res.status(201).json({
      success: true,
      message: "Testimonial submitted successfully",
      data: {
        id: testimonial._id,
        name: testimonial.name,
        university: testimonial.university,
        rating: testimonial.rating,
        status: testimonial.status,
        image: testimonial.image.secure_url,
      },
    });
  } catch (error) {
    console.error("Submit testimonial error:", error);
    // If there's an uploaded image, delete it from Cloudinary
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(500).json({
      success: false,
      message: "Failed to submit testimonial",
    });
  }
};

// 2. Get All Testimonials (with filters)
exports.getAllTestimonials = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 20, 1);
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const university = req.query.university;
    const featured = req.query.featured;

    let query = {};
    if (status) query.status = status;
    if (university) query.university = { $regex: university, $options: "i" };
    if (featured !== undefined) query.featured = featured === "true";

    const [testimonials, total] = await Promise.all([
      Testimonial.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Testimonial.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all testimonials error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
      error: error.message,
    });
  }
};

// 3. Get Testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("Get testimonial by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonial",
    });
  }
};

// 4. Get Testimonials by University
exports.getTestimonialsByUniversity = async (req, res) => {
  try {
    const university = req.params.university;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
      Testimonial.find({
        university: { $regex: university, $options: "i" },
        status: "approved",
      })
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Testimonial.countDocuments({
        university: { $regex: university, $options: "i" },
        status: "approved",
      }),
    ]);

    res.status(200).json({
      success: true,
      data: testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get testimonials by university error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
    });
  }
};

// 5. Get Featured Testimonials
exports.getFeaturedTestimonials = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const testimonials = await Testimonial.find({
      featured: true,
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Get featured testimonials error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured testimonials",
    });
  }
};

// 6. Update Testimonial Status (Approve/Reject)
exports.updateTestimonialStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["pending", "approved", "rejected"];

    const requestedStatus = String(status || "")
      .trim()
      .toLowerCase();

    if (!requestedStatus) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
        data: {
          validStatuses,
        },
      });
    }

    if (!validStatuses.includes(requestedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        data: {
          requestedStatus,
          validStatuses,
        },
      });
    }

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const oldStatus = testimonial.status;
    testimonial.status = requestedStatus;

    await testimonial.save();

    // ============================================================
    // CREATE NOTIFICATION TYPE
    // ============================================================

    let notificationType = "testimonial_updated";

    if (requestedStatus === "approved") {
      notificationType = "testimonial_approved";
    } else if (requestedStatus === "rejected") {
      notificationType = "testimonial_rejected";
    }

    // ============================================================
    // USER INFO FOR NOTIFICATIONS
    // ============================================================
    const userInfo = {
      userId: testimonial.userId || null,
      email: testimonial.email || "",
      role: "user",
      oldStatus: oldStatus,
    };

    // ============================================================
    // CREATE NOTIFICATIONS
    // ============================================================
    await createAllRoleNotifications(testimonial, notificationType, userInfo);

    // ============================================================
    // SEND EMAIL TO USER
    // ============================================================
    await sendTestimonialEmails(testimonial, notificationType, userInfo);

    return res.status(200).json({
      success: true,
      message: "Testimonial status updated successfully",
      data: testimonial,
    });
  } catch (error) {
    console.error("❌ Update testimonial status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update testimonial status",
      error: error.message,
    });
  }
};

// 7. Toggle Featured Status
exports.toggleFeatured = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    testimonial.featured = !testimonial.featured;
    await testimonial.save();

    // =====================
    // CREATE NOTIFICATIONS
    // =====================
    const userInfo = {
      userId: testimonial.userId || null,
      email: testimonial.email || "",
      role: "user",
    };

    const notificationType = testimonial.featured
      ? "testimonial_featured"
      : "testimonial_unfeatured";
    await createAllRoleNotifications(testimonial, notificationType, userInfo);

    // =====================
    // SEND EMAIL TO USER
    // =====================
    await sendTestimonialEmails(testimonial, notificationType, userInfo);

    res.status(200).json({
      success: true,
      message: `Testimonial ${testimonial.featured ? "featured" : "unfeatured"} successfully`,
      data: testimonial,
    });
  } catch (error) {
    console.error("Toggle featured error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle featured status",
    });
  }
};

// 8. Delete Testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // =====================
    // CREATE NOTIFICATIONS BEFORE DELETE
    // =====================
    const userInfo = {
      userId: testimonial.userId || null,
      email: testimonial.email || "",
      role: "user",
    };

    await createAllRoleNotifications(
      testimonial,
      "testimonial_deleted",
      userInfo,
    );

    // Delete image from Cloudinary
    if (testimonial.image?.public_id) {
      await cloudinary.uploader.destroy(testimonial.image.public_id);
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
    });
  }
};

// 9. Update Testimonial (with image update)
exports.updateTestimonial = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const { name, university, location, rating, title, content, houseName } =
      req.body;

    // Update fields
    if (name) testimonial.name = name;
    if (university) testimonial.university = university;
    if (location) testimonial.location = location;
    if (rating) testimonial.rating = parseInt(rating);
    if (title) testimonial.title = title;
    if (content) testimonial.content = content;
    if (houseName) testimonial.houseName = houseName;

    // Update image if new one uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (testimonial.image?.public_id) {
        await cloudinary.uploader.destroy(testimonial.image.public_id);
      }

      testimonial.image = {
        public_id: req.file.filename,
        url: req.file.path,
        secure_url: req.file.path,
      };
    }

    await testimonial.save();

    // =====================
    // CREATE NOTIFICATIONS
    // =====================
    const userInfo = {
      userId: testimonial.userId || null,
      email: testimonial.email || "",
      role: "user",
    };

    await createAllRoleNotifications(
      testimonial,
      "testimonial_updated",
      userInfo,
    );

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    console.error("Update testimonial error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update testimonial",
    });
  }
};

// 10. Get Testimonial Statistics
exports.getTestimonialStatistics = async (req, res) => {
  try {
    const stats = await Testimonial.getStatistics();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get testimonial statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get statistics",
    });
  }
};

// 11. Get Top Rated Testimonials
exports.getTopRated = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const testimonials = await Testimonial.find({
      status: "approved",
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Get top rated testimonials error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top rated testimonials",
    });
  }
};

// 12. Get Recent Testimonials
exports.getRecentTestimonials = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const testimonials = await Testimonial.find({
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Get recent testimonials error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent testimonials",
    });
  }
};

// ============================================================
// NOTIFICATION CONTROLLER FUNCTIONS
// ============================================================

// 13. Get Testimonial Notifications
exports.getTestimonialNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const role = req.query.role;

    let query = {
      type: { $regex: /^testimonial_/ },
    };

    if (status) query.status = status;
    if (role) query.targetRoles = { $in: [role] };

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({
        ...query,
        isRead: false,
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Get testimonial notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// 14. Get Testimonial Notifications by Email
exports.getTestimonialNotificationsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { page = 1, limit = 20, isRead } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const filter = {
      type: { $regex: /^testimonial_/ },
      $or: [
        { targetUserEmail: email.trim().toLowerCase() },
        { userEmail: email.trim().toLowerCase() },
        { testimonialEmail: email.trim().toLowerCase() },
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
        .limit(parseInt(limit))
        .lean(),
      Notification.countDocuments(filter),
    ]);

    const unreadCount = await Notification.countDocuments({
      ...filter,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      email: email.trim().toLowerCase(),
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
    console.error("❌ Get testimonial notifications by email error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// 15. Get Notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("❌ Get notification by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notification",
      error: error.message,
    });
  }
};

// 16. Get My Testimonial Notifications
exports.getMyTestimonialNotifications = async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 20, isRead } = req.query;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const query = {
      type: { $regex: /^testimonial_/ },
      $or: [
        { targetRoles: { $in: [user.role] } },
        { targetUserId: user.id },
        { targetUserEmail: user.email },
        { userId: user.id },
      ],
    };

    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({
        ...query,
        isRead: false,
      }),
    ]);

    return res.status(200).json({
      success: true,
      userRole: user.role,
      data: notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("❌ Get my testimonial notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// 17. Mark Notification as Read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findById(id);

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
    console.error("❌ Mark notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// 18. Mark All Notifications as Read
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const user = req.user;
    const { role } = req.query;

    let filter = {
      type: { $regex: /^testimonial_/ },
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

// 19. Get Unread Count
exports.getUnreadCount = async (req, res) => {
  try {
    const user = req.user;
    const { role } = req.query;

    let filter = {
      type: { $regex: /^testimonial_/ },
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

// 20. Delete Notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Delete notification without checking user, role, email, or ownership
    await notification.deleteOne();

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

// 21. Bulk Delete Notifications
exports.bulkDeleteNotifications = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of notification IDs",
      });
    }

    // Validate every ID
    const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more notification IDs are invalid",
        invalidIds,
      });
    }

    // Delete all requested notifications
    // without checking role, user, email, or ownership
    const result = await Notification.deleteMany({
      _id: { $in: ids },
      type: { $regex: /^testimonial_/ },
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No notifications found to delete",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} notifications deleted successfully`,
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

// 22. Get Notification Statistics
exports.getNotificationStats = async (req, res) => {
  try {
    const user = req.user;

    const query = {
      type: { $regex: /^testimonial_/ },
    };

    // If not admin, only show user's notifications
    if (user.role !== "admin") {
      query.$or = [
        { targetRoles: { $in: [user.role] } },
        { targetUserId: user.id },
        { targetUserEmail: user.email },
        { userId: user.id },
      ];
    }

    const [total, unread, read, byType, byRole] = await Promise.all([
      Notification.countDocuments(query),
      Notification.countDocuments({ ...query, isRead: false }),
      Notification.countDocuments({ ...query, isRead: true }),
      Notification.aggregate([
        { $match: query },
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Notification.aggregate([
        { $match: query },
        { $unwind: "$targetRoles" },
        { $group: { _id: "$targetRoles", count: { $sum: 1 } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        total,
        unread,
        read,
        byType,
        byRole,
      },
    });
  } catch (error) {
    console.error("❌ Get notification stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get notification statistics",
      error: error.message,
    });
  }
};