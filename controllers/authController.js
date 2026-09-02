
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const mongoose = require("mongoose");
// const User = require("../models/User");
// const UserActivity = require("../activity/UserActivity");
// const Notification = require("../models/Notification");
// const transporter = require("../services/emailTransporter");

// // ======================================================
// // EMAIL VALIDATION
// // ======================================================

// // const validateEmail = (email) => {
// //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// //   if (!emailRegex.test(email)) {
// //     return {
// //       valid: false,
// //       message: "Invalid email format",
// //     };
// //   }

// //   const disposableDomains = [
// //     "tempmail.com",
// //     "temp-mail.org",
// //     "guerrillamail.com",
// //     "10minutemail.com",
// //     "throwawaymail.com",
// //     "mailinator.com",
// //   ];

// //   const domain = email.split("@")[1].toLowerCase();

// //   if (disposableDomains.includes(domain)) {
// //     return {
// //       valid: false,
// //       message: "Disposable email addresses are not allowed",
// //     };
// //   }

// //   const rwandaSchoolEmailRegex =
// //     /^[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.ac\.rw$/i;

// //   const isRwandaSchoolEmail = rwandaSchoolEmailRegex.test(email);

// //   if (isRwandaSchoolEmail) {
// //     return {
// //       valid: true,
// //     };
// //   }

// //   return {
// //     valid: true,
// //   };
// // };

// const validateEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (!emailRegex.test(email)) {
//     return {
//       valid: false,
//       message: "Invalid email format",
//     };
//   }

//   const disposableDomains = [
//     "tempmail.com",
//     "temp-mail.org",
//     "guerrillamail.com",
//     "10minutemail.com",
//     "throwawaymail.com",
//     "mailinator.com",
//   ];

//   const domain = email.split("@")[1].toLowerCase();

//   if (disposableDomains.includes(domain)) {
//     return {
//       valid: false,
//       message: "Disposable email addresses are not allowed",
//     };
//   }

//   // Rwanda school/university email format
//   // Examples:
//   // ug22738@ines.ac.rw
//   // hs7292@uk.ac.rw
//   // student123@school.ac.rw
//   const rwandaSchoolEmailRegex =
//     /^[a-z0-9._%+-]+@[a-z0-9-]+\.ac\.rw$/i;

//   const isRwandaSchoolEmail = rwandaSchoolEmailRegex.test(email);

//   if (isRwandaSchoolEmail) {
//     return {
//       valid: true,
//     };
//   }

//   return {
//     valid: true,
//   };
// };

// // ======================================================
// // GENERATE VERIFICATION CODE
// // ======================================================

// const generateVerificationCode = () => {
//   return crypto.randomBytes(3).toString("hex").toUpperCase();
// };

// // ======================================================
// // GENERATE VERIFICATION TOKEN
// // ======================================================

// const generateVerificationToken = (email) => {
//   return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });
// };

// // ======================================================
// // SEND EMAIL FUNCTION
// // ======================================================

// const sendEmail = async ({ to, subject, html, text }) => {
//   try {
//     const mailOptions = {
//       from: process.env.SMTP_USER,
//       to,
//       subject,
//       html,
//       text: text || html.replace(/<[^>]*>/g, ""),
//     };

//     const info = await transporter.sendMail(mailOptions);
//     // console.log(`✅ Email sent to ${to}: ${subject}`);
//     return { success: true, info };
//   } catch (error) {
//     console.error(`❌ Failed to send email to ${to}:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ======================================================
// // SEND ACCOUNT CREATION CONFIRMATION EMAIL
// // ======================================================

// const sendAccountCreationConfirmation = async (user) => {
//   const frontendUrl = "https://inyumbaportal.vercel.app";
//   const loginLink = `${frontendUrl}`;

//   const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Welcome to Inyumba Portal</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           line-height: 1.6;
//           color: #333;
//           max-width: 600px;
//           margin: 0 auto;
//           padding: 20px;
//         }
//         .header {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           padding: 30px;
//           border-radius: 10px 10px 0 0;
//           text-align: center;
//         }
//         .header h1 {
//           color: white;
//           margin: 0;
//           font-size: 24px;
//         }
//         .header p {
//           color: rgba(255,255,255,0.9);
//           margin: 10px 0 0;
//         }
//         .content {
//           background: #f8f9fa;
//           padding: 30px;
//           border-radius: 0 0 10px 10px;
//           border: 1px solid #e9ecef;
//           border-top: none;
//         }
//         .welcome-box {
//           background: #fff;
//           border-radius: 8px;
//           padding: 20px;
//           margin: 15px 0;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.05);
//         }
//         .btn {
//           display: inline-block;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           padding: 14px 28px;
//           text-decoration: none;
//           border-radius: 8px;
//           font-weight: bold;
//           margin: 20px 0;
//         }
//         .btn:hover {
//           opacity: 0.9;
//         }
//         .info-box {
//           background: #e8f4fd;
//           border-left: 4px solid #2196F3;
//           padding: 12px 16px;
//           margin: 15px 0;
//           border-radius: 4px;
//         }
//         .footer {
//           text-align: center;
//           color: #6c757d;
//           font-size: 14px;
//           margin-top: 20px;
//           padding-top: 20px;
//           border-top: 1px solid #e9ecef;
//         }
//         .user-details {
//           background: #f1f3f5;
//           border-radius: 6px;
//           padding: 12px 16px;
//           margin: 10px 0;
//         }
//         .user-details strong {
//           color: #667eea;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <h1>🎉 Welcome to Inyumba Portal!</h1>
//         <p>Your account has been successfully created</p>
//       </div>
//       <div class="content">
//         <div class="welcome-box">
//           <p>Hello <strong>${user.name}</strong>,</p>
//           <p>Thank you for creating an account with the <strong>Inyumba Portal</strong>! We're excited to have you on board.</p>
//         </div>

//         <div class="info-box">
//           <strong>📋 Account Details:</strong>
//           <div class="user-details">
//             <p><strong>Name:</strong> ${user.name}</p>
//             <p><strong>Email:</strong> ${user.email}</p>
//             <p><strong>Phone:</strong> ${user.phone || "Not provided"}</p>
//             <p><strong>Account Type:</strong> ${user.role || "User"}</p>
//             <p><strong>Created:</strong> ${new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
//           </div>
//         </div>

//         <div style="text-align: center;">
//           <a href="${loginLink}" class="btn">🔑 Log In to Your Account</a>
//         </div>

//         <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; border-radius: 4px;">
//           <strong>📧 Next Steps:</strong>
//           <p style="margin: 8px 0 0;">Please check your email for the verification link to activate your account. You'll need to verify your email before you can access all features.</p>
//         </div>

//         <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
//         <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
//           If you have any questions or need assistance, please don't hesitate to contact our support team.
//         </p>
//         <p style="color: #6c757d; font-size: 12px; text-align: center; margin: 10px 0 0;">
//           This is an automated message from our system. Please do not reply to this email.
//         </p>
//       </div>
//       <div class="footer">
//         <p>&copy; ${new Date().getFullYear()} Inyumba Portal. All rights reserved.</p>
//       </div>
//     </body>
//     </html>
//   `;

//   return await sendEmail({
//     to: user.email,
//     subject: "🎉 Welcome to Inyumba Portal - Account Created",
//     html,
//   });
// };

// // ======================================================
// // SEND VERIFICATION EMAIL
// // ======================================================

// const sendVerificationEmail = async (user, verificationCode) => {
//   const verificationToken = generateVerificationToken(user.email);
//   const frontendUrl = "https://inyumbaportal.vercel.app";
//   const verificationLink = `${frontendUrl}/verification/email/status?token=${verificationToken}&code=${verificationCode}&email=${encodeURIComponent(user.email)}`;

