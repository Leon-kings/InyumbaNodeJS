// const Question = require("../models/Question");
// const Notification = require("../models/Notification");
// const User = require("../models/User");
// const UserActivity = require("../activity/UserActivity");
// const mongoose = require("mongoose");
// const { validationResult } = require("express-validator");
// const { sendEmail } = require("../services/emailTransporter");

// // ===========================================
// // EMAIL TEMPLATES
// // ===========================================

// const getQuestionConfirmationEmail = (question) => ({
//   subject: "We Received Your Question",
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Question Confirmation</title>
//     </head>
//     <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//       <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//         <h1 style="color: white; margin: 0; font-size: 24px;">We Received Your Question</h1>
//       </div>
//       <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
//         <p style="font-size: 16px; margin-bottom: 20px;">Hello ${question.name},</p>
//         <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your question. Our team will review it and get back to you within 24-48 hours.</p>
        
//         <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
//           <h3 style="margin: 0 0 15px; color: #667eea;">Your Question</h3>
//           <p style="margin: 5px 0;"><strong>Name:</strong> ${question.name}</p>
//           <p style="margin: 5px 0;"><strong>Email:</strong> ${question.email}</p>
//           ${question.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${question.phone}</p>` : ''}
//           <p style="margin: 5px 0;"><strong>Category:</strong> ${question.category}</p>
//           <p style="margin: 5px 0;"><strong>Status:</strong> ${question.status}</p>
//           <p style="margin: 15px 0 5px;"><strong>Question:</strong></p>
//           <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${question.question}</p>
//         </div>
        
//         <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
//           <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
//             📌 You will receive a notification when your question is answered.
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

// const getAdminQuestionNotificationEmail = (question) => ({
//   subject: `📩 New Question from ${question.name}`,
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>New Question</title>
//     </head>
//     <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//       <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//         <h1 style="color: white; margin: 0; font-size: 24px;">📩 New Question Received</h1>
//       </div>
//       <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
//         <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
//           <p style="margin: 0; color: #856404;">
//             <strong>⚠️ New question requires your attention</strong>
//           </p>
//         </div>
        
//         <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
//           <h3 style="margin: 0 0 15px; color: #f5576c;">Question Details</h3>
//           <p style="margin: 5px 0;"><strong>Name:</strong> ${question.name}</p>
//           <p style="margin: 5px 0;"><strong>Email:</strong> ${question.email}</p>
//           ${question.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${question.phone}</p>` : ''}
//           <p style="margin: 5px 0;"><strong>Category:</strong> ${question.category}</p>
//           <p style="margin: 5px 0;"><strong>Priority:</strong> ${question.priority}</p>
//           <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date(question.createdAt).toLocaleString()}</p>
//           ${question.ipAddress ? `<p style="margin: 5px 0;"><strong>IP Address:</strong> ${question.ipAddress}</p>` : ''}
//           <p style="margin: 15px 0 5px;"><strong>Question:</strong></p>
//           <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${question.question}</p>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
//           <p style="margin: 0; text-align: center;">
//             <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/questions/${question._id}" 
//                style="display: inline-block; background: #667eea; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px;">
//               View & Answer
//             </a>
//           </p>
//         </div>
        
//         <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
//         <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
//           Please login to the admin panel to answer this question.
//         </p>
//       </div>
//     </body>
//     </html>
//   `,
// });

// const getQuestionReplyEmail = (question) => ({
//   subject: `Answer to Your Question - ${question.name}`,
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Answer to Your Question</title>
//     </head>
//     <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//       <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//         <h1 style="color: white; margin: 0; font-size: 24px;">Answer to Your Question</h1>
//       </div>
//       <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
//         <p style="font-size: 16px; margin-bottom: 20px;">Hello ${question.name},</p>
//         <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your patience. Here is the answer to your question:</p>
        
//         <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
//           <h3 style="margin: 0 0 15px; color: #11998e;">📝 Answer</h3>
//           <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${question.replyMessage}</p>
//         </div>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #11998e;">
//           <p style="margin: 0; font-size: 14px; color: #495057;">
//             <strong>📌 Your Original Question:</strong>
//           </p>
//           <p style="margin: 5px 0 0; font-size: 14px; color: #6c757d;">${question.question}</p>
//         </div>
        
//         <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
//           <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
//             💡 If you have any further questions, please don't hesitate to ask.
//           </p>
//         </div>
        
//         <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
//         <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
//           This is a reply to your question. Please keep this email for your records.
//         </p>
//       </div>
//     </body>
//     </html>
//   `,
// });

