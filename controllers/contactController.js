


// const Contact = require("../models/Contact");
// const Notification = require("../models/Notification");
// const mongoose = require("mongoose");
// const { validationResult } = require("express-validator");
// const UserActivity = require("../activity/UserActivity");

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
//       target: "admin", // Only for admin
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
//       target: "user", // For user
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

//       message: "Contact form submitted successfully",

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
//       message: "Reply saved successfully",
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

// exports.deleteContactNotification = async (
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
//     // DELETE
//     // ===========================

//     const notification =
//       await Notification.findOneAndDelete({
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
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,
//       message:
//         "Notification deleted successfully",
//       data: notification,
//     });
//   } catch (error) {
//     console.error(
//       "Delete contact notification error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to delete notification",
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
const { sendEmailWithTemplate, emailTemplates } = require("../mails/contactServices");

// ===========================
// NOTIFICATION FUNCTIONS
// ===========================

// Create notification for admin about new contact
const createAdminNotification = async (contact, type) => {
  try {
    let message = "";
    let metadata = {};

    switch (type) {
      case "created":
        message = `📩 New contact from ${contact.name} (${contact.email})`;
        metadata = {
          name: contact.name,
          email: contact.email,
          messagePreview:
            contact.messagePreview || contact.message.substring(0, 100) + "...",
          status: contact.status,
          ipAddress: contact.ipAddress,
        };
        break;
      case "read":
        message = `👀 Contact from ${contact.name} has been read`;
        metadata = {
          name: contact.name,
          email: contact.email,
          readAt: new Date(),
        };
        break;
      case "replied":
        message = `✅ Reply sent to ${contact.name} (${contact.email})`;
        metadata = {
          name: contact.name,
          email: contact.email,
          replyMessage: contact.replyMessage,
          repliedAt: new Date(),
        };
        break;
      default:
        message = `📩 New contact from ${contact.name}`;
    }

    const notification = new Notification({
      type: `contact_${type}`,
      contactId: contact._id,
      contactName: contact.name,
      contactEmail: contact.email,
      message: message,
      isRead: false,
      isGlobal: false,
      status: "new",
      metadata: metadata,
      target: "admin",
      data: {
        contactId: contact._id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        status: contact.status,
        createdAt: contact.createdAt,
        ipAddress: contact.ipAddress,
        userAgent: contact.userAgent,
      },
    });

    await notification.save();
    console.log(`✅ Contact notification created: ${message}`);
    return notification;
  } catch (error) {
    console.error("❌ Error creating contact notification:", error);
    return null;
  }
};

// Create notification for user when replied
const createUserNotification = async (contact) => {
  try {
    const notification = new Notification({
      type: "contact_replied",
      contactId: contact._id,
      contactName: contact.name,
      contactEmail: contact.email,
      message: `✅ Your message has been replied to by our team`,
      isRead: false,
      isGlobal: false,
      status: "new",
      target: "user",
      data: {
        contactId: contact._id,
        name: contact.name,
        email: contact.email,
        replyMessage: contact.replyMessage,
        repliedAt: contact.repliedAt,
      },
    });

    await notification.save();
    console.log(`✅ User notification created for ${contact.email}`);
    return notification;
  } catch (error) {
    console.error("❌ Error creating user notification:", error);
    return null;
  }
};

// ===========================
// EMAIL FUNCTIONS
// ===========================

// Send contact confirmation email to user
const sendContactConfirmationEmail = async (contact) => {
  try {
    const result = await sendEmailWithTemplate(
      contact.email,
      'contactConfirmation',
      contact
    );

    if (result.success) {
      console.log(`✅ Contact confirmation email sent to ${contact.email}`);
    } else {
      console.error(
        `❌ Failed to send contact confirmation email to ${contact.email}:`,
        result.error
      );
    }

    return result;
  } catch (error) {
    console.error(`❌ Error sending contact confirmation email:`, error.message);
    return { success: false, error: error.message };
  }
};

// Send contact notification to admin
const sendContactNotificationToAdmin = async (contact) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;

    if (!adminEmail) {
      console.log(`⚠️ No admin email configured`);
      return { success: false, error: "No admin email configured" };
    }

    const result = await sendEmailWithTemplate(
      adminEmail,
      'contactNotificationForAdmin',
      contact
    );

    if (result.success) {
      console.log(`✅ Contact notification sent to admin ${adminEmail}`);
    } else {
      console.error(
        `❌ Failed to send contact notification to admin:`,
        result.error
      );
    }

    return result;
  } catch (error) {
    console.error(`❌ Error sending contact notification to admin:`, error.message);
    return { success: false, error: error.message };
  }
};

