

// const Request = require("../models/Request");
// const Notification = require("../models/Notification");
// const User = require("../models/User");
// const cloudinary = require("cloudinary").v2;
// const mongoose = require("mongoose");
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const { sendEmail } = require("../services/emailTransporter");

// // =======================
// // CLOUDINARY CONFIG
// // =======================

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // =======================
// // MULTER CONFIG
// // =======================

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "requests",
//     allowed_formats: ["jpg", "jpeg", "png", "webp"],
//     transformation: [
//       {
//         width: 800,
//         height: 800,
//         crop: "limit",
//       },
//     ],
//   },
// });

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only images are allowed"), false);
//     }
//   },
// });

// // =======================
// // EMAIL TEMPLATES
// // =======================

// const getRequestConfirmationEmail = (request) => ({
//   subject: "Your Request Has Been Submitted",
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Request Confirmation</title>
//     </head>
//     <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//       <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//         <h1 style="color: white; margin: 0; font-size: 24px;">Request Submitted Successfully</h1>
//       </div>
//       <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
//         <p style="font-size: 16px; margin-bottom: 20px;">Hello ${request.name},</p>
//         <p style="font-size: 16px; margin-bottom: 20px;">Your request has been submitted successfully. Our team will review it and get back to you shortly.</p>
        
//         <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
//           <h3 style="margin: 0 0 15px; color: #667eea;">Request Details</h3>
//           <p style="margin: 5px 0;"><strong>Name:</strong> ${request.name}</p>
//           <p style="margin: 5px 0;"><strong>Email:</strong> ${request.email}</p>
//           ${request.language ? `<p style="margin: 5px 0;"><strong>Language:</strong> ${request.language}</p>` : ""}
//           <p style="margin: 5px 0;"><strong>Status:</strong> ${request.status || "Pending"}</p>
//           <p style="margin: 15px 0 5px;"><strong>Message:</strong></p>
//           <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${request.message}</p>
//         </div>
        
//         <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
//           <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
//             📌 You will receive a notification when your request is reviewed.
//           </p>
//         </div>
        
//         <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
//         <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
//           This is an automated confirmation. Please keep this email for your records.
//         </p>
//       </div>
//     </body>
//     </html>
//   `,
// });

// const getAdminRequestNotificationEmail = (request) => ({
//   subject: `📩 New Request from ${request.name}`,
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>New Request</title>
//     </head>
//     <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//       <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//         <h1 style="color: white; margin: 0; font-size: 24px;">📩 New Request Received</h1>
//       </div>
//       <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
//         <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
//           <p style="margin: 0; color: #856404;">
//             <strong>⚠️ New request requires your attention</strong>
//           </p>
//         </div>
        
//         <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
//           <h3 style="margin: 0 0 15px; color: #f5576c;">Request Details</h3>
//           <p style="margin: 5px 0;"><strong>Name:</strong> ${request.name}</p>
//           <p style="margin: 5px 0;"><strong>Email:</strong> ${request.email}</p>
//           ${request.language ? `<p style="margin: 5px 0;"><strong>Language:</strong> ${request.language}</p>` : ""}
//           <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date(request.createdAt).toLocaleString()}</p>
//           <p style="margin: 15px 0 5px;"><strong>Message:</strong></p>
//           <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${request.message}</p>
//           ${
//             request.image?.url
//               ? `
//             <p style="margin: 15px 0 5px;"><strong>Image:</strong></p>
//             <img src="${request.image.url}" style="max-width: 100%; border-radius: 5px;" />
//           `
//               : ""
//           }
//         </div>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
//           <p style="margin: 0; text-align: center;">
//             <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/requests/${request._id}" 
//                style="display: inline-block; background: #667eea; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px;">
//               View & Respond
//             </a>
//           </p>
//         </div>
        
//         <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
//         <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
//           Please login to the admin panel to respond to this request.
//         </p>
//       </div>
//     </body>
//     </html>
//   `,
// });

// const getRequestStatusUpdateEmail = (request, oldStatus, newStatus) => ({
//   subject: `Request Status Updated - ${request.name}`,
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Request Status Update</title>
//     </head>
//     <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//       <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//         <h1 style="color: white; margin: 0; font-size: 24px;">Request Status Updated</h1>
//       </div>
//       <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
//         <p style="font-size: 16px; margin-bottom: 20px;">Hello ${request.name},</p>
//         <p style="font-size: 16px; margin-bottom: 20px;">Your request status has been updated.</p>
        
//         <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
//           <h3 style="margin: 0 0 15px; color: #11998e;">Status Update</h3>
//           <p style="margin: 5px 0;"><strong>Old Status:</strong> ${oldStatus}</p>
//           <p style="margin: 5px 0;"><strong>New Status:</strong> ${newStatus}</p>
//           <p style="margin: 5px 0;"><strong>Request ID:</strong> ${request._id}</p>
//         </div>
        
//         <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
//           <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
//             💡 If you have any questions, please don't hesitate to contact us.
//           </p>
//         </div>
        
