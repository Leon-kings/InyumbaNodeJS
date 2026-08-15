const nodemailer = require('nodemailer');
require('dotenv').config();

// ============================================================
// EMAIL TRANSPORTER
// ============================================================

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
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
  cc = null,
  bcc = null,
  attachments = null,
}) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: html,
    };

    if (text) {
      mailOptions.text = text;
    }

    if (cc) {
      mailOptions.cc = cc;
    }

    if (bcc) {
      mailOptions.bcc = bcc;
    }

    if (attachments) {
      mailOptions.attachments = attachments;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { 
      success: true, 
      messageId: info.messageId,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to send email'
    };
  }
};

// ============================================================
// TEST EMAIL CONNECTION
// ============================================================

const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server connection verified');
    return { success: true, message: 'Email connection successful' };
  } catch (error) {
    console.error('❌ Email connection failed:', error.message);
    return { success: false, error: error.message };
  }
};

// ============================================================
// EMAIL TEMPLATES
// ============================================================

const emailTemplates = {
  // ============================================================
  // AUTHENTICATION TEMPLATES
  // ============================================================

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
  },

  // ============================================================
  // BOOKING EMAIL TEMPLATES
  // ============================================================

  // Booking confirmation for tenant
  bookingConfirmation: (booking) => {
    const viewBookingLink = `${process.env.FRONTEND_URL}/bookings/${booking.bookingId}`;
    
    return {
      subject: `Booking Confirmation #${booking.bookingId} - Inyumba Student Portal`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #27ae60; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ddd; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #555; }
            .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; }
            .status-pending { background: #f39c12; color: white; }
            .status-confirmed { background: #27ae60; color: white; }
            .status-cancelled { background: #e74c3c; color: white; }
            .button { display: inline-block; background: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Booking Confirmation</h1>
          </div>
          <div class="content">
            <h2>Hello ${booking.fullName}!</h2>
            <p>Your booking has been created successfully. Here are your booking details:</p>
            
            <div class="booking-details">
              <div class="detail-row">
                <span class="label">Booking ID:</span>
                <span>${booking.bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="label">House:</span>
                <span>${booking.houseName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Location:</span>
                <span>${booking.district}, ${booking.sector}</span>
              </div>
              <div class="detail-row">
                <span class="label">Check-in:</span>
                <span>${new Date(booking.checkIn).toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="label">Check-out:</span>
                <span>${new Date(booking.checkOut).toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration:</span>
                <span>${booking.months} month${booking.months > 1 ? 's' : ''}</span>
              </div>
              <div class="detail-row">
                <span class="label">Guests:</span>
                <span>${booking.guests}</span>
              </div>
              <div class="detail-row">
                <span class="label">Total Amount:</span>
                <span><strong>$${booking.totalAmount.toFixed(2)}</strong></span>
              </div>
              <div class="detail-row">
                <span class="label">Payment Status:</span>
                <span>
                  <span class="status-badge status-${booking.paymentStatus}">
                    ${booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                  </span>
                </span>
              </div>
              <div class="detail-row">
                <span class="label">Booking Status:</span>
                <span>
                  <span class="status-badge status-${booking.status}">
                    ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </span>
              </div>
            </div>

            <p>You can view and manage your booking by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${viewBookingLink}" class="button">View Booking</a>
            </div>
            <p>If you have any questions, please contact the landlord directly:</p>
            <p><strong>Landlord:</strong> ${booking.ownerName}</p>
            <p><strong>Contact:</strong> ${booking.ownerContact}</p>
            <p><strong>Email:</strong> ${booking.ownerEmail}</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };
  },

  // Booking notification for landlord
  bookingNotificationForLandlord: (booking) => {
    const viewBookingLink = `${process.env.FRONTEND_URL}/landlord/bookings/${booking.bookingId}`;
    
    return {
      subject: `New Booking Request #${booking.bookingId} - Inyumba Student Portal`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Booking Request</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f39c12; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ddd; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #555; }
            .button { display: inline-block; background: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>New Booking Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${booking.ownerName}!</h2>
            <p>You have received a new booking request for your property. Here are the details:</p>
            
            <div class="booking-details">
              <div class="detail-row">
                <span class="label">Booking ID:</span>
                <span>${booking.bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="label">Property:</span>
                <span>${booking.houseName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Location:</span>
                <span>${booking.district}, ${booking.sector}</span>
              </div>
              <div class="detail-row">
                <span class="label">Tenant:</span>
                <span>${booking.fullName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Tenant Email:</span>
                <span>${booking.email}</span>
              </div>
              <div class="detail-row">
                <span class="label">Tenant Phone:</span>
                <span>${booking.phone}</span>
              </div>
              <div class="detail-row">
                <span class="label">Check-in:</span>
                <span>${new Date(booking.checkIn).toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="label">Check-out:</span>
                <span>${new Date(booking.checkOut).toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration:</span>
                <span>${booking.months} month${booking.months > 1 ? 's' : ''}</span>
              </div>
              <div class="detail-row">
                <span class="label">Guests:</span>
                <span>${booking.guests}</span>
              </div>
              <div class="detail-row">
                <span class="label">Total Amount:</span>
                <span><strong>$${booking.totalAmount.toFixed(2)}</strong></span>
              </div>
              ${booking.momoNumber ? `
              <div class="detail-row">
                <span class="label">MoMo Number:</span>
                <span>${booking.momoNumber}</span>
              </div>
              ` : ''}
            </div>

            <p>Please review the booking request and confirm or cancel it:</p>
            <div style="text-align: center;">
              <a href="${viewBookingLink}" class="button">Manage Booking</a>
            </div>
            <p>Contact the tenant if you have any questions:</p>
            <p><strong>Tenant:</strong> ${booking.fullName}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };
  },

  // Booking status update for tenant
  bookingStatusUpdate: (booking, statusMessage) => {
    const viewBookingLink = `${process.env.FRONTEND_URL}/bookings/${booking.bookingId}`;
    const statusColors = {
      'confirmed': '#27ae60',
      'pending': '#f39c12',
      'cancelled': '#e74c3c',
      'completed': '#3498db'
    };
    const color = statusColors[booking.status] || '#333';
    
    return {
      subject: `Booking ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} #${booking.bookingId} - Inyumba Student Portal`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${color}; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; background: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Booking Status Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${booking.fullName}!</h2>
            <p>Your booking #${booking.bookingId} has been <strong>${booking.status}</strong>.</p>
            ${statusMessage ? `<p><strong>Message from landlord:</strong> ${statusMessage}</p>` : ''}
            
            <p>Here's a summary of your booking:</p>
            <ul>
              <li><strong>Property:</strong> ${booking.houseName}</li>
              <li><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</li>
              <li><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</li>
              <li><strong>Total:</strong> $${booking.totalAmount.toFixed(2)}</li>
              <li><strong>Status:</strong> ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</li>
            </ul>

            <div style="text-align: center;">
              <a href="${viewBookingLink}" class="button">View Booking Details</a>
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

  // Payment verification notification for tenant
  paymentVerification: (booking) => {
    const viewBookingLink = `${process.env.FRONTEND_URL}/bookings/${booking.bookingId}`;
    
    return {
      subject: `Payment Verified #${booking.bookingId} - Inyumba Student Portal`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Verified</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #27ae60; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; background: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Payment Verified!</h1>
          </div>
          <div class="content">
            <h2>Hello ${booking.fullName}!</h2>
            <p>Your payment for booking #${booking.bookingId} has been successfully verified.</p>
            <p><strong>Amount:</strong> $${booking.totalAmount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${booking.paymentMethod.toUpperCase()}</p>
            
            <p>Your booking is now confirmed. You can view the details below:</p>
            <div style="text-align: center;">
              <a href="${viewBookingLink}" class="button">View Booking</a>
            </div>
            <p>If you have any questions, please contact the landlord:</p>
            <p><strong>Landlord:</strong> ${booking.ownerName}</p>
            <p><strong>Contact:</strong> ${booking.ownerContact}</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };
  },

  // Payment failure notification
  paymentFailure: (booking) => {
    const viewBookingLink = `${process.env.FRONTEND_URL}/bookings/${booking.bookingId}`;
    
    return {
      subject: `Payment Issue #${booking.bookingId} - Inyumba Student Portal`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Issue</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; background: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Payment Issue</h1>
          </div>
          <div class="content">
            <h2>Hello ${booking.fullName}!</h2>
            <p>There was an issue with your payment for booking #${booking.bookingId}.</p>
            <p><strong>Amount:</strong> $${booking.totalAmount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${booking.paymentMethod.toUpperCase()}</p>
            
            <p>Please upload a valid payment screenshot or contact the landlord to resolve this issue.</p>
            <div style="text-align: center;">
              <a href="${viewBookingLink}" class="button">Manage Booking</a>
            </div>
            <p>Landlord Contact:</p>
            <p><strong>Name:</strong> ${booking.ownerName}</p>
            <p><strong>Phone:</strong> ${booking.ownerContact}</p>
            <p><strong>Email:</strong> ${booking.ownerEmail}</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };
  },

  // Booking reminder email
  bookingReminder: (booking) => {
    const daysUntilCheckIn = Math.ceil((new Date(booking.checkIn) - new Date()) / (1000 * 60 * 60 * 24));
    const viewBookingLink = `${process.env.FRONTEND_URL}/bookings/${booking.bookingId}`;
    
    return {
      subject: `Booking Reminder #${booking.bookingId} - Inyumba Student Portal`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3498db; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; background: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Booking Reminder</h1>
          </div>
          <div class="content">
            <h2>Hello ${booking.fullName}!</h2>
            <p>This is a reminder for your upcoming booking:</p>
            <ul>
              <li><strong>Booking ID:</strong> ${booking.bookingId}</li>
              <li><strong>Property:</strong> ${booking.houseName}</li>
              <li><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()} (${daysUntilCheckIn} days from now)</li>
              <li><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</li>
              <li><strong>Location:</strong> ${booking.district}, ${booking.sector}</li>
            </ul>

            <div style="text-align: center;">
              <a href="${viewBookingLink}" class="button">View Booking</a>
            </div>
            <p>If you need to make any changes, please contact the landlord:</p>
            <p><strong>Landlord:</strong> ${booking.ownerName}</p>
            <p><strong>Phone:</strong> ${booking.ownerContact}</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };
  },

  // ============================================================
  // CONTACT EMAIL TEMPLATES
  // ============================================================

  // Contact confirmation for user
  contactConfirmation: (contact) => {
    return {
      subject: `Thank You for Contacting Us - Inyumba Student Portal`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contact Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4A90E2; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .message-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4A90E2; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Thank You for Contacting Us</h1>
          </div>
          <div class="content">
            <h2>Hello ${contact.name}!</h2>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>Here's a copy of your message:</p>
            <div class="message-box">
              <p><strong>Subject:</strong> Contact Form Submission</p>
              <p><strong>Message:</strong></p>
              <p>${contact.message}</p>
            </div>
            <p><strong>Reference ID:</strong> ${contact._id}</p>
            <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
            <p>Our team will review your message and respond within 24-48 hours.</p>
            <p>If you need immediate assistance, please call us at our support line.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Inyumba Student Portal. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };
  },

  // Contact notification for admin
  contactNotificationForAdmin: (contact) => {
    const adminUrl = `${process.env.FRONTEND_URL}/admin/contacts/${contact._id}`;
    
    return {
      subject: `New Contact Form Submission - ${contact.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f39c12; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .message-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f39c12; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #555; }
            .button { display: inline-block; background: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <h2>Hello Admin!</h2>
            <p>A new contact form has been submitted. Here are the details:</p>
            
            <div class="message-box">
              <div class="detail-row">
                <span class="label">Name:</span>
                <span>${contact.name}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span>${contact.email}</span>
              </div>
              <div class="detail-row">
                <span class="label">Phone:</span>
                <span>${contact.phone || 'Not provided'}</span>
              </div>
              <div class="detail-row">
                <span class="label">IP Address:</span>
                <span>${contact.ipAddress || 'Unknown'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Status:</span>
                <span><strong>${contact.status.toUpperCase()}</strong></span>
              </div>
              <div class="detail-row">
                <span class="label">Submitted:</span>
                <span>${new Date(contact.createdAt).toLocaleString()}</span>
              </div>
              <div style="margin-top: 15px;">
                <p><strong>Message:</strong></p>
                <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${contact.message}</p>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${adminUrl}" class="button">View and Reply</a>
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

  // Contact reply email to user
  contactReply: (contact) => {
    return {
      subject: `Reply to Your Message - Inyumba Student Portal`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reply to Your Message</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #27ae60; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .original-message { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ddd; }
            .reply-message { background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #27ae60; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reply to Your Message</h1>
          </div>
          <div class="content">
            <h2>Hello ${contact.name}!</h2>
            <p>Our team has responded to your inquiry. Here is their reply:</p>
            
            <div class="reply-message">
              <p><strong>Our Response:</strong></p>
              <p>${contact.replyMessage}</p>
            </div>
            
            <p><strong>Your Original Message:</strong></p>
            <div class="original-message">
              <p>${contact.message}</p>
            </div>
            
            <p><strong>Reference ID:</strong> ${contact._id}</p>
            <p><strong>Replied:</strong> ${new Date(contact.repliedAt).toLocaleString()}</p>
            
            <p>If you have any further questions, feel free to reply to this email or submit a new inquiry through our website.</p>
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

// ============================================================
// SEND EMAIL WITH TEMPLATE
// ============================================================

const sendEmailWithTemplate = async (to, templateName, data) => {
  try {
    if (!emailTemplates[templateName]) {
      throw new Error(`Template "${templateName}" not found`);
    }

    const { subject, html } = emailTemplates[templateName](data);
    
    return await sendEmail({
      to: to,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.error(`❌ Failed to send template email:`, error.message);
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to send template email'
    };
  }
};

// ============================================================
// EXPORT MODULES
// ============================================================

module.exports = {
  sendEmail,
  sendEmailWithTemplate,
  emailTemplates,
  testEmailConnection,
  createTransporter,
};