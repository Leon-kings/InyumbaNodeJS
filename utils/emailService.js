// const nodemailer = require('nodemailer');
// require('dotenv').config();

// // Create reusable transporter
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST || 'smtp.gmail.com',
//     port: parseInt(process.env.SMTP_PORT) || 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//     tls: {
//       rejectUnauthorized: false
//     }
//   });
// };

// // Send email function
// const sendEmail = async ({
//   to,
//   subject,
//   html,
//   text = null,
//   from = process.env.EMAIL_FROM || process.env.SMTP_USER,
// }) => {
//   try {
//     const transporter = createTransporter();
    
//     const mailOptions = {
//       from: from,
//       to: to,
//       subject: subject,
//       html: html,
//     };

//     if (text) {
//       mailOptions.text = text;
//     }

//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ Email sent to ${to}: ${info.messageId}`);
//     return { success: true, messageId: info.messageId };
//   } catch (error) {
//     console.error(`❌ Failed to send email to ${to}:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // Generate email templates
// const emailTemplates = {
//   // Welcome email template
//   welcome: (name, verificationCode) => {
//     const verifyLink = `${process.env.FRONTEND_URL}/verification/email/status?email=${encodeURIComponent(process.env.ADMIN_EMAIL)}&code=${verificationCode}`;
    
//     return {
//       subject: 'Welcome to Inyumba Student Portal!',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Welcome</title>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: #4A90E2; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
//             .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
//             .code { background: #e8f0fe; padding: 15px; font-size: 24px; text-align: center; border-radius: 5px; margin: 20px 0; font-weight: bold; letter-spacing: 5px; }
//             .button { display: inline-block; background: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
//             .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>Welcome to Inyumba Student Portal!</h1>
//           </div>
//           <div class="content">
//             <h2>Hello ${name}!</h2>
//             <p>Thank you for registering with the Inyumba Student Portal. We're excited to have you on board!</p>
//             <p>To complete your registration, please verify your email address using the code below:</p>
//             <div class="code">${verificationCode}</div>
//             <p>Or click the button below to verify your email:</p>
//             <div style="text-align: center;">
//               <a href="${verifyLink}" class="button">Verify Email Address</a>
//             </div>
//             <p><strong>Note:</strong> You can continue using the platform without verifying your email. However, some features may be limited until you verify.</p>
//             <p>If you did not create an account, please ignore this email.</p>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
//           </div>
//         </body>
//         </html>
//       `
//     };
//   },

//   // Verification code email template
//   verificationCode: (name, verificationCode) => {
//     const verifyLink = `${process.env.FRONTEND_URL}/verification/email/status?email=${encodeURIComponent(process.env.ADMIN_EMAIL)}&code=${verificationCode}`;
    
//     return {
//       subject: 'Email Verification Code - Inyumba Student Portal',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Verification Code</title>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: #4A90E2; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
//             .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
//             .code { background: #e8f0fe; padding: 15px; font-size: 24px; text-align: center; border-radius: 5px; margin: 20px 0; font-weight: bold; letter-spacing: 5px; }
//             .button { display: inline-block; background: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
//             .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>Email Verification</h1>
//           </div>
//           <div class="content">
//             <h2>Hello ${name}!</h2>
//             <p>Your email verification code is:</p>
//             <div class="code">${verificationCode}</div>
//             <p>Or click the button below to verify your email:</p>
//             <div style="text-align: center;">
//               <a href="${verifyLink}" class="button">Verify Email Address</a>
//             </div>
//             <p>This code will not expire, but you can request a new one at any time.</p>
//             <p>If you didn't request this, please ignore this email.</p>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
//           </div>
//         </body>
//         </html>
//       `
//     };
//   },

//   // Password reset email template
//   passwordReset: (name, resetCode, resetToken) => {
//     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
//     return {
//       subject: 'Password Reset Request - Inyumba Student Portal',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Password Reset</title>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
//             .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
//             .code { background: #fde8e8; padding: 15px; font-size: 24px; text-align: center; border-radius: 5px; margin: 20px 0; font-weight: bold; letter-spacing: 5px; }
//             .button { display: inline-block; background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
//             .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>Password Reset Request</h1>
//           </div>
//           <div class="content">
//             <h2>Hello ${name}!</h2>
//             <p>We received a request to reset your password. Use the code below or click the button to reset your password:</p>
//             <div class="code">${resetCode}</div>
//             <div style="text-align: center;">
//               <a href="${resetLink}" class="button">Reset Password</a>
//             </div>
//             <p>This reset link will expire in 1 hour.</p>
//             <p>If you did not request a password reset, please ignore this email.</p>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
//           </div>
//         </body>
//         </html>
//       `
//     };
//   },

