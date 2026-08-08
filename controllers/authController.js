const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/User");
const UserActivity = require("../activity/UserActivity");

// ===========================
// EMAIL CONFIGURATION
// ===========================

const createTransporter = () => {
  const port =
    Number(process.env.SMTP_PORT) || 587;

  const transporter =
 transporter = nodemailer.createTransport({
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

  // ===========================
  // VERIFY SMTP CONNECTION
  // ===========================

  transporter.verify((error, success) => {
    if (error) {
      console.error(
        "❌ SMTP connection verification failed:",
        error.message
      );

      console.error(
        "SMTP Host:",
        process.env.SMTP_HOST ||
          "smtp.gmail.com"
      );

      console.error(
        "SMTP Port:",
        port
      );

      console.error(
        "SMTP User:",
        process.env.SMTP_USER
          ? "Configured"
          : "Missing"
      );
    } else {
      console.log(
        "✅ SMTP server is ready to send emails"
      );
    }
  });

  return transporter;
};


// ===========================
// EMAIL VALIDATION
// ===========================
const validateEmail = (email) => {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email format" };
  }

  // Check for common disposable email domains (optional)
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

  return { valid: true };
};

// ===========================
// EMAIL TEMPLATES
// ===========================
// const generateVerificationEmail = (user, verificationCode) => {
//   return {
//     subject: "Verify Your Email Address ✅",
//     html: `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <style>
//             body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4; }
//             .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//             .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
//             .verification-code {
//               background: #f0f0f0;
//               padding: 20px;
//               border-radius: 8px;
//               font-size: 32px;
//               font-weight: bold;
//               text-align: center;
//               letter-spacing: 8px;
//               color: #667eea;
//               margin: 20px 0;
//               font-family: monospace;
//             }
//             .btn {
//               display: inline-block;
//               padding: 14px 35px;
//               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//               color: white;
//               text-decoration: none;
//               border-radius: 5px;
//               margin: 20px 0;
//               font-weight: bold;
//             }
//             .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
//             .warning { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>Verify Your Email Address</h1>
//             </div>
//             <div class="content">
//               <h2>Hello ${user.name}! 👋</h2>
//               <p>Thank you for creating an account with us. To complete your registration, please verify your email address using the code below:</p>

//               <div class="verification-code">
//                 ${verificationCode}
//               </div>

//               <p style="text-align: center;">Enter this code on the verification page to confirm your email.</p>

//               <div class="warning">
//                 <strong>⚠️ Important:</strong> This verification code will expire in <strong>24 hours</strong>.
//               </div>

//               <p>If you didn't create an account with us, please ignore this email.</p>

//               <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

//               <p style="font-size: 14px; color: #666;">
//                 <strong>Account Details:</strong><br>
//                 Email: ${user.email}<br>
//                 Created: ${new Date(user.createdAt).toLocaleString()}
//               </p>

//               <p>Best regards,<br><strong>The Team</strong></p>
//             </div>
//             <div class="footer">
//               <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
//               <p>This is an automated message, please do not reply to this email.</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `,
//     text: `
//       Verify Your Email Address ✅

//       Hello ${user.name}! 👋

//       Thank you for creating an account with us. To complete your registration, please verify your email address using the code below:

//       Verification Code: ${verificationCode}

//       Enter this code on the verification page to confirm your email.

//       ⚠️ Important: This verification code will expire in 24 hours.

//       If you didn't create an account with us, please ignore this email.

//       Account Details:
//       Email: ${user.email}
//       Created: ${new Date(user.createdAt).toLocaleString()}

//       Best regards,
//       The Team
//     `,
//   };
// };

const generateVerificationEmail = (user, verificationCode) => {
  const verificationUrl =
    "https://inyumba-studentportal.vercel.app/verification/email/status";

  return {
    subject: "Verify Your Email Address ✅",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f4f4f4;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }

    .content {
      background: white;
      padding: 30px;
      border-radius: 0 0 10px 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .verification-code {
      background: #f0f0f0;
      padding: 20px;
      border-radius: 8px;
      font-size: 32px;
      font-weight: bold;
      text-align: center;
      letter-spacing: 8px;
      color: #667eea;
      margin: 20px 0;
      font-family: monospace;
    }

    .btn {
      display: inline-block;
      padding: 14px 35px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }

    .footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 12px;
    }

    .warning {
      background: #fff3cd;
      padding: 15px;
      border-radius: 5px;
      border-left: 4px solid #ffc107;
      margin: 20px 0;
    }
  </style>
</head>

<body>

<div class="container">

  <div class="header">
    <h1>Verify Your Email Address</h1>
  </div>

  <div class="content">

    <p>Hello <strong>${user.name}</strong>! 👋</p>

    <p>
      Thank you for creating an account with us.
      To complete your registration, please verify your email address using the code below:
    </p>

    <div class="verification-code">
      ${verificationCode}
    </div>

    <p style="text-align:center;">
      Enter this verification code on the verification page.
    </p>

    <div style="text-align:center;">
      <a href="${verificationUrl}" class="btn">
        Verify Email
      </a>
    </div>

    <div class="warning">
      <strong>ℹ️ Note:</strong><br>
      Click the button above to open the verification page, then enter the verification code shown in this email.
    </div>

    <p>
      Verification Page:<br>
      <a href="${verificationUrl}">
        ${verificationUrl}
      </a>
    </p>

    <p>
      If you didn't create an account with us, please ignore this email.
    </p>

    <hr style="margin:30px 0;border:none;border-top:1px solid #eee;">

    <p style="font-size:14px;color:#666;">
      <strong>Account Details:</strong><br>
      Email: ${user.email}<br>
      Created: ${new Date(user.createdAt).toLocaleString()}
    </p>

    <p>
      Best regards,<br>
      <strong>The Team</strong>
    </p>

  </div>

  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
    <p>This is an automated message, please do not reply to this email.</p>
  </div>

</div>

</body>
</html>
`,
    text: `
Verify Your Email Address ✅

Hello ${user.name}! 👋

Thank you for creating an account with us.

Your verification code is:

${verificationCode}

Open the verification page below and enter the code:

${verificationUrl}

Account Details:
Email: ${user.email}
Created: ${new Date(user.createdAt).toLocaleString()}

If you didn't create this account, please ignore this email.

Best regards,
The Team
`,
  };
};

const generateWelcomeEmail = (user) => {
  return {
    subject: "Welcome to Our Platform! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome Aboard! 🎉</h1>
            </div>
            <div class="content">
              <h2>Hello ${user.name}!</h2>
              <p>Your email has been successfully verified and your account is now active!</p>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3>Account Details:</h3>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Account Type:</strong> ${user.role}</p>
                <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
              </div>
              
              <p>You now have full access to all features of our platform.</p>
              
              <p>If you have any questions, feel free to contact our support team.</p>
              <p>Best regards,<br><strong>The Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome Aboard! 🎉
      
      Hello ${user.name}!
      
      Your email has been successfully verified and your account is now active!
      
      Account Details:
      Name: ${user.name}
      Email: ${user.email}
      Phone: ${user.phone}
      Account Type: ${user.role}
      Joined: ${new Date(user.createdAt).toLocaleString()}
      
      You now have full access to all features of our platform.
      
      Best regards,
      The Team
    `,
  };
};