// Send reply email to user
const sendReplyEmailToUser = async (contact) => {
  try {
    const result = await sendEmailWithTemplate(
      contact.email,
      'contactReply',
      contact
    );

    if (result.success) {
      console.log(`✅ Reply email sent to ${contact.email}`);
    } else {
      console.error(
        `❌ Failed to send reply email to ${contact.email}:`,
        result.error
      );
    }

    return result;
  } catch (error) {
    console.error(`❌ Error sending reply email:`, error.message);
    return { success: false, error: error.message };
  }
};

// ============ CONTROLLER FUNCTIONS ============

// ===========================
// FORMAT IP ADDRESS
// ===========================

const getClientIP = (req) => {
  let ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress;

  // If multiple IPs exist from proxy
  if (ip && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  // Convert IPv6 localhost / IPv4 mapped address
  if (ip === "::1") {
    return "127.0.0.1";
  }

  if (ip && ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }

  // Only return IPv4 format
  const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;

  if (ipv4Regex.test(ip)) {
    return ip;
  }

  return "0.0.0.0";
};

// 1. Submit Contact Form
exports.submitContact = async (req, res) => {
  try {
    const errors = validationResult(req);

    // ===========================
    // VALIDATION
    // ===========================

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
        })),
      });
    }

    const { name, email, message } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // ===========================
    // CHECK FOR DUPLICATE SUBMISSIONS
    // ===========================

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

    // ===========================
    // GET LOGGED-IN USER
    // ===========================

    // Do NOT get userId from req.body.
    // It comes from the authenticated JWT.
    const userId = req.user?.id || null;

    // ===========================
    // GET CLIENT INFORMATION
    // ===========================

    const ipAddress = getClientIP(req);

    const userAgent = req.headers["user-agent"] || null;

    // ===========================
    // CREATE NEW CONTACT
    // ===========================

    const contact = new Contact({
      userId,

      name: name.trim(),

      email: normalizedEmail,

      message: message.trim(),

      ipAddress,

      userAgent,
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
      const result = await sendContactConfirmationEmail(contact);
      confirmationEmailSent = result.success;
    } catch (emailError) {
      console.error("❌ Failed to send confirmation email:", emailError.message);
    }

    // Send notification to admin
    try {
      const result = await sendContactNotificationToAdmin(contact);
      adminEmailSent = result.success;
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
      // Activity failure should NOT
      // prevent contact submission.
      console.error(
        "❌ Failed to create user activity:",
        activityError.message,
      );
    }

    // ===========================
    // CREATE ADMIN NOTIFICATION
    // ===========================

    try {
      await createAdminNotification(contact, "created");

      console.log(`✅ Admin notification created for contact ${contact._id}`);
    } catch (notificationError) {
      // Notification failure should NOT
      // prevent contact submission.
      console.error(
        "❌ Failed to create admin notification:",
        notificationError.message,
      );
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

    // ===========================
    // VALIDATE MONGODB OBJECT ID
    // ===========================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }

    // ===========================
    // FIND CONTACT
    // ===========================

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // ===========================
    // MARK AS READ
    // ===========================

    if (contact.status === "pending") {
      contact.status = "read";
      contact.readAt = new Date();

      await contact.save();

      // ===========================
      // CREATE READ NOTIFICATION
      // ===========================

      try {
        await createAdminNotification(contact, "read");
      } catch (notificationError) {
        // Notification failure should NOT
        // prevent the contact from being returned
        console.error(
          "Failed to create read notification:",
          notificationError.message,
        );
      }
    }

    // ===========================
    // RESPONSE
    // ===========================

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

    // ===========================
    // VALIDATE CONTACT ID
    // ===========================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }

    // ===========================
    // VALIDATE STATUS
    // ===========================

    const allowedStatuses = [
      "pending",
      "read",
      "replied",
      "archived",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact status",
        allowedStatuses,
      });
    }

    // ===========================
    // FIND CONTACT
    // ===========================

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // ===========================
    // SAVE OLD STATUS
    // ===========================

    const oldStatus = contact.status;

    // ===========================
    // UPDATE STATUS
    // ===========================

    contact.status = status;

    if (status === "read" && !contact.readAt) {
      contact.readAt = new Date();
    }

    if (status === "replied" && !contact.repliedAt) {
      contact.repliedAt = new Date();
    }

    await contact.save();

    // ===========================
    // CREATE NOTIFICATION
    // ONLY WHEN STATUS CHANGES
    // ===========================

    if (
      oldStatus !== status &&
      status === "replied"
    ) {
      try {
        await createAdminNotification(
          contact,
          "replied"
        );
      } catch (notificationError) {
        console.error(
          "Failed to create status notification:",
          notificationError.message
        );
      }
    }

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(200).json({
      success: true,
      message: "Contact status updated successfully",

      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        status: contact.status,
        readAt: contact.readAt,
        repliedAt: contact.repliedAt,
        updatedAt: contact.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Update contact status error:",
      error
    );

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

    // ===========================
    // VALIDATE REPLY MESSAGE
    // ===========================

    if (
      !replyMessage ||
      replyMessage.trim().length < 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Reply message must be at least 5 characters",
      });
    }

    // ===========================
    // VALIDATE CONTACT ID
    // ===========================

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }

    // ===========================
    // FIND CONTACT
    // ===========================

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // ===========================
    // DETERMINE STATUS
    // ===========================

    const finalStatus = status || "replied";

    const allowedStatuses = [
      "pending",
      "read",
      "replied",
      "archived",
    ];

    if (!allowedStatuses.includes(finalStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact status",
        allowedStatuses,
      });
    }

    // ===========================
    // UPDATE CONTACT FIRST
    // ===========================

    contact.status = finalStatus;
    contact.replyMessage = replyMessage.trim();

    if (finalStatus === "replied") {
      contact.repliedAt = new Date();
    }

    await contact.save();

    // ===========================
    // SEND REPLY EMAIL TO USER
    // ===========================

    let emailSent = false;
    try {
      const result = await sendReplyEmailToUser(contact);
      emailSent = result.success;
    } catch (emailError) {
      console.error("❌ Failed to send reply email:", emailError.message);
    }

    // ===========================
    // CREATE NOTIFICATIONS
    // ===========================

    try {
      // Admin notification
      await createAdminNotification(
        contact,
        "replied"
      );
    } catch (notificationError) {
      console.error(
        "Admin notification error:",
        notificationError.message
      );
    }

    try {
      // User notification
      await createUserNotification(contact);
    } catch (notificationError) {
      console.error(
        "User notification error:",
        notificationError.message
      );
    }

    // ===========================
    // RESPONSE
    // ===========================

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
    console.error(
      "Reply to contact error:",
      error
    );

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

    // Create CSV header
    let csv = "Name,Email,Message,Status,Submitted At\n";

    // Add data rows
    contacts.forEach((c) => {
      csv += `"${c.name}","${c.email}","${c.message.replace(/"/g, '""')}","${c.status}","${c.createdAt.toISOString()}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=contacts_${Date.now()}.csv`,
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
    const { name, email, message, status } = req.body;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Update fields
    if (name) contact.name = name;
    if (email) contact.email = email;
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

// 12. Get Contact Notifications (Admin)
exports.getContactNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {
      type: { $regex: /^contact_/ },
      target: { $in: ["admin", "both"] },
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

// ============================================================
// GET CONTACT NOTIFICATIONS
// ============================================================
// GET /api/notifications/contact
// GET /api/notifications/contact?page=1&limit=20
// GET /api/notifications/contact?status=new
// ============================================================

exports.getContactNotifications = async (req, res) => {
  try {
    // ===========================
    // PAGINATION
    // ===========================

    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        parseInt(req.query.limit) || 20,
        1
      ),
      100
    );

    const skip = (page - 1) * limit;

    const status = req.query.status;

    // ===========================
    // BASE QUERY
    // ===========================

    const query = {
      type: {
        $regex: /^contact_/,
      },

      target: {
        $in: ["admin", "both"],
      },
    };

    // ===========================
    // OPTIONAL STATUS FILTER
    // ===========================

    if (status) {
      query.status = status;
    }

    // ===========================
    // GET DATA + COUNTS
    // ===========================

    const [
      notifications,
      total,
      unreadCount,
    ] = await Promise.all([
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

    // ===========================
    // RESPONSE
    // ===========================

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
    console.error(
      "Get contact notifications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};


// ============================================================
// MARK ONE CONTACT NOTIFICATION AS READ
// ============================================================
// PUT /api/notifications/contact/:id/read
// ============================================================

exports.markContactNotificationAsRead = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ===========================
    // VALIDATE ID
    // ===========================

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Notification ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid notification ID",
      });
    }

    // ===========================
    // FIND NOTIFICATION
    // ===========================

    const notification =
      await Notification.findOne({
        _id: id,

        type: {
          $regex: /^contact_/,
        },

        target: {
          $in: ["admin", "both"],
        },
      });

    // ===========================
    // NOT FOUND
    // ===========================

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // ===========================
    // MARK AS READ
    // ===========================

    notification.isRead = true;
    notification.status = "read";
    notification.readAt = new Date();

    await notification.save();

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error(
      "Mark contact notification as read error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to mark notification as read",
    });
  }
};


