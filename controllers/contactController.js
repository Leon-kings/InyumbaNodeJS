// const Contact = require("../models/Contact");
// const Notification = require("../models/Notification");
// const mongoose = require("mongoose");
// const { validationResult } = require("express-validator");
// const UserActivity = require("../activity/UserActivity");
// const { sendEmailWithTemplate, emailTemplates } = require("../mails/contactServices");

// // ===========================
// // NOTIFICATION FUNCTIONS
// // ===========================

// // Create notification for admin about new contact
// const createAdminNotification = async (contact, type) => {
//   try {
//     let message = "";
//     let metadata = {};

//     switch (type) {
//       case "created":
//         message = `📩 New contact from ${contact.name} (${contact.email})`;
//         metadata = {
//           name: contact.name,
//           email: contact.email,
//           messagePreview:
//             contact.messagePreview || contact.message.substring(0, 100) + "...",
//           status: contact.status,
//           ipAddress: contact.ipAddress,
//         };
//         break;
//       case "read":
//         message = `👀 Contact from ${contact.name} has been read`;
//         metadata = {
//           name: contact.name,
//           email: contact.email,
//           readAt: new Date(),
//         };
//         break;
//       case "replied":
//         message = `✅ Reply sent to ${contact.name} (${contact.email})`;
//         metadata = {
//           name: contact.name,
//           email: contact.email,
//           replyMessage: contact.replyMessage,
//           repliedAt: new Date(),
//         };
//         break;
//       default:
//         message = `📩 New contact from ${contact.name}`;
//     }

//     const notification = new Notification({
//       type: `contact_${type}`,
//       contactId: contact._id,
//       contactName: contact.name,
//       contactEmail: contact.email,
//       message: message,
//       isRead: false,
//       isGlobal: false,
//       status: "new",
//       metadata: metadata,
//       target: "admin",
//       data: {
//         contactId: contact._id,
//         name: contact.name,
//         email: contact.email,
//         message: contact.message,
//         status: contact.status,
//         createdAt: contact.createdAt,
//         ipAddress: contact.ipAddress,
//         userAgent: contact.userAgent,
//       },
//     });

//     await notification.save();
//     console.log(`✅ Contact notification created: ${message}`);
//     return notification;
//   } catch (error) {
//     console.error("❌ Error creating contact notification:", error);
//     return null;
//   }
// };

// // Create notification for user when replied
// const createUserNotification = async (contact) => {
//   try {
//     const notification = new Notification({
//       type: "contact_replied",
//       contactId: contact._id,
//       contactName: contact.name,
//       contactEmail: contact.email,
//       message: `✅ Your message has been replied to by our team`,
//       isRead: false,
//       isGlobal: false,
//       status: "new",
//       target: "user",
//       data: {
//         contactId: contact._id,
//         name: contact.name,
//         email: contact.email,
//         replyMessage: contact.replyMessage,
//         repliedAt: contact.repliedAt,
//       },
//     });

//     await notification.save();
//     console.log(`✅ User notification created for ${contact.email}`);
//     return notification;
//   } catch (error) {
//     console.error("❌ Error creating user notification:", error);
//     return null;
//   }
// };

// // ===========================
// // EMAIL FUNCTIONS
// // ===========================

// // Send contact confirmation email to user
// const sendContactConfirmationEmail = async (contact) => {
//   try {
//     const result = await sendEmailWithTemplate(
//       contact.email,
//       'contactConfirmation',
//       contact
//     );

//     if (result.success) {
//       console.log(`✅ Contact confirmation email sent to ${contact.email}`);
//     } else {
//       console.error(
//         `❌ Failed to send contact confirmation email to ${contact.email}:`,
//         result.error
//       );
//     }

//     return result;
//   } catch (error) {
//     console.error(`❌ Error sending contact confirmation email:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // Send contact notification to admin
// const sendContactNotificationToAdmin = async (contact) => {
//   try {
//     const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;

//     if (!adminEmail) {
//       console.log(`⚠️ No admin email configured`);
//       return { success: false, error: "No admin email configured" };
//     }

//     const result = await sendEmailWithTemplate(
//       adminEmail,
//       'contactNotificationForAdmin',
//       contact
//     );

//     if (result.success) {
//       console.log(`✅ Contact notification sent to admin ${adminEmail}`);
//     } else {
//       console.error(
//         `❌ Failed to send contact notification to admin:`,
//         result.error
//       );
//     }

//     return result;
//   } catch (error) {
//     console.error(`❌ Error sending contact notification to admin:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // Send reply email to user
// const sendReplyEmailToUser = async (contact) => {
//   try {
//     const result = await sendEmailWithTemplate(
//       contact.email,
//       'contactReply',
//       contact
//     );

//     if (result.success) {
//       console.log(`✅ Reply email sent to ${contact.email}`);
//     } else {
//       console.error(
//         `❌ Failed to send reply email to ${contact.email}:`,
//         result.error
//       );
//     }

//     return result;
//   } catch (error) {
//     console.error(`❌ Error sending reply email:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ============ CONTROLLER FUNCTIONS ============

// // ===========================
// // FORMAT IP ADDRESS
// // ===========================

// const getClientIP = (req) => {
//   let ip =
//     req.headers["x-forwarded-for"] ||
//     req.socket.remoteAddress ||
//     req.connection.remoteAddress;

//   // If multiple IPs exist from proxy
//   if (ip && ip.includes(",")) {
//     ip = ip.split(",")[0].trim();
//   }

//   // Convert IPv6 localhost / IPv4 mapped address
//   if (ip === "::1") {
//     return "127.0.0.1";
//   }

//   if (ip && ip.startsWith("::ffff:")) {
//     return ip.replace("::ffff:", "");
//   }