// // ===========================================
// // NOTIFICATION FUNCTIONS
// // ===========================================

// // Create notification for specific role
// const createRoleNotification = async (question, type, role, userInfo = null) => {
//   try {
//     let title = "";
//     let message = "";
//     let priority = "normal";
//     let targetUserId = null;
//     let targetUserEmail = question.email || "";
//     let targetUserRole = role;

//     switch (type) {
//       case "question_created":
//         title = "📩 New Question Submitted";
//         message = `New question from ${question.name} (${question.email})`;
//         priority = question.priority === "urgent" ? "urgent" : "high";
//         targetUserId = question.userId || null;
//         break;
//       case "question_answered":
//         title = "✅ Question Answered";
//         message = `Question from ${question.name} has been answered`;
//         priority = "high";
//         break;
//       case "question_archived":
//         title = "📦 Question Archived";
//         message = `Question from ${question.name} has been archived`;
//         priority = "normal";
//         break;
//       case "question_updated":
//         title = "📝 Question Updated";
//         message = `Question from ${question.name} has been updated`;
//         priority = "normal";
//         break;
//       case "question_deleted":
//         title = "🗑️ Question Deleted";
//         message = `Question from ${question.name} was deleted`;
//         priority = "high";
//         break;
//       default:
//         title = "📩 Question Notification";
//         message = `Update for question from ${question.name}`;
//     }

//     // If userInfo is provided, use that for targeting
//     if (userInfo) {
//       targetUserId = userInfo.userId || targetUserId;
//       targetUserEmail = userInfo.email || targetUserEmail;
//       targetUserRole = userInfo.role || role;
//     }

//     const notification = new Notification({
//       type: type,
//       questionId: question._id,
//       questionName: question.name,
//       questionEmail: question.email,
//       userId: question.userId || null,
//       userName: question.name,
//       userEmail: question.email,
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
//       isGlobal: type === "question_created",
//       metadata: {
//         questionName: question.name,
//         questionEmail: question.email,
//         questionCategory: question.category,
//         questionPreview: question.question.substring(0, 100) + "...",
//         status: question.status,
//         priority: question.priority,
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
// const createAllRoleNotifications = async (question, type, userInfo = null) => {
//   const roles = ["admin", "manager", "user"];
//   const notifications = [];

//   for (const role of roles) {
//     const notification = await createRoleNotification(question, type, role, userInfo);
//     if (notification) {
//       notifications.push(notification);
//     }
//   }

//   return notifications;
// };

// // ===========================================
// // SEND EMAIL NOTIFICATIONS
// // ===========================================

// const sendQuestionEmails = async (question, type, userInfo = null) => {
//   try {
//     const emailsSent = [];

//     // Send confirmation to user
//     if (type === "question_created") {
//       const userEmailTemplate = getQuestionConfirmationEmail(question);
//       const result = await sendEmail({
//         to: question.email,
//         subject: userEmailTemplate.subject,
//         html: userEmailTemplate.html,
//       });
//       if (result.success) {
//         emailsSent.push({ to: question.email, role: "user" });
//         console.log(`✅ Question confirmation email sent to ${question.email}`);
//       }
//     }

//     // Send notification to admin
//     if (type === "question_created") {
//       const adminEmailTemplate = getAdminQuestionNotificationEmail(question);
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

//     // Send reply email to user
//     if (type === "question_answered" && question.replyMessage) {
//       const replyEmailTemplate = getQuestionReplyEmail(question);
//       const result = await sendEmail({
//         to: question.email,
//         subject: replyEmailTemplate.subject,
//         html: replyEmailTemplate.html,
//       });
//       if (result.success) {
//         emailsSent.push({ to: question.email, role: "user" });
//         console.log(`✅ Reply email sent to ${question.email}`);
//       }
//     }

//     // Send to Managers
//     const managers = await User.find({ role: "manager", isActive: true });
//     for (const manager of managers) {
//       const managerTemplate = getAdminQuestionNotificationEmail(question);
//       const result = await sendEmail({
//         to: manager.email,
//         subject: `📩 New Question from ${question.name}`,
//         html: managerTemplate.html,
//       });
//       if (result.success) {
//         emailsSent.push({ to: manager.email, role: "manager" });
//         console.log(`✅ Manager email sent to ${manager.email}`);
//       }
//     }

//     return { success: true, emailsSent };
//   } catch (error) {
//     console.error("❌ Failed to send question emails:", error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ===========================================
// // FORMAT IP ADDRESS
// // ===========================================