//   const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Verify Your Email</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           line-height: 1.6;
//           color: #333;
//           max-width: 600px;
//           margin: 0 auto;
//           padding: 20px;
//         }
//         .header {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           padding: 30px;
//           border-radius: 10px 10px 0 0;
//           text-align: center;
//         }
//         .header h1 {
//           color: white;
//           margin: 0;
//           font-size: 24px;
//         }
//         .content {
//           background: #f8f9fa;
//           padding: 30px;
//           border-radius: 0 0 10px 10px;
//           border: 1px solid #e9ecef;
//           border-top: none;
//         }
//         .code-box {
//           background: #fff;
//           border: 2px dashed #667eea;
//           border-radius: 8px;
//           padding: 15px;
//           text-align: center;
//           font-size: 32px;
//           font-weight: bold;
//           letter-spacing: 8px;
//           color: #667eea;
//           margin: 20px 0;
//         }
//         .btn {
//           display: inline-block;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           padding: 14px 28px;
//           text-decoration: none;
//           border-radius: 8px;
//           font-weight: bold;
//           margin: 20px 0;
//         }
//         .btn:hover {
//           opacity: 0.9;
//         }
//         .footer {
//           text-align: center;
//           color: #6c757d;
//           font-size: 14px;
//           margin-top: 20px;
//         }
//         .note {
//           background: #fff3cd;
//           border-left: 4px solid #ffc107;
//           padding: 12px;
//           margin: 15px 0;
//           border-radius: 4px;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <h1>Verify Your Email Address</h1>
//       </div>
//       <div class="content">
//         <p>Hello <strong>${user.name}</strong>,</p>
//         <p>Thank you for registering with us! Please verify your email address to activate your account.</p>
        
//         <div style="text-align: center;">
//           <a href="${verificationLink}" class="btn">Verify Email Address</a>
//         </div>
        
//         <p>Or use this verification code:</p>
//         <div class="code-box">${verificationCode}</div>
        
//         <div class="note">
//           <strong>⏰ Note:</strong> This verification link and code will expire in 24 hours.
//         </div>
        
//         <p>If you didn't create an account with us, please ignore this email.</p>
        
//         <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
//         <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
//           This is an automated message from our system. Please do not reply to this email.
//         </p>
//       </div>
//     </body>
//     </html>
//   `;

//   return await sendEmail({
//     to: user.email,
//     subject: "Verify Your Email Address",
//     html,
//   });
// };

// // ======================================================
// // SEND PASSWORD RESET EMAIL
// // ======================================================

// const sendPasswordResetEmail = async (user, resetToken, resetCode) => {
//   const frontendUrl = "https://inyumbaportal.vercel.app";
//   const resetLink = `${frontendUrl}/reset-password?token=${resetToken}&code=${resetCode}&email=${encodeURIComponent(user.email)}`;

//   const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Reset Your Password</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           line-height: 1.6;
//           color: #333;
//           max-width: 600px;
//           margin: 0 auto;
//           padding: 20px;
//         }
//         .header {
//           background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
//           padding: 30px;
//           border-radius: 10px 10px 0 0;
//           text-align: center;
//         }
//         .header h1 {
//           color: white;
//           margin: 0;
//           font-size: 24px;
//         }
//         .content {
//           background: #f8f9fa;
//           padding: 30px;
//           border-radius: 0 0 10px 10px;
//           border: 1px solid #e9ecef;
//           border-top: none;
//         }
//         .code-box {
//           background: #fff;
//           border: 2px dashed #f5576c;
//           border-radius: 8px;
//           padding: 15px;
//           text-align: center;
//           font-size: 32px;
//           font-weight: bold;
//           letter-spacing: 8px;
//           color: #f5576c;
//           margin: 20px 0;
//         }
//         .btn {
//           display: inline-block;
//           background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
//           color: white;
//           padding: 14px 28px;
//           text-decoration: none;
//           border-radius: 8px;
//           font-weight: bold;
//           margin: 20px 0;
//         }
//         .btn:hover {
//           opacity: 0.9;
//         }
//         .warning {
//           background: #f8d7da;
//           border-left: 4px solid #dc3545;
//           padding: 12px;
//           margin: 15px 0;
//           border-radius: 4px;
//         }
//         .footer {
//           text-align: center;
//           color: #6c757d;
//           font-size: 14px;
//           margin-top: 20px;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <h1>Reset Your Password</h1>
//       </div>
//       <div class="content">
//         <p>Hello <strong>${user.name}</strong>,</p>
//         <p>We received a request to reset your password. Click the button below to create a new password.</p>
        
//         <div style="text-align: center;">
//           <a href="${resetLink}" class="btn">Reset Password</a>
//         </div>
        
//         <p>Or use this reset code:</p>
//         <div class="code-box">${resetCode}</div>
        
//         <div class="warning">
//           <strong>⚠️ Security Notice:</strong> This password reset link and code will expire in 1 hour.
//           If you didn't request this, please ignore this email and your password will remain unchanged.
//         </div>
        
//         <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
//         <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
//           This is an automated message from our system. Please do not reply to this email.
//         </p>
//       </div>
//     </body>
//     </html>
//   `;

//   return await sendEmail({
//     to: user.email,
//     subject: "Reset Your Password",
//     html,
//   });
// };

// // ======================================================
// // CREATE NOTIFICATION
// // ======================================================

// const createNotification = async ({
//   userId,
//   userName,
//   email,
//   title,
//   message,
//   type,
// }) => {
//   try {
//     const notification = await Notification.create({
//       userId,
//       userName,
//       email: email.toLowerCase().trim(),
//       title,
//       message,
//       type,
//       isRead: false,
//     });

//     console.log(`✅ Notification created for ${email}: ${title}`);
//     return notification;
//   } catch (error) {
//     console.error(
//       `❌ Failed to create notification for ${email}:`,
//       error.message,
//     );
//     return null;
//   }
// };

// // ======================================================
// // REGISTER USER
// // ======================================================

// const register = async (req, res) => {
//   try {
//     const { name, email, phone, password, confirmPassword } = req.body;

//     // ===========================
//     // VALIDATE REQUIRED FIELDS
//     // ===========================

//     if (!name || !email || !phone || !password || !confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // ===========================
//     // PASSWORD CONFIRMATION
//     // ===========================

//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         errors: {
//           confirmPassword: "Passwords do not match",
//         },
//       });
//     }

//     // ===========================
//     // PASSWORD LENGTH
//     // ===========================

//     if (password.length < 8) {
//       return res.status(400).json({
//         success: false,
//         errors: {
//           password: "Password must be at least 8 characters",
//         },
//       });
//     }

//     // ===========================
//     // NORMALIZE EMAIL AND PHONE
//     // ===========================

//     const normalizedEmail = email.toLowerCase().trim();

//     const normalizedPhone = String(phone).trim();

//     // ===========================
//     // EMAIL VALIDATION
//     // ===========================

//     const emailValidation = validateEmail(normalizedEmail);

//     if (!emailValidation.valid) {
//       return res.status(400).json({
//         success: false,
//         errors: {
//           email: emailValidation.message,
//         },
//       });
//     }

//     // ===========================
//     // CHECK EXISTING USER
//     // ===========================