//         <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
//         <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
//           This is an automated notification from your request management system.
//         </p>
//       </div>
//     </body>
//     </html>
//   `,
// });

// // =======================
// // NOTIFICATION FUNCTIONS
// // =======================

// // Create notification for specific role
// const createRoleNotification = async (request, type, role, userInfo = null) => {
//   try {
//     let title = "";
//     let message = "";
//     let priority = "normal";
//     let targetUserId = null;
//     let targetUserEmail = request.email || "";
//     let targetUserRole = role;

//     switch (type) {
//       case "request_created":
//         title = "📩 New Request Created";
//         message = `New request from ${request.name} (${request.email})`;
//         priority = "high";
//         targetUserId = request.userId || null;
//         break;
//       case "request_updated":
//         title = "📝 Request Updated";
//         message = `Request from ${request.name} has been updated`;
//         priority = "normal";
//         break;
//       case "request_status_changed":
//         title = "🔄 Request Status Changed";
//         message = `Request from ${request.name} status changed to ${request.status || "updated"}`;
//         priority = "high";
//         break;
//       case "request_replied":
//         title = "✅ Reply Sent to Request";
//         message = `Reply sent to ${request.name} (${request.email})`;
//         priority = "high";
//         break;
//       case "request_deleted":
//         title = "🗑️ Request Deleted";
//         message = `Request from ${request.name} was deleted`;
//         priority = "high";
//         break;
//       default:
//         title = "📩 Request Notification";
//         message = `Update for request from ${request.name}`;
//     }

//     // If userInfo is provided, use that for targeting
//     if (userInfo) {
//       targetUserId = userInfo.userId || targetUserId;
//       targetUserEmail = userInfo.email || targetUserEmail;
//       targetUserRole = userInfo.role || role;
//     }

//     const notification = new Notification({
//       type: type,
//       requestId: request._id,
//       requestName: request.name,
//       requestEmail: request.email,
//       userId: request.userId || null,
//       userName: request.name,
//       userEmail: request.email,
//       userRole: role,
//       title,
//       message,
//       isRead: false,
//       status: "new",
//       targetRoles: [role],
//       targetUserId: targetUserId,
//       targetUserEmail: targetUserEmail,
//       targetUserRole: targetUserRole,
//       priority,
//       isGlobal: type === "request_created",
//       metadata: {
//         requestMessage: request.message,
//         requestImage: request.image?.url || null,
//         oldStatus: userInfo?.oldStatus || null,
//         newStatus: request.status || null,
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
// const createAllRoleNotifications = async (request, type, userInfo = null) => {
//   const roles = ["admin", "manager", "host", "user"];
//   const notifications = [];

//   for (const role of roles) {
//     const notification = await createRoleNotification(
//       request,
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

// // =======================
// // SEND EMAIL NOTIFICATIONS
// // =======================

// const sendRequestEmails = async (request, type, userInfo = null) => {
//   try {
//     const emailsSent = [];

//     // Send confirmation to user
//     if (type === "request_created") {
//       const userEmailTemplate = getRequestConfirmationEmail(request);
//       const result = await sendEmail({
//         to: request.email,
//         subject: userEmailTemplate.subject,
//         html: userEmailTemplate.html,
//       });
//       if (result.success) {
//         emailsSent.push({ to: request.email, role: "user" });
//         console.log(`✅ Request confirmation email sent to ${request.email}`);
//       }
//     }

//     // Send notification to admin
//     if (type === "request_created" || type === "request_updated") {
//       const adminEmailTemplate = getAdminRequestNotificationEmail(request);
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
//     if (type === "request_status_changed" && userInfo?.oldStatus) {
//       const statusEmailTemplate = getRequestStatusUpdateEmail(
//         request,
//         userInfo.oldStatus,
//         request.status || "updated",
//       );
//       const result = await sendEmail({
//         to: request.email,
//         subject: statusEmailTemplate.subject,
//         html: statusEmailTemplate.html,
//       });
//       if (result.success) {
//         emailsSent.push({ to: request.email, role: "user" });
//         console.log(`✅ Status update email sent to ${request.email}`);
//       }
//     }

//     // Send to Managers
//     const managers = await User.find({ role: "manager", isActive: true });
//     for (const manager of managers) {
//       const managerTemplate = getAdminRequestNotificationEmail(request);
//       const result = await sendEmail({
//         to: manager.email,
//         subject: `📩 New Request from ${request.name}`,
//         html: managerTemplate.html,
//       });
//       if (result.success) {
//         emailsSent.push({ to: manager.email, role: "manager" });
//         console.log(`✅ Manager email sent to ${manager.email}`);
//       }
//     }

//     return { success: true, emailsSent };
//   } catch (error) {
//     console.error("❌ Failed to send request emails:", error.message);
//     return { success: false, error: error.message };
//   }
// };

// // =======================
// // CREATE REQUEST
// // =======================

// exports.createRequest = async (req, res) => {
//   try {
//     const { name, email, message, language } = req.body;

//     if (!name || !email || !message) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // Get user info from request
//     const userId = req.user?.id || null;
//     const userRole = req.user?.role || "user";