// const getClientIP = (req) => {
//   let ip =
//     req.headers["x-forwarded-for"] ||
//     req.socket.remoteAddress ||
//     req.connection.remoteAddress;

//   if (ip && ip.includes(",")) {
//     ip = ip.split(",")[0].trim();
//   }

//   if (ip === "::1") {
//     return "127.0.0.1";
//   }

//   if (ip && ip.startsWith("::ffff:")) {
//     return ip.replace("::ffff:", "");
//   }

//   const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
//   if (ipv4Regex.test(ip)) {
//     return ip;
//   }

//   return "0.0.0.0";
// };

// // ===========================================
// // CONTROLLER FUNCTIONS
// // ===========================================

// // 1. Submit Question
// exports.submitQuestion = async (req, res) => {
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

//     const { name, email, phone, question, category, priority } = req.body;

//     // Validate required fields
//     if (!name || !email || !question) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, email, and question are required",
//       });
//     }

//     // Check for duplicate submissions (within 5 minutes)
//     const recentSubmission = await Question.findOne({
//       email: email.toLowerCase().trim(),
//       question: question.trim(),
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

//     // Get user info from request
//     const userId = req.user?.id || null;
//     const userRole = req.user?.role || "user";
//     const ipAddress = getClientIP(req);
//     const userAgent = req.headers["user-agent"] || null;

//     // Create question
//     const questionData = new Question({
//       userId,
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       phone: phone?.trim() || null,
//       question: question.trim(),
//       category: category || "general",
//       priority: priority || "normal",
//       ipAddress,
//       userAgent,
//       status: "pending",
//     });

//     await questionData.save();
//     console.log(`✅ Question created: ${questionData._id}`);

//     // ===========================================
//     // USER INFO FOR NOTIFICATIONS
//     // ===========================================
//     const userInfo = {
//       userId: userId,
//       email: email,
//       role: userRole,
//     };

//     // ===========================================
//     // CREATE ROLE-BASED NOTIFICATIONS
//     // ===========================================
//     await createAllRoleNotifications(questionData, "question_created", userInfo);

//     // ===========================================
//     // SEND EMAILS
//     // ===========================================
//     await sendQuestionEmails(questionData, "question_created", userInfo);

//     // ===========================================
//     // CREATE USER ACTIVITY
//     // ===========================================
//     try {
//       await UserActivity.create({
//         userId: userId,
//         userName: questionData.name,
//         userEmail: questionData.email,
//         action: "question_created",
//         description: `User ${questionData.name} submitted a question`,
//         ipAddress,
//         userAgent,
//         metadata: {
//           questionId: questionData._id,
//           category: questionData.category,
//           priority: questionData.priority,
//         },
//       });
//       console.log(`✅ User activity created for ${questionData.email}`);
//     } catch (activityError) {
//       console.error("❌ Failed to create user activity:", activityError.message);
//     }

//     res.status(201).json({
//       success: true,
//       message: "Question submitted successfully",
//       data: {
//         id: questionData._id,
//         name: questionData.name,
//         email: questionData.email,
//         question: questionData.question,
//         category: questionData.category,
//         status: questionData.status,
//         priority: questionData.priority,
//         createdAt: questionData.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Submit question error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to submit question",
//     });
//   }
// };

// // 2. Get All Questions
// exports.getQuestions = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const skip = (page - 1) * limit;
//     const status = req.query.status;
//     const category = req.query.category;
//     const priority = req.query.priority;
//     const search = req.query.search;

//     let query = {};

//     if (status) query.status = status;
//     if (category) query.category = category;
//     if (priority) query.priority = priority;
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { question: { $regex: search, $options: "i" } },
//       ];
//     }

//     const [questions, total] = await Promise.all([
//       Question.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Question.countDocuments(query),
//     ]);

//     res.status(200).json({
//       success: true,
//       data: questions,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get all questions error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch questions",
//     });
//   }
// };

// // 3. Get Question by ID
// exports.getQuestionById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid question ID",
//       });
//     }

//     const question = await Question.findById(id);

//     if (!question) {
//       return res.status(404).json({
//         success: false,
//         message: "Question not found",
//       });
//     }

//     // Mark as read if pending
//     if (question.status === "pending" && !question.readAt) {
//       question.readAt = new Date();
//       await question.save();
//     }

//     res.status(200).json({
//       success: true,
//       data: question,
//     });
//   } catch (error) {
//     console.error("Get question by ID error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch question",
//     });
//   }
// };

// // 4. Get Questions by Email
// exports.getQuestionsByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const [questions, total] = await Promise.all([
//       Question.find({ email: email.toLowerCase().trim() })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Question.countDocuments({ email: email.toLowerCase().trim() }),
//     ]);