//   // Password reset success email template
//   passwordResetSuccess: (name) => {
//     return {
//       subject: 'Password Reset Successful - Inyumba Student Portal',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Password Reset Successful</title>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: #27ae60; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
//             .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
//             .button { display: inline-block; background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
//             .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>Password Reset Successful</h1>
//           </div>
//           <div class="content">
//             <h2>Hello ${name}!</h2>
//             <p>Your password has been successfully reset.</p>
//             <p>You can now log in to your account with your new password.</p>
//             <div style="text-align: center;">
//               <a href="${process.env.FRONTEND_URL}/login" class="button">Login Now</a>
//             </div>
//             <p>If you did not perform this action, please contact support immediately.</p>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
//           </div>
//         </body>
//         </html>
//       `
//     };
//   },

//   // Email verified success email template
//   emailVerified: (name) => {
//     return {
//       subject: 'Email Verified - Inyumba Student Portal',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Email Verified</title>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: #27ae60; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
//             .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
//             .button { display: inline-block; background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
//             .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>Email Verified Successfully!</h1>
//           </div>
//           <div class="content">
//             <h2>Hello ${name}!</h2>
//             <p>Your email has been successfully verified. Your account is now fully active.</p>
//             <p>You now have access to all features of the Inyumba Student Portal.</p>
//             <div style="text-align: center;">
//               <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
//             </div>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
//           </div>
//         </body>
//         </html>
//       `
//     };
//   },

//   // Account deleted email template
//   accountDeleted: (name) => {
//     return {
//       subject: 'Account Deleted - Inyumba Student Portal',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Account Deleted</title>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
//             .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
//             .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>Account Deleted</h1>
//           </div>
//           <div class="content">
//             <h2>Goodbye ${name}!</h2>
//             <p>Your account has been successfully deleted from the Inyumba Student Portal.</p>
//             <p>We're sad to see you go. If you ever change your mind, you're always welcome to create a new account.</p>
//             <p>If you did not request this deletion, please contact support immediately.</p>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
//           </div>
//         </body>
//         </html>
//       `
//     };
//   }
// };

// module.exports = {
//   sendEmail,
//   emailTemplates,
// };










const nodemailer = require('nodemailer');
require('dotenv').config();

// ============================================================
// CREATE REUSABLE TRANSPORTER
// ============================================================
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false, // true for 465, false for other ports

    // Force IPv4 connection
    family: 4,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },

    tls: {
      rejectUnauthorized: false,
    },

    // SMTP connection timeouts
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
};

// ============================================================
// CHECK SMTP CONNECTION
// ============================================================
const checkEmailConnection = async () => {
  try {
    const transporter = createTransporter();

    await transporter.verify();

    console.log('✅ Email service connected successfully');
    console.log(
      `📧 SMTP: ${process.env.SMTP_HOST || 'smtp.gmail.com'}:${
        process.env.SMTP_PORT || 587
      }`
    );

    return {
      connected: true,
      transporter,
    };
  } catch (error) {
    console.error(
      '❌ Email service connection failed:',
      error.message
    );

    return {
      connected: false,
      transporter: null,
      error: error.message,
    };
  }
};