//     const existingUser = await User.findOne({
//       email: normalizedEmail,
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         errors: {
//           email: "An account with this email already exists",
//         },
//       });
//     }

//     // ===========================
//     // HASH PASSWORD
//     // ===========================

//     const salt = await bcrypt.genSalt(10);

//     const hashedPassword = await bcrypt.hash(password, salt);

//     // ===========================
//     // GENERATE VERIFICATION CODE
//     // ===========================

//     const verificationCode = generateVerificationCode();

//     // ===========================
//     // CREATE USER
//     // ===========================

//     const newUser = await User.create({
//       name: name.trim(),
//       email: normalizedEmail,
//       phone: normalizedPhone,
//       password: hashedPassword,
//       isEmailVerified: false,
//       isActive: true,
//       emailVerificationCode: verificationCode,
//     });

//     // ======================================================
//     // SEND ACCOUNT CREATION CONFIRMATION EMAIL
//     // ======================================================

//     try {
//       await sendAccountCreationConfirmation(newUser);
//       console.log(
//         `✅ Account creation confirmation email sent to ${newUser.email}`,
//       );
//     } catch (emailError) {
//       console.error(
//         "❌ Failed to send account creation confirmation email:",
//         emailError.message,
//       );
//     }

//     // ======================================================
//     // SEND VERIFICATION EMAIL
//     // ======================================================

//     try {
//       await sendVerificationEmail(newUser, verificationCode);
//       console.log(`✅ Verification email sent to ${newUser.email}`);
//     } catch (emailError) {
//       console.error(
//         "❌ Failed to send verification email:",
//         emailError.message,
//       );
//     }

//     // ======================================================
//     // ACCOUNT CREATED NOTIFICATION
//     // ======================================================

//     try {
//       await createNotification({
//         userId: newUser._id,
//         userName: newUser.name,
//         email: newUser.email,
//         title: "Account Created",
//         message: `Welcome ${newUser.name}! Your account has been created successfully. Please check your email for verification instructions.`,
//         type: "user_created",
//       });
//     } catch (notificationError) {
//       console.error(
//         "❌ Failed to create account notification:",
//         notificationError.message,
//       );
//     }

//     // ======================================================
//     // VERIFICATION CODE NOTIFICATION
//     // ======================================================

//     try {
//       await createNotification({
//         userId: newUser._id,
//         userName: newUser.name,
//         email: newUser.email,
//         title: "Email Verification Code",
//         message: `Your email verification code is: <strong>${verificationCode}</strong>. Please use this code to verify your email address.`,
//         type: "email_verification",
//       });
//     } catch (notificationError) {
//       console.error(
//         "❌ Failed to create verification notification:",
//         notificationError.message,
//       );
//     }

//     // ======================================================
//     // USER ACTIVITY
//     // ======================================================

//     try {
//       await UserActivity.create({
//         userId: newUser._id,
//         userName: newUser.name,
//         userEmail: newUser.email,
//         action: "user_created",
//         description: `New user ${newUser.name} created an account`,
//         ipAddress:
//           req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
//           req.socket.remoteAddress ||
//           null,
//         userAgent: req.headers["user-agent"] || null,
//       });

//       console.log(`✅ User activity created for ${newUser.email}`);
//     } catch (activityError) {
//       console.error(
//         "❌ Failed to create user activity:",
//         activityError.message,
//       );
//     }

//     // ======================================================
//     // GENERATE JWT
//     // ======================================================

//     const token = jwt.sign(
//       {
//         id: newUser._id,
//         email: newUser.email,
//         role: newUser.role,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//       },
//     );

//     // ======================================================
//     // RESPONSE
//     // ======================================================

//     return res.status(201).json({
//       success: true,
//       message:
//         "Registration successful! Please check your email for the verification link and code. A confirmation email has also been sent to you.",
//       requiresEmailVerification: true,
//       emailSent: true,
//       confirmationEmailSent: true,
//       token,
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         phone: newUser.phone,
//         role: newUser.role,
//         isEmailVerified: newUser.isEmailVerified,
//         isActive: newUser.isActive,
//         statistics: newUser.statistics,
//         createdAt: newUser.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("REGISTER ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong during registration.",
//       error: error.message,
//       name: error.name,
//     });
//   }
// };

// // ======================================================
// // VERIFY EMAIL
// // ======================================================

// const verifyEmail = async (req, res) => {
//   try {
//     let { email, code, token } = req.body;

//     // If token is provided, decode it
//     if (token && !email) {
//       try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         email = decoded.email;
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid or expired verification link",
//         });
//       }
//     }

//     if (!email || !code) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and verification code are required",
//       });
//     }

//     email = email.toLowerCase().trim();
//     code = code.trim().toUpperCase();

//     const user = await User.findOne({
//       email,
//       emailVerificationCode: code,
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid verification code",
//       });
//     }

//     if (user.isEmailVerified) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already verified",
//       });
//     }

//     // ===========================
//     // VERIFY USER
//     // ===========================

//     user.isEmailVerified = true;
//     user.emailVerificationCode = undefined;
//     user.emailVerificationExpires = undefined;
//     user.isActive = true;

//     await user.save();

//     // ======================================================
//     // CREATE VERIFICATION SUCCESS NOTIFICATION
//     // ======================================================

//     await createNotification({
//       userId: user._id,
//       userName: user.name,
//       email: user.email,
//       title: "Email Verified",
//       message:
//         "Your email has been successfully verified. Your account is now active.",
//       type: "email_verified",
//     });

//     // ======================================================
//     // USER ACTIVITY
//     // ======================================================

//     try {
//       await UserActivity.create({
//         userId: user._id,
//         userName: user.name,
//         userEmail: user.email,
//         action: "email_verified",
//         description: `User ${user.name} verified their email address`,
//         ipAddress:
//           req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
//           req.socket.remoteAddress ||
//           null,
//         userAgent: req.headers["user-agent"] || null,
//       });
//     } catch (activityError) {
//       console.error(
//         "❌ Failed to create verification activity:",
//         activityError.message,
//       );
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Email verified successfully!",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         isEmailVerified: true,
//         isActive: true,
//       },
//     });
//   } catch (error) {
//     console.error("Verify email error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while verifying email",
//     });
//   }
// };

// // ======================================================
// // RESEND VERIFICATION CODE
// // ======================================================

// const resendVerificationCode = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const normalizedEmail = email.toLowerCase().trim();

//     // ===========================
//     // VALIDATE EMAIL
//     // ===========================

//     const emailValidation = validateEmail(normalizedEmail);

//     if (!emailValidation.valid) {
//       return res.status(400).json({
//         success: false,
//         message: emailValidation.message,
//       });
//     }

//     // ===========================
//     // FIND USER
//     // ===========================

//     const user = await User.findOne({ email: normalizedEmail });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (user.isEmailVerified) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already verified",
//       });
//     }

//     // ===========================
//     // GENERATE NEW CODE
//     // ===========================

//     const verificationCode = generateVerificationCode();

//     user.emailVerificationCode = verificationCode;
//     user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

//     await user.save();

//     // ======================================================
//     // SEND VERIFICATION EMAIL
//     // ======================================================

//     try {
//       await sendVerificationEmail(user, verificationCode);
//       console.log(`✅ Verification email sent to ${user.email}`);
//     } catch (emailError) {
//       console.error(
//         "❌ Failed to send verification email:",
//         emailError.message,
//       );
//     }

//     // ======================================================
//     // CREATE NOTIFICATION
//     // ======================================================

//     await createNotification({
//       userId: user._id,
//       userName: user.name,
//       email: user.email,
//       title: "New Verification Code",
//       message: `Your new email verification code is: <strong>${verificationCode}</strong>. A verification link has also been sent to your email.`,
//       type: "email_verification",
//     });

//     return res.status(200).json({
//       success: true,
//       message:
//         "New verification code created and sent to your email. Check your inbox.",
//     });
//   } catch (error) {
//     console.error("Resend verification error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while generating the verification code",
//     });
//   }
// };

// // ======================================================
// // FORGOT PASSWORD
// // ======================================================

// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const normalizedEmail = email.toLowerCase().trim();

//     // ===========================
//     // VALIDATE EMAIL
//     // ===========================

//     const emailValidation = validateEmail(normalizedEmail);

//     if (!emailValidation.valid) {
//       return res.status(400).json({
//         success: false,
//         message: emailValidation.message,
//       });
//     }

//     // ===========================
//     // FIND USER
//     // ===========================

//     const user = await User.findOne({ email: normalizedEmail });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "No account found with this email address",
//       });
//     }

//     if (!user.isEmailVerified) {
//       return res.status(403).json({
//         success: false,
//         message: "Please verify your email first",
//       });
//     }

//     // ===========================
//     // GENERATE RESET TOKEN
//     // ===========================

//     const resetToken = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" },
//     );

//     // ===========================
//     // SAVE RESET TOKEN
//     // ===========================

//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000;

//     await user.save();

//     // ===========================
//     // CREATE RESET CODE
//     // ===========================

//     const resetCode = crypto.randomBytes(4).toString("hex").toUpperCase();

//     // ======================================================
//     // SEND PASSWORD RESET EMAIL
//     // ======================================================

//     try {
//       await sendPasswordResetEmail(user, resetToken, resetCode);
//       console.log(`✅ Password reset email sent to ${user.email}`);
//     } catch (emailError) {
//       console.error(
//         "❌ Failed to send password reset email:",
//         emailError.message,
//       );
//     }

//     // ======================================================
//     // CREATE PASSWORD RESET NOTIFICATION
//     // ======================================================

//     await createNotification({
//       userId: user._id,
//       userName: user.name,
//       email: user.email,
//       title: "Password Reset Request",
//       message: `Your password reset code is: <strong>${resetCode}</strong>. A reset link has also been sent to your email.`,
//       type: "password_reset",
//     });

//     return res.status(200).json({
//       success: true,
//       message:
//         "Password reset link and code have been sent to your email. Please check your inbox.",
//       token: resetToken,
//     });
//   } catch (error) {
//     console.error("Forgot password error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while creating the password reset request",
//     });
//   }
// };

// // ======================================================
// // RESET PASSWORD
// // ======================================================

// const resetPassword = async (req, res) => {
//   try {
//     const { token, newPassword, confirmPassword } = req.body;

//     if (!token || !newPassword || !confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Token, new password, and confirm password are required",
//       });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Passwords do not match",
//       });
//     }

//     if (newPassword.length < 8) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 8 characters",
//       });
//     }

//     // ===========================
//     // VERIFY TOKEN
//     // ===========================

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired reset token",
//       });
//     }

//     // ===========================
//     // FIND USER
//     // ===========================

//     const user = await User.findOne({
//       _id: decoded.id,
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired reset token",
//       });
//     }

//     // ===========================
//     // HASH NEW PASSWORD
//     // ===========================

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     // ===========================
//     // UPDATE USER
//     // ===========================

//     user.password = hashedPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     // ======================================================
//     // PASSWORD RESET SUCCESS NOTIFICATION
//     // ======================================================

//     await createNotification({
//       userId: user._id,
//       userName: user.name,
//       email: user.email,
//       title: "Password Reset Successful",
//       message: "Your password has been successfully reset.",
//       type: "password_reset_success",
//     });

//     // ======================================================
//     // USER ACTIVITY
//     // ======================================================

//     try {
//       await UserActivity.create({
//         userId: user._id,
//         userName: user.name,
//         userEmail: user.email,
//         action: "password_reset",
//         description: `User ${user.name} successfully reset their password`,
//         ipAddress:
//           req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
//           req.socket.remoteAddress ||
//           null,
//         userAgent: req.headers["user-agent"] || null,
//       });
//     } catch (activityError) {
//       console.error(
//         "❌ Failed to create password reset activity:",
//         activityError.message,
//       );
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Password reset successfully",
//     });
//   } catch (error) {
//     console.error("Reset password error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while resetting password",
//     });
//   }
// };

// // ======================================================
// // LOGIN
// // ======================================================

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // ===========================
//     // VALIDATE INPUT
//     // ===========================

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     const normalizedEmail = email.toLowerCase().trim();

//     // ===========================
//     // FIND USER
//     // ===========================

//     const user = await User.findOne({ email: normalizedEmail }).select(
//       "+password",
//     );

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // ===========================
//     // CHECK PASSWORD
//     // ===========================

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // ===========================
//     // UPDATE LAST LOGIN
//     // ===========================

//     user.lastLogin = new Date();
//     await user.save();

//     // ======================================================
//     // CREATE LOGIN ACTIVITY
//     // ======================================================

//     try {
//       await UserActivity.create({
//         userId: user._id,
//         userName: user.name,
//         userEmail: user.email,
//         action: "user_login",
//         description: `User ${user.name} logged into their account`,
//         ipAddress:
//           req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
//           req.socket.remoteAddress ||
//           null,
//         userAgent: req.headers["user-agent"] || null,
//       });
//     } catch (activityError) {
//       console.error(
//         "❌ Failed to create login activity:",
//         activityError.message,
//       );
//     }

//     // ===========================
//     // CREATE JWT
//     // ===========================

//     const token = jwt.sign(
//       {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       },
//     );

//     // ===========================
//     // SAVE COOKIE
//     // ===========================

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         isEmailVerified: user.isEmailVerified,
//         isActive: user.isActive,
//         lastLogin: user.lastLogin,
//         statistics: user.statistics,
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong during login",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // LOGOUT
// // ======================================================

// const logout = async (req, res) => {
//   try {
//     res.clearCookie("token", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Logged out successfully",
//     });
//   } catch (error) {
//     console.error("Logout error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong during logout",
//     });
//   }
// };

// // ======================================================
// // GET CURRENT USER
// // ======================================================

// const getCurrentUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         isEmailVerified: user.isEmailVerified,
//         isActive: user.isActive,
//         lastLogin: user.lastLogin,
//         statistics: user.statistics,
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Get current user error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching user profile",
//     });
//   }
// };

// // ======================================================
// // GET ALL NOTIFICATIONS
// // ======================================================

// const getAllNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find().sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: notifications.length,
//       notifications,
//     });
//   } catch (error) {
//     console.error("GET ALL NOTIFICATIONS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch notifications",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // GET NOTIFICATIONS BY EMAIL
// // ======================================================

// const getNotificationsByEmail = async (req, res) => {
//   try {
//     const email = req.params.email?.toLowerCase().trim();

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const notifications = await Notification.find({ email }).sort({
//       createdAt: -1,
//     });

//     return res.status(200).json({
//       success: true,
//       count: notifications.length,
//       email,
//       notifications,
//     });
//   } catch (error) {
//     console.error("GET NOTIFICATIONS BY EMAIL ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch notifications",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // GET ALL USERS
// // ======================================================

// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find()
//       .select(
//         "-password -confirmPassword -emailVerificationCode -emailVerificationExpires",
//       )
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       totalUsers: users.length,
//       users,
//     });
//   } catch (error) {
//     console.error("Get All Users Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch users",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // GET USER BY EMAIL
// // ======================================================

// const getUserByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const user = await User.findOne({
//       email: email.trim().toLowerCase(),
//     }).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         isEmailVerified: user.isEmailVerified,
//         isActive: user.isActive,
//         lastLogin: user.lastLogin,
//         statistics: user.statistics,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt,
//       },
//     });
//   } catch (error) {
//     console.error("Get user by email error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching user profile",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// // ======================================================
// // UPDATE CURRENT USER
// // ======================================================

// const updateCurrentUser = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { name, email, phone, password, statistics } = req.body;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // ======================================================
//     // EMAIL CHANGE
//     // ======================================================

//     if (
//       email &&
//       email.toLowerCase().trim() !== user.email.toLowerCase().trim()
//     ) {
//       const normalizedEmail = email.toLowerCase().trim();

//       const emailValidation = validateEmail(normalizedEmail);

//       if (!emailValidation.valid) {
//         return res.status(400).json({
//           success: false,
//           message: emailValidation.message,
//         });
//       }

//       // ===========================
//       // CHECK EMAIL
//       // ===========================

//       const existingUser = await User.findOne({
//         email: normalizedEmail,
//         _id: { $ne: userId },
//       });

//       if (existingUser) {
//         return res.status(409).json({
//           success: false,
//           message: "Email already in use by another account",
//         });
//       }

//       // ===========================
//       // NEW VERIFICATION CODE
//       // ===========================

//       const verificationCode = generateVerificationCode();

//       user.email = normalizedEmail;
//       user.isEmailVerified = false;
//       user.emailVerificationCode = verificationCode;
//       user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

//       // ======================================================
//       // SEND NEW VERIFICATION EMAIL
//       // ======================================================

//       try {
//         await sendVerificationEmail(user, verificationCode);
//         console.log(`✅ New verification email sent to ${user.email}`);
//       } catch (emailError) {
//         console.error(
//           "❌ Failed to send new verification email:",
//           emailError.message,
//         );
//       }

//       // ======================================================
//       // CREATE NOTIFICATION
//       // ======================================================

//       await createNotification({
//         userId: user._id,
//         userName: user.name,
//         email: normalizedEmail,
//         title: "Email Verification Required",
//         message: `Your email address was changed. Your new verification code is: <strong>${verificationCode}</strong>. A verification link has also been sent to your new email.`,
//         type: "email_verification",
//       });
//     }

//     // ===========================
//     // UPDATE OTHER FIELDS
//     // ===========================

//     if (name) {
//       user.name = name.trim();
//     }

//     if (phone) {
//       user.phone = phone.trim();
//     }

//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);
//     }

//     if (statistics) {
//       user.statistics = {
//         ...user.statistics,
//         ...statistics,
//       };
//     }

//     await user.save();

//     const updatedUser = user.toObject();
//     delete updatedUser.password;

//     return res.status(200).json({
//       success: true,
//       message:
//         email && !updatedUser.isEmailVerified
//           ? "Profile updated. Please verify your new email address."
//           : "Profile updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error("Update current user error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while updating profile",
//     });
//   }
// };

// // ======================================================
// // CHECK EMAIL VERIFICATION STATUS
// // ======================================================

// const checkEmailVerification = async (req, res) => {
//   try {
//     const { email } = req.query;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const normalizedEmail = email.toLowerCase().trim();

//     const user = await User.findOne({ email: normalizedEmail });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       isEmailVerified: user.isEmailVerified,
//       isActive: user.isActive,
//     });
//   } catch (error) {
//     console.error("Check verification error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };

// // ======================================================
// // GET USERS
// // ======================================================

// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find()
//       .select("-password -emailVerificationCode")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: users.length,
//       users,
//     });
//   } catch (error) {
//     console.error("Get users error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching users",
//     });
//   }
// };

// // ======================================================
// // GET SINGLE USER
// // ======================================================

// const getUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findById(id).select(
//       "-password -emailVerificationCode",
//     );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     console.error("Get user error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching the user",
//     });
//   }
// };

// // ======================================================
// // UPDATE USER - ADMIN
// // ======================================================

// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, email, phone, password, statistics, isActive, role } =
//       req.body;

//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // ===========================
//     // EMAIL VALIDATION
//     // ===========================

//     if (
//       email &&
//       email.toLowerCase().trim() !== user.email.toLowerCase().trim()
//     ) {
//       const normalizedEmail = email.toLowerCase().trim();

//       const emailValidation = validateEmail(normalizedEmail);

//       if (!emailValidation.valid) {
//         return res.status(400).json({
//           success: false,
//           message: emailValidation.message,
//         });
//       }

//       const existingUser = await User.findOne({
//         email: normalizedEmail,
//         _id: { $ne: id },
//       });

//       if (existingUser) {
//         return res.status(409).json({
//           success: false,
//           message: "Email already in use by another account",
//         });
//       }

//       user.email = normalizedEmail;
//     }

//     // ===========================
//     // UPDATE FIELDS
//     // ===========================

//     if (name) {
//       user.name = name.trim();
//     }

//     if (phone) {
//       user.phone = phone.trim();
//     }

//     if (isActive !== undefined) {
//       user.isActive = isActive;
//     }

//     if (role) {
//       user.role = role;
//     }

//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);
//     }

//     if (statistics) {
//       user.statistics = {
//         ...user.statistics,
//         ...statistics,
//       };
//     }

//     await user.save();

//     const updatedUser = user.toObject();
//     delete updatedUser.password;
//     delete updatedUser.emailVerificationCode;

//     return res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error("Update user error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while updating the user",
//     });
//   }
// };

// // ======================================================
// // DELETE USER - ADMIN
// // ======================================================

// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const protectedEmail = "akingeneyeleon@gmail.com";

//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // ===========================
//     // PROTECT MAIN ACCOUNT
//     // ===========================

//     if (user.email.toLowerCase() === protectedEmail) {
//       return res.status(403).json({
//         success: false,
//         message: "This account cannot be deleted",
//       });
//     }

//     // ===========================
//     // CREATE ACTIVITY BEFORE DELETE
//     // ===========================

//     try {
//       await UserActivity.create({
//         userId: user._id,
//         userName: user.name,
//         userEmail: user.email,
//         action: "user_deleted",
//         description: `User ${user.name} was deleted`,
//         ipAddress:
//           req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
//           req.socket.remoteAddress ||
//           null,
//         userAgent: req.headers["user-agent"] || null,
//       });
//     } catch (activityError) {
//       console.error(
//         "❌ Failed to create delete activity:",
//         activityError.message,
//       );
//     }

//     await User.findByIdAndDelete(id);

//     return res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete user error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while deleting the user",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // DELETE CURRENT USER
// // ======================================================

// const deleteCurrentUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // ======================================================
//     // CREATE NOTIFICATION BEFORE DELETE
//     // ======================================================

//     await createNotification({
//       userId: user._id,
//       userName: user.name,
//       email: user.email,
//       title: "Account Deleted",
//       message: "Your account has been successfully deleted.",
//       type: "account_deleted",
//     });

//     // ======================================================
//     // USER ACTIVITY
//     // ======================================================

//     try {
//       await UserActivity.create({
//         userId: user._id,
//         userName: user.name,
//         userEmail: user.email,
//         action: "user_deleted",
//         description: `User ${user.name} deleted their account`,
//         ipAddress:
//           req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
//           req.socket.remoteAddress ||
//           null,
//         userAgent: req.headers["user-agent"] || null,
//       });
//     } catch (activityError) {
//       console.error(
//         "❌ Failed to create account deletion activity:",
//         activityError.message,
//       );
//     }

//     await User.findByIdAndDelete(id);

//     return res.status(200).json({
//       success: true,
//       message: "Account deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete current user error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while deleting account",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // UPDATE STATISTICS
// // ======================================================

// const updateStatistics = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const statistics = req.body;

//     const validFields = [
//       "totalIncome",
//       "totalExpenses",
//       "totalSavings",
//       "monthlyIncome",
//       "monthlyExpenses",
//       "monthlyBudget",
//       "membersCount",
//     ];

//     const updateData = {};

//     for (const field of validFields) {
//       if (statistics[field] !== undefined) {
//         if (typeof statistics[field] !== "number" || statistics[field] < 0) {
//           return res.status(400).json({
//             success: false,
//             message: `${field} must be a positive number`,
//           });
//         }

//         updateData[`statistics.${field}`] = statistics[field];
//       }
//     }

//     if (Object.keys(updateData).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No valid statistics fields provided",
//       });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: updateData },
//       { new: true, runValidators: true },
//     ).select("-password -emailVerificationCode");

//     return res.status(200).json({
//       success: true,
//       message: "Statistics updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error("Update statistics error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while updating statistics",
//     });
//   }
// };

// // ======================================================
// // GET USER STATISTICS
// // ======================================================

// const getUserStatistics = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const activeUsers = await User.countDocuments({ isActive: true });
//     const inactiveUsers = await User.countDocuments({ isActive: false });
//     const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
//     const unverifiedUsers = await User.countDocuments({
//       isEmailVerified: false,
//     });

//     // ===========================
//     // USERS BY ROLE
//     // ===========================

//     const usersByRole = await User.aggregate([
//       {
//         $group: {
//           _id: "$role",
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           role: "$_id",
//           count: 1,
//         },
//       },
//     ]);

//     // ===========================
//     // NEW USERS LAST 30 DAYS
//     // ===========================

//     const newUsers = await User.countDocuments({
//       createdAt: {
//         $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
//       },
//     });

//     // ===========================
//     // RECENT USERS
//     // ===========================

//     const recentUsers = await User.find()
//       .select("-password")
//       .sort({ createdAt: -1 })
//       .limit(5);

//     return res.status(200).json({
//       success: true,
//       statistics: {
//         totalUsers,
//         activeUsers,
//         inactiveUsers,
//         verifiedUsers,
//         unverifiedUsers,
//         newUsersLast30Days: newUsers,
//         usersByRole,
//       },
//       recentUsers,
//     });
//   } catch (error) {
//     console.error("GET USER STATISTICS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch user statistics",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // BULK DELETE NOTIFICATIONS
// // ======================================================

// const bulkDeleteNotifications = async (req, res) => {
//   try {
//     const { ids } = req.body;

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
//     console.error("BULK DELETE NOTIFICATIONS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete notifications",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// // ======================================================
// // DELETE NOTIFICATION
// // ======================================================

// const deleteNotification = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
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

//     await Notification.deleteOne({
//       _id: notification._id,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Notification deleted successfully",
//       data: notification,
//     });
//   } catch (error) {
//     console.error("DELETE NOTIFICATION ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete notification",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// // ======================================================
// // MARK NOTIFICATION AS READ
// // ======================================================

// const markNotificationAsRead = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
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

//     notification.isRead = true;
//     notification.status = "read";
//     notification.readAt = new Date();

//     await notification.save();

//     return res.status(200).json({
//       success: true,
//       message: "Notification marked as read",
//       data: notification,
//     });
//   } catch (error) {
//     console.error("MARK NOTIFICATION AS READ ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to mark notification as read",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// // ======================================================
// // BULK MARK NOTIFICATIONS AS READ
// // ======================================================

// const bulkMarkNotificationsAsRead = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     const filter = {
//       isRead: false,
//     };

//     if (Array.isArray(ids) && ids.length > 0) {
//       const invalidIds = ids.filter(
//         (id) => !mongoose.Types.ObjectId.isValid(id),
//       );

//       if (invalidIds.length > 0) {
//         return res.status(400).json({
//           success: false,
//           message: "One or more notification IDs are invalid",
//           invalidIds,
//         });
//       }

//       filter._id = {
//         $in: ids,
//       };
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
//       message:
//         Array.isArray(ids) && ids.length > 0
//           ? "Selected notifications marked as read"
//           : "All notifications marked as read",
//       modifiedCount: result.modifiedCount,
//     });
//   } catch (error) {
//     console.error("BULK MARK NOTIFICATIONS AS READ ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to mark notifications as read",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// // ======================================================
// // EXPORT ALL CONTROLLERS
// // ======================================================

// module.exports = {
//   register,
//   login,
//   logout,
//   verifyEmail,
//   resendVerificationCode,
//   checkEmailVerification,
//   forgotPassword,
//   resetPassword,
//   getUsers,
//   getUser,
//   getCurrentUser,
//   updateUser,
//   updateCurrentUser,
//   deleteUser,
//   getAllUsers,
//   getUserByEmail,
//   deleteCurrentUser,
//   updateStatistics,
//   getUserStatistics,
//   getAllNotifications,
//   bulkMarkNotificationsAsRead,
//   markNotificationAsRead,
//   deleteNotification,
//   bulkDeleteNotifications,
//   getNotificationsByEmail,
// };













const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/User");
const UserActivity = require("../activity/UserActivity");
const Notification = require("../models/Notification");
const transporter = require("../services/emailTransporter");

// ======================================================
// EMAIL VALIDATION
// ======================================================

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: "Invalid email format",
    };
  }

  const disposableDomains = [
    "tempmail.com",
    "temp-mail.org",
    "guerrillamail.com",
    "10minutemail.com",
    "throwawaymail.com",
    "mailinator.com",
  ];

  const domain = email.split("@")[1].toLowerCase();

  if (disposableDomains.includes(domain)) {
    return {
      valid: false,
      message: "Disposable email addresses are not allowed",
    };
  }

  const rwandaSchoolEmailRegex = /^[a-z0-9._%+-]+@[a-z0-9-]+\.ac\.rw$/i;

  const isRwandaSchoolEmail = rwandaSchoolEmailRegex.test(email);

  if (isRwandaSchoolEmail) {
    return {
      valid: true,
    };
  }

  return {
    valid: true,
  };
};