//     if (questions.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No questions found for this email",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: questions,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get questions by email error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch questions",
//     });
//   }
// };

// // 5. Answer Question
// exports.answerQuestion = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { replyMessage, status } = req.body;

//     if (!replyMessage || replyMessage.trim().length < 5) {
//       return res.status(400).json({
//         success: false,
//         message: "Reply message must be at least 5 characters",
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid question ID",
//       });
//     }

//     const question = await Question.findById(id);

//     if (!question) {
//       return res.status(404).json({
//         success: false,
//         message: "Question not found",
//       });
//     }

//     const user = req.user;

//     // Update question
//     question.replyMessage = replyMessage.trim();
//     question.status = status || "answered";
//     question.repliedAt = new Date();
//     question.repliedBy = user?.id || null;

//     await question.save();

//     // ===========================================
//     // CREATE ROLE-BASED NOTIFICATIONS
//     // ===========================================
//     const userInfo = {
//       userId: question.userId || null,
//       email: question.email,
//       role: "user",
//     };

//     await createAllRoleNotifications(question, "question_answered", userInfo);

//     // ===========================================
//     // SEND REPLY EMAIL
//     // ===========================================
//     await sendQuestionEmails(question, "question_answered", userInfo);

//     // ===========================================
//     // CREATE USER ACTIVITY
//     // ===========================================
//     try {
//       await UserActivity.create({
//         userId: user?.id || null,
//         userName: user?.name || "Admin",
//         userEmail: user?.email || "admin",
//         action: "question_answered",
//         description: `Question from ${question.name} was answered`,
//         metadata: {
//           questionId: question._id,
//           questionEmail: question.email,
//         },
//       });
//       console.log(`✅ User activity created for question answer`);
//     } catch (activityError) {
//       console.error("❌ Failed to create user activity:", activityError.message);
//     }

//     res.status(200).json({
//       success: true,
//       message: "Question answered successfully",
//       data: question,
//     });
//   } catch (error) {
//     console.error("Answer question error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to answer question",
//     });
//   }
// };

// // 6. Update Question Status
// exports.updateQuestionStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid question ID",
//       });
//     }

//     const allowedStatuses = ["pending", "answered", "replied", "archived"];
//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status",
//         allowedStatuses,
//       });
//     }

//     const question = await Question.findById(id);

//     if (!question) {
//       return res.status(404).json({
//         success: false,
//         message: "Question not found",
//       });
//     }

//     const oldStatus = question.status;
//     question.status = status;

//     if (status === "archived") {
//       question.readAt = new Date();
//     }

//     await question.save();

//     // Create notification if archived
//     if (oldStatus !== status && status === "archived") {
//       const userInfo = {
//         userId: question.userId || null,
//         email: question.email,
//         role: "user",
//       };
//       await createAllRoleNotifications(question, "question_archived", userInfo);
//     }

//     res.status(200).json({
//       success: true,
//       message: "Question status updated successfully",
//       data: question,
//     });
//   } catch (error) {
//     console.error("Update question status error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update question status",
//     });
//   }
// };

// // 7. Delete Question
// exports.deleteQuestion = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid question ID",
//       });
//     }

//     const question = await Question.findById(id);

//     if (!question) {
//       return res.status(404).json({
//         success: false,
//         message: "Question not found",
//       });
//     }

//     // Create notification before deletion
//     const userInfo = {
//       userId: question.userId || null,
//       email: question.email,
//       role: "user",
//     };
//     await createAllRoleNotifications(question, "question_deleted", userInfo);

//     await question.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Question deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete question error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete question",
//     });
//   }
// };

// // 8. Bulk Delete Questions
// exports.bulkDeleteQuestions = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide an array of question IDs",
//       });
//     }

//     const result = await Question.deleteMany({ _id: { $in: ids } });

//     res.status(200).json({
//       success: true,
//       message: `${result.deletedCount} questions deleted successfully`,
//       deletedCount: result.deletedCount,
//     });
//   } catch (error) {
//     console.error("Bulk delete questions error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete questions",
//     });
//   }
// };

// // 9. Get Question Statistics
// exports.getQuestionStatistics = async (req, res) => {
//   try {
//     const stats = await Question.getStatistics();

//     res.status(200).json({
//       success: true,
//       data: stats,
//     });
//   } catch (error) {
//     console.error("Get question statistics error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get statistics",
//     });
//   }
// };

// // 10. Get My Questions
// exports.getMyQuestions = async (req, res) => {
//   try {
//     const user = req.user;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not authenticated",
//       });
//     }