// ============================================================
// SEND EMAIL FUNCTION
// ============================================================
const sendEmail = async ({
  to,
  subject,
  html,
  text = null,
  from = process.env.EMAIL_FROM || process.env.SMTP_USER,
}) => {
  try {
    // Check SMTP connection before sending
    const {
      connected,
      transporter,
      error,
    } = await checkEmailConnection();

    // Do not attempt to send if SMTP is unavailable
    if (!connected || !transporter) {
      console.warn(
        `⚠️ Email not sent to ${to}: SMTP service is not connected`
      );

      return {
        success: false,
        connected: false,
        error: error || 'Email service is not connected',
      };
    }

    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: html,
    };

    if (text) {
      mailOptions.text = text;
    }

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${to}: ${info.messageId}`);

    return {
      success: true,
      connected: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(
      `❌ Failed to send email to ${to}:`,
      error.message
    );

    return {
      success: false,
      connected: false,
      error: error.message,
    };
  }
};


// ============================================================
// GENERATE EMAIL TEMPLATES
// ============================================================
const emailTemplates = {
  // Welcome email template
  welcome: (name, verificationCode) => {
    const verifyLink = `${process.env.FRONTEND_URL}/verification/email/status?email=${encodeURIComponent(process.env.ADMIN_EMAIL)}&code=${verificationCode}`;

    return {
      subject: 'Welcome to Inyumba Student Portal!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4A90E2; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .code { background: #e8f0fe; padding: 15px; font-size: 24px; text-align: center; border-radius: 5px; margin: 20px 0; font-weight: bold; letter-spacing: 5px; }
            .button { display: inline-block; background: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to Inyumba Student Portal!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for registering with the Inyumba Student Portal. We're excited to have you on board!</p>
            <p>To complete your registration, please verify your email address using the code below:</p>
            <div class="code">${verificationCode}</div>
            <p>Or click the button below to verify your email:</p>
            <div style="text-align: center;">
              <a href="${verifyLink}" class="button">Verify Email Address</a>
            </div>
            <p><strong>Note:</strong> You can continue using the platform without verifying your email. However, some features may be limited until you verify.</p>
            <p>If you did not create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };
  },

  // Verification code email template
  verificationCode: (name, verificationCode) => {
    const verifyLink = `${process.env.FRONTEND_URL}/verification/email/status?email=${encodeURIComponent(process.env.ADMIN_EMAIL)}&code=${verificationCode}`;

    return {
      subject: 'Email Verification Code - Inyumba Student Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4A90E2; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .code { background: #e8f0fe; padding: 15px; font-size: 24px; text-align: center; border-radius: 5px; margin: 20px 0; font-weight: bold; letter-spacing: 5px; }
            .button { display: inline-block; background: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Your email verification code is:</p>
            <div class="code">${verificationCode}</div>
            <p>Or click the button below to verify your email:</p>
            <div style="text-align: center;">
              <a href="${verifyLink}" class="button">Verify Email Address</a>
            </div>
            <p>This code will not expire, but you can request a new one at any time.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };
  },

  // Password reset email template
  passwordReset: (name, resetCode, resetToken) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    return {
      subject: 'Password Reset Request - Inyumba Student Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .code { background: #fde8e8; padding: 15px; font-size: 24px; text-align: center; border-radius: 5px; margin: 20px 0; font-weight: bold; letter-spacing: 5px; }
            .button { display: inline-block; background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>We received a request to reset your password. Use the code below or click the button to reset your password:</p>
            <div class="code">${resetCode}</div>
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <p>This reset link will expire in 1 hour.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };
  },

  // Password reset success email template
  passwordResetSuccess: (name) => {
    return {
      subject: 'Password Reset Successful - Inyumba Student Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Successful</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #27ae60; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Password Reset Successful</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Your password has been successfully reset.</p>
            <p>You can now log in to your account with your new password.</p>
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/login" class="button">Login Now</a>
            </div>
            <p>If you did not perform this action, please contact support immediately.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };
  },

  // Email verified success email template
  emailVerified: (name) => {
    return {
      subject: 'Email Verified - Inyumba Student Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verified</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #27ae60; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Email Verified Successfully!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Your email has been successfully verified. Your account is now fully active.</p>
            <p>You now have access to all features of the Inyumba Student Portal.</p>
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };
  },

  // Account deleted email template
  accountDeleted: (name) => {
    return {
      subject: 'Account Deleted - Inyumba Student Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Deleted</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Account Deleted</h1>
          </div>
          <div class="content">
            <h2>Goodbye ${name}!</h2>
            <p>Your account has been successfully deleted from the Inyumba Student Portal.</p>
            <p>We're sad to see you go. If you ever change your mind, you're always welcome to create a new account.</p>
            <p>If you did not request this deletion, please contact support immediately.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };
  }
};

module.exports = {
  sendEmail,
  emailTemplates,
  createTransporter,
  checkEmailConnection,
};