//     let image = {};

//     if (req.file) {
//       image = {
//         public_id: req.file.filename,
//         url: req.file.path,
//         format: req.file.format,
//       };
//     }

//     const request = await Request.create({
//       userId,
//       name,
//       email: email.toLowerCase().trim(),
//       message,
//       language,
//       image,
//       status: "pending",
//     });

//     console.log(`✅ Request created: ${request._id}`);

//     // =======================
//     // USER INFO FOR NOTIFICATIONS
//     // =======================
//     const userInfo = {
//       userId: userId,
//       email: email,
//       role: userRole,
//     };

//     // =======================
//     // CREATE ROLE-BASED NOTIFICATIONS
//     // =======================
//     await createAllRoleNotifications(request, "request_created", userInfo);

//     // =======================
//     // SEND EMAILS
//     // =======================
//     await sendRequestEmails(request, "request_created", userInfo);

//     res.status(201).json({
//       success: true,
//       message: "Request created successfully",
//       data: request,
//     });
//   } catch (error) {
//     console.log("CREATE REQUEST ERROR", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =======================
// // GET ALL REQUESTS
// // =======================

// exports.getRequests = async (req, res) => {
//   try {
//     const requests = await Request.find()
//       .populate("notificationId")
//       .populate("notifications.notificationId")
//       .sort({
//         createdAt: -1,
//       });

//     res.json({
//       success: true,
//       data: requests,
//     });
//   } catch (error) {
//     console.error("GET REQUESTS ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =======================
// // GET REQUESTS BY EMAIL
// // =======================

// exports.getRequestsByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const requests = await Request.find({
//       email: email.toLowerCase().trim(),
//     }).sort({ createdAt: -1 });

//     if (requests.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No requests found for this email",
//         data: [],
//       });
//     }

//     res.status(200).json({
//       success: true,
//       total: requests.length,
//       data: requests,
//     });
//   } catch (error) {
//     console.error("GET REQUESTS BY EMAIL ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =======================
// // GET SINGLE REQUEST
// // =======================

// exports.getRequestById = async (req, res) => {
//   try {
//     const request = await Request.findById(req.params.id)
//       .populate("notificationId")
//       .populate("notifications.notificationId");

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: "Request not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: request,
//     });
//   } catch (error) {
//     console.error("GET REQUEST BY ID ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =======================
// // UPDATE REQUEST
// // =======================

// exports.updateRequest = async (req, res) => {
//   try {
//     const oldRequest = await Request.findById(req.params.id);

//     if (!oldRequest) {
//       return res.status(404).json({
//         success: false,
//         message: "Request not found",
//       });
//     }

//     const updatedRequest = await Request.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//       },
//     );

//     // =======================
//     // STATUS CHANGED
//     // =======================

//     if (req.body.status && req.body.status !== oldRequest.status) {
//       const userInfo = {
//         userId: updatedRequest.userId || null,
//         email: updatedRequest.email,
//         role: "user",
//         oldStatus: oldRequest.status,
//       };

//       // Create role-based notifications
//       await createAllRoleNotifications(
//         updatedRequest,
//         "request_status_changed",
//         userInfo,
//       );

//       // Send email notification
//       await sendRequestEmails(
//         updatedRequest,
//         "request_status_changed",
//         userInfo,
//       );
//     }

//     res.json({
//       success: true,
//       message: "Request updated",
//       data: updatedRequest,
//     });
//   } catch (error) {
//     console.error("UPDATE REQUEST ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =======================
// // DELETE REQUEST
// // =======================

// exports.deleteRequest = async (req, res) => {
//   try {
//     const request = await Request.findById(req.params.id);

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: "Request not found",
//       });
//     }

//     // =======================
//     // DELETE IMAGE FROM CLOUDINARY
//     // =======================

//     if (request.image?.public_id) {
//       await cloudinary.uploader.destroy(request.image.public_id);
//     }

//     // =======================
//     // CREATE NOTIFICATIONS BEFORE DELETE
//     // =======================

//     const userInfo = {
//       userId: request.userId || null,
//       email: request.email,
//       role: "user",
//     };

//     await createAllRoleNotifications(request, "request_deleted", userInfo);

//     // =======================
//     // DELETE REQUEST
//     // =======================

//     await Request.findByIdAndDelete(req.params.id);

//     res.json({
//       success: true,
//       message: "Request deleted",
//     });
//   } catch (error) {
//     console.error("DELETE REQUEST ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =======================
// // REPLY TO REQUEST
// // =======================

// exports.replyToRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { replyMessage } = req.body;

//     if (!replyMessage || replyMessage.trim().length < 5) {
//       return res.status(400).json({
//         success: false,
//         message: "Reply message must be at least 5 characters",
//       });
//     }

//     const request = await Request.findById(id);

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: "Request not found",
//       });
//     }

//     // Update request with reply
//     request.replyMessage = replyMessage.trim();
//     request.status = "replied";
//     request.repliedAt = new Date();