//     const query = {
//       $or: [{ userId: user.id }, { email: user.email }],
//     };

//     const [questions, total] = await Promise.all([
//       Question.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Question.countDocuments(query),
//     ]);

//     res.status(200).json({
//       success: true,
//       data: questions,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get my questions error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch questions",
//     });
//   }
// };

// // ============================================================
// // NOTIFICATION CONTROLLER FUNCTIONS
// // ============================================================

// // 11. Get Question Notifications
// exports.getQuestionNotifications = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const skip = (page - 1) * limit;
//     const status = req.query.status;
//     const role = req.query.role;

//     let query = {
//       type: { $regex: /^question_/ },
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
//     console.error("❌ Get question notifications error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch notifications",
//       error: error.message,
//     });
//   }
// };

// // 12. Get My Question Notifications
// exports.getMyQuestionNotifications = async (req, res) => {
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
//       type: { $regex: /^question_/ },
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
//     console.error("❌ Get my question notifications error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch notifications",
//       error: error.message,
//     });
//   }
// };

// // 13. Mark Notification as Read
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

// // 14. Mark All Notifications as Read
// exports.markAllNotificationsAsRead = async (req, res) => {
//   try {
//     const user = req.user;
//     const { role } = req.query;

//     let filter = {
//       type: { $regex: /^question_/ },
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

//     const result = await Notification.updateMany(
//       filter,
//       {
//         $set: {
//           isRead: true,
//           status: "read",
//           readAt: new Date(),
//         },
//       }
//     );

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

// // 15. Get Unread Count
// exports.getUnreadCount = async (req, res) => {
//   try {
//     const user = req.user;
//     const { role } = req.query;

//     let filter = {
//       type: { $regex: /^question_/ },
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

// // 16. Delete Notification
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

// // 17. Bulk Delete Notifications
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
//       type: { $regex: /^question_/ },
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

// // 18. Get Notification Statistics
// exports.getNotificationStats = async (req, res) => {
//   try {
//     const user = req.user;

//     const query = {
//       type: { $regex: /^question_/ },
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









const Question = require("../models/Question");
const Notification = require("../models/Notification");
const User = require("../models/User");
const UserActivity = require("../activity/UserActivity"); // ✅ Fixed path
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const { sendEmail } = require("../services/emailTransporter");

// ===========================================
// EMAIL TEMPLATES
// ===========================================