// ======================================================
// GENERATE VERIFICATION CODE
// ======================================================

const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

// ======================================================
// GENERATE VERIFICATION TOKEN
// ======================================================

const generateVerificationToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

// ======================================================
// SEND EMAIL FUNCTION
// ======================================================

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// ======================================================
// GET FRONTEND URL FROM ENVIRONMENT
// ======================================================

const getFrontendUrl = () => {
  // Use environment variable or fallback to default
  const url = process.env.FRONTEND_URL || "https://inyumba-studentportal.vercel.app";
  // Remove trailing slash if present
  return url.replace(/\/$/, '');
};

// ======================================================
// SEND ACCOUNT CREATION CONFIRMATION EMAIL
// ======================================================

const sendAccountCreationConfirmation = async (user) => {
  const frontendUrl = getFrontendUrl();
  const loginLink = `${frontendUrl}/login`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Inyumba Portal</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 24px;
        }
        .header p {
          color: rgba(255,255,255,0.9);
          margin: 10px 0 0;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 10px 10px;
          border: 1px solid #e9ecef;
          border-top: none;
        }
        .welcome-box {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          margin: 15px 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
        }
        .btn:hover {
          opacity: 0.9;
        }
        .info-box {
          background: #e8f4fd;
          border-left: 4px solid #2196F3;
          padding: 12px 16px;
          margin: 15px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          color: #6c757d;
          font-size: 14px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }
        .user-details {
          background: #f1f3f5;
          border-radius: 6px;
          padding: 12px 16px;
          margin: 10px 0;
        }
        .user-details strong {
          color: #667eea;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Welcome to Inyumba Portal!</h1>
        <p>Your account has been successfully created</p>
      </div>
      <div class="content">
        <div class="welcome-box">
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Thank you for creating an account with the <strong>Inyumba Portal</strong>! We're excited to have you on board.</p>
        </div>

        <div class="info-box">
          <strong>📋 Account Details:</strong>
          <div class="user-details">
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || "Not provided"}</p>
            <p><strong>Account Type:</strong> ${user.role || "User"}</p>
            <p><strong>Created:</strong> ${new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${loginLink}" class="btn">🔑 Log In to Your Account</a>
        </div>

        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; border-radius: 4px;">
          <strong>📧 Next Steps:</strong>
          <p style="margin: 8px 0 0;">Please check your email for the verification link to activate your account. You'll need to verify your email before you can access all features.</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          If you have any questions or need assistance, please don't hesitate to contact our support team.
        </p>
        <p style="color: #6c757d; font-size: 12px; text-align: center; margin: 10px 0 0;">
          This is an automated message from our system. Please do not reply to this email.
        </p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Inyumba Portal. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: "🎉 Welcome to Inyumba Portal - Account Created",
    html,
  });
};