// ===========================
// SEND EMAIL FUNCTION
// ===========================
const sendEmail = async (to, subject, html, text) => {
  try {
    // Validate email before sending
    const emailValidation = validateEmail(to);
    if (!emailValidation.valid) {
      throw new Error(`Invalid email: ${emailValidation.message}`);
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"INYUMBA" <${process.env.EMAIL_FROM || "noreply@yourplatform.com"}>`,
      to,
      subject,
      html,
      text:
        text ||
        html
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim(),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);

    // If using ethereal, log the preview URL
    if (process.env.NODE_ENV !== "production" && info.messageId) {
      console.log(`📧 Email preview: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

// ===========================
// GENERATE VERIFICATION CODE
// ===========================
const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

// ===========================
// REGISTER - Create User with Email Verification
// ===========================


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
//     // EMAIL VALIDATION
//     // ===========================

//     const emailValidation = validateEmail(email);

//     if (!emailValidation.valid) {
//       return res.status(400).json({
//         success: false,
//         errors: {
//           email: emailValidation.message,
//         },
//       });
//     }

//     const normalizedEmail = email.toLowerCase().trim();

//     // ===========================
//     // CHECK EXISTING USER
//     // ===========================

//     const existingUser = await User.findOne({
//       $or: [{ email: normalizedEmail }, { phone: phone.trim() }],
//     });

//     if (existingUser) {
//       const errors = {};

//       if (existingUser.email === normalizedEmail) {
//         errors.email = "An account with this email already exists";
//       }

//       if (existingUser.phone === phone.trim()) {
//         errors.phone = "An account with this phone number already exists";
//       }

//       return res.status(409).json({
//         success: false,
//         errors,
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
//       phone: phone.trim(),
//       password: hashedPassword,

//       isEmailVerified: false,
//       isActive: true,

//       emailVerificationCode: verificationCode,

//       // No expiration date
//       emailVerificationExpires: undefined,
//     });

//     // ===========================
//     // SEND VERIFICATION EMAIL
//     // ===========================

//     let emailSent = true;

//     try {
//       const emailData = generateVerificationEmail(newUser, verificationCode);

//       await sendEmail(
//         newUser.email,
//         emailData.subject,
//         emailData.html,
//         emailData.text,
//       );

//       console.log(`✅ Verification email sent to ${newUser.email}`);
//     } catch (emailError) {
//       emailSent = false;

//       console.error("❌ Email sending failed:", emailError.message);
//     }

//     // ===========================
//     // GENERATE JWT
//     // ===========================

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

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(201).json({
//       success: true,
//       message: emailSent
//         ? "Registration successful. Please check your email to verify your account."
//         : "Registration successful, but the verification email could not be sent. You can request another verification email later.",
//       requiresEmailVerification: true,
//       emailSent,
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
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

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

    // ===========================
    // CHECK EXISTING USER
    // ===========================

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: phone.trim() },
      ],
    });

    if (existingUser) {
      const errors = {};

      if (existingUser.email === normalizedEmail) {
        errors.email = "An account with this email already exists";
      }

      if (existingUser.phone === phone.trim()) {
        errors.phone =
          "An account with this phone number already exists";
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
      phone: phone.trim(),
      password: hashedPassword,

      isEmailVerified: false,
      isActive: true,

      emailVerificationCode: verificationCode,

      // No expiration date
      emailVerificationExpires: undefined,
    });

    // ===========================
    // CREATE USER ACTIVITY
    // ===========================

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
      // Activity failure should NOT prevent successful registration
      console.error(
        "❌ Failed to create user activity:",
        activityError.message
      );
    }

    // ===========================
    // SEND VERIFICATION EMAIL
    // ===========================

    let emailSent = true;

    try {
      const emailData = generateVerificationEmail(
        newUser,
        verificationCode
      );

      await sendEmail(
        newUser.email,
        emailData.subject,
        emailData.html,
        emailData.text
      );

      console.log(`✅ Verification email sent to ${newUser.email}`);
    } catch (emailError) {
      emailSent = false;

      console.error(
        "❌ Email sending failed:",
        emailError.message
      );
    }

    // ===========================
    // GENERATE JWT
    // ===========================

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(201).json({
      success: true,

      message: emailSent
        ? "Registration successful. Please check your email to verify your account."
        : "Registration successful, but the verification email could not be sent. You can request another verification email later.",

      requiresEmailVerification: true,
      emailSent,
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
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// ===========================
// VERIFY EMAIL - Using Code
// ===========================
// const verifyEmail = async (req, res) => {
//   try {
//     const { email, code } = req.body;

//     if (!email || !code) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and verification code are required",
//       });
//     }

//     // Find user with matching email and verification code
//     const user = await User.findOne({
//       email,
//       emailVerificationCode: code,
//       emailVerificationExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired verification code",
//       });
//     }

//     if (user.isEmailVerified) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already verified",
//       });
//     }

//     // Mark email as verified
//     user.isEmailVerified = true;
//     user.emailVerificationCode = undefined;
//     user.emailVerificationExpires = undefined;
//     user.isActive = true; // Activate account
//     await user.save();

//     // Send welcome email
//     const welcomeEmail = generateWelcomeEmail(user);
//     await sendEmail(
//       user.email,
//       welcomeEmail.subject,
//       welcomeEmail.html,
//       welcomeEmail.text,
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Email verified successfully! Welcome aboard! 🎉",
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

    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    user.isActive = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===========================
// RESEND VERIFICATION CODE
// ===========================
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.message,
      });
    }

    const user = await User.findOne({ email });
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

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send new verification email
    const emailData = generateVerificationEmail(user, verificationCode);
    await sendEmail(
      user.email,
      emailData.subject,
      emailData.html,
      emailData.text,
    );

    return res.status(200).json({
      success: true,
      message: "New verification code sent to your email",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resending verification code",
    });
  }
};

