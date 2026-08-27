
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
    console.log(`✅ Email sent to ${to}: ${subject}`);
    return { success: true, info };
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
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

    // Also send email notification
    await sendEmail({
      to: email,
      subject: title,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">${title}</h1>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello ${userName},</p>
            <p style="font-size: 16px; margin-bottom: 20px;">${message}</p>
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
            <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
              This is an automated message from our system. Please do not reply to this email.
            </p>
          </div>
        </body>
        </html>
      `,
    });

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

    // ===========================
    // VALIDATE REQUIRED FIELDS
    // ===========================

    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ===========================
    // PASSWORD CONFIRMATION
    // ===========================

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        errors: {
          confirmPassword: "Passwords do not match",
        },
      });
    }

    // ===========================
    // PASSWORD LENGTH
    // ===========================

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        errors: {
          password: "Password must be at least 8 characters",
        },
      });
    }

    // ===========================
    // EMAIL VALIDATION
    // ===========================

    const emailValidation = validateEmail(email);

    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        errors: {
          email: emailValidation.message,
        },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.trim();

    // ===========================
    // CHECK EXISTING USER
    // ===========================

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
    });

    if (existingUser) {
      const errors = {};

      if (existingUser.email === normalizedEmail) {
        errors.email = "An account with this email already exists";
      }

      if (existingUser.phone === normalizedPhone) {
        errors.phone = "An account with this phone number already exists";
      }

      return res.status(409).json({
        success: false,
        errors,
      });
    }

    // ===========================
    // HASH PASSWORD
    // ===========================

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ===========================
    // GENERATE VERIFICATION CODE
    // ===========================

    const verificationCode = generateVerificationCode();

    // ===========================
    // CREATE USER
    // ===========================

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      isEmailVerified: false,
      isActive: true,
      emailVerificationCode: verificationCode,
      emailVerificationExpires: undefined,
    });

    console.log(`✅ User created: ${newUser.email}`);

    // ======================================================
    // ACCOUNT CREATED NOTIFICATION
    // ======================================================

    await createNotification({
      userId: newUser._id,
      userName: newUser.name,
      email: newUser.email,
      title: "Account Created",
      message: `Welcome ${newUser.name}! Your account has been created successfully.`,
      type: "user_created",
    });

    // ======================================================
    // VERIFICATION CODE NOTIFICATION
    // ======================================================

    await createNotification({
      userId: newUser._id,
      userName: newUser.name,
      email: newUser.email,
      title: "Email Verification Code",
      message: `Your email verification code is: <strong>${verificationCode}</strong>. Please use this code to verify your email address.`,
      type: "email_verification",
    });

    // ======================================================
    // USER ACTIVITY
    // ======================================================

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

    // ======================================================
    // GENERATE JWT
    // ======================================================

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

    // ======================================================
    // RESPONSE
    // ======================================================

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your notifications for your verification code.",
      requiresEmailVerification: true,
      emailSent: true,
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
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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

const bulkDeleteNotifications = async (req, res) => {
  try {
    const { ids } = req.body;

    // ============================================================
    // VALIDATE IDS
    // ============================================================

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of notification IDs",
      });
    }

    // ============================================================
    // VALIDATE MONGODB IDS
    // ============================================================

    const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));

    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more notification IDs are invalid",
        invalidIds,
      });
    }

    // ============================================================
    // DELETE SELECTED NOTIFICATIONS
    // ============================================================

    const result = await Notification.deleteMany({
      _id: { $in: ids },
    });

    // ============================================================
    // NOTHING DELETED
    // ============================================================

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
// VERIFY EMAIL
// ======================================================

const verifyEmail = async (req, res) => {
  try {
    let { email, code } = req.body;

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
    }).select("+emailVerificationCode +emailVerificationExpires");

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

    // ===========================
    // VERIFY USER
    // ===========================

    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    user.isActive = true;

    await user.save();

    // ======================================================
    // CREATE VERIFICATION SUCCESS NOTIFICATION
    // ======================================================

    await createNotification({
      userId: user._id,
      userName: user.name,
      email: user.email,
      title: "Email Verified",
      message:
        "Your email has been successfully verified. Your account is now active.",
      type: "email_verified",
    });

    // ======================================================
    // USER ACTIVITY
    // ======================================================

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

    // ===========================
    // VALIDATE EMAIL
    // ===========================

    const emailValidation = validateEmail(normalizedEmail);

    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.message,
      });
    }

    // ===========================
    // FIND USER
    // ===========================

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

    // ===========================
    // GENERATE NEW CODE
    // ===========================

    const verificationCode = generateVerificationCode();

    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    // ======================================================
    // CREATE NOTIFICATION
    // ======================================================

    await createNotification({
      userId: user._id,
      userName: user.name,
      email: user.email,
      title: "New Verification Code",
      message: `Your new email verification code is: <strong>${verificationCode}</strong>`,
      type: "email_verification",
    });

    return res.status(200).json({
      success: true,
      message: "New verification code created. Check your notifications.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating the verification code",
    });
  }
};


const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // ============================================================
    // VALIDATE ID
    // ============================================================

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    // ============================================================
    // FIND NOTIFICATION
    // ============================================================

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // ============================================================
    // MARK AS READ
    // ============================================================

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

const bulkMarkNotificationsAsRead = async (req, res) => {
  try {
    const { ids } = req.body;

    // ============================================================
    // BASE FILTER
    // ============================================================

    const filter = {
      isRead: false,
    };

    // ============================================================
    // IF IDS ARE PROVIDED
    // MARK ONLY SELECTED NOTIFICATIONS
    // ============================================================

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

    // ============================================================
    // MARK AS READ
    // ============================================================

    const result = await Notification.updateMany(filter, {
      $set: {
        isRead: true,
        status: "read",
        readAt: new Date(),
      },
    });

    // ============================================================
    // SUCCESS
    // ============================================================

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
// LOGIN
// ======================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ===========================
    // VALIDATE INPUT
    // ===========================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ===========================
    // FIND USER
    // ===========================

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ===========================
    // CHECK PASSWORD
    // ===========================

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ===========================
    // UPDATE LAST LOGIN
    // ===========================

    user.lastLogin = new Date();
    await user.save();

    // ======================================================
    // CREATE LOGIN ACTIVITY
    // ======================================================

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

    // ===========================
    // CREATE JWT
    // ===========================

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

    // ===========================
    // SAVE COOKIE
    // ===========================

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ===========================
    // RESPONSE
    // ===========================

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

    // ===========================
    // VALIDATE EMAIL
    // ===========================

    const emailValidation = validateEmail(normalizedEmail);

    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.message,
      });
    }

    // ===========================
    // FIND USER
    // ===========================

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

    // ===========================
    // GENERATE RESET TOKEN
    // ===========================

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET + user.password,
      { expiresIn: "1h" },
    );

    // ===========================
    // SAVE RESET TOKEN
    // ===========================

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    // ===========================
    // CREATE RESET CODE
    // ===========================

    const resetCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    // ======================================================
    // CREATE PASSWORD RESET NOTIFICATION
    // ======================================================

    await createNotification({
      userId: user._id,
      userName: user.name,
      email: user.email,
      title: "Password Reset Request",
      message: `Your password reset code is: <strong>${resetCode}</strong>. Your reset request is valid for 1 hour.`,
      type: "password_reset",
    });

    return res.status(200).json({
      success: true,
      message:
        "Password reset request created. Check your notifications for the reset code.",
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

    // ===========================
    // FIND USER
    // ===========================

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // ===========================
    // HASH NEW PASSWORD
    // ===========================

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // ===========================
    // UPDATE USER
    // ===========================

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // ======================================================
    // PASSWORD RESET SUCCESS NOTIFICATION
    // ======================================================

    await createNotification({
      userId: user._id,
      userName: user.name,
      email: user.email,
      title: "Password Reset Successful",
      message: "Your password has been successfully reset.",
      type: "password_reset_success",
    });

    // ======================================================
    // USER ACTIVITY
    // ======================================================

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

    // ======================================================
    // EMAIL CHANGE
    // ======================================================

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

      // ===========================
      // CHECK EMAIL
      // ===========================

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

      // ===========================
      // NEW VERIFICATION CODE
      // ===========================

      const verificationCode = generateVerificationCode();

      user.email = normalizedEmail;
      user.isEmailVerified = false;
      user.emailVerificationCode = verificationCode;
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

      // ======================================================
      // CREATE NOTIFICATION
      // ======================================================

      await createNotification({
        userId: user._id,
        userName: user.name,
        email: normalizedEmail,
        title: "Email Verification Required",
        message: `Your email address was changed. Your new verification code is: <strong>${verificationCode}</strong>`,
        type: "email_verification",
      });
    }

    // ===========================
    // UPDATE OTHER FIELDS
    // ===========================

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
          ? "Profile updated. Please verify your new email address from your notifications."
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

    // ===========================
    // EMAIL VALIDATION
    // ===========================

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

    // ===========================
    // UPDATE FIELDS
    // ===========================

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

    // ===========================
    // PROTECT MAIN ACCOUNT
    // ===========================

    if (user.email.toLowerCase() === protectedEmail) {
      return res.status(403).json({
        success: false,
        message: "This account cannot be deleted",
      });
    }

    // ===========================
    // CREATE ACTIVITY BEFORE DELETE
    // ===========================

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

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // ============================================================
    // VALIDATE ID
    // ============================================================

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    // ============================================================
    // FIND NOTIFICATION
    // ============================================================

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // ============================================================
    // DELETE
    // ============================================================

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

    // ======================================================
    // CREATE NOTIFICATION BEFORE DELETE
    // ======================================================

    await createNotification({
      userId: user._id,
      userName: user.name,
      email: user.email,
      title: "Account Deleted",
      message: "Your account has been successfully deleted.",
      type: "account_deleted",
    });

    // ======================================================
    // USER ACTIVITY
    // ======================================================

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

    // ===========================
    // USERS BY ROLE
    // ===========================

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

    // ===========================
    // NEW USERS LAST 30 DAYS
    // ===========================

    const newUsers = await User.countDocuments({
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    });

    // ===========================
    // RECENT USERS
    // ===========================

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
// EXPORT ALL CONTROLLERS
// ======================================================

module.exports = {
  // ===========================
  // Authentication
  // ===========================

  register,
  login,
  logout,
  verifyEmail,
  resendVerificationCode,
  checkEmailVerification,
  forgotPassword,
  resetPassword,

  // ===========================
  // User Management
  // ===========================

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
  bulkDeleteNotifications,

  // ===========================
  // Notifications
  // ===========================

  getAllNotifications,
  bulkMarkNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
  getNotificationsByEmail,
};