// ======================================================
// SEND VERIFICATION EMAIL
// ======================================================

const sendVerificationEmail = async (user, verificationCode) => {
  const frontendUrl = getFrontendUrl();
  const verificationToken = generateVerificationToken(user.email);
  
  // Construct the verification link with proper URL
  const verificationLink = `${frontendUrl}/verification/email/status?token=${verificationToken}&code=${verificationCode}&email=${encodeURIComponent(user.email)}`;

  console.log(`🔗 Verification link generated: ${verificationLink}`);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 24px;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 10px 10px;
          border: 1px solid #e9ecef;
          border-top: none;
        }
        .code-box {
          background: #fff;
          border: 2px dashed #667eea;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #667eea;
          margin: 20px 0;
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
        }
        .btn:hover {
          opacity: 0.9;
        }
        .footer {
          text-align: center;
          color: #6c757d;
          font-size: 14px;
          margin-top: 20px;
        }
        .note {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 12px;
          margin: 15px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Verify Your Email Address</h1>
      </div>
      <div class="content">
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>Thank you for registering with us! Please verify your email address to activate your account.</p>
        
        <div style="text-align: center;">
          <a href="${verificationLink}" class="btn">Verify Email Address</a>
        </div>
        
        <p>Or use this verification code:</p>
        <div class="code-box">${verificationCode}</div>
        
        <div class="note">
          <strong>⏰ Note:</strong> This verification link and code will expire in 24 hours.
        </div>
        
        <p>If you didn't create an account with us, please ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          This is an automated message from our system. Please do not reply to this email.
        </p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: "Verify Your Email Address",
    html,
  });
};