// ===========================
// CHECK EMAIL VERIFICATION STATUS
// ===========================
const checkEmailVerification = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
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

// ===========================
// LOGIN - With Email Verification Check
// ===========================
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
    // FIND USER WITH PASSWORD
    // ===========================

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

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

    // ===========================
    // CREATE JWT TOKEN
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

// ===========================
// LOGOUT
// ===========================
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

// ===========================
// FORGOT PASSWORD
// ===========================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.message,
      });
    }

    const user = await User.findOne({ email });
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

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET + user.password,
      { expiresIn: "1h" },
    );

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email with code
    const resetCode = crypto.randomBytes(4).toString("hex").toUpperCase();
    const resetHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4; }
            .header { background: #f44336; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .reset-code {
              background: #f0f0f0;
              padding: 20px;
              border-radius: 8px;
              font-size: 28px;
              font-weight: bold;
              text-align: center;
              letter-spacing: 6px;
              color: #f44336;
              margin: 20px 0;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <p>Hello ${user.name},</p>
              <p>We received a request to reset your password. Use the code below to reset it:</p>
              <div class="reset-code">${resetCode}</div>
              <p>This code will expire in <strong>1 hour</strong>.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <p>Best regards,<br><strong>The Team</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail(user.email, "Password Reset Request", resetHtml);

    return res.status(200).json({
      success: true,
      message: "Password reset code sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset email",
    });
  }
};