//   // Only return IPv4 format
//   const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;

//   if (ipv4Regex.test(ip)) {
//     return ip;
//   }

//   return "0.0.0.0";
// };

// // 1. Submit Contact Form
// exports.submitContact = async (req, res) => {
//   try {
//     const errors = validationResult(req);

//     // ===========================
//     // VALIDATION
//     // ===========================

//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array().map((e) => ({
//           field: e.path,
//           message: e.msg,
//         })),
//       });
//     }

//     const { name, email, message } = req.body;

//     const normalizedEmail = email.toLowerCase().trim();

//     // ===========================
//     // CHECK FOR DUPLICATE SUBMISSIONS
//     // ===========================

//     const recentSubmission = await Contact.findOne({
//       email: normalizedEmail,
//       createdAt: {
//         $gte: new Date(Date.now() - 5 * 60 * 1000),
//       },
//     });

//     if (recentSubmission) {
//       return res.status(429).json({
//         success: false,
//         message: "Please wait 5 minutes before submitting again",
//       });
//     }

//     // ===========================
//     // GET LOGGED-IN USER
//     // ===========================

//     // Do NOT get userId from req.body.
//     // It comes from the authenticated JWT.
//     const userId = req.user?.id || null;

//     // ===========================
//     // GET CLIENT INFORMATION
//     // ===========================

//     const ipAddress = getClientIP(req);

//     const userAgent = req.headers["user-agent"] || null;

//     // ===========================
//     // CREATE NEW CONTACT
//     // ===========================

//     const contact = new Contact({
//       userId,

//       name: name.trim(),

//       email: normalizedEmail,

//       message: message.trim(),

//       ipAddress,

//       userAgent,
//     });

//     await contact.save();

//     console.log(`✅ Contact created: ${contact._id}`);

//     // ===========================
//     // SEND EMAILS
//     // ===========================

//     let confirmationEmailSent = false;
//     let adminEmailSent = false;

//     // Send confirmation email to user
//     try {
//       const result = await sendContactConfirmationEmail(contact);
//       confirmationEmailSent = result.success;
//     } catch (emailError) {
//       console.error("❌ Failed to send confirmation email:", emailError.message);
//     }

//     // Send notification to admin
//     try {
//       const result = await sendContactNotificationToAdmin(contact);
//       adminEmailSent = result.success;
//     } catch (emailError) {
//       console.error("❌ Failed to send admin notification email:", emailError.message);
//     }

//     // ===========================
//     // CREATE USER ACTIVITY
//     // ===========================

//     try {
//       await UserActivity.create({
//         userId: userId,

//         userName: contact.name,

//         userEmail: contact.email,

//         action: "contact_created",

//         description: `User ${contact.name} submitted a contact message`,

//         ipAddress,

//         userAgent,
//       });

//       console.log(`✅ User activity created for ${contact.email}`);
//     } catch (activityError) {
//       // Activity failure should NOT
//       // prevent contact submission.
//       console.error(
//         "❌ Failed to create user activity:",
//         activityError.message,
//       );
//     }

//     // ===========================
//     // CREATE ADMIN NOTIFICATION
//     // ===========================

//     try {
//       await createAdminNotification(contact, "created");