// ======================================================
// SEND PASSWORD RESET EMAIL
// ======================================================

const sendPasswordResetEmail = async (user, resetToken, resetCode) => {
  const frontendUrl = getFrontendUrl();
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}&code=${resetCode}&email=${encodeURIComponent(user.email)}`;

  console.log(`🔗 Password reset link generated: ${resetLink}`);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 24px;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 10px 10px;
          border: 1px solid #e9ecef;
          border-top: none;
        }
        .code-box {
          background: #fff;
          border: 2px dashed #f5576c;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #f5576c;
          margin: 20px 0;
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
        }
        .btn:hover {
          opacity: 0.9;
        }
        .warning {
          background: #f8d7da;
          border-left: 4px solid #dc3545;
          padding: 12px;
          margin: 15px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          color: #6c757d;
          font-size: 14px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Reset Your Password</h1>
      </div>
      <div class="content">
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>We received a request to reset your password. Click the button below to create a new password.</p>
        
        <div style="text-align: center;">
          <a href="${resetLink}" class="btn">Reset Password</a>
        </div>
        
        <p>Or use this reset code:</p>
        <div class="code-box">${resetCode}</div>
        
        <div class="warning">
          <strong>⚠️ Security Notice:</strong> This password reset link and code will expire in 1 hour.
          If you didn't request this, please ignore this email and your password will remain unchanged.
        </div>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
          This is an automated message from our system. Please do not reply to this email.
        </p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html,
  });
};

// ======================================================
// CREATE NOTIFICATION
// ======================================================

const createNotification = async ({
  userId,
  userName,
  email,
  title,
  message,
  type,
}) => {
  try {
    const notification = await Notification.create({
      userId,
      userName,
      email: email.toLowerCase().trim(),
      title,
      message,
      type,
      isRead: false,
    });

    console.log(`✅ Notification created for ${email}: ${title}`);
    return notification;
  } catch (error) {
    console.error(
      `❌ Failed to create notification for ${email}:`,
      error.message,
    );
    return null;
  }
};

// ======================================================
// REGISTER USER
// ======================================================

const register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        errors: {
          confirmPassword: "Passwords do not match",
        },
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        errors: {
          password: "Password must be at least 8 characters",
        },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = String(phone).trim();

    const emailValidation = validateEmail(normalizedEmail);

    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        errors: {
          email: emailValidation.message,
        },
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        errors: {
          email: "An account with this email already exists",
        },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationCode = generateVerificationCode();

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      isEmailVerified: false,
      isActive: true,
      emailVerificationCode: verificationCode,
    });

    try {
      await sendAccountCreationConfirmation(newUser);
      console.log(
        `✅ Account creation confirmation email sent to ${newUser.email}`,
      );
    } catch (emailError) {
      console.error(
        "❌ Failed to send account creation confirmation email:",
        emailError.message,
      );
    }

    try {
      await sendVerificationEmail(newUser, verificationCode);
      console.log(`✅ Verification email sent to ${newUser.email}`);
    } catch (emailError) {
      console.error(
        "❌ Failed to send verification email:",
        emailError.message,
      );
    }

    try {
      await createNotification({
        userId: newUser._id,
        userName: newUser.name,
        email: newUser.email,
        title: "Account Created",
        message: `Welcome ${newUser.name}! Your account has been created successfully. Please check your email for verification instructions.`,
        type: "user_created",
      });
    } catch (notificationError) {
      console.error(
        "❌ Failed to create account notification:",
        notificationError.message,
      );
    }

    try {
      await createNotification({
        userId: newUser._id,
        userName: newUser.name,
        email: newUser.email,
        title: "Email Verification Code",
        message: `Your email verification code is: <strong>${verificationCode}</strong>. Please use this code to verify your email address.`,
        type: "email_verification",
      });
    } catch (notificationError) {
      console.error(
        "❌ Failed to create verification notification:",
        notificationError.message,
      );
    }

    try {
      await UserActivity.create({
        userId: newUser._id,
        userName: newUser.name,
        userEmail: newUser.email,
        action: "user_created",
        description: `New user ${newUser.name} created an account`,
        ipAddress:
          req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
          req.socket.remoteAddress ||
          null,
        userAgent: req.headers["user-agent"] || null,
      });

      console.log(`✅ User activity created for ${newUser.email}`);
    } catch (activityError) {
      console.error(
        "❌ Failed to create user activity:",
        activityError.message,
      );
    }

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email for the verification link and code. A confirmation email has also been sent to you.",
      requiresEmailVerification: true,
      emailSent: true,
      confirmationEmailSent: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
        isActive: newUser.isActive,
        statistics: newUser.statistics,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during registration.",
      error: error.message,
      name: error.name,
    });
  }
};

// ======================================================
// VERIFY EMAIL
// ======================================================

const verifyEmail = async (req, res) => {
  try {
    let { email, code, token } = req.body;

    if (token && !email) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        email = decoded.email;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification link",
        });
      }
    }

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    email = email.toLowerCase().trim();
    code = code.trim().toUpperCase();

    const user = await User.findOne({
      email,
      emailVerificationCode: code,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    user.isActive = true;

    await user.save();

    await createNotification({
      userId: user._id,
      userName: user.name,
      email: user.email,
      title: "Email Verified",
      message:
        "Your email has been successfully verified. Your account is now active.",
      type: "email_verified",
    });

    try {
      await UserActivity.create({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        action: "email_verified",
        description: `User ${user.name} verified their email address`,
        ipAddress:
          req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
          req.socket.remoteAddress ||
          null,
        userAgent: req.headers["user-agent"] || null,
      });
    } catch (activityError) {
      console.error(
        "❌ Failed to create verification activity:",
        activityError.message,
      );
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: true,
        isActive: true,
      },
    });
  } catch (error) {
    console.error("Verify email error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying email",
    });
  }
};

// ======================================================
// RESEND VERIFICATION CODE
// ======================================================

const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const emailValidation = validateEmail(normalizedEmail);

    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.message,
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const verificationCode = generateVerificationCode();

    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    try {
      await sendVerificationEmail(user, verificationCode);
      console.log(`✅ Verification email sent to ${user.email}`);
    } catch (emailError) {
      console.error(
        "❌ Failed to send verification email:",
        emailError.message,
      );
    }

    await createNotification({
      userId: user._id,
      userName: user.name,
      email: user.email,
      title: "New Verification Code",
      message: `Your new email verification code is: <strong>${verificationCode}</strong>. A verification link has also been sent to your email.`,
      type: "email_verification",
    });

    return res.status(200).json({
      success: true,
      message:
        "New verification code created and sent to your email. Check your inbox.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating the verification code",
    });
  }
};

// ======================================================
// FORGOT PASSWORD
// ======================================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const emailValidation = validateEmail(normalizedEmail);

    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.message,
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const resetCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    try {
      await sendPasswordResetEmail(user, resetToken, resetCode);
      console.log(`✅ Password reset email sent to ${user.email}`);
    } catch (emailError) {
      console.error(
        "❌ Failed to send password reset email:",
        emailError.message,
      );
    }

    await createNotification({
      userId: user._id,
      userName: user.name,
      email: user.email,
      title: "Password Reset Request",
      message: `Your password reset code is: <strong>${resetCode}</strong>. A reset link has also been sent to your email.`,
      type: "password_reset",
    });

    return res.status(200).json({
      success: true,
      message:
        "Password reset link and code have been sent to your email. Please check your inbox.",
      token: resetToken,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the password reset request",
    });
  }
};

// ======================================================
// RESET PASSWORD
// ======================================================

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Token, new password, and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    await createNotification({
      userId: user._id,
      userName: user.name,
      email: user.email,
      title: "Password Reset Successful",
      message: "Your password has been successfully reset.",
      type: "password_reset_success",
    });

    try {
      await UserActivity.create({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        action: "password_reset",
        description: `User ${user.name} successfully reset their password`,
        ipAddress:
          req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
          req.socket.remoteAddress ||
          null,
        userAgent: req.headers["user-agent"] || null,
      });
    } catch (activityError) {
      console.error(
        "❌ Failed to create password reset activity:",
        activityError.message,
      );
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password",
    });
  }
};

// ======================================================
// LOGIN
// ======================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    try {
      await UserActivity.create({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        action: "user_login",
        description: `User ${user.name} logged into their account`,
        ipAddress:
          req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
          req.socket.remoteAddress ||
          null,
        userAgent: req.headers["user-agent"] || null,
      });
    } catch (activityError) {
      console.error(
        "❌ Failed to create login activity:",
        activityError.message,
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        statistics: user.statistics,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during login",
      error: error.message,
    });
  }
};

// ======================================================
// LOGOUT
// ======================================================

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during logout",
    });
  }
};

// ======================================================
// GET CURRENT USER
// ======================================================

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        statistics: user.statistics,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user profile",
    });
  }
};

// ======================================================
// GET ALL NOTIFICATIONS
// ======================================================

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("GET ALL NOTIFICATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// ======================================================
// GET NOTIFICATIONS BY EMAIL
// ======================================================

const getNotificationsByEmail = async (req, res) => {
  try {
    const email = req.params.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const notifications = await Notification.find({ email }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      email,
      notifications,
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS BY EMAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL USERS
// ======================================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select(
        "-password -confirmPassword -emailVerificationCode -emailVerificationExpires",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// ======================================================
// GET USER BY EMAIL
// ======================================================

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        statistics: user.statistics,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get user by email error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ======================================================
// UPDATE CURRENT USER
// ======================================================

const updateCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, password, statistics } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      email &&
      email.toLowerCase().trim() !== user.email.toLowerCase().trim()
    ) {
      const normalizedEmail = email.toLowerCase().trim();

      const emailValidation = validateEmail(normalizedEmail);

      if (!emailValidation.valid) {
        return res.status(400).json({
          success: false,
          message: emailValidation.message,
        });
      }

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already in use by another account",
        });
      }

      const verificationCode = generateVerificationCode();

      user.email = normalizedEmail;
      user.isEmailVerified = false;
      user.emailVerificationCode = verificationCode;
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

      try {
        await sendVerificationEmail(user, verificationCode);
        console.log(`✅ New verification email sent to ${user.email}`);
      } catch (emailError) {
        console.error(
          "❌ Failed to send new verification email:",
          emailError.message,
        );
      }

      await createNotification({
        userId: user._id,
        userName: user.name,
        email: normalizedEmail,
        title: "Email Verification Required",
        message: `Your email address was changed. Your new verification code is: <strong>${verificationCode}</strong>. A verification link has also been sent to your new email.`,
        type: "email_verification",
      });
    }

    if (name) {
      user.name = name.trim();
    }

    if (phone) {
      user.phone = phone.trim();
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (statistics) {
      user.statistics = {
        ...user.statistics,
        ...statistics,
      };
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      success: true,
      message:
        email && !updatedUser.isEmailVerified
          ? "Profile updated. Please verify your new email address."
          : "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile",
    });
  }
};

// ======================================================
// CHECK EMAIL VERIFICATION STATUS
// ======================================================

const checkEmailVerification = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
    });
  } catch (error) {
    console.error("Check verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ======================================================
// GET USERS
// ======================================================

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -emailVerificationCode")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching users",
    });
  }
};

// ======================================================
// GET SINGLE USER
// ======================================================

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "-password -emailVerificationCode",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the user",
    });
  }
};

// ======================================================
// UPDATE USER - ADMIN
// ======================================================

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password, statistics, isActive, role } =
      req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      email &&
      email.toLowerCase().trim() !== user.email.toLowerCase().trim()
    ) {
      const normalizedEmail = email.toLowerCase().trim();

      const emailValidation = validateEmail(normalizedEmail);

      if (!emailValidation.valid) {
        return res.status(400).json({
          success: false,
          message: emailValidation.message,
        });
      }

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already in use by another account",
        });
      }

      user.email = normalizedEmail;
    }

    if (name) {
      user.name = name.trim();
    }

    if (phone) {
      user.phone = phone.trim();
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    if (role) {
      user.role = role;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (statistics) {
      user.statistics = {
        ...user.statistics,
        ...statistics,
      };
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.emailVerificationCode;

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the user",
    });
  }
};

// ======================================================
// DELETE USER - ADMIN
// ======================================================

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const protectedEmail = "akingeneyeleon@gmail.com";

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.email.toLowerCase() === protectedEmail) {
      return res.status(403).json({
        success: false,
        message: "This account cannot be deleted",
      });
    }

    try {
      await UserActivity.create({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        action: "user_deleted",
        description: `User ${user.name} was deleted`,
        ipAddress:
          req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
          req.socket.remoteAddress ||
          null,
        userAgent: req.headers["user-agent"] || null,
      });
    } catch (activityError) {
      console.error(
        "❌ Failed to create delete activity:",
        activityError.message,
      );
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the user",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE CURRENT USER
// ======================================================

const deleteCurrentUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await createNotification({
      userId: user._id,
      userName: user.name,
      email: user.email,
      title: "Account Deleted",
      message: "Your account has been successfully deleted.",
      type: "account_deleted",
    });

    try {
      await UserActivity.create({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        action: "user_deleted",
        description: `User ${user.name} deleted their account`,
        ipAddress:
          req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
          req.socket.remoteAddress ||
          null,
        userAgent: req.headers["user-agent"] || null,
      });
    } catch (activityError) {
      console.error(
        "❌ Failed to create account deletion activity:",
        activityError.message,
      );
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting account",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE STATISTICS
// ======================================================

const updateStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const statistics = req.body;

    const validFields = [
      "totalIncome",
      "totalExpenses",
      "totalSavings",
      "monthlyIncome",
      "monthlyExpenses",
      "monthlyBudget",
      "membersCount",
    ];

    const updateData = {};

    for (const field of validFields) {
      if (statistics[field] !== undefined) {
        if (typeof statistics[field] !== "number" || statistics[field] < 0) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a positive number`,
          });
        }

        updateData[`statistics.${field}`] = statistics[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid statistics fields provided",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password -emailVerificationCode");

    return res.status(200).json({
      success: true,
      message: "Statistics updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update statistics error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating statistics",
    });
  }
};