//     await request.save();

//     // =======================
//     // CREATE NOTIFICATIONS
//     // =======================

//     const userInfo = {
//       userId: request.userId || null,
//       email: request.email,
//       role: "user",
//     };

//     await createAllRoleNotifications(request, "request_replied", userInfo);

//     // =======================
//     // SEND REPLY EMAIL
//     // =======================

//     const replyEmailTemplate = {
//       subject: `Reply to Your Request - ${request.name}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Reply to Your Request</title>
//         </head>
//         <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//             <h1 style="color: white; margin: 0; font-size: 24px;">Reply to Your Request</h1>
//           </div>
//           <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
//             <p style="font-size: 16px; margin-bottom: 20px;">Hello ${request.name},</p>
//             <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your request. Here is our response:</p>
            
//             <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
//               <h3 style="margin: 0 0 15px; color: #11998e;">📝 Our Response</h3>
//               <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${replyMessage}</p>
//             </div>
            
//             <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #11998e;">
//               <p style="margin: 0; font-size: 14px; color: #495057;">
//                 <strong>📌 Original Request:</strong>
//               </p>
//               <p style="margin: 5px 0 0; font-size: 14px; color: #6c757d;">${request.message}</p>
//             </div>
            
//             <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
//               <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
//                 💡 If you have any further questions, please don't hesitate to reply to this email.
//               </p>
//             </div>
            
//             <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
//             <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
//               This is a reply to your request. Please keep this email for your records.
//             </p>
//           </div>
//         </body>
//         </html>
//       `,
//     };

//     await sendEmail({
//       to: request.email,
//       subject: replyEmailTemplate.subject,
//       html: replyEmailTemplate.html,
//     });

//     res.json({
//       success: true,
//       message: "Reply sent successfully",
//       data: request,
//     });
//   } catch (error) {
//     console.error("REPLY TO REQUEST ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =======================
// // GET REQUEST STATISTICS
// // =======================

// exports.getRequestStatistics = async (req, res) => {
//   try {
//     const total = await Request.countDocuments();
//     const pending = await Request.countDocuments({ status: "pending" });
//     const inProgress = await Request.countDocuments({ status: "in_progress" });
//     const resolved = await Request.countDocuments({ status: "resolved" });
//     const replied = await Request.countDocuments({ status: "replied" });
//     const cancelled = await Request.countDocuments({ status: "cancelled" });

//     // Recent requests (last 7 days)
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//     const recentRequests = await Request.countDocuments({
//       createdAt: { $gte: sevenDaysAgo },
//     });

//     // By language
//     const byLanguage = await Request.aggregate([
//       {
//         $group: {
//           _id: "$language",
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { count: -1 } },
//     ]);

//     res.status(200).json({
//       success: true,
//       statistics: {
//         total,
//         byStatus: {
//           pending,
//           inProgress,
//           resolved,
//           replied,
//           cancelled,
//         },
//         recentRequests,
//         byLanguage,
//       },
//     });
//   } catch (error) {
//     console.error("GET REQUEST STATISTICS ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ============================================================
// // NOTIFICATION CONTROLLER FUNCTIONS
// // ============================================================

// // GET ALL NOTIFICATIONS
// exports.getAllNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find({}).sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: notifications.length,
//       data: notifications,
//     });
//   } catch (error) {
//     console.error("❌ GET ALL NOTIFICATIONS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to get notifications",
//       error: error.message,
//     });
//   }
// };

// // GET NOTIFICATIONS BY ROLE
// exports.getNotificationsByRole = async (req, res) => {
//   try {
//     const { role } = req.params;
//     const { page = 1, limit = 20, isRead } = req.query;

//     const validRoles = ["user", "admin", "manager", "host"];
//     if (!validRoles.includes(role)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid role. Must be: user, admin, manager, or host",
//       });
//     }

//     const filter = {
//       targetRoles: { $in: [role] },
//     };