// ===========================
// RESET PASSWORD
// ===========================
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

    // Find user with valid reset token
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

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send confirmation email
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4; }
            .header { background: #4CAF50; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Successful</h1>
            </div>
            <div class="content">
              <p>Hello ${user.name},</p>
              <p>Your password has been successfully reset.</p>
              <p>If you didn't perform this action, please contact our support team immediately.</p>
              <p>Best regards,<br><strong>The Team</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail(user.email, "Password Reset Successful", confirmationHtml);

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

// ===========================
// GET CURRENT USER
// ===========================
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



// ===========================
// GET USER BY EMAIL
// GET /users/:email
// ===========================
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
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};



// ===========================
// UPDATE CURRENT USER
// ===========================
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

    // If email is being changed, validate it
    if (email && email !== user.email) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return res.status(400).json({
          success: false,
          message: emailValidation.message,
        });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already in use by another account",
        });
      }

      // If email changed, require re-verification
      const verificationCode = generateVerificationCode();
      user.email = email;
      user.isEmailVerified = false;
      user.emailVerificationCode = verificationCode;
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

      // Send new verification email
      const emailData = generateVerificationEmail(user, verificationCode);
      await sendEmail(
        user.email,
        emailData.subject,
        emailData.html,
        emailData.text,
      );
    }

    // Update other fields
    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (statistics) {
      user.statistics = { ...user.statistics, ...statistics };
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

// ===========================
// GET ALL USERS
// ===========================
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

// ===========================
// GET SINGLE USER
// ===========================
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

// ===========================
// UPDATE USER (Admin)
// ===========================
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

    // If email is being changed, validate it
    if (email && email !== user.email) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return res.status(400).json({
          success: false,
          message: emailValidation.message,
        });
      }

      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already in use by another account",
        });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;
    if (role) user.role = role;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (statistics) {
      user.statistics = { ...user.statistics, ...statistics };
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

// ===========================
// DELETE USER (Admin)
// ===========================
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

// ===========================
// DELETE CURRENT USER
// ===========================
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

    await User.findByIdAndDelete(id);

    // Send deletion confirmation email
    const deletionHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
            }

            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: #f4f4f4;
            }

            .header {
              background: #f44336;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }

            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
          </style>
        </head>

        <body>
          <div class="container">

            <div class="header">
              <h1>Account Deleted</h1>
            </div>

            <div class="content">

              <p>Hello ${user.name},</p>

              <p>
                Your account has been successfully deleted.
              </p>

              <p>
                If you did not request this deletion,
                please contact our support team immediately.
              </p>

              <p>
                We hope to see you again in the future!
              </p>

              <p>
                Best regards,<br>
                <strong>The Team</strong>
              </p>

            </div>

          </div>
        </body>
      </html>
    `;

    try {
      await sendEmail(user.email, "Account Deleted", deletionHtml);
    } catch (emailError) {
      console.error("Deletion email error:", emailError.message);
    }

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

// ===========================
// UPDATE STATISTICS
// ===========================
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

const getUserStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({
      isActive: true,
    });

    const inactiveUsers = await User.countDocuments({
      isActive: false,
    });

    const verifiedUsers = await User.countDocuments({
      isEmailVerified: true,
    });

    const unverifiedUsers = await User.countDocuments({
      isEmailVerified: false,
    });

    // Users grouped by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: {
            $sum: 1,
          },
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

    // New users created in last 30 days
    const newUsers = await User.countDocuments({
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Latest registered users
    const recentUsers = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      })
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

// ===========================
// EXPORT ALL CONTROLLERS
// ===========================
module.exports = {
  // Authentication
  register,
  login,
  logout,
  verifyEmail,
  resendVerificationCode,
  checkEmailVerification,
  forgotPassword,
  resetPassword,

  // User Management
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
};
