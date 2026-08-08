const Contact = require("../models/Contact");
const Notification = require("../models/Notification");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const UserActivity = require("../activity/UserActivity");

// Email Service Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  family: 4,

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error.message);

    console.error("SMTP Host:", process.env.SMTP_HOST || "smtp.gmail.com");

    console.error("SMTP Port:", process.env.SMTP_PORT || 587);

    console.error(
      "SMTP User:",
      process.env.SMTP_USER ? "Configured" : "Missing",
    );
  } else {
    console.log("✅ SMTP server is ready to accept messages");
  }
});

// Verify SMTP connection
const verifySMTP = async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified");
    return true;
  } catch (error) {
    console.error("❌ SMTP connection failed:", error.message);
    return false;
  }
};

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
      target: "admin", // Only for admin
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
      target: "user", // For user
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

const sendEmailToAdmin = async ({ name, email, message }) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: adminEmail,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: bold; color: #555; }
            .field-value { background: #f1f3f5; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📧 New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">👤 Name</div>
                <div class="field-value">${name}</div>
              </div>
              <div class="field">
                <div class="field-label">📧 Email</div>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="field-label">💬 Message</div>
                <div class="field-value">${message.replace(/\n/g, "<br>")}</div>
              </div>
              <div class="field">
                <div class="field-label">📅 Submitted</div>
                <div class="field-value">${new Date().toLocaleString()}</div>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the contact form on your website.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Admin email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending admin email:", error.message);
    throw error;
  }
};

const sendEmailToUser = async ({
  name,
  email,
  message,
  isReply = false,
  replyMessage = null,
}) => {
  try {
    let subject, htmlContent;

    if (isReply && replyMessage) {
      subject = "Reply to Your Contact Form Inquiry";
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; }
            .message-box { background: #f1f3f5; padding: 20px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📨 Reply to Your Inquiry</h2>
            </div>
            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              <p>Thank you for your inquiry. Here's our response:</p>
              <div class="message-box">
                ${replyMessage.replace(/\n/g, "<br>")}
              </div>
              <p>Your original message:</p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; color: #666; font-size: 14px;">
                ${message.replace(/\n/g, "<br>")}
              </div>
              <p>Best regards,<br><strong>Support Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated response to your inquiry.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      subject = "We Received Your Message - Thank You";
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; }
            .message-box { background: #f1f3f5; padding: 20px; border-radius: 5px; border-left: 4px solid #667eea; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; text-align: center; }
            .ref-id { background: #e9ecef; padding: 5px 10px; border-radius: 3px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">✅ Thank You for Contacting Us</h2>
            </div>
            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              <p>Thank you for reaching out to us. We have received your message and will get back to you within 24-48 hours.</p>
              <p><strong>Your Message:</strong></p>
              <div class="message-box">
                ${message.replace(/\n/g, "<br>")}
              </div>
              <p><strong>Reference ID:</strong> <span class="ref-id">${Date.now().toString(36).toUpperCase()}</span></p>
            </div>
            <div class="footer">
              <p>This is a confirmation email. Please keep this for your records.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ User email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending user email:", error.message);
    throw error;
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
// exports.submitContact = async (req, res) => {
//   try {
//     const errors = validationResult(req);

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

//     // Check for duplicate submissions
//     const recentSubmission = await Contact.findOne({
//       email,
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

//     // Create new contact
//     const contact = new Contact({
//       name,
//       email,
//       message,
//       ipAddress: getClientIP(req),
//       userAgent: req.headers["user-agent"],
//     });

//     await contact.save();

//     // ===========================
//     // CREATE ADMIN NOTIFICATION
//     // ===========================
//     await createAdminNotification(contact, "created");

//     // Send emails
//     try {
//       await Promise.all([
//         sendEmailToAdmin({
//           name,
//           email,
//           message,
//         }),
//         sendEmailToUser({
//           name,
//           email,
//           message,
//         }),
//       ]);
//     } catch (emailError) {
//       console.error("Email error:", emailError);
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Contact form submitted successfully",
//       data: {
//         id: contact._id,
//         name: contact.name,
//         email: contact.email,
//         status: contact.status,
//         ipAddress: contact.ipAddress,
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
    // SEND EMAILS
    // ===========================

    try {
      await Promise.all([
        sendEmailToAdmin({
          name: contact.name,
          email: contact.email,
          message: contact.message,
        }),

        sendEmailToUser({
          name: contact.name,
          email: contact.email,
          message: contact.message,
        }),
      ]);

      console.log(`✅ Contact emails processed for ${contact.email}`);
    } catch (emailError) {
      // Email failure should NOT
      // prevent successful contact creation.
      console.error("❌ Contact email error:", emailError.message);
    }

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(201).json({
      success: true,

      message: "Contact form submitted successfully",

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

// exports.updateContactStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const contact = await Contact.findById(req.params.id);

//     if (!contact) {
//       return res.status(404).json({
//         success: false,
//         message: "Contact not found",
//       });
//     }

//     const oldStatus = contact.status;
//     contact.status = status;
//     await contact.save();

//     // Create notification for status change
//     if (status === "replied") {
//       await createAdminNotification(contact, "replied");
//     }

//     res.status(200).json({
//       success: true,
//       message: "Contact status updated successfully",
//       data: contact,
//     });
//   } catch (error) {
//     console.error("Update contact status error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update contact status",
//     });
//   }
// };

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
      message:
        "Contact status updated successfully",

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
        message:
          "Reply message must be at least 5 characters",
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
    // SEND REPLY EMAIL
    // ===========================

    let emailSent = true;

    try {
      await sendEmailToUser({
        name: contact.name,
        email: contact.email,
        message: contact.message,

        isReply: true,

        replyMessage:
          contact.replyMessage,

        status: contact.status,
      });

      console.log(
        `✅ Reply email sent to ${contact.email}`
      );
    } catch (emailError) {
      emailSent = false;

      console.error(
        "❌ Reply email error:",
        emailError.message
      );

      // IMPORTANT:
      // Do NOT throw the error.
      // The reply has already been saved.
    }

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(200).json({
      success: true,

      message: emailSent
        ? "Reply sent successfully"
        : "Reply saved successfully, but the email could not be sent",

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