//     if (isRead !== undefined) {
//       filter.isRead = isRead === "true";
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [notifications, total] = await Promise.all([
//       Notification.find(filter)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Notification.countDocuments(filter),
//     ]);

//     const unreadCount = await Notification.countDocuments({
//       ...filter,
//       isRead: false,
//     });

//     return res.status(200).json({
//       success: true,
//       role,
//       data: notifications,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / parseInt(limit)),
//       },
//       unreadCount,
//     });
//   } catch (error) {
//     console.error("❌ GET NOTIFICATIONS BY ROLE ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to get notifications",
//       error: error.message,
//     });
//   }
// };

// // GET MY NOTIFICATIONS
// exports.getMyNotifications = async (req, res) => {
//   try {
//     const user = req.user;
//     const { page = 1, limit = 20, isRead } = req.query;

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not authenticated",
//       });
//     }

//     const filter = {
//       $or: [
//         { targetRoles: { $in: [user.role] } },
//         { targetUserId: user.id },
//         { targetUserEmail: user.email },
//         { userId: user.id },
//       ],
//     };

//     if (isRead !== undefined) {
//       filter.isRead = isRead === "true";
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [notifications, total] = await Promise.all([
//       Notification.find(filter)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Notification.countDocuments(filter),
//     ]);

//     const unreadCount = await Notification.countDocuments({
//       ...filter,
//       isRead: false,
//     });

//     return res.status(200).json({
//       success: true,
//       userRole: user.role,
//       data: notifications,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / parseInt(limit)),
//       },
//       unreadCount,
//     });
//   } catch (error) {
//     console.error("❌ GET MY NOTIFICATIONS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to get notifications",
//       error: error.message,
//     });
//   }
// };

// // MARK ONE NOTIFICATION AS READ
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
//     console.error("❌ MARK NOTIFICATION AS READ ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to mark notification as read",
//       error: error.message,
//     });
//   }
// };

// // MARK ALL NOTIFICATIONS AS READ
// exports.markAllNotificationsAsRead = async (req, res) => {
//   try {
//     const user = req.user;
//     const { role } = req.query;

//     let filter = {
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
//     console.error("❌ MARK ALL NOTIFICATIONS AS READ ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to mark all notifications as read",
//       error: error.message,
//     });
//   }
// };

// // GET UNREAD COUNT
// exports.getUnreadCount = async (req, res) => {
//   try {
//     const user = req.user;
//     const { role } = req.query;

//     let filter = {
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
//     console.error("❌ GET UNREAD COUNT ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to get unread count",
//       error: error.message,
//     });
//   }
// };

// // DELETE ONE NOTIFICATION
// // exports.deleteNotification = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const user = req.user;

// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid notification ID",
// //       });
// //     }

// //     const notification = await Notification.findById(id);

// //     if (!notification) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Notification not found",
// //       });
// //     }

// //     // Check permission
// //     const hasPermission =
// //       user.role === "admin" ||
// //       notification.targetUserId?.toString() === user.id ||
// //       notification.userId?.toString() === user.id;

// //     if (!hasPermission) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "You don't have permission to delete this notification",
// //       });
// //     }

// //     await notification.deleteOne();

// //     return res.status(200).json({
// //       success: true,
// //       message: "Notification deleted successfully",
// //       data: notification,
// //     });
// //   } catch (error) {
// //     console.error("❌ DELETE NOTIFICATION ERROR:", error);

// //     return res.status(500).json({
// //       success: false,
// //       message: "Failed to delete notification",
// //       error: error.message,
// //     });
// //   }
// // };

// exports.deleteNotification = async (req, res) => {
//   try {
//     const { id } = req.params;

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

//     // Delete notification without checking user, role, email, or ownership
//     await notification.deleteOne();

//     return res.status(200).json({
//       success: true,
//       message: "Notification deleted successfully",
//       data: notification,
//     });
//   } catch (error) {
//     console.error("❌ DELETE NOTIFICATION ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete notification",
//       error: error.message,
//     });
//   }
// };

// // BULK DELETE NOTIFICATIONS
// // exports.bulkDeleteNotifications = async (req, res) => {
// //   try {
// //     const { ids } = req.body;
// //     const user = req.user;

// //     if (!Array.isArray(ids) || ids.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Please provide an array of notification IDs",
// //       });
// //     }

// //     // Validate every ID
// //     const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

// //     if (invalidIds.length > 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "One or more notification IDs are invalid",
// //         invalidIds,
// //       });
// //     }

// //     let query = {
// //       _id: { $in: ids },
// //     };

// //     // Non-admin users can only delete their own notifications
// //     if (user.role !== "admin") {
// //       query.$or = [
// //         { targetUserId: user.id },
// //         { userId: user.id },
// //         { targetUserEmail: user.email },
// //       ];
// //     }

// //     const result = await Notification.deleteMany(query);

// //     if (result.deletedCount === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "No notifications found to delete",
// //       });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       message: `${result.deletedCount} notifications deleted successfully`,
// //       deletedCount: result.deletedCount,
// //     });
// //   } catch (error) {
// //     console.error("❌ BULK DELETE NOTIFICATIONS ERROR:", error);

// //     return res.status(500).json({
// //       success: false,
// //       message: "Failed to delete notifications",
// //       error: error.message,
// //     });
// //   }
// // };

// exports.bulkDeleteNotifications = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide an array of notification IDs",
//       });
//     }

//     // Validate every ID
//     const invalidIds = ids.filter(
//       (id) => !mongoose.Types.ObjectId.isValid(id)
//     );

//     if (invalidIds.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "One or more notification IDs are invalid",
//         invalidIds,
//       });
//     }

//     // Delete all requested notifications
//     // without checking role, user, email, or ownership
//     const result = await Notification.deleteMany({
//       _id: { $in: ids },
//     });

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
//     console.error("❌ BULK DELETE NOTIFICATIONS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete notifications",
//       error: error.message,
//     });
//   }
// };

// // GET NOTIFICATION STATISTICS
// exports.getNotificationStats = async (req, res) => {
//   try {
//     const user = req.user;

//     const query = {};

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
//     console.error("❌ GET NOTIFICATION STATS ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get notification statistics",
//       error: error.message,
//     });
//   }
// };

// // Export upload middleware
// module.exports.upload = upload;











const Request = require("../models/Request");
const Notification = require("../models/Notification");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { sendEmail } = require("../services/emailTransporter");

// =======================
// CLOUDINARY CONFIG
// =======================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =======================
// MULTER CONFIG
// =======================

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "requests",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 800,
        height: 800,
        crop: "limit",
      },
    ],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"), false);
    }
  },
});