const getQuestionConfirmationEmail = (question) => ({
  subject: "We Received Your Question",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Question Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">We Received Your Question</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello ${question.name},</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your question. Our team will review it and get back to you within 24-48 hours.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #667eea;">Your Question</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${question.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${question.email}</p>
          ${question.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${question.phone}</p>` : ''}
          <p style="margin: 5px 0;"><strong>Category:</strong> ${question.category}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> ${question.status}</p>
          <p style="margin: 15px 0 5px;"><strong>Question:</strong></p>
          <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${question.question}</p>
        </div>
        
        <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
          <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
            📌 You will receive a notification when your question is answered.
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

const getAdminQuestionNotificationEmail = (question) => ({
  subject: `📩 New Question from ${question.name}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Question</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📩 New Question Received</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;">
            <strong>⚠️ New question requires your attention</strong>
          </p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #f5576c;">Question Details</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${question.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${question.email}</p>
          ${question.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${question.phone}</p>` : ''}
          <p style="margin: 5px 0;"><strong>Category:</strong> ${question.category}</p>
          <p style="margin: 5px 0;"><strong>Priority:</strong> ${question.priority}</p>
          <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date(question.createdAt).toLocaleString()}</p>
          ${question.ipAddress ? `<p style="margin: 5px 0;"><strong>IP Address:</strong> ${question.ipAddress}</p>` : ''}
          <p style="margin: 15px 0 5px;"><strong>Question:</strong></p>
          <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${question.question}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
          <p style="margin: 0; text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/questions/${question._id}" 
               style="display: inline-block; background: #667eea; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px;">
              View & Answer
            </a>
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          Please login to the admin panel to answer this question.
        </p>
      </div>
    </body>
    </html>
  `,
});

const getQuestionReplyEmail = (question) => ({
  subject: `Answer to Your Question - ${question.name}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Answer to Your Question</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Answer to Your Question</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello ${question.name},</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your patience. Here is the answer to your question:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
          <h3 style="margin: 0 0 15px; color: #11998e;">📝 Answer</h3>
          <p style="background: #f1f3f5; padding: 15px; border-radius: 5px; margin: 5px 0 0;">${question.replyMessage}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #11998e;">
          <p style="margin: 0; font-size: 14px; color: #495057;">
            <strong>📌 Your Original Question:</strong>
          </p>
          <p style="margin: 5px 0 0; font-size: 14px; color: #6c757d;">${question.question}</p>
        </div>
        
        <div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #339af0;">
          <p style="margin: 0; color: #1c7ed6; font-size: 14px;">
            💡 If you have any further questions, please don't hesitate to ask.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          This is a reply to your question. Please keep this email for your records.
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
const createRoleNotification = async (question, type, role, userInfo = null) => {
  try {
    let title = "";
    let message = "";
    let priority = "normal";
    let targetUserId = null;
    let targetUserEmail = question.email || "";
    let targetUserRole = role;

    switch (type) {
      case "question_created":
        title = "📩 New Question Submitted";
        message = `New question from ${question.name} (${question.email})`;
        priority = question.priority === "urgent" ? "urgent" : "high";
        targetUserId = question.userId || null;
        break;
      case "question_answered":
        title = "✅ Question Answered";
        message = `Question from ${question.name} has been answered`;
        priority = "high";
        break;
      case "question_archived":
        title = "📦 Question Archived";
        message = `Question from ${question.name} has been archived`;
        priority = "normal";
        break;
      case "question_updated":
        title = "📝 Question Updated";
        message = `Question from ${question.name} has been updated`;
        priority = "normal";
        break;
      case "question_deleted":
        title = "🗑️ Question Deleted";
        message = `Question from ${question.name} was deleted`;
        priority = "high";
        break;
      default:
        title = "📩 Question Notification";
        message = `Update for question from ${question.name}`;
    }

    // If userInfo is provided, use that for targeting
    if (userInfo) {
      targetUserId = userInfo.userId || targetUserId;
      targetUserEmail = userInfo.email || targetUserEmail;
      targetUserRole = userInfo.role || role;
    }

    const notification = new Notification({
      type: type,
      questionId: question._id,
      questionName: question.name,
      questionEmail: question.email,
      userId: question.userId || null,
      userName: question.name,
      userEmail: question.email,
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
      isGlobal: type === "question_created",
      metadata: {
        questionName: question.name,
        questionEmail: question.email,
        questionCategory: question.category,
        questionPreview: question.question.substring(0, 100) + "...",
        status: question.status,
        priority: question.priority,
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
const createAllRoleNotifications = async (question, type, userInfo = null) => {
  const roles = ["admin", "manager", "user"];
  const notifications = [];

  for (const role of roles) {
    const notification = await createRoleNotification(question, type, role, userInfo);
    if (notification) {
      notifications.push(notification);
    }
  }

  return notifications;
};

// ===========================================
// SEND EMAIL NOTIFICATIONS
// ===========================================

const sendQuestionEmails = async (question, type, userInfo = null) => {
  try {
    const emailsSent = [];

    // Send confirmation to user
    if (type === "question_created") {
      const userEmailTemplate = getQuestionConfirmationEmail(question);
      const result = await sendEmail({
        to: question.email,
        subject: userEmailTemplate.subject,
        html: userEmailTemplate.html,
      });
      if (result.success) {
        emailsSent.push({ to: question.email, role: "user" });
        console.log(`✅ Question confirmation email sent to ${question.email}`);
      }
    }

    // Send notification to admin
    if (type === "question_created") {
      const adminEmailTemplate = getAdminQuestionNotificationEmail(question);
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

    // Send reply email to user
    if (type === "question_answered" && question.replyMessage) {
      const replyEmailTemplate = getQuestionReplyEmail(question);
      const result = await sendEmail({
        to: question.email,
        subject: replyEmailTemplate.subject,
        html: replyEmailTemplate.html,
      });
      if (result.success) {
        emailsSent.push({ to: question.email, role: "user" });
        console.log(`✅ Reply email sent to ${question.email}`);
      }
    }

    // Send to Managers
    const managers = await User.find({ role: "manager", isActive: true });
    for (const manager of managers) {
      const managerTemplate = getAdminQuestionNotificationEmail(question);
      const result = await sendEmail({
        to: manager.email,
        subject: `📩 New Question from ${question.name}`,
        html: managerTemplate.html,
      });
      if (result.success) {
        emailsSent.push({ to: manager.email, role: "manager" });
        console.log(`✅ Manager email sent to ${manager.email}`);
      }
    }

    return { success: true, emailsSent };
  } catch (error) {
    console.error("❌ Failed to send question emails:", error.message);
    return { success: false, error: error.message };
  }
};

// ===========================================
// FORMAT IP ADDRESS
// ===========================================

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

// ===========================================
// CONTROLLER FUNCTIONS
// ===========================================

// 1. Submit Question
exports.submitQuestion = async (req, res) => {
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

    const { name, email, phone, question, category, priority } = req.body;

    // Validate required fields
    if (!name || !email || !question) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and question are required",
      });
    }

    // Check for duplicate submissions (within 5 minutes)
    const recentSubmission = await Question.findOne({
      email: email.toLowerCase().trim(),
      question: question.trim(),
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

    // Get user info from request
    const userId = req.user?.id || null;
    const userRole = req.user?.role || "user";
    const ipAddress = getClientIP(req);
    const userAgent = req.headers["user-agent"] || null;

    // Create question
    const questionData = new Question({
      userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      question: question.trim(),
      category: category || "general",
      priority: priority || "normal",
      ipAddress,
      userAgent,
      status: "pending",
    });

    await questionData.save();
    console.log(`✅ Question created: ${questionData._id}`);

    // ===========================================
    // USER INFO FOR NOTIFICATIONS
    // ===========================================
    const userInfo = {
      userId: userId,
      email: email,
      role: userRole,
    };

    // ===========================================
    // CREATE ROLE-BASED NOTIFICATIONS
    // ===========================================
    try {
      await createAllRoleNotifications(questionData, "question_created", userInfo);
      console.log("✅ Notifications created successfully");
    } catch (notificationError) {
      console.error("❌ Failed to create notifications:", notificationError.message);
      // Don't fail the request
    }

    // ===========================================
    // SEND EMAILS
    // ===========================================
    try {
      await sendQuestionEmails(questionData, "question_created", userInfo);
      console.log("✅ Emails sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send emails:", emailError.message);
      // Don't fail the request
    }

    // ===========================================
    // CREATE USER ACTIVITY
    // ===========================================
    try {
      const activityData = {
        userName: questionData.name,
        userEmail: questionData.email,
        action: "question_created",
        description: `User ${questionData.name} submitted a question`,
        ipAddress,
        userAgent,
        metadata: {
          questionId: questionData._id,
          category: questionData.category,
          priority: questionData.priority,
        },
      };

      // Only add userId if it exists
      if (userId) {
        activityData.userId = userId;
      }

      await UserActivity.create(activityData);
      console.log(`✅ User activity created for ${questionData.email}`);
    } catch (activityError) {
      console.error("❌ Failed to create user activity:", activityError.message);
      // Don't fail the request
    }

    res.status(201).json({
      success: true,
      message: "Question submitted successfully",
      data: {
        id: questionData._id,
        name: questionData.name,
        email: questionData.email,
        question: questionData.question,
        category: questionData.category,
        status: questionData.status,
        priority: questionData.priority,
        createdAt: questionData.createdAt,
      },
    });
  } catch (error) {
    console.error("Submit question error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit question",
    });
  }
};

// 2. Get All Questions
exports.getQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const category = req.query.category;
    const priority = req.query.priority;
    const search = req.query.search;

    let query = { isActive: true };

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { question: { $regex: search, $options: "i" } },
      ];
    }

    const [questions, total] = await Promise.all([
      Question.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Question.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all questions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
};

// 3. Get Question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID",
      });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Mark as read if pending
    if (question.status === "pending" && !question.readAt) {
      question.readAt = new Date();
      await question.save();
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("Get question by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch question",
    });
  }
};

// 4. Get Questions by Email
exports.getQuestionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      Question.find({ email: email.toLowerCase().trim(), isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Question.countDocuments({ email: email.toLowerCase().trim(), isActive: true }),
    ]);

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this email",
      });
    }

    res.status(200).json({
      success: true,
      data: questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get questions by email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
};

// 5. Answer Question
exports.answerQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage, status } = req.body;

    if (!replyMessage || replyMessage.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Reply message must be at least 5 characters",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID",
      });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const user = req.user;

    // Update question
    question.replyMessage = replyMessage.trim();
    question.status = status || "answered";
    question.repliedAt = new Date();
    question.repliedBy = user?.id || null;

    await question.save();

    // ===========================================
    // CREATE ROLE-BASED NOTIFICATIONS
    // ===========================================
    const userInfo = {
      userId: question.userId || null,
      email: question.email,
      role: "user",
    };

    try {
      await createAllRoleNotifications(question, "question_answered", userInfo);
    } catch (notificationError) {
      console.error("❌ Failed to create notifications:", notificationError.message);
    }

    // ===========================================
    // SEND REPLY EMAIL
    // ===========================================
    try {
      await sendQuestionEmails(question, "question_answered", userInfo);
    } catch (emailError) {
      console.error("❌ Failed to send emails:", emailError.message);
    }

    // ===========================================
    // CREATE USER ACTIVITY
    // ===========================================
    try {
      const activityData = {
        userName: user?.name || "Admin",
        userEmail: user?.email || "admin",
        action: "question_answered",
        description: `Question from ${question.name} was answered`,
        metadata: {
          questionId: question._id,
          questionEmail: question.email,
        },
      };

      if (user?.id) {
        activityData.userId = user.id;
      }

      await UserActivity.create(activityData);
      console.log(`✅ User activity created for question answer`);
    } catch (activityError) {
      console.error("❌ Failed to create user activity:", activityError.message);
    }

    res.status(200).json({
      success: true,
      message: "Question answered successfully",
      data: question,
    });
  } catch (error) {
    console.error("Answer question error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to answer question",
    });
  }
};

// 6. Update Question Status
exports.updateQuestionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID",
      });
    }

    const allowedStatuses = ["pending", "answered", "replied", "archived"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
        allowedStatuses,
      });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const oldStatus = question.status;
    question.status = status;

    if (status === "archived") {
      question.readAt = new Date();
      question.isActive = false;
    }

    await question.save();

    // Create notification if archived
    if (oldStatus !== status && status === "archived") {
      const userInfo = {
        userId: question.userId || null,
        email: question.email,
        role: "user",
      };
      await createAllRoleNotifications(question, "question_archived", userInfo);
    }

    res.status(200).json({
      success: true,
      message: "Question status updated successfully",
      data: question,
    });
  } catch (error) {
    console.error("Update question status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update question status",
    });
  }
};

// 7. Delete Question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID",
      });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Create notification before deletion
    const userInfo = {
      userId: question.userId || null,
      email: question.email,
      role: "user",
    };
    await createAllRoleNotifications(question, "question_deleted", userInfo);

    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete question error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete question",
    });
  }
};

// 8. Bulk Delete Questions
exports.bulkDeleteQuestions = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of question IDs",
      });
    }

    const result = await Question.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} questions deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Bulk delete questions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete questions",
    });
  }
};

// 9. Get Question Statistics
exports.getQuestionStatistics = async (req, res) => {
  try {
    const stats = await Question.getStatistics();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get question statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get statistics",
    });
  }
};

// 10. Get My Questions
exports.getMyQuestions = async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const query = {
      $or: [{ userId: user.id }, { email: user.email }],
      isActive: true,
    };

    const [questions, total] = await Promise.all([
      Question.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Question.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get my questions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
};

// ============================================================
// NOTIFICATION CONTROLLER FUNCTIONS
// ============================================================

// 11. Get Question Notifications
exports.getQuestionNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const role = req.query.role;

    let query = {
      type: { $regex: /^question_/ },
      isActive: true,
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
    console.error("❌ Get question notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// 12. Get My Question Notifications
exports.getMyQuestionNotifications = async (req, res) => {
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
      type: { $regex: /^question_/ },
      isActive: true,
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
    console.error("❌ Get my question notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// 13. Mark Notification as Read
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
    console.error("❌ Mark notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// 14. Mark All Notifications as Read
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const user = req.user;
    const { role } = req.query;

    let filter = {
      type: { $regex: /^question_/ },
      isRead: false,
      isActive: true,
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

    const result = await Notification.updateMany(
      filter,
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
    console.error("❌ Mark all notifications as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

// 15. Get Unread Count
exports.getUnreadCount = async (req, res) => {
  try {
    const user = req.user;
    const { role } = req.query;

    let filter = {
      type: { $regex: /^question_/ },
      isRead: false,
      isActive: true,
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

// 16. Delete Notification
exports.deleteNotification = async (req, res) => {
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

// 17. Bulk Delete Notifications
exports.bulkDeleteNotifications = async (req, res) => {
  try {
    const { ids } = req.body;
    const user = req.user;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of notification IDs",
      });
    }

    const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more notification IDs are invalid",
        invalidIds,
      });
    }

    let query = {
      _id: { $in: ids },
      type: { $regex: /^question_/ },
      isActive: true,
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
    console.error("❌ Bulk delete notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notifications",
      error: error.message,
    });
  }
};

// 18. Get Notification Statistics
exports.getNotificationStats = async (req, res) => {
  try {
    const user = req.user;

    const query = {
      type: { $regex: /^question_/ },
      isActive: true,
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