// ============================================================
// BULK MARK CONTACT NOTIFICATIONS AS READ
// ============================================================
// PUT /api/notifications/contact/read-all
//
// Body:
// {
//   "ids": ["id1", "id2", "id3"]
// }
//
// If ids are omitted or empty, ALL admin contact
// notifications will be marked as read.
// ============================================================

exports.bulkMarkContactNotificationsAsRead = async (
  req,
  res
) => {
  try {
    const { ids } = req.body;

    // ===========================
    // BASE QUERY
    // ===========================

    const query = {
      type: {
        $regex: /^contact_/,
      },

      target: {
        $in: ["admin", "both"],
      },

      isRead: false,
    };

    // ===========================
    // IF IDS WERE PROVIDED
    // ===========================

    if (Array.isArray(ids) && ids.length > 0) {
      const invalidIds = ids.filter(
        (id) =>
          !mongoose.Types.ObjectId.isValid(id)
      );

      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "One or more notification IDs are invalid",
          invalidIds,
        });
      }

      query._id = {
        $in: ids,
      };
    }

    // ===========================
    // UPDATE
    // ===========================

    const result =
      await Notification.updateMany(
        query,
        {
          $set: {
            isRead: true,
            status: "read",
            readAt: new Date(),
          },
        }
      );

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(200).json({
      success: true,

      message: ids?.length
        ? "Selected notifications marked as read"
        : "All contact notifications marked as read",

      modifiedCount:
        result.modifiedCount,
    });
  } catch (error) {
    console.error(
      "Bulk mark contact notifications as read error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to mark notifications as read",
    });
  }
};