// ======================================================
// GET USER STATISTICS
// ======================================================

const getUserStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const unverifiedUsers = await User.countDocuments({
      isEmailVerified: false,
    });

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          role: "$_id",
          count: 1,
        },
      },
    ]);

    const newUsers = await User.countDocuments({
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    });

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      statistics: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        verifiedUsers,
        unverifiedUsers,
        newUsersLast30Days: newUsers,
        usersByRole,
      },
      recentUsers,
    });
  } catch (error) {
    console.error("GET USER STATISTICS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
      error: error.message,
    });
  }
};

// ======================================================
// BULK DELETE NOTIFICATIONS
// ======================================================

const bulkDeleteNotifications = async (req, res) => {
  try {
    const { ids } = req.body;

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
    console.error("BULK DELETE NOTIFICATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notifications",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ======================================================
// DELETE NOTIFICATION
// ======================================================

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
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

    await Notification.deleteOne({
      _id: notification._id,
    });

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: notification,
    });
  } catch (error) {
    console.error("DELETE NOTIFICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ======================================================
// MARK NOTIFICATION AS READ
// ======================================================

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
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
    console.error("MARK NOTIFICATION AS READ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ======================================================
// BULK MARK NOTIFICATIONS AS READ
// ======================================================

const bulkMarkNotificationsAsRead = async (req, res) => {
  try {
    const { ids } = req.body;

    const filter = {
      isRead: false,
    };

    if (Array.isArray(ids) && ids.length > 0) {
      const invalidIds = ids.filter(
        (id) => !mongoose.Types.ObjectId.isValid(id),
      );

      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: "One or more notification IDs are invalid",
          invalidIds,
        });
      }

      filter._id = {
        $in: ids,
      };
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
      message:
        Array.isArray(ids) && ids.length > 0
          ? "Selected notifications marked as read"
          : "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("BULK MARK NOTIFICATIONS AS READ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ======================================================
// EXPORT ALL CONTROLLERS
// ======================================================

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  resendVerificationCode,
  checkEmailVerification,
  forgotPassword,
  resetPassword,
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateCurrentUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
  deleteCurrentUser,
  updateStatistics,
  getUserStatistics,
  getAllNotifications,
  bulkMarkNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
  bulkDeleteNotifications,
  getNotificationsByEmail,
};