//       console.log(`✅ Admin notification created for contact ${contact._id}`);
//     } catch (notificationError) {
//       // Notification failure should NOT
//       // prevent contact submission.
//       console.error(
//         "❌ Failed to create admin notification:",
//         notificationError.message,
//       );
//     }

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(201).json({
//       success: true,

//       message: "Contact form submitted successfully. A confirmation email has been sent.",

//       emailSent: confirmationEmailSent && adminEmailSent,

//       data: {
//         id: contact._id,

//         userId: contact.userId,

//         name: contact.name,

//         email: contact.email,

//         message: contact.message,

//         status: contact.status,

//         ipAddress: contact.ipAddress,

//         userAgent: contact.userAgent,

//         createdAt: contact.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Submit contact error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to submit contact form",
//     });
//   }
// };

// // 2. Get All Contacts (with pagination, filtering, search)
// exports.getAllContacts = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const skip = (page - 1) * limit;
//     const status = req.query.status;
//     const search = req.query.search;

//     let query = {};
//     if (status) query.status = status;
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { message: { $regex: search, $options: "i" } },
//       ];
//     }

//     const [contacts, total] = await Promise.all([
//       Contact.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Contact.countDocuments(query),
//     ]);

//     res.status(200).json({
//       success: true,
//       data: contacts,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get all contacts error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch contacts",
//     });
//   }
// };

// // 3. Get Contact by ID
// exports.getContactById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // ===========================
//     // VALIDATE MONGODB OBJECT ID
//     // ===========================

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid contact ID",
//       });
//     }

//     // ===========================
//     // FIND CONTACT
//     // ===========================

//     const contact = await Contact.findById(id);

//     if (!contact) {
//       return res.status(404).json({
//         success: false,
//         message: "Contact not found",
//       });
//     }

//     // ===========================
//     // MARK AS READ
//     // ===========================

//     if (contact.status === "pending") {
//       contact.status = "read";
//       contact.readAt = new Date();

//       await contact.save();

//       // ===========================
//       // CREATE READ NOTIFICATION
//       // ===========================

//       try {
//         await createAdminNotification(contact, "read");
//       } catch (notificationError) {
//         // Notification failure should NOT
//         // prevent the contact from being returned
//         console.error(
//           "Failed to create read notification:",
//           notificationError.message,
//         );
//       }
//     }

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,
//       data: contact,
//     });
//   } catch (error) {
//     console.error("Get contact by ID error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch contact",
//     });
//   }
// };

// // 4. Get Contacts by Email
// exports.getContactsByEmail = async (req, res) => {
//   try {
//     const email = req.params.email.toLowerCase();
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const [contacts, total] = await Promise.all([
//       Contact.find({ email })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Contact.countDocuments({ email }),
//     ]);

//     if (contacts.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No contacts found for this email",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: contacts,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get contacts by email error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch contacts",
//     });
//   }
// };

// // 5. Update Contact Status
// exports.updateContactStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     // ===========================
//     // VALIDATE CONTACT ID
//     // ===========================

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid contact ID",
//       });
//     }

//     // ===========================
//     // VALIDATE STATUS
//     // ===========================

//     const allowedStatuses = [
//       "pending",
//       "read",
//       "replied",
//       "archived",
//     ];

//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid contact status",
//         allowedStatuses,
//       });
//     }

//     // ===========================
//     // FIND CONTACT
//     // ===========================

//     const contact = await Contact.findById(id);

//     if (!contact) {
//       return res.status(404).json({
//         success: false,
//         message: "Contact not found",
//       });
//     }

//     // ===========================
//     // SAVE OLD STATUS
//     // ===========================

//     const oldStatus = contact.status;

//     // ===========================
//     // UPDATE STATUS
//     // ===========================

//     contact.status = status;

//     if (status === "read" && !contact.readAt) {
//       contact.readAt = new Date();
//     }

//     if (status === "replied" && !contact.repliedAt) {
//       contact.repliedAt = new Date();
//     }

//     await contact.save();

//     // ===========================
//     // CREATE NOTIFICATION
//     // ONLY WHEN STATUS CHANGES
//     // ===========================

//     if (
//       oldStatus !== status &&
//       status === "replied"
//     ) {
//       try {
//         await createAdminNotification(
//           contact,
//           "replied"
//         );
//       } catch (notificationError) {
//         console.error(
//           "Failed to create status notification:",
//           notificationError.message
//         );
//       }
//     }

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,
//       message: "Contact status updated successfully",

//       data: {
//         id: contact._id,
//         name: contact.name,
//         email: contact.email,
//         message: contact.message,
//         status: contact.status,
//         readAt: contact.readAt,
//         repliedAt: contact.repliedAt,
//         updatedAt: contact.updatedAt,
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Update contact status error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update contact status",
//     });
//   }
// };

// // 6. Reply to Contact
// exports.replyToContact = async (req, res) => {
//   try {
//     const { replyMessage, status } = req.body;

//     // ===========================
//     // VALIDATE REPLY MESSAGE
//     // ===========================

//     if (
//       !replyMessage ||
//       replyMessage.trim().length < 5
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Reply message must be at least 5 characters",
//       });
//     }

//     // ===========================
//     // VALIDATE CONTACT ID
//     // ===========================

//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid contact ID",
//       });
//     }

//     // ===========================
//     // FIND CONTACT
//     // ===========================

//     const contact = await Contact.findById(id);

//     if (!contact) {
//       return res.status(404).json({
//         success: false,
//         message: "Contact not found",
//       });
//     }

//     // ===========================
//     // DETERMINE STATUS
//     // ===========================

//     const finalStatus = status || "replied";

//     const allowedStatuses = [
//       "pending",
//       "read",
//       "replied",
//       "archived",
//     ];

//     if (!allowedStatuses.includes(finalStatus)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid contact status",
//         allowedStatuses,
//       });
//     }

//     // ===========================
//     // UPDATE CONTACT FIRST
//     // ===========================

//     contact.status = finalStatus;
//     contact.replyMessage = replyMessage.trim();

//     if (finalStatus === "replied") {
//       contact.repliedAt = new Date();
//     }

//     await contact.save();

//     // ===========================
//     // SEND REPLY EMAIL TO USER
//     // ===========================

//     let emailSent = false;
//     try {
//       const result = await sendReplyEmailToUser(contact);
//       emailSent = result.success;
//     } catch (emailError) {
//       console.error("❌ Failed to send reply email:", emailError.message);
//     }

//     // ===========================
//     // CREATE NOTIFICATIONS
//     // ===========================

//     try {
//       // Admin notification
//       await createAdminNotification(
//         contact,
//         "replied"
//       );
//     } catch (notificationError) {
//       console.error(
//         "Admin notification error:",
//         notificationError.message
//       );
//     }

//     try {
//       // User notification
//       await createUserNotification(contact);
//     } catch (notificationError) {
//       console.error(
//         "User notification error:",
//         notificationError.message
//       );
//     }

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,
//       message: emailSent
//         ? "Reply saved and email sent to user successfully"
//         : "Reply saved successfully, but email could not be sent",
      
//       emailSent,

//       data: {
//         id: contact._id,
//         userId: contact.userId,
//         name: contact.name,
//         email: contact.email,
//         message: contact.message,
//         replyMessage: contact.replyMessage,
//         status: contact.status,
//         repliedAt: contact.repliedAt,
//         updatedAt: contact.updatedAt,
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Reply to contact error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to reply to contact",
//     });
//   }
// };

// // 7. Delete Contact
// exports.deleteContact = async (req, res) => {
//   try {
//     const contact = await Contact.findById(req.params.id);

//     if (!contact) {
//       return res.status(404).json({
//         success: false,
//         message: "Contact not found",
//       });
//     }

//     await contact.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Contact deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete contact error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete contact",
//     });
//   }
// };

// // 8. Get Statistics
// exports.getStatistics = async (req, res) => {
//   try {
//     const stats = await Contact.getStatistics();

//     res.status(200).json({
//       success: true,
//       data: stats,
//     });
//   } catch (error) {
//     console.error("Get statistics error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get statistics",
//     });
//   }
// };

// // 9. Bulk Delete Contacts
// exports.bulkDeleteContacts = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide an array of contact IDs",
//       });
//     }

//     const result = await Contact.deleteMany({ _id: { $in: ids } });

//     res.status(200).json({
//       success: true,
//       message: `${result.deletedCount} contacts deleted successfully`,
//       deletedCount: result.deletedCount,
//     });
//   } catch (error) {
//     console.error("Bulk delete error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete contacts",
//     });
//   }
// };

// // 10. Export Contacts (CSV)
// exports.exportContacts = async (req, res) => {
//   try {
//     const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

//     // Create CSV header
//     let csv = "Name,Email,Message,Status,Submitted At\n";

//     // Add data rows
//     contacts.forEach((c) => {
//       csv += `"${c.name}","${c.email}","${c.message.replace(/"/g, '""')}","${c.status}","${c.createdAt.toISOString()}"\n`;
//     });

//     res.setHeader("Content-Type", "text/csv");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=contacts_${Date.now()}.csv`,
//     );
//     res.status(200).send(csv);
//   } catch (error) {
//     console.error("Export contacts error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to export contacts",
//     });
//   }
// };

// // 11. Edit Contact
// exports.editContact = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, email, message, status } = req.body;

//     const contact = await Contact.findById(id);

//     if (!contact) {
//       return res.status(404).json({
//         success: false,
//         message: "Contact not found",
//       });
//     }

//     // Update fields
//     if (name) contact.name = name;
//     if (email) contact.email = email;
//     if (message) contact.message = message;
//     if (status) contact.status = status;

//     await contact.save();

//     return res.status(200).json({
//       success: true,
//       message: "Contact updated successfully",
//       data: {
//         id: contact._id,
//         name: contact.name,
//         email: contact.email,
//         message: contact.message,
//         status: contact.status,
//         createdAt: contact.createdAt,
//         updatedAt: contact.updatedAt,
//       },
//     });
//   } catch (error) {
//     console.error("Edit contact error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update contact",
//     });
//   }
// };

// // 12. Get Contact Notifications (Admin)
// exports.getContactNotifications = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const skip = (page - 1) * limit;
//     const status = req.query.status;

//     let query = {
//       type: { $regex: /^contact_/ },
//       target: { $in: ["admin", "both"] },
//     };

//     if (status) query.status = status;

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
//         status: "new",
//       }),
//     ]);

//     res.status(200).json({
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
//     console.error("Get contact notifications error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch notifications",
//     });
//   }
// };

// // ============================================================
// // GET CONTACT NOTIFICATIONS
// // ============================================================
// // GET /api/notifications/contact
// // GET /api/notifications/contact?page=1&limit=20
// // GET /api/notifications/contact?status=new
// // ============================================================

// exports.getContactNotifications = async (req, res) => {
//   try {
//     // ===========================
//     // PAGINATION
//     // ===========================

//     const page = Math.max(
//       parseInt(req.query.page) || 1,
//       1
//     );

//     const limit = Math.min(
//       Math.max(
//         parseInt(req.query.limit) || 20,
//         1
//       ),
//       100
//     );

//     const skip = (page - 1) * limit;

//     const status = req.query.status;

//     // ===========================
//     // BASE QUERY
//     // ===========================

//     const query = {
//       type: {
//         $regex: /^contact_/,
//       },

//       target: {
//         $in: ["admin", "both"],
//       },
//     };

//     // ===========================
//     // OPTIONAL STATUS FILTER
//     // ===========================

//     if (status) {
//       query.status = status;
//     }

//     // ===========================
//     // GET DATA + COUNTS
//     // ===========================

//     const [
//       notifications,
//       total,
//       unreadCount,
//     ] = await Promise.all([
//       Notification.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),

//       Notification.countDocuments(query),

//       Notification.countDocuments({
//         ...query,
//         isRead: false,
//         status: "new",
//       }),
//     ]);

//     // ===========================
//     // RESPONSE
//     // ===========================

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
//     console.error(
//       "Get contact notifications error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch notifications",
//     });
//   }
// };


// // ============================================================
// // MARK ONE CONTACT NOTIFICATION AS READ
// // ============================================================
// // PUT /api/notifications/contact/:id/read
// // ============================================================

// exports.markContactNotificationAsRead = async (
//   req,
//   res
// ) => {
//   try {
//     const { id } = req.params;

//     // ===========================
//     // VALIDATE ID
//     // ===========================

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Notification ID is required",
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Invalid notification ID",
//       });
//     }

//     // ===========================
//     // FIND NOTIFICATION
//     // ===========================

//     const notification =
//       await Notification.findOne({
//         _id: id,

//         type: {
//           $regex: /^contact_/,
//         },

//         target: {
//           $in: ["admin", "both"],
//         },
//       });

//     // ===========================
//     // NOT FOUND
//     // ===========================

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: "Notification not found",
//       });
//     }

//     // ===========================
//     // MARK AS READ
//     // ===========================

//     notification.isRead = true;
//     notification.status = "read";
//     notification.readAt = new Date();

//     await notification.save();

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,
//       message:
//         "Notification marked as read",
//       data: notification,
//     });
//   } catch (error) {
//     console.error(
//       "Mark contact notification as read error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to mark notification as read",
//     });
//   }
// };


// // ============================================================
// // BULK MARK CONTACT NOTIFICATIONS AS READ
// // ============================================================
// // PUT /api/notifications/contact/read-all
// //
// // Body:
// // {
// //   "ids": ["id1", "id2", "id3"]
// // }
// //
// // If ids are omitted or empty, ALL admin contact
// // notifications will be marked as read.
// // ============================================================

// exports.bulkMarkContactNotificationsAsRead = async (
//   req,
//   res
// ) => {
//   try {
//     const { ids } = req.body;

//     // ===========================
//     // BASE QUERY
//     // ===========================

//     const query = {
//       type: {
//         $regex: /^contact_/,
//       },

//       target: {
//         $in: ["admin", "both"],
//       },

//       isRead: false,
//     };

//     // ===========================
//     // IF IDS WERE PROVIDED
//     // ===========================

//     if (Array.isArray(ids) && ids.length > 0) {
//       const invalidIds = ids.filter(
//         (id) =>
//           !mongoose.Types.ObjectId.isValid(id)
//       );

//       if (invalidIds.length > 0) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "One or more notification IDs are invalid",
//           invalidIds,
//         });
//       }

//       query._id = {
//         $in: ids,
//       };
//     }

//     // ===========================
//     // UPDATE
//     // ===========================

//     const result =
//       await Notification.updateMany(
//         query,
//         {
//           $set: {
//             isRead: true,
//             status: "read",
//             readAt: new Date(),
//           },
//         }
//       );

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,

//       message: ids?.length
//         ? "Selected notifications marked as read"
//         : "All contact notifications marked as read",

//       modifiedCount:
//         result.modifiedCount,
//     });
//   } catch (error) {
//     console.error(
//       "Bulk mark contact notifications as read error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to mark notifications as read",
//     });
//   }
// };


// // ============================================================
// // DELETE ONE CONTACT NOTIFICATION
// // ============================================================
// // DELETE /api/notifications/contact/:id
// // ============================================================

// // exports.deleteContactNotification = async (
// //   req,
// //   res
// // ) => {
// //   try {
// //     const { id } = req.params;

// //     // ===========================
// //     // VALIDATE ID
// //     // ===========================

// //     if (!id) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Notification ID is required",
// //       });
// //     }

// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Invalid notification ID",
// //       });
// //     }

// //     // ===========================
// //     // DELETE
// //     // ===========================

// //     const notification =
// //       await Notification.findOneAndDelete({
// //         _id: id,

// //         type: {
// //           $regex: /^contact_/,
// //         },

// //         target: {
// //           $in: ["admin", "both"],
// //         },
// //       });

// //     // ===========================
// //     // NOT FOUND
// //     // ===========================

// //     if (!notification) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Notification not found",
// //       });
// //     }

// //     // ===========================
// //     // RESPONSE
// //     // ===========================

// //     return res.status(200).json({
// //       success: true,
// //       message:
// //         "Notification deleted successfully",
// //       data: notification,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Delete contact notification error:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         "Failed to delete notification",
// //     });
// //   }
// // };

// exports.deleteContactNotification = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // ===========================
//     // VALIDATE ID
//     // ===========================

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Notification ID is required",
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid notification ID",
//       });
//     }

//     // ===========================
//     // DELETE NOTIFICATION
//     // ===========================

//     const notification = await Notification.findByIdAndDelete(id);

//     // ===========================
//     // NOT FOUND
//     // ===========================

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: "Notification not found",
//       });
//     }

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,
//       message: "Notification deleted successfully",
//       data: notification,
//     });
//   } catch (error) {
//     console.error(
//       "Delete contact notification error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete notification",
//     });
//   }
// };


// // ============================================================
// // BULK DELETE CONTACT NOTIFICATIONS
// // ============================================================
// // DELETE /api/notifications/contact/bulk
// //
// // Body:
// // {
// //   "ids": ["id1", "id2", "id3"]
// // }
// //
// // If ids are omitted or empty, ALL admin contact
// // notifications will be deleted.
// // ============================================================

// exports.bulkDeleteContactNotifications = async (
//   req,
//   res
// ) => {
//   try {
//     const { ids } = req.body;

//     // ===========================
//     // BASE QUERY
//     // ===========================

//     const query = {
//       type: {
//         $regex: /^contact_/,
//       },

//       target: {
//         $in: ["admin", "both"],
//       },
//     };

//     // ===========================
//     // IF IDS WERE PROVIDED
//     // ===========================

//     if (Array.isArray(ids) && ids.length > 0) {
//       const invalidIds = ids.filter(
//         (id) =>
//           !mongoose.Types.ObjectId.isValid(id)
//       );

//       if (invalidIds.length > 0) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "One or more notification IDs are invalid",
//           invalidIds,
//         });
//       }

//       query._id = {
//         $in: ids,
//       };
//     }

//     // ===========================
//     // DELETE
//     // ===========================

//     const result =
//       await Notification.deleteMany(query);

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,

//       message: ids?.length
//         ? "Selected notifications deleted successfully"
//         : "All contact notifications deleted successfully",

//       deletedCount:
//         result.deletedCount,
//     });
//   } catch (error) {
//     console.error(
//       "Bulk delete contact notifications error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to delete notifications",
//     });
//   }
// };

// // 13. Mark Notification as Read
// exports.markNotificationAsRead = async (req, res) => {
//   try {
//     const notification = await Notification.findById(req.params.id);

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: "Notification not found",
//       });
//     }

//     notification.isRead = true;
//     notification.status = "read";
//     notification.readAt = new Date();
//     await notification.save();

//     res.status(200).json({
//       success: true,
//       message: "Notification marked as read",
//       data: notification,
//     });
//   } catch (error) {
//     console.error("Mark notification as read error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to mark notification as read",
//     });
//   }
// };

// // 14. Mark All Notifications as Read
// exports.markAllNotificationsAsRead = async (req, res) => {
//   try {
//     await Notification.updateMany(
//       { type: { $regex: /^contact_/ }, isRead: false },
//       {
//         $set: {
//           isRead: true,
//           status: "read",
//           readAt: new Date(),
//         },
//       },
//     );

//     res.status(200).json({
//       success: true,
//       message: "All notifications marked as read",
//     });
//   } catch (error) {
//     console.error("Mark all notifications as read error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to mark all notifications as read",
//     });
//   }
// };









const Contact = require("../models/Contact");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const UserActivity = require("../activity/UserActivity");
const { sendEmail } = require("../services/emailTransporter");

// ===========================
// EMAIL TEMPLATES
// ===========================

const getContactConfirmationEmail = (contact) => ({
  subject: "We Received Your Message - Thank You for Contacting Us",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting Us</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello ${contact.name},</p>
        <p style="font-size: 16px; margin-bottom: 20px;">We have received your message and will get back to you within 24-48 hours.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #667eea;">Your Message Summary</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${contact.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${contact.email}</p>
          ${contact.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${contact.phone}</p>` : ''}
          <p style="margin: 5px 0;"><strong>Message:</strong></p>
          <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${contact.message}</p>
        </div>
        
        <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
          <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
            📌 Our team will review your message and respond as soon as possible.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          This is an automated confirmation. Please do not reply to this email.
        </p>
      </div>
    </body>
    </html>
  `,
});

const getAdminNotificationEmail = (contact) => ({
  subject: `📩 New Contact Form Submission - ${contact.name}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Submission</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📩 New Contact Form Submission</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;">
            <strong>⚠️ New message requires your attention</strong>
          </p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #f5576c;">Contact Details</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${contact.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${contact.email}</p>
          ${contact.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${contact.phone}</p>` : ''}
          <p style="margin: 5px 0;"><strong>Status:</strong> ${contact.status}</p>
          <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
          ${contact.ipAddress ? `<p style="margin: 5px 0;"><strong>IP Address:</strong> ${contact.ipAddress}</p>` : ''}
          <p style="margin: 15px 0 5px;"><strong>Message:</strong></p>
          <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${contact.message}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
          <p style="margin: 0; text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/contacts/${contact._id}" 
               style="display: inline-block; background: #667eea; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px;">
              View & Reply
            </a>
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          This is an automated notification. Please login to the admin panel to reply.
        </p>
      </div>
    </body>
    </html>
  `,
});

const getReplyEmail = (contact) => ({
  subject: `Reply to Your Message - ${contact.name}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reply to Your Message</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Reply to Your Message</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello ${contact.name},</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Thank you for contacting us. Here is our response to your inquiry:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #11998e;">📝 Our Response</h3>
          <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${contact.replyMessage}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #11998e;">
          <p style="margin: 0; font-size: 14px; color: #495057;">
            <strong>📌 Original Message:</strong>
          </p>
          <p style="margin: 5px 0 0; font-size: 14px; color: #6c757d;">${contact.message}</p>
        </div>
        
        <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
          <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
            💡 If you have any further questions, please don't hesitate to reply to this email.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          This is a reply to your inquiry. Please keep this email for your records.
        </p>
      </div>
    </body>
    </html>
  `,
});

// ===========================
// NOTIFICATION FUNCTIONS
// ===========================

// Create notification for specific role
const createRoleNotification = async (contact, type, role) => {
  try {
    let title = "";
    let message = "";
    let priority = "normal";

    switch (type) {
      case "created":
        title = "📩 New Contact Submission";
        message = `New contact from ${contact.name} (${contact.email})`;
        priority = "high";
        break;
      case "read":
        title = "👀 Contact Read";
        message = `Contact from ${contact.name} has been read`;
        break;
      case "replied":
        title = "✅ Reply Sent";
        message = `Reply sent to ${contact.name} (${contact.email})`;
        priority = "high";
        break;
      case "archived":
        title = "📦 Contact Archived";
        message = `Contact from ${contact.name} has been archived`;
        break;
      default:
        title = "📩 New Contact";
        message = `New contact from ${contact.name}`;
    }

    const notification = new Notification({
      type: `contact_${type}`,
      contactId: contact._id,
      contactName: contact.name,
      contactEmail: contact.email,
      userId: contact.userId || null,
      userName: contact.name,
      userEmail: contact.email,
      userRole: role,
      title,
      message,
      isRead: false,
      status: "new",
      targetRoles: [role],
      targetUserId: contact.userId || null,
      targetUserEmail: contact.email,
      targetUserRole: role,
      priority,
      isGlobal: false,
      metadata: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        messagePreview: contact.message.substring(0, 100) + "...",
        status: contact.status,
        ipAddress: contact.ipAddress,
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
const createAllRoleNotifications = async (contact, type) => {
  const roles = ["admin", "manager", "host", "user"];
  const notifications = [];

  for (const role of roles) {
    const notification = await createRoleNotification(contact, type, role);
    if (notification) {
      notifications.push(notification);
    }
  }

  return notifications;
};

// ===========================
// FORMAT IP ADDRESS
// ===========================

const getClientIP = (req) => {
  let ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress;

  if (ip && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  if (ip === "::1") {
    return "127.0.0.1";
  }

  if (ip && ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }

  const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(ip)) {
    return ip;
  }

  return "0.0.0.0";
};

// ===========================
// CONTROLLER FUNCTIONS
// ===========================

// 1. Submit Contact Form
exports.submitContact = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
        })),
      });
    }

    const { name, email, phone, message } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check for duplicate submissions
    const recentSubmission = await Contact.findOne({
      email: normalizedEmail,
      createdAt: {
        $gte: new Date(Date.now() - 5 * 60 * 1000),
      },
    });

    if (recentSubmission) {
      return res.status(429).json({
        success: false,
        message: "Please wait 5 minutes before submitting again",
      });
    }

    const userId = req.user?.id || null;
    const userRole = req.user?.role || "user";
    const ipAddress = getClientIP(req);
    const userAgent = req.headers["user-agent"] || null;

    // Create new contact
    const contact = new Contact({
      userId,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || null,
      message: message.trim(),
      ipAddress,
      userAgent,
      status: "pending",
    });

    await contact.save();
    console.log(`✅ Contact created: ${contact._id}`);

    // ===========================
    // SEND EMAILS
    // ===========================

    let confirmationEmailSent = false;
    let adminEmailSent = false;

    // Send confirmation email to user
    try {
      const userEmailTemplate = getContactConfirmationEmail(contact);
      const result = await sendEmail({
        to: contact.email,
        subject: userEmailTemplate.subject,
        html: userEmailTemplate.html,
      });
      confirmationEmailSent = result.success;
    } catch (emailError) {
      console.error("❌ Failed to send confirmation email:", emailError.message);
    }

    // Send notification to admin
    try {
      const adminEmailTemplate = getAdminNotificationEmail(contact);
      const adminEmail = process.env.ADMIN_EMAIL;

      if (adminEmail) {
        const result = await sendEmail({
          to: adminEmail,
          subject: adminEmailTemplate.subject,
          html: adminEmailTemplate.html,
        });
        adminEmailSent = result.success;
      } else {
        console.log("⚠️ No ADMIN_EMAIL configured in .env");
      }
    } catch (emailError) {
      console.error("❌ Failed to send admin notification email:", emailError.message);
    }

    // ===========================
    // CREATE USER ACTIVITY
    // ===========================

    try {
      await UserActivity.create({
        userId: userId,
        userName: contact.name,
        userEmail: contact.email,
        action: "contact_created",
        description: `User ${contact.name} submitted a contact message`,
        ipAddress,
        userAgent,
      });
      console.log(`✅ User activity created for ${contact.email}`);
    } catch (activityError) {
      console.error("❌ Failed to create user activity:", activityError.message);
    }

    // ===========================
    // CREATE ROLE-BASED NOTIFICATIONS
    // ===========================

    try {
      await createAllRoleNotifications(contact, "created");
      console.log(`✅ Role-based notifications created for contact ${contact._id}`);
    } catch (notificationError) {
      console.error("❌ Failed to create role-based notifications:", notificationError.message);
    }

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(201).json({
      success: true,
      message: "Contact form submitted successfully. A confirmation email has been sent.",
      emailSent: confirmationEmailSent && adminEmailSent,
      data: {
        id: contact._id,
        userId: contact.userId,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        message: contact.message,
        status: contact.status,
        ipAddress: contact.ipAddress,
        userAgent: contact.userAgent,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    console.error("Submit contact error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit contact form",
    });
  }
};

// 2. Get All Contacts (with pagination, filtering, search)
exports.getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;

    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all contacts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
};

// 3. Get Contact by ID
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Mark as read if pending
    if (contact.status === "pending") {
      contact.status = "read";
      contact.readAt = new Date();
      await contact.save();

      try {
        await createAllRoleNotifications(contact, "read");
      } catch (notificationError) {
        console.error("Failed to create read notification:", notificationError.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Get contact by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
    });
  }
};

// 4. Get Contacts by Email
exports.getContactsByEmail = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      Contact.find({ email })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments({ email }),
    ]);

    if (contacts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No contacts found for this email",
      });
    }

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get contacts by email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
};

// 5. Update Contact Status
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }

    const allowedStatuses = ["pending", "read", "replied", "archived"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact status",
        allowedStatuses,
      });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    const oldStatus = contact.status;
    contact.status = status;

    if (status === "read" && !contact.readAt) {
      contact.readAt = new Date();
    }
    if (status === "replied" && !contact.repliedAt) {
      contact.repliedAt = new Date();
    }

    await contact.save();

    if (oldStatus !== status) {
      const notificationType = status === "replied" ? "replied" : "read";
      try {
        await createAllRoleNotifications(contact, notificationType);
      } catch (notificationError) {
        console.error("Failed to create status notification:", notificationError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Contact status updated successfully",
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        status: contact.status,
        readAt: contact.readAt,
        repliedAt: contact.repliedAt,
        updatedAt: contact.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update contact status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update contact status",
    });
  }
};

// 6. Reply to Contact
exports.replyToContact = async (req, res) => {
  try {
    const { replyMessage, status } = req.body;

    if (!replyMessage || replyMessage.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Reply message must be at least 5 characters",
      });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    const finalStatus = status || "replied";
    const allowedStatuses = ["pending", "read", "replied", "archived"];
    if (!allowedStatuses.includes(finalStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact status",
        allowedStatuses,
      });
    }

    contact.status = finalStatus;
    contact.replyMessage = replyMessage.trim();
    if (finalStatus === "replied") {
      contact.repliedAt = new Date();
    }
    await contact.save();

    // Send reply email to user
    let emailSent = false;
    try {
      const replyEmailTemplate = getReplyEmail(contact);
      const result = await sendEmail({
        to: contact.email,
        subject: replyEmailTemplate.subject,
        html: replyEmailTemplate.html,
      });
      emailSent = result.success;
    } catch (emailError) {
      console.error("❌ Failed to send reply email:", emailError.message);
    }

    // Create role-based notifications
    try {
      await createAllRoleNotifications(contact, "replied");
    } catch (notificationError) {
      console.error("Role-based notification error:", notificationError.message);
    }

    return res.status(200).json({
      success: true,
      message: emailSent
        ? "Reply saved and email sent to user successfully"
        : "Reply saved successfully, but email could not be sent",
      emailSent,
      data: {
        id: contact._id,
        userId: contact.userId,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        replyMessage: contact.replyMessage,
        status: contact.status,
        repliedAt: contact.repliedAt,
        updatedAt: contact.updatedAt,
      },
    });
  } catch (error) {
    console.error("Reply to contact error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reply to contact",
    });
  }
};

// 7. Delete Contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Create archive notification
    try {
      await createAllRoleNotifications(contact, "archived");
    } catch (notificationError) {
      console.error("Archive notification error:", notificationError.message);
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
    });
  }
};

// 8. Get Statistics
exports.getStatistics = async (req, res) => {
  try {
    const stats = await Contact.getStatistics();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get statistics",
    });
  }
};

// 9. Bulk Delete Contacts
exports.bulkDeleteContacts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of contact IDs",
      });
    }

    const result = await Contact.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} contacts deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete contacts",
    });
  }
};

// 10. Export Contacts (CSV)
exports.exportContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

    let csv = "Name,Email,Phone,Message,Status,Submitted At\n";

    contacts.forEach((c) => {
      csv += `"${c.name}","${c.email}","${c.phone || ''}","${c.message.replace(/"/g, '""')}","${c.status}","${c.createdAt.toISOString()}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=contacts_${Date.now()}.csv`
    );
    res.status(200).send(csv);
  } catch (error) {
    console.error("Export contacts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export contacts",
    });
  }
};

// 11. Edit Contact
exports.editContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message, status } = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    if (name) contact.name = name;
    if (email) contact.email = email;
    if (phone) contact.phone = phone;
    if (message) contact.message = message;
    if (status) contact.status = status;

    await contact.save();

    return res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        message: contact.message,
        status: contact.status,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      },
    });
  } catch (error) {
    console.error("Edit contact error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update contact",
    });
  }
};

// ===========================
// CONTACT NOTIFICATION FUNCTIONS (ORIGINAL)
// ===========================

// 12. Get Contact Notifications (Admin)
exports.getContactNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {
      type: { $regex: /^contact_/ },
      targetRoles: { $in: ["admin"] },
    };

    if (status) query.status = status;

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
        status: "new",
      }),
    ]);

    res.status(200).json({
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
    console.error("Get contact notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// 13. Mark Contact Notification as Read
exports.markContactNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      type: { $regex: /^contact_/ },
    });

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
    console.error("Mark contact notification as read error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

// 14. Bulk Mark Contact Notifications as Read
exports.bulkMarkContactNotificationsAsRead = async (req, res) => {
  try {
    const user = req.user;
    const { ids } = req.body;

    const query = {
      type: { $regex: /^contact_/ },
      isRead: false,
    };

    // If IDs were provided, filter by them
    if (Array.isArray(ids) && ids.length > 0) {
      const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: "One or more notification IDs are invalid",
          invalidIds,
        });
      }
      query._id = { $in: ids };
    } else {
      // If no IDs, mark all based on user role
      if (user.role !== "admin") {
        query.$or = [
          { targetRoles: { $in: [user.role] } },
          { targetUserId: user.id },
          { targetUserEmail: user.email },
          { userId: user.id },
        ];
      }
    }

    const result = await Notification.updateMany(
      query,
      {
        $set: {
          isRead: true,
          status: "read",
          readAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: ids?.length
        ? "Selected notifications marked as read"
        : "All contact notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Bulk mark contact notifications as read error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
    });
  }
};

// 15. Delete Contact Notification
exports.deleteContactNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      type: { $regex: /^contact_/ },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Check permission
    const hasPermission =
      user.role === "admin" ||
      notification.targetUserId?.toString() === user.id ||
      notification.userId?.toString() === user.id;

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this notification",
      });
    }

    await notification.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact notification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};

// 16. Bulk Delete Contact Notifications
exports.bulkDeleteContactNotifications = async (req, res) => {
  try {
    const { ids } = req.body;
    const user = req.user;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of notification IDs",
      });
    }

    let query = {
      _id: { $in: ids },
      type: { $regex: /^contact_/ },
    };

    // Non-admin users can only delete their own notifications
    if (user.role !== "admin") {
      query.$or = [
        { targetUserId: user.id },
        { userId: user.id },
        { targetUserEmail: user.email },
      ];
    }

    const result = await Notification.deleteMany(query);

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
    console.error("Bulk delete contact notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notifications",
    });
  }
};

// 17. Mark All Contact Notifications as Read (User)
exports.markAllContactNotificationsAsRead = async (req, res) => {
  try {
    const user = req.user;
    const { role } = req.query;

    let query = {
      type: { $regex: /^contact_/ },
      isRead: false,
    };

    if (role) {
      query.targetRoles = { $in: [role] };
    } else {
      query.$or = [
        { targetRoles: { $in: [user.role] } },
        { targetUserId: user.id },
        { targetUserEmail: user.email },
        { userId: user.id },
      ];
    }

    const result = await Notification.updateMany(
      query,
      {
        $set: {
          isRead: true,
          status: "read",
          readAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all contact notifications as read error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
    });
  }
};

// 18. Get Contact Notification Stats
exports.getContactNotificationStats = async (req, res) => {
  try {
    const user = req.user;

    const query = {
      type: { $regex: /^contact_/ },
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
    console.error("Get contact notification stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get notification statistics",
    });
  }
};

// 19. Get Contact Notifications by Role
exports.getContactNotificationsByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    const validRoles = ["user", "admin", "manager", "host"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be: user, admin, manager, or host",
      });
    }

    let query = {
      type: { $regex: /^contact_/ },
      targetRoles: { $in: [role] },
    };

    if (status) query.status = status;

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
        status: "new",
      }),
    ]);

    res.status(200).json({
      success: true,
      role,
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
    console.error("Get contact notifications by role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// 20. Get My Contact Notifications
exports.getMyContactNotifications = async (req, res) => {
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
      type: { $regex: /^contact_/ },
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

    res.status(200).json({
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
    console.error("Get my contact notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};