// ============================================================
// DELETE ONE CONTACT NOTIFICATION
// ============================================================
// DELETE /api/notifications/contact/:id
// ============================================================

// exports.deleteContactNotification = async (
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
//     // DELETE
//     // ===========================

//     const notification =
//       await Notification.findOneAndDelete({
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
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,
//       message:
//         "Notification deleted successfully",
//       data: notification,
//     });
//   } catch (error) {
//     console.error(
//       "Delete contact notification error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to delete notification",
//     });
//   }
// };

exports.deleteContactNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // ===========================
    // VALIDATE ID
    // ===========================

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    // ===========================
    // DELETE NOTIFICATION
    // ===========================

    const notification = await Notification.findByIdAndDelete(id);

    // ===========================
    // NOT FOUND
    // ===========================

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: notification,
    });
  } catch (error) {
    console.error(
      "Delete contact notification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};


// ============================================================
// BULK DELETE CONTACT NOTIFICATIONS
// ============================================================
// DELETE /api/notifications/contact/bulk
//
// Body:
// {
//   "ids": ["id1", "id2", "id3"]
// }
//
// If ids are omitted or empty, ALL admin contact
// notifications will be deleted.
// ============================================================

exports.bulkDeleteContactNotifications = async (
  req,
  res
) => {
  try {
    const { ids } = req.body;

    // ===========================
    // BASE QUERY
    // ===========================

    const query = {
      type: {
        $regex: /^contact_/,
      },

      target: {
        $in: ["admin", "both"],
      },
    };

    // ===========================
    // IF IDS WERE PROVIDED
    // ===========================

    if (Array.isArray(ids) && ids.length > 0) {
      const invalidIds = ids.filter(
        (id) =>
          !mongoose.Types.ObjectId.isValid(id)
      );

      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "One or more notification IDs are invalid",
          invalidIds,
        });
      }

      query._id = {
        $in: ids,
      };
    }

    // ===========================
    // DELETE
    // ===========================

    const result =
      await Notification.deleteMany(query);

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(200).json({
      success: true,

      message: ids?.length
        ? "Selected notifications deleted successfully"
        : "All contact notifications deleted successfully",

      deletedCount:
        result.deletedCount,
    });
  } catch (error) {
    console.error(
      "Bulk delete contact notifications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete notifications",
    });
  }
};

// 13. Mark Notification as Read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

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

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

// 14. Mark All Notifications as Read
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { type: { $regex: /^contact_/ }, isRead: false },
      {
        $set: {
          isRead: true,
          status: "read",
          readAt: new Date(),
        },
      },
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};