// =======================
// EMAIL TEMPLATES
// =======================

const getRequestConfirmationEmail = (request) => ({
  subject: "Your Request Has Been Submitted",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Request Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Request Submitted Successfully</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello ${request.name},</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Your request has been submitted successfully. Our team will review it and get back to you shortly.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #667eea;">Request Details</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${request.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${request.email}</p>
          ${request.language ? `<p style="margin: 5px 0;"><strong>Language:</strong> ${request.language}</p>` : ""}
          <p style="margin: 5px 0;"><strong>Status:</strong> ${request.status || "Pending"}</p>
          <p style="margin: 15px 0 5px;"><strong>Message:</strong></p>
          <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${request.message}</p>
        </div>
        
        <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
          <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
            📌 You will receive a notification when your request is reviewed.
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

const getAdminRequestNotificationEmail = (request) => ({
  subject: `📩 New Request from ${request.name}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📩 New Request Received</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;">
            <strong>⚠️ New request requires your attention</strong>
          </p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #f5576c;">Request Details</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${request.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${request.email}</p>
          ${request.language ? `<p style="margin: 5px 0;"><strong>Language:</strong> ${request.language}</p>` : ""}
          <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date(request.createdAt).toLocaleString()}</p>
          <p style="margin: 15px 0 5px;"><strong>Message:</strong></p>
          <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${request.message}</p>
          ${
            request.image?.url
              ? `
            <p style="margin: 15px 0 5px;"><strong>Image:</strong></p>
            <img src="${request.image.url}" style="max-width: 100%; border-radius: 5px;" />
          `
              : ""
          }
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
          <p style="margin: 0; text-align: center;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/requests/${request._id}" 
               style="display: inline-block; background: #667eea; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px;">
              View & Respond
            </a>
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          Please login to the admin panel to respond to this request.
        </p>
      </div>
    </body>
    </html>
  `,
});

const getRequestStatusUpdateEmail = (request, oldStatus, newStatus) => ({
  subject: `Request Status Updated - ${request.name}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Request Status Update</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Request Status Updated</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello ${request.name},</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Your request status has been updated.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #11998e;">Status Update</h3>
          <p style="margin: 5px 0;"><strong>Old Status:</strong> ${oldStatus}</p>
          <p style="margin: 5px 0;"><strong>New Status:</strong> ${newStatus}</p>
          <p style="margin: 5px 0;"><strong>Request ID:</strong> ${request._id}</p>
        </div>
        
        <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
          <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
            💡 If you have any questions, please don't hesitate to contact us.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          This is an automated notification from your request management system.
        </p>
      </div>
    </body>
    </html>
  `,
});

// =======================
// NOTIFICATION FUNCTIONS
// =======================

// Create notification for specific role
const createRoleNotification = async (request, type, role, userInfo = null) => {
  try {
    let title = "";
    let message = "";
    let priority = "normal";
    let targetUserId = null;
    let targetUserEmail = request.email || "";
    let targetUserRole = role;

    switch (type) {
      case "request_created":
        title = "📩 New Request Created";
        message = `New request from ${request.name} (${request.email})`;
        priority = "high";
        targetUserId = request.userId || null;
        break;
      case "request_updated":
        title = "📝 Request Updated";
        message = `Request from ${request.name} has been updated`;
        priority = "normal";
        break;
      case "request_status_changed":
        title = "🔄 Request Status Changed";
        message = `Request from ${request.name} status changed to ${request.status || "updated"}`;
        priority = "high";
        break;
      case "request_replied":
        title = "✅ Reply Sent to Request";
        message = `Reply sent to ${request.name} (${request.email})`;
        priority = "high";
        break;
      case "request_deleted":
        title = "🗑️ Request Deleted";
        message = `Request from ${request.name} was deleted`;
        priority = "high";
        break;
      default:
        title = "📩 Request Notification";
        message = `Update for request from ${request.name}`;
    }

    // If userInfo is provided, use that for targeting
    if (userInfo) {
      targetUserId = userInfo.userId || targetUserId;
      targetUserEmail = userInfo.email || targetUserEmail;
      targetUserRole = userInfo.role || role;
    }

    const notification = new Notification({
      type: type,
      requestId: request._id,
      requestName: request.name,
      requestEmail: request.email,
      userId: request.userId || null,
      userName: request.name,
      userEmail: request.email,
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
      isGlobal: type === "request_created",
      metadata: {
        requestMessage: request.message,
        requestImage: request.image?.url || null,
        oldStatus: userInfo?.oldStatus || null,
        newStatus: request.status || null,
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
const createAllRoleNotifications = async (request, type, userInfo = null) => {
  const roles = ["admin", "manager", "host", "user"];
  const notifications = [];

  for (const role of roles) {
    const notification = await createRoleNotification(
      request,
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

// =======================
// SEND EMAIL NOTIFICATIONS
// =======================

const sendRequestEmails = async (request, type, userInfo = null) => {
  try {
    const emailsSent = [];

    // Send confirmation to user
    if (type === "request_created") {
      const userEmailTemplate = getRequestConfirmationEmail(request);
      const result = await sendEmail({
        to: request.email,
        subject: userEmailTemplate.subject,
        html: userEmailTemplate.html,
      });
      if (result.success) {
        emailsSent.push({ to: request.email, role: "user" });
        console.log(`✅ Request confirmation email sent to ${request.email}`);
      }
    }

    // Send notification to admin
    if (type === "request_created" || type === "request_updated") {
      const adminEmailTemplate = getAdminRequestNotificationEmail(request);
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

      if (adminEmail) {
        const result = await sendEmail({
          to: adminEmail,
          subject: adminEmailTemplate.subject,
          html: adminEmailTemplate.html,
        });
        if (result.success) {
          emailsSent.push({ to: adminEmail, role: "admin" });
          console.log(`✅ Admin notification email sent to ${adminEmail}`);
        }
      }
    }

    // Send status update to user
    if (type === "request_status_changed" && userInfo?.oldStatus) {
      const statusEmailTemplate = getRequestStatusUpdateEmail(
        request,
        userInfo.oldStatus,
        request.status || "updated",
      );
      const result = await sendEmail({
        to: request.email,
        subject: statusEmailTemplate.subject,
        html: statusEmailTemplate.html,
      });
      if (result.success) {
        emailsSent.push({ to: request.email, role: "user" });
        console.log(`✅ Status update email sent to ${request.email}`);
      }
    }

    // Send to Managers
    const managers = await User.find({ role: "manager", isActive: true });
    for (const manager of managers) {
      const managerTemplate = getAdminRequestNotificationEmail(request);
      const result = await sendEmail({
        to: manager.email,
        subject: `📩 New Request from ${request.name}`,
        html: managerTemplate.html,
      });
      if (result.success) {
        emailsSent.push({ to: manager.email, role: "manager" });
        console.log(`✅ Manager email sent to ${manager.email}`);
      }
    }

    return { success: true, emailsSent };
  } catch (error) {
    console.error("❌ Failed to send request emails:", error.message);
    return { success: false, error: error.message };
  }
};

// =======================
// CREATE REQUEST
// =======================

exports.createRequest = async (req, res) => {
  try {
    const { name, email, message, language } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Get user info from request
    const userId = req.user?.id || null;
    const userRole = req.user?.role || "user";

    let image = {};

    if (req.file) {
      image = {
        public_id: req.file.filename,
        url: req.file.path,
        format: req.file.format,
      };
    }

    const request = await Request.create({
      userId,
      name,
      email: email.toLowerCase().trim(),
      message,
      language,
      image,
      status: "pending",
    });

    console.log(`✅ Request created: ${request._id}`);

    // =======================
    // USER INFO FOR NOTIFICATIONS
    // =======================
    const userInfo = {
      userId: userId,
      email: email,
      role: userRole,
    };

    // =======================
    // CREATE ROLE-BASED NOTIFICATIONS
    // =======================
    await createAllRoleNotifications(request, "request_created", userInfo);

    // =======================
    // SEND EMAILS
    // =======================
    await sendRequestEmails(request, "request_created", userInfo);

    res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: request,
    });
  } catch (error) {
    console.log("CREATE REQUEST ERROR", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET ALL REQUESTS
// =======================

exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("notificationId")
      .populate("notifications.notificationId")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("GET REQUESTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET REQUESTS BY EMAIL
// =======================

exports.getRequestsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const requests = await Request.find({
      email: email.toLowerCase().trim(),
    }).sort({ createdAt: -1 });

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No requests found for this email",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      total: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("GET REQUESTS BY EMAIL ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET SINGLE REQUEST
// =======================

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("notificationId")
      .populate("notifications.notificationId");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("GET REQUEST BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// UPDATE REQUEST
// =======================

exports.updateRequest = async (req, res) => {
  try {
    const oldRequest = await Request.findById(req.params.id);

    if (!oldRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    // =======================
    // STATUS CHANGED
    // =======================

    if (req.body.status && req.body.status !== oldRequest.status) {
      const userInfo = {
        userId: updatedRequest.userId || null,
        email: updatedRequest.email,
        role: "user",
        oldStatus: oldRequest.status,
      };

      // Create role-based notifications
      await createAllRoleNotifications(
        updatedRequest,
        "request_status_changed",
        userInfo,
      );

      // Send email notification
      await sendRequestEmails(
        updatedRequest,
        "request_status_changed",
        userInfo,
      );
    }

    res.json({
      success: true,
      message: "Request updated",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("UPDATE REQUEST ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// DELETE REQUEST
// =======================

exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // =======================
    // DELETE IMAGE FROM CLOUDINARY
    // =======================

    if (request.image?.public_id) {
      await cloudinary.uploader.destroy(request.image.public_id);
    }

    // =======================
    // CREATE NOTIFICATIONS BEFORE DELETE
    // =======================

    const userInfo = {
      userId: request.userId || null,
      email: request.email,
      role: "user",
    };

    await createAllRoleNotifications(request, "request_deleted", userInfo);

    // =======================
    // DELETE REQUEST
    // =======================

    await Request.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Request deleted",
    });
  } catch (error) {
    console.error("DELETE REQUEST ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// REPLY TO REQUEST
// =======================

exports.replyToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage || replyMessage.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Reply message must be at least 5 characters",
      });
    }

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Update request with reply
    request.replyMessage = replyMessage.trim();
    request.status = "replied";
    request.repliedAt = new Date();

    await request.save();

    // =======================
    // CREATE NOTIFICATIONS
    // =======================

    const userInfo = {
      userId: request.userId || null,
      email: request.email,
      role: "user",
    };

    await createAllRoleNotifications(request, "request_replied", userInfo);

    // =======================
    // SEND REPLY EMAIL
    // =======================

    const replyEmailTemplate = {
      subject: `Reply to Your Request - ${request.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reply to Your Request</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Reply to Your Request</h1>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello ${request.name},</p>
            <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your request. Here is our response:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
              <h3 style="margin: 0 0 15px; color: #11998e;">📝 Our Response</h3>
              <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${replyMessage}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #11998e;">
              <p style="margin: 0; font-size: 14px; color: #495057;">
                <strong>📌 Original Request:</strong>
              </p>
              <p style="margin: 5px 0 0; font-size: 14px; color: #6c757d;">${request.message}</p>
            </div>
            
            <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
              <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
                💡 If you have any further questions, please don't hesitate to reply to this email.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
            <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
              This is a reply to your request. Please keep this email for your records.
            </p>
          </div>
        </body>
        </html>
      `,
    };

    await sendEmail({
      to: request.email,
      subject: replyEmailTemplate.subject,
      html: replyEmailTemplate.html,
    });

    res.json({
      success: true,
      message: "Reply sent successfully",
      data: request,
    });
  } catch (error) {
    console.error("REPLY TO REQUEST ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET REQUEST STATISTICS
// =======================

exports.getRequestStatistics = async (req, res) => {
  try {
    const total = await Request.countDocuments();
    const pending = await Request.countDocuments({ status: "pending" });
    const inProgress = await Request.countDocuments({ status: "in_progress" });
    const resolved = await Request.countDocuments({ status: "resolved" });
    const replied = await Request.countDocuments({ status: "replied" });
    const cancelled = await Request.countDocuments({ status: "cancelled" });

    // Recent requests (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentRequests = await Request.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // By language
    const byLanguage = await Request.aggregate([
      {
        $group: {
          _id: "$language",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        total,
        byStatus: {
          pending,
          inProgress,
          resolved,
          replied,
          cancelled,
        },
        recentRequests,
        byLanguage,
      },
    });
  } catch (error) {
    console.error("GET REQUEST STATISTICS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// NOTIFICATION CONTROLLER FUNCTIONS
// ============================================================

// GET ALL NOTIFICATIONS
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("❌ GET ALL NOTIFICATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get notifications",
      error: error.message,
    });
  }
};

// GET NOTIFICATIONS BY ROLE
exports.getNotificationsByRole = async (req, res) => {
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
    console.error("❌ GET NOTIFICATIONS BY ROLE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get notifications",
      error: error.message,
    });
  }
};

// GET MY NOTIFICATIONS
exports.getMyNotifications = async (req, res) => {
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
    console.error("❌ GET MY NOTIFICATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get notifications",
      error: error.message,
    });
  }
};

// MARK ONE NOTIFICATION AS READ
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

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
    console.error("❌ MARK NOTIFICATION AS READ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// MARK ALL NOTIFICATIONS AS READ
exports.markAllNotificationsAsRead = async (req, res) => {
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
    console.error("❌ MARK ALL NOTIFICATIONS AS READ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

// GET UNREAD COUNT
exports.getUnreadCount = async (req, res) => {
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
    console.error("❌ GET UNREAD COUNT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get unread count",
      error: error.message,
    });
  }
};

// DELETE ONE NOTIFICATION
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
    console.error("❌ DELETE NOTIFICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

// BULK DELETE NOTIFICATIONS
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
    const invalidIds = ids.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );

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
    console.error("❌ BULK DELETE NOTIFICATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notifications",
      error: error.message,
    });
  }
};

// GET NOTIFICATION STATISTICS
exports.getNotificationStats = async (req, res) => {
  try {
    const user = req.user;

    const query = {};

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
    console.error("❌ GET NOTIFICATION STATS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get notification statistics",
      error: error.message,
    });
  }
};

// Export upload middleware
module.exports.upload = upload;