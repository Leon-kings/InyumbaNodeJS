
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";

// const SMTP_PORT = "465"; // 🔒 Fixed to port 465 only

// const SMTP_USER = process.env.SMTP_USER || "";

// const SMTP_PASS = process.env.SMTP_PASS || "";

// const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "INYUMBA";

// const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SMTP_USER;

// const TEST_EMAIL = "kingsleon250@gmail.com";

// let smtpTransporter = null;

// let smtpConnected = false;

// let smtpLastError = null;

// let smtpLastCheckedAt = null;

// let startupTestSent = false;

// /* ============================================================
//    FROM ADDRESS
// ============================================================ */

// const getFromAddress = () => {
//   if (!ADMIN_EMAIL) {
//     throw new Error("ADMIN_EMAIL is required");
//   }

//   return `"${EMAIL_FROM_NAME}" <${ADMIN_EMAIL}>`;
// };

// /* ============================================================
//    CONFIGURATION
// ============================================================ */

// const isSMTPConfigured = () => {
//   return Boolean(SMTP_USER && SMTP_PASS && ADMIN_EMAIL);
// };

// const isResendConfigured = isSMTPConfigured;

// /* ============================================================
//    SMTP TRANSPORTER (GMAIL - PORT 465 ONLY)
// ============================================================ */

// const getTransporter = () => {
//   if (!isSMTPConfigured()) {
//     throw new Error("Gmail SMTP configuration is incomplete");
//   }

//   if (!smtpTransporter) {
//     smtpTransporter = nodemailer.createTransport({
//       host: SMTP_HOST,
//       port: 465, // 🔒 Fixed to port 465
//       secure: true, // 🔒 Always true for port 465 (SSL/TLS)
//       auth: {
//         user: SMTP_USER,
//         pass: SMTP_PASS,
//       },
//     });
//   }

//   return smtpTransporter;
// };

// /* ============================================================
//    TEST SMTP (GMAIL)
// ============================================================ */

// const testConnection = async () => {
//   console.log("");
//   console.log("================================================");
//   console.log("🔍 VERIFYING GMAIL SMTP CONNECTION (PORT 465)");
//   console.log("================================================");

//   smtpLastCheckedAt = new Date();

//   if (!isSMTPConfigured()) {
//     smtpConnected = false;

//     smtpLastError = "Gmail SMTP configuration is incomplete";

//     console.error("❌ GMAIL SMTP CONFIGURATION INCOMPLETE");

//     console.error("Required environment variables:");

//     console.error("SMTP_USER");

//     console.error("SMTP_PASS");

//     console.error("ADMIN_EMAIL");

//     console.log("================================================");

//     return {
//       success: false,
//       connected: false,
//       error: smtpLastError,
//       checkedAt: smtpLastCheckedAt,
//     };
//   }

//   try {
//     const transporter = getTransporter();

//     const from = getFromAddress();

//     console.log("🔄 Connecting to Gmail SMTP...");

//     console.log("🌐 Host:", SMTP_HOST);

//     console.log("🔒 Port: 465 (SSL/TLS)");

//     console.log("📤 From:", from);

//     console.log("📨 Test recipient:", TEST_EMAIL);

//     await transporter.verify();

//     const result = await transporter.sendMail({
//       from,
//       to: TEST_EMAIL,
//       subject: "✨ INYUMBA Email Service Test",
//       text: "This is a test email from the INYUMBA application. The Gmail SMTP email service is working correctly.",
//       html: `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>INYUMBA Email Test</title>
//         <style>
//           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

//           .container {
//             max-width: 600px;
//             margin: auto;
//             padding: 40px 30px;
//             background: #ffffff;
//             border-radius: 20px;
//             box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
//             border: 1px solid #eaeef5;
//           }

//           .header {
//             text-align: center;
//             margin-bottom: 30px;
//           }

//           .logo-icon {
//             display: inline-block;
//             background: linear-gradient(135deg, #6366f1, #8b5cf6);
//             color: white;
//             font-size: 28px;
//             font-weight: 700;
//             padding: 12px 24px;
//             border-radius: 14px;
//             letter-spacing: -0.5px;
//           }

//           .badge {
//             display: inline-block;
//             margin-top: 14px;
//             background: #dcfce7;
//             color: #166534;
//             font-size: 13px;
//             font-weight: 600;
//             padding: 6px 18px;
//             border-radius: 100px;
//           }

//           h2 {
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 26px;
//             font-weight: 700;
//             color: #1e293b;
//             margin: 20px 0 10px;
//           }

//           .subtitle {
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 15px;
//             color: #64748b;
//             margin-bottom: 30px;
//             line-height: 1.6;
//           }

//           .status-card {
//             background: #f8fafc;
//             border-radius: 16px;
//             padding: 24px 28px;
//             margin: 24px 0;
//             border-left: 5px solid #22c55e;
//           }

//           .status-row {
//             display: flex;
//             justify-content: space-between;
//             padding: 8px 0;
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 14px;
//             border-bottom: 1px solid #e9edf2;
//           }

//           .status-row:last-child {
//             border-bottom: none;
//           }

//           .status-label {
//             font-weight: 500;
//             color: #475569;
//           }

//           .status-value {
//             font-weight: 600;
//             color: #0f172a;
//           }

//           .status-value.connected {
//             color: #16a34a;
//           }

//           .divider {
//             border: none;
//             border-top: 2px dashed #e2e8f0;
//             margin: 28px 0;
//           }

//           .footer {
//             text-align: center;
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 13px;
//             color: #94a3b8;
//             margin-top: 30px;
//             line-height: 1.8;
//           }

//           .footer a {
//             color: #6366f1;
//             text-decoration: none;
//             font-weight: 500;
//           }

//           .footer a:hover {
//             text-decoration: underline;
//           }

//           @media (max-width: 480px) {
//             .container {
//               padding: 24px 16px;
//             }
//             .status-row {
//               flex-direction: column;
//               gap: 2px;
//               padding: 10px 0;
//             }
//             .logo-icon {
//               font-size: 22px;
//               padding: 10px 18px;
//             }
//           }
//         </style>
//       </head>
//       <body style="margin:0;padding:30px;font-family:'Inter',Arial,sans-serif;background:#f1f5f9;">
//         <div class="container">

//           <!-- Header -->
//           <div class="header">
//             <div class="logo-icon">INYUMBA</div>
//             <div class="badge">✅ Test Email</div>
//           </div>

//           <h2>Email Service is Live 🚀</h2>
//           <p class="subtitle">
//             This is a test email from the <strong>INYUMBA</strong> application.
//             Your Gmail SMTP configuration is working perfectly.
//           </p>

//           <!-- Status Card -->
//           <div class="status-card">
//             <div class="status-row">
//               <span class="status-label">📧 Service</span>
//               <span class="status-value">Gmail SMTP (Port 465)</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">🔒 Security</span>
//               <span class="status-value">SSL/TLS</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">📶 Status</span>
//               <span class="status-value connected">● Connected</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">👤 From</span>
//               <span class="status-value">${from}</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">📨 Recipient</span>
//               <span class="status-value">${TEST_EMAIL}</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">⏱️ Sent at</span>
//               <span class="status-value">${new Date().toLocaleString("en-US", {
//                 timeZone: "UTC",
//                 dateStyle: "full",
//                 timeStyle: "medium",
//               })} UTC</span>
//             </div>
//           </div>

//           <hr class="divider" />

//           <!-- Additional Info -->
//           <p style="font-family:'Inter',Arial,sans-serif;font-size:14px;color:#475569;text-align:center;margin:10px 0 0;">
//             This automated test confirms that your email service is<br />
//             <strong style="color:#16a34a;">fully operational</strong> and ready for production.
//           </p>

//           <!-- Footer -->
//           <div class="footer">
//             <p>
//               © ${new Date().getFullYear()} <strong>INYUMBA</strong> &mdash; Built with ❤️<br />
//               <span style="font-size:12px;color:#cbd5e1;">
//                 This is an automated system test. No action is required.
//               </span>
//             </p>
//           </div>

//         </div>
//       </body>
//     </html>
//   `,
//     });
//     smtpConnected = true;

//     smtpLastError = null;

//     smtpLastCheckedAt = new Date();

//     startupTestSent = true;

//     console.log("");
//     console.log("================================================");
//     console.log("✅ GMAIL SMTP CONNECTION VERIFIED (PORT 465)");
//     console.log("🟢 EMAIL SERVICE: ONLINE");
//     console.log("🟢 GMAIL SMTP: CONNECTED");
//     console.log("🔒 SECURITY: SSL/TLS");
//     console.log(`🟢 TEST EMAIL SENT TO: ${TEST_EMAIL}`);
//     console.log("📨 Message ID:", result.messageId || "N/A");
//     console.log("================================================");

//     return {
//       success: true,
//       connected: true,
//       error: null,
//       data: result,
//       testEmail: TEST_EMAIL,
//       checkedAt: smtpLastCheckedAt,
//     };
//   } catch (error) {
//     smtpConnected = false;

//     smtpLastError = error.message;

//     smtpLastCheckedAt = new Date();

//     console.error("");
//     console.error("================================================");
//     console.error("❌ GMAIL SMTP CONNECTION FAILED (PORT 465)");
//     console.error("🔴 EMAIL SERVICE: OFFLINE");
//     console.error("❌ Error:", error.message);
//     console.error("================================================");

//     return {
//       success: false,
//       connected: false,
//       error: error.message,
//       checkedAt: smtpLastCheckedAt,
//     };
//   }
// };

// /* ============================================================
//    SEND MAIL
// ============================================================ */

// const sendMail = async (mailOptions) => {
//   try {
//     if (!isSMTPConfigured()) {
//       return {
//         success: false,
//         error: "Gmail SMTP configuration is incomplete",
//       };
//     }

//     if (!mailOptions || typeof mailOptions !== "object") {
//       return {
//         success: false,
//         error: "Mail options are required",
//       };
//     }

//     if (!mailOptions.to) {
//       return {
//         success: false,
//         error: "Email recipient is required",
//       };
//     }

//     if (!mailOptions.subject) {
//       return {
//         success: false,
//         error: "Email subject is required",
//       };
//     }

//     if (!mailOptions.text && !mailOptions.html) {
//       return {
//         success: false,
//         error: "Email text or HTML content is required",
//       };
//     }

//     const transporter = getTransporter();

//     const from = mailOptions.from || getFromAddress();

//     const to = Array.isArray(mailOptions.to)
//       ? mailOptions.to.join(",")
//       : mailOptions.to;

//     const result = await transporter.sendMail({
//       from,
//       to,
//       subject: mailOptions.subject,
//       ...(mailOptions.text && {
//         text: mailOptions.text,
//       }),
//       ...(mailOptions.html && {
//         html: mailOptions.html,
//       }),
//       ...(mailOptions.cc && {
//         cc: Array.isArray(mailOptions.cc)
//           ? mailOptions.cc.join(",")
//           : mailOptions.cc,
//       }),
//       ...(mailOptions.bcc && {
//         bcc: Array.isArray(mailOptions.bcc)
//           ? mailOptions.bcc.join(",")
//           : mailOptions.bcc,
//       }),
//       ...(mailOptions.replyTo && {
//         replyTo: mailOptions.replyTo,
//       }),
//       ...(mailOptions.attachments && {
//         attachments: mailOptions.attachments,
//       }),
//     });

//     smtpConnected = true;

//     smtpLastError = null;

//     smtpLastCheckedAt = new Date();

//     console.log("");
//     console.log("================================================");
//     console.log("✅ EMAIL SENT SUCCESSFULLY THROUGH GMAIL SMTP");
//     console.log("🔒 SECURITY: SSL/TLS (PORT 465)");
//     console.log("📤 From:", from);
//     console.log("📨 Message ID:", result.messageId || "N/A");
//     console.log("================================================");

//     return {
//       success: true,
//       info: result,
//       data: result,
//       error: null,
//     };
//   } catch (error) {
//     smtpConnected = false;

//     smtpLastError = error.message;

//     smtpLastCheckedAt = new Date();

//     console.error("❌ GMAIL SMTP EMAIL SENDING FAILED:", error.message);

//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// /* ============================================================
//    SEND EMAIL
// ============================================================ */

// const sendEmail = async ({
//   to,
//   subject,
//   text,
//   html,
//   cc,
//   bcc,
//   replyTo,
//   attachments,
// }) => {
//   if (!to) {
//     return {
//       success: false,
//       error: "Email recipient is required",
//     };
//   }

//   if (!subject) {
//     return {
//       success: false,
//       error: "Email subject is required",
//     };
//   }

//   if (!text && !html) {
//     return {
//       success: false,
//       error: "Email text or HTML content is required",
//     };
//   }

//   const mailOptions = {
//     from: getFromAddress(),
//     to,
//     subject,
//     ...(text && {
//       text,
//     }),
//     ...(html && {
//       html,
//     }),
//     ...(cc && {
//       cc,
//     }),
//     ...(bcc && {
//       bcc,
//     }),
//     ...(replyTo && {
//       replyTo,
//     }),
//     ...(attachments && {
//       attachments,
//     }),
//   };

//   return await sendMailWithRetry(mailOptions, 3);
// };

// /* ============================================================
//    RETRY
// ============================================================ */

// const sendMailWithRetry = async (mailOptions, maxRetries = 3) => {
//   let lastError = null;

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       console.log(`📧 Sending email attempt ${attempt}/${maxRetries}...`);

//       const result = await sendMail(mailOptions);

//       if (result.success) {
//         return result;
//       }

//       lastError = result.error;
//     } catch (error) {
//       lastError = error.message;
//     }

//     if (attempt < maxRetries) {
//       console.log(
//         `🔄 Retrying Gmail SMTP email (${attempt + 1}/${maxRetries})...`,
//       );

//       await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
//     }
//   }

//   return {
//     success: false,
//     error: lastError || "Gmail SMTP email sending failed",
//   };
// };

// /* ============================================================
//    SAFE SEND
// ============================================================ */

// const sendMailSafely = async (mailOptions) => {
//   try {
//     return await sendMailWithRetry(mailOptions, 3);
//   } catch (error) {
//     console.error("⚠️ Gmail SMTP email service error:", error.message);

//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// /* ============================================================
//    SMTP INFORMATION
// ============================================================ */

// const getSMTPInfo = () => {
//   return {
//     host: SMTP_HOST,
//     port: 465, // 🔒 Fixed port
//     user: SMTP_USER,
//     adminEmail: ADMIN_EMAIL,
//     fromName: EMAIL_FROM_NAME,
//     service: "Gmail SMTP",
//     protocol: "SMTP",
//     security: "SSL/TLS", // 🔒 Always SSL/TLS
//     configured: isSMTPConfigured(),
//     transporterCreated: Boolean(smtpTransporter),
//     connected: smtpConnected,
//     status: smtpConnected ? "ONLINE" : "OFFLINE",
//     startupTestEmail: TEST_EMAIL,
//     startupTestSent: startupTestSent,
//     lastError: smtpLastError,
//     lastCheckedAt: smtpLastCheckedAt,
//   };
// };

// /* ============================================================
//    CLOSE
// ============================================================ */

// const closeTransporter = async () => {
//   try {
//     if (smtpTransporter) {
//       smtpTransporter.close();
//     }

//     smtpTransporter = null;

//     smtpConnected = false;

//     console.log("🔌 GMAIL SMTP CLIENT CLOSED");

//     return {
//       success: true,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// /* ============================================================
//    STARTUP VERIFICATION
// ============================================================ */

// const startSMTPVerification = async () => {
//   console.log("");
//   console.log("================================================");
//   console.log("📧 EMAIL SERVICE STARTUP CHECK (PORT 465)");
//   console.log("================================================");

//   const result = await testConnection();

//   console.log("");

//   if (result.connected) {
//     console.log("🟢 EMAIL SERVICE STATUS: ONLINE");
//     console.log("🟢 GMAIL SMTP: CONNECTED");
//     console.log("🔒 SECURITY: SSL/TLS (PORT 465)");
//     console.log(`🟢 TEST EMAIL SENT TO: ${TEST_EMAIL}`);
//   } else {
//     console.log("🔴 EMAIL SERVICE STATUS: OFFLINE");
//     console.log("🔴 Reason:", result.error);
//   }

//   console.log("================================================");
//   console.log("");

//   return result;
// };

// module.exports = {
//   getTransporter,
//   getSMTPInfo,
//   isSMTPConfigured,
//   isResendConfigured,
//   testConnection,
//   startSMTPVerification,
//   sendEmail,
//   sendMail,
//   sendMailWithRetry,
//   sendMailSafely,
//   closeTransporter,
// };










// const nodemailer = require("nodemailer");
// require("dotenv").config();

// // ============================================================
// // FORCE IPv4 RESOLUTION (Fixes ENETUNREACH error)
// // ============================================================
// const dns = require('dns');
// dns.setDefaultResultOrder('ipv4first');

// // ============================================================
// // CONFIGURATION - All from .env file (NO CREDENTIALS HERE!)
// // ============================================================
// const BREVO_SMTP_HOST = process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com";
// const BREVO_SMTP_PORT = parseInt(process.env.BREVO_SMTP_PORT) || 587;
// const BREVO_SMTP_USER = process.env.BREVO_SMTP_USER || "";
// const BREVO_SMTP_PASS = process.env.BREVO_SMTP_PASS || "";
// const BREVO_FROM_NAME = process.env.BREVO_FROM_NAME || "INYUMBA";
// const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL || "";
// const BREVO_TEST_EMAIL = process.env.BREVO_TEST_EMAIL || "kingsleon250@gmail.com";
// const BREVO_USE_SSL = process.env.BREVO_USE_SSL === 'true' || false;
// const BREVO_API_KEY = process.env.BREVO_API_KEY || "";

// // ============================================================
// // STATE MANAGEMENT
// // ============================================================
// let smtpTransporter = null;
// let smtpConnected = false;
// let smtpLastError = null;
// let smtpLastCheckedAt = null;
// let startupTestSent = false;

// // Timers and performance tracking
// const timers = {
//   connectionStart: null,
//   connectionEnd: null,
//   lastSendStart: null,
//   lastSendEnd: null,
//   totalEmailsSent: 0,
//   totalEmailsFailed: 0,
//   averageResponseTime: 0,
//   responseTimes: [],
//   uptimeStart: Date.now(),
//   lastSuccessfulSend: null,
//   lastFailedSend: null,
// };

// // ============================================================
// // FROM ADDRESS
// // ============================================================
// const getFromAddress = () => {
//   if (!BREVO_FROM_EMAIL) {
//     throw new Error("BREVO_FROM_EMAIL is required");
//   }
//   return `"${BREVO_FROM_NAME}" <${BREVO_FROM_EMAIL}>`;
// };

// // ============================================================
// // CONFIGURATION CHECKS
// // ============================================================
// const isSMTPConfigured = () => {
//   return Boolean(BREVO_SMTP_USER && BREVO_SMTP_PASS && BREVO_FROM_EMAIL);
// };

// // ============================================================
// // SMTP TRANSPORTER (BREVO)
// // ============================================================
// const getTransporter = () => {
//   if (!isSMTPConfigured()) {
//     throw new Error("Brevo SMTP configuration is incomplete. Please check BREVO_SMTP_USER, BREVO_SMTP_PASS, and BREVO_FROM_EMAIL");
//   }

//   if (!smtpTransporter) {
//     const config = {
//       host: BREVO_SMTP_HOST,
//       port: BREVO_SMTP_PORT,
//       secure: BREVO_USE_SSL,
//       family: 4, // Force IPv4
//       auth: {
//         user: BREVO_SMTP_USER,
//         pass: BREVO_SMTP_PASS,
//       },
//       connectionTimeout: 30000,
//       greetingTimeout: 30000,
//       socketTimeout: 60000,
//     };

//     if (BREVO_SMTP_PORT === 587 && !BREVO_USE_SSL) {
//       config.requireTLS = true;
//     }

//     smtpTransporter = nodemailer.createTransport(config);
//   }

//   return smtpTransporter;
// };

// // ============================================================
// // TIMER UTILITIES
// // ============================================================
// const startTimer = (timerName) => {
//   timers[timerName] = Date.now();
// };

// const endTimer = (timerName) => {
//   if (timers[timerName]) {
//     const duration = Date.now() - timers[timerName];
//     timers[timerName] = null;
//     return duration;
//   }
//   return 0;
// };

// const recordResponseTime = (duration) => {
//   timers.responseTimes.push(duration);
//   if (timers.responseTimes.length > 100) {
//     timers.responseTimes.shift();
//   }
//   const sum = timers.responseTimes.reduce((a, b) => a + b, 0);
//   timers.averageResponseTime = sum / timers.responseTimes.length;
// };

// const getUptime = () => {
//   return Math.floor((Date.now() - timers.uptimeStart) / 1000);
// };

// const formatUptime = (seconds) => {
//   const days = Math.floor(seconds / 86400);
//   const hours = Math.floor((seconds % 86400) / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const secs = seconds % 60;
  
//   if (days > 0) {
//     return `${days}d ${hours}h ${minutes}m ${secs}s`;
//   } else if (hours > 0) {
//     return `${hours}h ${minutes}m ${secs}s`;
//   } else if (minutes > 0) {
//     return `${minutes}m ${secs}s`;
//   } else {
//     return `${secs}s`;
//   }
// };

// // ============================================================
// // TEST SMTP (BREVO)
// // ============================================================
// const testConnection = async () => {
//   console.log("");
//   console.log("================================================");
//   console.log("🔍 VERIFYING BREVO SMTP CONNECTION");
//   console.log("================================================");

//   smtpLastCheckedAt = new Date();

//   if (!isSMTPConfigured()) {
//     smtpConnected = false;
//     smtpLastError = "Brevo SMTP configuration is incomplete";
//     console.error("❌ BREVO SMTP CONFIGURATION INCOMPLETE");
//     console.error("Required environment variables:");
//     console.error("BREVO_SMTP_USER");
//     console.error("BREVO_SMTP_PASS");
//     console.error("BREVO_FROM_EMAIL");
//     console.log("================================================");
//     return {
//       success: false,
//       connected: false,
//       error: smtpLastError,
//       checkedAt: smtpLastCheckedAt,
//     };
//   }

//   try {
//     startTimer("connectionStart");
//     const transporter = getTransporter();
//     const from = getFromAddress();

//     console.log("🔄 Connecting to Brevo SMTP...");
//     console.log("🌐 Host:", BREVO_SMTP_HOST);
//     console.log(`🔒 Port: ${BREVO_SMTP_PORT} (${BREVO_USE_SSL ? 'SSL' : 'TLS'})`);
//     console.log("🔌 Network: IPv4 (forced)");
//     console.log("📤 From:", from);
//     console.log("📨 Test recipient:", BREVO_TEST_EMAIL);

//     await transporter.verify();
//     const connectionDuration = endTimer("connectionStart");
//     console.log(`✅ Connection established in ${connectionDuration}ms`);

//     startTimer("sendStart");
//     const result = await transporter.sendMail({
//       from,
//       to: BREVO_TEST_EMAIL,
//       subject: "✨ INYUMBA Email Service Test - Brevo",
//       text: "This is a test email from the INYUMBA application. The Brevo SMTP email service is working correctly.",
//       html: `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>INYUMBA Email Test - Brevo</title>
//         <style>
//           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

//           .container {
//             max-width: 600px;
//             margin: auto;
//             padding: 40px 30px;
//             background: #ffffff;
//             border-radius: 20px;
//             box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
//             border: 1px solid #eaeef5;
//           }

//           .header {
//             text-align: center;
//             margin-bottom: 30px;
//           }

//           .logo-icon {
//             display: inline-block;
//             background: linear-gradient(135deg, #0b6bdf, #00b4d8);
//             color: white;
//             font-size: 28px;
//             font-weight: 700;
//             padding: 12px 24px;
//             border-radius: 14px;
//             letter-spacing: -0.5px;
//           }

//           .badge {
//             display: inline-block;
//             margin-top: 14px;
//             background: #dcfce7;
//             color: #166534;
//             font-size: 13px;
//             font-weight: 600;
//             padding: 6px 18px;
//             border-radius: 100px;
//           }

//           h2 {
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 26px;
//             font-weight: 700;
//             color: #1e293b;
//             margin: 20px 0 10px;
//           }

//           .subtitle {
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 15px;
//             color: #64748b;
//             margin-bottom: 30px;
//             line-height: 1.6;
//           }

//           .status-card {
//             background: #f8fafc;
//             border-radius: 16px;
//             padding: 24px 28px;
//             margin: 24px 0;
//             border-left: 5px solid #0b6bdf;
//           }

//           .status-row {
//             display: flex;
//             justify-content: space-between;
//             padding: 8px 0;
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 14px;
//             border-bottom: 1px solid #e9edf2;
//           }

//           .status-row:last-child {
//             border-bottom: none;
//           }

//           .status-label {
//             font-weight: 500;
//             color: #475569;
//           }

//           .status-value {
//             font-weight: 600;
//             color: #0f172a;
//           }

//           .status-value.connected {
//             color: #16a34a;
//           }

//           .divider {
//             border: none;
//             border-top: 2px dashed #e2e8f0;
//             margin: 28px 0;
//           }

//           .footer {
//             text-align: center;
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 13px;
//             color: #94a3b8;
//             margin-top: 30px;
//             line-height: 1.8;
//           }

//           .footer a {
//             color: #0b6bdf;
//             text-decoration: none;
//             font-weight: 500;
//           }

//           .footer a:hover {
//             text-decoration: underline;
//           }

//           @media (max-width: 480px) {
//             .container {
//               padding: 24px 16px;
//             }
//             .status-row {
//               flex-direction: column;
//               gap: 2px;
//               padding: 10px 0;
//             }
//             .logo-icon {
//               font-size: 22px;
//               padding: 10px 18px;
//             }
//           }
//         </style>
//       </head>
//       <body style="margin:0;padding:30px;font-family:'Inter',Arial,sans-serif;background:#f1f5f9;">
//         <div class="container">

//           <div class="header">
//             <div class="logo-icon">INYUMBA</div>
//             <div class="badge">✅ Brevo Test Email</div>
//           </div>

//           <h2>Email Service is Live 🚀</h2>
//           <p class="subtitle">
//             This is a test email from the <strong>INYUMBA</strong> application.
//             Your Brevo SMTP configuration is working perfectly.
//           </p>

//           <div class="status-card">
//             <div class="status-row">
//               <span class="status-label">📧 Service</span>
//               <span class="status-value">Brevo SMTP (Port ${BREVO_SMTP_PORT})</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">🔒 Security</span>
//               <span class="status-value">${BREVO_USE_SSL ? 'SSL' : 'TLS'}</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">🔌 Network</span>
//               <span class="status-value">IPv4</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">📶 Status</span>
//               <span class="status-value connected">● Connected</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">👤 From</span>
//               <span class="status-value">${from}</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">📨 Recipient</span>
//               <span class="status-value">${BREVO_TEST_EMAIL}</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">⏱️ Response Time</span>
//               <span class="status-value">${connectionDuration}ms</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">⏱️ Sent at</span>
//               <span class="status-value">${new Date().toLocaleString("en-US", {
//                 timeZone: "UTC",
//                 dateStyle: "full",
//                 timeStyle: "medium",
//               })} UTC</span>
//             </div>
//           </div>

//           <hr class="divider" />

//           <p style="font-family:'Inter',Arial,sans-serif;font-size:14px;color:#475569;text-align:center;margin:10px 0 0;">
//             This automated test confirms that your email service is<br />
//             <strong style="color:#16a34a;">fully operational</strong> and ready for production.
//           </p>

//           <div class="footer">
//             <p>
//               © ${new Date().getFullYear()} <strong>INYUMBA</strong> &mdash; Built with ❤️<br />
//               <span style="font-size:12px;color:#cbd5e1;">
//                 This is an automated system test. No action is required.
//               </span>
//             </p>
//           </div>

//         </div>
//       </body>
//     </html>
//   `,
//     });

//     const sendDuration = endTimer("sendStart");
//     recordResponseTime(sendDuration);
//     timers.totalEmailsSent++;
//     timers.lastSuccessfulSend = new Date();
//     smtpConnected = true;
//     smtpLastError = null;
//     smtpLastCheckedAt = new Date();
//     startupTestSent = true;

//     console.log("");
//     console.log("================================================");
//     console.log("✅ BREVO SMTP CONNECTION VERIFIED");
//     console.log("🟢 EMAIL SERVICE: ONLINE");
//     console.log("🟢 BREVO SMTP: CONNECTED");
//     console.log(`🔒 SECURITY: ${BREVO_USE_SSL ? 'SSL' : 'TLS'}`);
//     console.log("🔌 NETWORK: IPv4");
//     console.log(`🟢 TEST EMAIL SENT TO: ${BREVO_TEST_EMAIL}`);
//     console.log(`⏱️ Connection Time: ${connectionDuration}ms`);
//     console.log(`⏱️ Send Time: ${sendDuration}ms`);
//     console.log("📨 Message ID:", result.messageId || "N/A");
//     console.log("================================================");

//     return {
//       success: true,
//       connected: true,
//       error: null,
//       data: result,
//       testEmail: BREVO_TEST_EMAIL,
//       checkedAt: smtpLastCheckedAt,
//       connectionDuration,
//       sendDuration,
//     };
//   } catch (error) {
//     smtpConnected = false;
//     smtpLastError = error.message;
//     smtpLastCheckedAt = new Date();
//     timers.totalEmailsFailed++;
//     timers.lastFailedSend = new Date();

//     console.error("");
//     console.error("================================================");
//     console.error("❌ BREVO SMTP CONNECTION FAILED");
//     console.error("🔴 EMAIL SERVICE: OFFLINE");
//     console.error("❌ Error:", error.message);
//     console.error("================================================");

//     return {
//       success: false,
//       connected: false,
//       error: error.message,
//       checkedAt: smtpLastCheckedAt,
//     };
//   }
// };

// // ============================================================
// // SEND MAIL
// // ============================================================
// const sendMail = async (mailOptions) => {
//   try {
//     if (!isSMTPConfigured()) {
//       return {
//         success: false,
//         error: "Brevo SMTP configuration is incomplete",
//       };
//     }

//     if (!mailOptions || typeof mailOptions !== "object") {
//       return {
//         success: false,
//         error: "Mail options are required",
//       };
//     }

//     if (!mailOptions.to) {
//       return {
//         success: false,
//         error: "Email recipient is required",
//       };
//     }

//     if (!mailOptions.subject) {
//       return {
//         success: false,
//         error: "Email subject is required",
//       };
//     }

//     if (!mailOptions.text && !mailOptions.html) {
//       return {
//         success: false,
//         error: "Email text or HTML content is required",
//       };
//     }

//     startTimer("sendStart");
//     const transporter = getTransporter();
//     const from = mailOptions.from || getFromAddress();

//     const to = Array.isArray(mailOptions.to)
//       ? mailOptions.to.join(",")
//       : mailOptions.to;

//     const result = await transporter.sendMail({
//       from,
//       to,
//       subject: mailOptions.subject,
//       ...(mailOptions.text && { text: mailOptions.text }),
//       ...(mailOptions.html && { html: mailOptions.html }),
//       ...(mailOptions.cc && {
//         cc: Array.isArray(mailOptions.cc)
//           ? mailOptions.cc.join(",")
//           : mailOptions.cc,
//       }),
//       ...(mailOptions.bcc && {
//         bcc: Array.isArray(mailOptions.bcc)
//           ? mailOptions.bcc.join(",")
//           : mailOptions.bcc,
//       }),
//       ...(mailOptions.replyTo && { replyTo: mailOptions.replyTo }),
//       ...(mailOptions.attachments && { attachments: mailOptions.attachments }),
//     });

//     const sendDuration = endTimer("sendStart");
//     recordResponseTime(sendDuration);
//     timers.totalEmailsSent++;
//     timers.lastSuccessfulSend = new Date();
//     smtpConnected = true;
//     smtpLastError = null;
//     smtpLastCheckedAt = new Date();

//     console.log("");
//     console.log("================================================");
//     console.log("✅ EMAIL SENT SUCCESSFULLY THROUGH BREVO SMTP");
//     console.log(`🔒 SECURITY: ${BREVO_USE_SSL ? 'SSL' : 'TLS'} (PORT ${BREVO_SMTP_PORT})`);
//     console.log("🔌 NETWORK: IPv4");
//     console.log("📤 From:", from);
//     console.log("📨 To:", to);
//     console.log(`⏱️ Response Time: ${sendDuration}ms`);
//     console.log("📨 Message ID:", result.messageId || "N/A");
//     console.log("================================================");

//     return {
//       success: true,
//       info: result,
//       data: result,
//       error: null,
//       responseTime: sendDuration,
//     };
//   } catch (error) {
//     smtpConnected = false;
//     smtpLastError = error.message;
//     smtpLastCheckedAt = new Date();
//     timers.totalEmailsFailed++;
//     timers.lastFailedSend = new Date();

//     console.error("❌ BREVO SMTP EMAIL SENDING FAILED:", error.message);

//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// // ============================================================
// // SEND EMAIL
// // ============================================================
// const sendEmail = async ({
//   to,
//   subject,
//   text,
//   html,
//   cc,
//   bcc,
//   replyTo,
//   attachments,
// }) => {
//   if (!to) {
//     return {
//       success: false,
//       error: "Email recipient is required",
//     };
//   }

//   if (!subject) {
//     return {
//       success: false,
//       error: "Email subject is required",
//     };
//   }

//   if (!text && !html) {
//     return {
//       success: false,
//       error: "Email text or HTML content is required",
//     };
//   }

//   const mailOptions = {
//     from: getFromAddress(),
//     to,
//     subject,
//     ...(text && { text }),
//     ...(html && { html }),
//     ...(cc && { cc }),
//     ...(bcc && { bcc }),
//     ...(replyTo && { replyTo }),
//     ...(attachments && { attachments }),
//   };

//   return await sendMailWithRetry(mailOptions, 3);
// };

// // ============================================================
// // RETRY
// // ============================================================
// const sendMailWithRetry = async (mailOptions, maxRetries = 3) => {
//   let lastError = null;
//   const startTime = Date.now();

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       console.log(`📧 Sending email attempt ${attempt}/${maxRetries}...`);

//       const result = await sendMail(mailOptions);

//       if (result.success) {
//         result.totalAttempts = attempt;
//         result.totalTime = Date.now() - startTime;
//         return result;
//       }

//       lastError = result.error;
//     } catch (error) {
//       lastError = error.message;
//     }

//     if (attempt < maxRetries) {
//       const waitTime = attempt * 2000;
//       console.log(
//         `🔄 Retrying Brevo SMTP email in ${waitTime}ms (${attempt + 1}/${maxRetries})...`,
//       );
//       await new Promise((resolve) => setTimeout(resolve, waitTime));
//     }
//   }

//   return {
//     success: false,
//     error: lastError || "Brevo SMTP email sending failed",
//     totalAttempts: maxRetries,
//     totalTime: Date.now() - startTime,
//   };
// };

// // ============================================================
// // SAFE SEND
// // ============================================================
// const sendMailSafely = async (mailOptions) => {
//   try {
//     return await sendMailWithRetry(mailOptions, 3);
//   } catch (error) {
//     console.error("⚠️ Brevo SMTP email service error:", error.message);
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// // ============================================================
// // SMTP INFORMATION WITH TIMERS
// // ============================================================
// const getSMTPInfo = () => {
//   const uptimeSeconds = getUptime();
  
//   return {
//     service: "Brevo SMTP",
//     host: BREVO_SMTP_HOST,
//     port: BREVO_SMTP_PORT,
//     user: BREVO_SMTP_USER ? "✓ Configured" : "✗ Missing",
//     fromEmail: BREVO_FROM_EMAIL,
//     fromName: BREVO_FROM_NAME,
//     protocol: "SMTP",
//     security: BREVO_USE_SSL ? 'SSL' : 'TLS',
//     network: "IPv4 (forced)",
//     configured: isSMTPConfigured(),
//     transporterCreated: Boolean(smtpTransporter),
//     connected: smtpConnected,
//     status: smtpConnected ? "ONLINE" : "OFFLINE",
//     testEmail: BREVO_TEST_EMAIL,
//     startupTestSent: startupTestSent,
//     lastError: smtpLastError,
//     lastCheckedAt: smtpLastCheckedAt,
//     uptime: {
//       seconds: uptimeSeconds,
//       formatted: formatUptime(uptimeSeconds),
//     },
//     timers: {
//       totalEmailsSent: timers.totalEmailsSent,
//       totalEmailsFailed: timers.totalEmailsFailed,
//       successRate: timers.totalEmailsSent + timers.totalEmailsFailed > 0
//         ? Math.round((timers.totalEmailsSent / (timers.totalEmailsSent + timers.totalEmailsFailed)) * 100)
//         : 0,
//       averageResponseTime: Math.round(timers.averageResponseTime),
//       recentResponseTimes: timers.responseTimes.slice(-10).map(ms => Math.round(ms)),
//       lastSuccessfulSend: timers.lastSuccessfulSend,
//       lastFailedSend: timers.lastFailedSend,
//     },
//   };
// };

// // ============================================================
// // CLOSE
// // ============================================================
// const closeTransporter = async () => {
//   try {
//     if (smtpTransporter) {
//       smtpTransporter.close();
//     }
//     smtpTransporter = null;
//     smtpConnected = false;

//     Object.keys(timers).forEach(key => {
//       if (key !== 'totalEmailsSent' && 
//           key !== 'totalEmailsFailed' && 
//           key !== 'responseTimes' && 
//           key !== 'averageResponseTime' &&
//           key !== 'uptimeStart') {
//         timers[key] = null;
//       }
//     });

//     console.log("🔌 BREVO SMTP CLIENT CLOSED");
//     return {
//       success: true,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// // ============================================================
// // STARTUP VERIFICATION
// // ============================================================
// const startSMTPVerification = async () => {
//   console.log("");
//   console.log("================================================");
//   console.log("📧 EMAIL SERVICE STARTUP CHECK - BREVO");
//   console.log("================================================");

//   const result = await testConnection();

//   console.log("");
//   console.log("================================================");
//   console.log("📊 STATUS SUMMARY");
//   console.log("================================================");

//   if (result.connected) {
//     console.log("🟢 EMAIL SERVICE STATUS: ONLINE");
//     console.log("🟢 BREVO SMTP: CONNECTED");
//     console.log(`🔒 SECURITY: ${BREVO_USE_SSL ? 'SSL' : 'TLS'} (PORT ${BREVO_SMTP_PORT})`);
//     console.log("🔌 NETWORK: IPv4");
//     console.log(`🟢 TEST EMAIL SENT TO: ${BREVO_TEST_EMAIL}`);
//     console.log(`⏱️ Connection Time: ${result.connectionDuration || 'N/A'}ms`);
//     console.log(`⏱️ Send Time: ${result.sendDuration || 'N/A'}ms`);
//   } else {
//     console.log("🔴 EMAIL SERVICE STATUS: OFFLINE");
//     console.log("🔴 Reason:", result.error);
//   }

//   console.log("================================================");
//   console.log("");

//   return result;
// };

// // ============================================================
// // EXPORTS
// // ============================================================
// module.exports = {
//   getTransporter,
//   getSMTPInfo,
//   isSMTPConfigured,
//   testConnection,
//   startSMTPVerification,
//   sendEmail,
//   sendMail,
//   sendMailWithRetry,
//   sendMailSafely,
//   closeTransporter,
//   startTimer,
//   endTimer,
//   recordResponseTime,
//   getUptime,
//   formatUptime,
// };














// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";

// const SMTP_PORT = "465"; // 🔒 Fixed to port 465 only

// const SMTP_USER = process.env.SMTP_USER || "";

// const SMTP_PASS = process.env.SMTP_PASS || "";

// const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "INYUMBA";

// const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SMTP_USER;

// const TEST_EMAIL = "kingsleon250@gmail.com";

// let smtpTransporter = null;

// let smtpConnected = false;

// let smtpLastError = null;

// let smtpLastCheckedAt = null;

// let startupTestSent = false;

// /* ============================================================
//    FROM ADDRESS
// ============================================================ */

// const getFromAddress = () => {
//   if (!ADMIN_EMAIL) {
//     throw new Error("ADMIN_EMAIL is required");
//   }

//   return `"${EMAIL_FROM_NAME}" <${ADMIN_EMAIL}>`;
// };

// /* ============================================================
//    CONFIGURATION
// ============================================================ */

// const isSMTPConfigured = () => {
//   return Boolean(SMTP_USER && SMTP_PASS && ADMIN_EMAIL);
// };

// const isResendConfigured = isSMTPConfigured;

// /* ============================================================
//    SMTP TRANSPORTER (GMAIL - PORT 465 ONLY)
// ============================================================ */

// const getTransporter = () => {
//   if (!isSMTPConfigured()) {
//     throw new Error("Gmail SMTP configuration is incomplete");
//   }

//   if (!smtpTransporter) {
//     smtpTransporter = nodemailer.createTransport({
//       host: SMTP_HOST,
//       port: 465, // 🔒 Fixed to port 465
//       secure: true, // 🔒 Always true for port 465 (SSL/TLS)
//       auth: {
//         user: SMTP_USER,
//         pass: SMTP_PASS,
//       },
//     });
//   }

//   return smtpTransporter;
// };

// /* ============================================================
//    TEST SMTP (GMAIL)
// ============================================================ */

// const testConnection = async () => {
//   console.log("");
//   console.log("================================================");
//   console.log("🔍 VERIFYING GMAIL SMTP CONNECTION (PORT 465)");
//   console.log("================================================");

//   smtpLastCheckedAt = new Date();

//   if (!isSMTPConfigured()) {
//     smtpConnected = false;

//     smtpLastError = "Gmail SMTP configuration is incomplete";

//     console.error("❌ GMAIL SMTP CONFIGURATION INCOMPLETE");

//     console.error("Required environment variables:");

//     console.error("SMTP_USER");

//     console.error("SMTP_PASS");

//     console.error("ADMIN_EMAIL");

//     console.log("================================================");

//     return {
//       success: false,
//       connected: false,
//       error: smtpLastError,
//       checkedAt: smtpLastCheckedAt,
//     };
//   }

//   try {
//     const transporter = getTransporter();

//     const from = getFromAddress();

//     console.log("🔄 Connecting to Gmail SMTP...");

//     console.log("🌐 Host:", SMTP_HOST);

//     console.log("🔒 Port: 465 (SSL/TLS)");

//     console.log("📤 From:", from);

//     console.log("📨 Test recipient:", TEST_EMAIL);

//     await transporter.verify();

//     const result = await transporter.sendMail({
//       from,
//       to: TEST_EMAIL,
//       subject: "✨ INYUMBA Email Service Test",
//       text: "This is a test email from the INYUMBA application. The Gmail SMTP email service is working correctly.",
//       html: `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>INYUMBA Email Test</title>
//         <style>
//           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

//           .container {
//             max-width: 600px;
//             margin: auto;
//             padding: 40px 30px;
//             background: #ffffff;
//             border-radius: 20px;
//             box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
//             border: 1px solid #eaeef5;
//           }

//           .header {
//             text-align: center;
//             margin-bottom: 30px;
//           }

//           .logo-icon {
//             display: inline-block;
//             background: linear-gradient(135deg, #6366f1, #8b5cf6);
//             color: white;
//             font-size: 28px;
//             font-weight: 700;
//             padding: 12px 24px;
//             border-radius: 14px;
//             letter-spacing: -0.5px;
//           }

//           .badge {
//             display: inline-block;
//             margin-top: 14px;
//             background: #dcfce7;
//             color: #166534;
//             font-size: 13px;
//             font-weight: 600;
//             padding: 6px 18px;
//             border-radius: 100px;
//           }

//           h2 {
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 26px;
//             font-weight: 700;
//             color: #1e293b;
//             margin: 20px 0 10px;
//           }

//           .subtitle {
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 15px;
//             color: #64748b;
//             margin-bottom: 30px;
//             line-height: 1.6;
//           }

//           .status-card {
//             background: #f8fafc;
//             border-radius: 16px;
//             padding: 24px 28px;
//             margin: 24px 0;
//             border-left: 5px solid #22c55e;
//           }

//           .status-row {
//             display: flex;
//             justify-content: space-between;
//             padding: 8px 0;
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 14px;
//             border-bottom: 1px solid #e9edf2;
//           }

//           .status-row:last-child {
//             border-bottom: none;
//           }

//           .status-label {
//             font-weight: 500;
//             color: #475569;
//           }

//           .status-value {
//             font-weight: 600;
//             color: #0f172a;
//           }

//           .status-value.connected {
//             color: #16a34a;
//           }

//           .divider {
//             border: none;
//             border-top: 2px dashed #e2e8f0;
//             margin: 28px 0;
//           }

//           .footer {
//             text-align: center;
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 13px;
//             color: #94a3b8;
//             margin-top: 30px;
//             line-height: 1.8;
//           }

//           .footer a {
//             color: #6366f1;
//             text-decoration: none;
//             font-weight: 500;
//           }

//           .footer a:hover {
//             text-decoration: underline;
//           }

//           @media (max-width: 480px) {
//             .container {
//               padding: 24px 16px;
//             }
//             .status-row {
//               flex-direction: column;
//               gap: 2px;
//               padding: 10px 0;
//             }
//             .logo-icon {
//               font-size: 22px;
//               padding: 10px 18px;
//             }
//           }
//         </style>
//       </head>
//       <body style="margin:0;padding:30px;font-family:'Inter',Arial,sans-serif;background:#f1f5f9;">
//         <div class="container">

//           <!-- Header -->
//           <div class="header">
//             <div class="logo-icon">INYUMBA</div>
//             <div class="badge">✅ Test Email</div>
//           </div>

//           <h2>Email Service is Live 🚀</h2>
//           <p class="subtitle">
//             This is a test email from the <strong>INYUMBA</strong> application.
//             Your Gmail SMTP configuration is working perfectly.
//           </p>

//           <!-- Status Card -->
//           <div class="status-card">
//             <div class="status-row">
//               <span class="status-label">📧 Service</span>
//               <span class="status-value">Gmail SMTP (Port 465)</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">🔒 Security</span>
//               <span class="status-value">SSL/TLS</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">📶 Status</span>
//               <span class="status-value connected">● Connected</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">👤 From</span>
//               <span class="status-value">${from}</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">📨 Recipient</span>
//               <span class="status-value">${TEST_EMAIL}</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">⏱️ Sent at</span>
//               <span class="status-value">${new Date().toLocaleString("en-US", {
//                 timeZone: "UTC",
//                 dateStyle: "full",
//                 timeStyle: "medium",
//               })} UTC</span>
//             </div>
//           </div>

//           <hr class="divider" />

//           <!-- Additional Info -->
//           <p style="font-family:'Inter',Arial,sans-serif;font-size:14px;color:#475569;text-align:center;margin:10px 0 0;">
//             This automated test confirms that your email service is<br />
//             <strong style="color:#16a34a;">fully operational</strong> and ready for production.
//           </p>

//           <!-- Footer -->
//           <div class="footer">
//             <p>
//               © ${new Date().getFullYear()} <strong>INYUMBA</strong> &mdash; Built with ❤️<br />
//               <span style="font-size:12px;color:#cbd5e1;">
//                 This is an automated system test. No action is required.
//               </span>
//             </p>
//           </div>

//         </div>
//       </body>
//     </html>
//   `,
//     });
//     smtpConnected = true;

//     smtpLastError = null;

//     smtpLastCheckedAt = new Date();

//     startupTestSent = true;

//     console.log("");
//     console.log("================================================");
//     console.log("✅ GMAIL SMTP CONNECTION VERIFIED (PORT 465)");
//     console.log("🟢 EMAIL SERVICE: ONLINE");
//     console.log("🟢 GMAIL SMTP: CONNECTED");
//     console.log("🔒 SECURITY: SSL/TLS");
//     console.log(`🟢 TEST EMAIL SENT TO: ${TEST_EMAIL}`);
//     console.log("📨 Message ID:", result.messageId || "N/A");
//     console.log("================================================");

//     return {
//       success: true,
//       connected: true,
//       error: null,
//       data: result,
//       testEmail: TEST_EMAIL,
//       checkedAt: smtpLastCheckedAt,
//     };
//   } catch (error) {
//     smtpConnected = false;

//     smtpLastError = error.message;

//     smtpLastCheckedAt = new Date();

//     console.error("");
//     console.error("================================================");
//     console.error("❌ GMAIL SMTP CONNECTION FAILED (PORT 465)");
//     console.error("🔴 EMAIL SERVICE: OFFLINE");
//     console.error("❌ Error:", error.message);
//     console.error("================================================");

//     return {
//       success: false,
//       connected: false,
//       error: error.message,
//       checkedAt: smtpLastCheckedAt,
//     };
//   }
// };

// /* ============================================================
//    SEND MAIL
// ============================================================ */

// const sendMail = async (mailOptions) => {
//   try {
//     if (!isSMTPConfigured()) {
//       return {
//         success: false,
//         error: "Gmail SMTP configuration is incomplete",
//       };
//     }

//     if (!mailOptions || typeof mailOptions !== "object") {
//       return {
//         success: false,
//         error: "Mail options are required",
//       };
//     }

//     if (!mailOptions.to) {
//       return {
//         success: false,
//         error: "Email recipient is required",
//       };
//     }

//     if (!mailOptions.subject) {
//       return {
//         success: false,
//         error: "Email subject is required",
//       };
//     }

//     if (!mailOptions.text && !mailOptions.html) {
//       return {
//         success: false,
//         error: "Email text or HTML content is required",
//       };
//     }

//     const transporter = getTransporter();

//     const from = mailOptions.from || getFromAddress();

//     const to = Array.isArray(mailOptions.to)
//       ? mailOptions.to.join(",")
//       : mailOptions.to;

//     const result = await transporter.sendMail({
//       from,
//       to,
//       subject: mailOptions.subject,
//       ...(mailOptions.text && {
//         text: mailOptions.text,
//       }),
//       ...(mailOptions.html && {
//         html: mailOptions.html,
//       }),
//       ...(mailOptions.cc && {
//         cc: Array.isArray(mailOptions.cc)
//           ? mailOptions.cc.join(",")
//           : mailOptions.cc,
//       }),
//       ...(mailOptions.bcc && {
//         bcc: Array.isArray(mailOptions.bcc)
//           ? mailOptions.bcc.join(",")
//           : mailOptions.bcc,
//       }),
//       ...(mailOptions.replyTo && {
//         replyTo: mailOptions.replyTo,
//       }),
//       ...(mailOptions.attachments && {
//         attachments: mailOptions.attachments,
//       }),
//     });

//     smtpConnected = true;

//     smtpLastError = null;

//     smtpLastCheckedAt = new Date();

//     console.log("");
//     console.log("================================================");
//     console.log("✅ EMAIL SENT SUCCESSFULLY THROUGH GMAIL SMTP");
//     console.log("🔒 SECURITY: SSL/TLS (PORT 465)");
//     console.log("📤 From:", from);
//     console.log("📨 Message ID:", result.messageId || "N/A");
//     console.log("================================================");

//     return {
//       success: true,
//       info: result,
//       data: result,
//       error: null,
//     };
//   } catch (error) {
//     smtpConnected = false;

//     smtpLastError = error.message;

//     smtpLastCheckedAt = new Date();

//     console.error("❌ GMAIL SMTP EMAIL SENDING FAILED:", error.message);

//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// /* ============================================================
//    SEND EMAIL
// ============================================================ */

// const sendEmail = async ({
//   to,
//   subject,
//   text,
//   html,
//   cc,
//   bcc,
//   replyTo,
//   attachments,
// }) => {
//   if (!to) {
//     return {
//       success: false,
//       error: "Email recipient is required",
//     };
//   }

//   if (!subject) {
//     return {
//       success: false,
//       error: "Email subject is required",
//     };
//   }

//   if (!text && !html) {
//     return {
//       success: false,
//       error: "Email text or HTML content is required",
//     };
//   }

//   const mailOptions = {
//     from: getFromAddress(),
//     to,
//     subject,
//     ...(text && {
//       text,
//     }),
//     ...(html && {
//       html,
//     }),
//     ...(cc && {
//       cc,
//     }),
//     ...(bcc && {
//       bcc,
//     }),
//     ...(replyTo && {
//       replyTo,
//     }),
//     ...(attachments && {
//       attachments,
//     }),
//   };

//   return await sendMailWithRetry(mailOptions, 3);
// };

// /* ============================================================
//    RETRY
// ============================================================ */

// const sendMailWithRetry = async (mailOptions, maxRetries = 3) => {
//   let lastError = null;

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       console.log(`📧 Sending email attempt ${attempt}/${maxRetries}...`);

//       const result = await sendMail(mailOptions);

//       if (result.success) {
//         return result;
//       }

//       lastError = result.error;
//     } catch (error) {
//       lastError = error.message;
//     }

//     if (attempt < maxRetries) {
//       console.log(
//         `🔄 Retrying Gmail SMTP email (${attempt + 1}/${maxRetries})...`,
//       );

//       await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
//     }
//   }

//   return {
//     success: false,
//     error: lastError || "Gmail SMTP email sending failed",
//   };
// };

// /* ============================================================
//    SAFE SEND
// ============================================================ */

// const sendMailSafely = async (mailOptions) => {
//   try {
//     return await sendMailWithRetry(mailOptions, 3);
//   } catch (error) {
//     console.error("⚠️ Gmail SMTP email service error:", error.message);

//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// /* ============================================================
//    SMTP INFORMATION
// ============================================================ */

// const getSMTPInfo = () => {
//   return {
//     host: SMTP_HOST,
//     port: 465, // 🔒 Fixed port
//     user: SMTP_USER,
//     adminEmail: ADMIN_EMAIL,
//     fromName: EMAIL_FROM_NAME,
//     service: "Gmail SMTP",
//     protocol: "SMTP",
//     security: "SSL/TLS", // 🔒 Always SSL/TLS
//     configured: isSMTPConfigured(),
//     transporterCreated: Boolean(smtpTransporter),
//     connected: smtpConnected,
//     status: smtpConnected ? "ONLINE" : "OFFLINE",
//     startupTestEmail: TEST_EMAIL,
//     startupTestSent: startupTestSent,
//     lastError: smtpLastError,
//     lastCheckedAt: smtpLastCheckedAt,
//   };
// };

// /* ============================================================
//    CLOSE
// ============================================================ */

// const closeTransporter = async () => {
//   try {
//     if (smtpTransporter) {
//       smtpTransporter.close();
//     }

//     smtpTransporter = null;

//     smtpConnected = false;

//     console.log("🔌 GMAIL SMTP CLIENT CLOSED");

//     return {
//       success: true,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// /* ============================================================
//    STARTUP VERIFICATION
// ============================================================ */

// const startSMTPVerification = async () => {
//   console.log("");
//   console.log("================================================");
//   console.log("📧 EMAIL SERVICE STARTUP CHECK (PORT 465)");
//   console.log("================================================");

//   const result = await testConnection();

//   console.log("");

//   if (result.connected) {
//     console.log("🟢 EMAIL SERVICE STATUS: ONLINE");
//     console.log("🟢 GMAIL SMTP: CONNECTED");
//     console.log("🔒 SECURITY: SSL/TLS (PORT 465)");
//     console.log(`🟢 TEST EMAIL SENT TO: ${TEST_EMAIL}`);
//   } else {
//     console.log("🔴 EMAIL SERVICE STATUS: OFFLINE");
//     console.log("🔴 Reason:", result.error);
//   }

//   console.log("================================================");
//   console.log("");

//   return result;
// };

// module.exports = {
//   getTransporter,
//   getSMTPInfo,
//   isSMTPConfigured,
//   isResendConfigured,
//   testConnection,
//   startSMTPVerification,
//   sendEmail,
//   sendMail,
//   sendMailWithRetry,
//   sendMailSafely,
//   closeTransporter,
// };










// const nodemailer = require("nodemailer");
// require("dotenv").config();

// // ============================================================
// // FORCE IPv4 RESOLUTION (Fixes ENETUNREACH error)
// // ============================================================
// const dns = require('dns');
// dns.setDefaultResultOrder('ipv4first');

// // ============================================================
// // CONFIGURATION - All from .env file (NO CREDENTIALS HERE!)
// // ============================================================
// const BREVO_SMTP_HOST = process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com";
// const BREVO_SMTP_PORT = parseInt(process.env.BREVO_SMTP_PORT) || 587;
// const BREVO_SMTP_USER = process.env.BREVO_SMTP_USER || "";
// const BREVO_SMTP_PASS = process.env.BREVO_SMTP_PASS || "";
// const BREVO_FROM_NAME = process.env.BREVO_FROM_NAME || "INYUMBA";
// const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL || "";
// const BREVO_TEST_EMAIL = process.env.BREVO_TEST_EMAIL || "kingsleon250@gmail.com";
// const BREVO_USE_SSL = process.env.BREVO_USE_SSL === 'true' || false;
// const BREVO_API_KEY = process.env.BREVO_API_KEY || "";

// // ============================================================
// // STATE MANAGEMENT
// // ============================================================
// let smtpTransporter = null;
// let smtpConnected = false;
// let smtpLastError = null;
// let smtpLastCheckedAt = null;
// let startupTestSent = false;

// // Timers and performance tracking
// const timers = {
//   connectionStart: null,
//   connectionEnd: null,
//   lastSendStart: null,
//   lastSendEnd: null,
//   totalEmailsSent: 0,
//   totalEmailsFailed: 0,
//   averageResponseTime: 0,
//   responseTimes: [],
//   uptimeStart: Date.now(),
//   lastSuccessfulSend: null,
//   lastFailedSend: null,
// };

// // ============================================================
// // FROM ADDRESS
// // ============================================================
// const getFromAddress = () => {
//   if (!BREVO_FROM_EMAIL) {
//     throw new Error("BREVO_FROM_EMAIL is required");
//   }
//   return `"${BREVO_FROM_NAME}" <${BREVO_FROM_EMAIL}>`;
// };

// // ============================================================
// // CONFIGURATION CHECKS
// // ============================================================
// const isSMTPConfigured = () => {
//   return Boolean(BREVO_SMTP_USER && BREVO_SMTP_PASS && BREVO_FROM_EMAIL);
// };

// // ============================================================
// // SMTP TRANSPORTER (BREVO)
// // ============================================================
// const getTransporter = () => {
//   if (!isSMTPConfigured()) {
//     throw new Error("Brevo SMTP configuration is incomplete. Please check BREVO_SMTP_USER, BREVO_SMTP_PASS, and BREVO_FROM_EMAIL");
//   }

//   if (!smtpTransporter) {
//     const config = {
//       host: BREVO_SMTP_HOST,
//       port: BREVO_SMTP_PORT,
//       secure: BREVO_USE_SSL,
//       family: 4, // Force IPv4
//       auth: {
//         user: BREVO_SMTP_USER,
//         pass: BREVO_SMTP_PASS,
//       },
//       connectionTimeout: 30000,
//       greetingTimeout: 30000,
//       socketTimeout: 60000,
//     };

//     if (BREVO_SMTP_PORT === 587 && !BREVO_USE_SSL) {
//       config.requireTLS = true;
//     }

//     smtpTransporter = nodemailer.createTransport(config);
//   }

//   return smtpTransporter;
// };

// // ============================================================
// // TIMER UTILITIES
// // ============================================================
// const startTimer = (timerName) => {
//   timers[timerName] = Date.now();
// };

// const endTimer = (timerName) => {
//   if (timers[timerName]) {
//     const duration = Date.now() - timers[timerName];
//     timers[timerName] = null;
//     return duration;
//   }
//   return 0;
// };

// const recordResponseTime = (duration) => {
//   timers.responseTimes.push(duration);
//   if (timers.responseTimes.length > 100) {
//     timers.responseTimes.shift();
//   }
//   const sum = timers.responseTimes.reduce((a, b) => a + b, 0);
//   timers.averageResponseTime = sum / timers.responseTimes.length;
// };

// const getUptime = () => {
//   return Math.floor((Date.now() - timers.uptimeStart) / 1000);
// };

// const formatUptime = (seconds) => {
//   const days = Math.floor(seconds / 86400);
//   const hours = Math.floor((seconds % 86400) / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const secs = seconds % 60;
  
//   if (days > 0) {
//     return `${days}d ${hours}h ${minutes}m ${secs}s`;
//   } else if (hours > 0) {
//     return `${hours}h ${minutes}m ${secs}s`;
//   } else if (minutes > 0) {
//     return `${minutes}m ${secs}s`;
//   } else {
//     return `${secs}s`;
//   }
// };

// // ============================================================
// // TEST SMTP (BREVO)
// // ============================================================
// const testConnection = async () => {
//   console.log("");
//   console.log("================================================");
//   console.log("🔍 VERIFYING BREVO SMTP CONNECTION");
//   console.log("================================================");

//   smtpLastCheckedAt = new Date();

//   if (!isSMTPConfigured()) {
//     smtpConnected = false;
//     smtpLastError = "Brevo SMTP configuration is incomplete";
//     console.error("❌ BREVO SMTP CONFIGURATION INCOMPLETE");
//     console.error("Required environment variables:");
//     console.error("BREVO_SMTP_USER");
//     console.error("BREVO_SMTP_PASS");
//     console.error("BREVO_FROM_EMAIL");
//     console.log("================================================");
//     return {
//       success: false,
//       connected: false,
//       error: smtpLastError,
//       checkedAt: smtpLastCheckedAt,
//     };
//   }

//   try {
//     startTimer("connectionStart");
//     const transporter = getTransporter();
//     const from = getFromAddress();

//     console.log("🔄 Connecting to Brevo SMTP...");
//     console.log("🌐 Host:", BREVO_SMTP_HOST);
//     console.log(`🔒 Port: ${BREVO_SMTP_PORT} (${BREVO_USE_SSL ? 'SSL' : 'TLS'})`);
//     console.log("🔌 Network: IPv4 (forced)");
//     console.log("📤 From:", from);
//     console.log("📨 Test recipient:", BREVO_TEST_EMAIL);

//     await transporter.verify();
//     const connectionDuration = endTimer("connectionStart");
//     console.log(`✅ Connection established in ${connectionDuration}ms`);

//     startTimer("sendStart");
//     const result = await transporter.sendMail({
//       from,
//       to: BREVO_TEST_EMAIL,
//       subject: "✨ INYUMBA Email Service Test - Brevo",
//       text: "This is a test email from the INYUMBA application. The Brevo SMTP email service is working correctly.",
//       html: `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>INYUMBA Email Test - Brevo</title>
//         <style>
//           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

//           .container {
//             max-width: 600px;
//             margin: auto;
//             padding: 40px 30px;
//             background: #ffffff;
//             border-radius: 20px;
//             box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
//             border: 1px solid #eaeef5;
//           }

//           .header {
//             text-align: center;
//             margin-bottom: 30px;
//           }

//           .logo-icon {
//             display: inline-block;
//             background: linear-gradient(135deg, #0b6bdf, #00b4d8);
//             color: white;
//             font-size: 28px;
//             font-weight: 700;
//             padding: 12px 24px;
//             border-radius: 14px;
//             letter-spacing: -0.5px;
//           }

//           .badge {
//             display: inline-block;
//             margin-top: 14px;
//             background: #dcfce7;
//             color: #166534;
//             font-size: 13px;
//             font-weight: 600;
//             padding: 6px 18px;
//             border-radius: 100px;
//           }

//           h2 {
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 26px;
//             font-weight: 700;
//             color: #1e293b;
//             margin: 20px 0 10px;
//           }

//           .subtitle {
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 15px;
//             color: #64748b;
//             margin-bottom: 30px;
//             line-height: 1.6;
//           }

//           .status-card {
//             background: #f8fafc;
//             border-radius: 16px;
//             padding: 24px 28px;
//             margin: 24px 0;
//             border-left: 5px solid #0b6bdf;
//           }

//           .status-row {
//             display: flex;
//             justify-content: space-between;
//             padding: 8px 0;
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 14px;
//             border-bottom: 1px solid #e9edf2;
//           }

//           .status-row:last-child {
//             border-bottom: none;
//           }

//           .status-label {
//             font-weight: 500;
//             color: #475569;
//           }

//           .status-value {
//             font-weight: 600;
//             color: #0f172a;
//           }

//           .status-value.connected {
//             color: #16a34a;
//           }

//           .divider {
//             border: none;
//             border-top: 2px dashed #e2e8f0;
//             margin: 28px 0;
//           }

//           .footer {
//             text-align: center;
//             font-family: 'Inter', Arial, sans-serif;
//             font-size: 13px;
//             color: #94a3b8;
//             margin-top: 30px;
//             line-height: 1.8;
//           }

//           .footer a {
//             color: #0b6bdf;
//             text-decoration: none;
//             font-weight: 500;
//           }

//           .footer a:hover {
//             text-decoration: underline;
//           }

//           @media (max-width: 480px) {
//             .container {
//               padding: 24px 16px;
//             }
//             .status-row {
//               flex-direction: column;
//               gap: 2px;
//               padding: 10px 0;
//             }
//             .logo-icon {
//               font-size: 22px;
//               padding: 10px 18px;
//             }
//           }
//         </style>
//       </head>
//       <body style="margin:0;padding:30px;font-family:'Inter',Arial,sans-serif;background:#f1f5f9;">
//         <div class="container">

//           <div class="header">
//             <div class="logo-icon">INYUMBA</div>
//             <div class="badge">✅ Brevo Test Email</div>
//           </div>

//           <h2>Email Service is Live 🚀</h2>
//           <p class="subtitle">
//             This is a test email from the <strong>INYUMBA</strong> application.
//             Your Brevo SMTP configuration is working perfectly.
//           </p>

//           <div class="status-card">
//             <div class="status-row">
//               <span class="status-label">📧 Service</span>
//               <span class="status-value">Brevo SMTP (Port ${BREVO_SMTP_PORT})</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">🔒 Security</span>
//               <span class="status-value">${BREVO_USE_SSL ? 'SSL' : 'TLS'}</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">🔌 Network</span>
//               <span class="status-value">IPv4</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">📶 Status</span>
//               <span class="status-value connected">● Connected</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">👤 From</span>
//               <span class="status-value">${from}</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">📨 Recipient</span>
//               <span class="status-value">${BREVO_TEST_EMAIL}</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">⏱️ Response Time</span>
//               <span class="status-value">${connectionDuration}ms</span>
//             </div>
//             <div class="status-row">
//               <span class="status-label">⏱️ Sent at</span>
//               <span class="status-value">${new Date().toLocaleString("en-US", {
//                 timeZone: "UTC",
//                 dateStyle: "full",
//                 timeStyle: "medium",
//               })} UTC</span>
//             </div>
//           </div>

//           <hr class="divider" />

//           <p style="font-family:'Inter',Arial,sans-serif;font-size:14px;color:#475569;text-align:center;margin:10px 0 0;">
//             This automated test confirms that your email service is<br />
//             <strong style="color:#16a34a;">fully operational</strong> and ready for production.
//           </p>

//           <div class="footer">
//             <p>
//               © ${new Date().getFullYear()} <strong>INYUMBA</strong> &mdash; Built with ❤️<br />
//               <span style="font-size:12px;color:#cbd5e1;">
//                 This is an automated system test. No action is required.
//               </span>
//             </p>
//           </div>

//         </div>
//       </body>
//     </html>
//   `,
//     });

//     const sendDuration = endTimer("sendStart");
//     recordResponseTime(sendDuration);
//     timers.totalEmailsSent++;
//     timers.lastSuccessfulSend = new Date();
//     smtpConnected = true;
//     smtpLastError = null;
//     smtpLastCheckedAt = new Date();
//     startupTestSent = true;

//     console.log("");
//     console.log("================================================");
//     console.log("✅ BREVO SMTP CONNECTION VERIFIED");
//     console.log("🟢 EMAIL SERVICE: ONLINE");
//     console.log("🟢 BREVO SMTP: CONNECTED");
//     console.log(`🔒 SECURITY: ${BREVO_USE_SSL ? 'SSL' : 'TLS'}`);
//     console.log("🔌 NETWORK: IPv4");
//     console.log(`🟢 TEST EMAIL SENT TO: ${BREVO_TEST_EMAIL}`);
//     console.log(`⏱️ Connection Time: ${connectionDuration}ms`);
//     console.log(`⏱️ Send Time: ${sendDuration}ms`);
//     console.log("📨 Message ID:", result.messageId || "N/A");
//     console.log("================================================");

//     return {
//       success: true,
//       connected: true,
//       error: null,
//       data: result,
//       testEmail: BREVO_TEST_EMAIL,
//       checkedAt: smtpLastCheckedAt,
//       connectionDuration,
//       sendDuration,
//     };
//   } catch (error) {
//     smtpConnected = false;
//     smtpLastError = error.message;
//     smtpLastCheckedAt = new Date();
//     timers.totalEmailsFailed++;
//     timers.lastFailedSend = new Date();

//     console.error("");
//     console.error("================================================");
//     console.error("❌ BREVO SMTP CONNECTION FAILED");
//     console.error("🔴 EMAIL SERVICE: OFFLINE");
//     console.error("❌ Error:", error.message);
//     console.error("================================================");

//     return {
//       success: false,
//       connected: false,
//       error: error.message,
//       checkedAt: smtpLastCheckedAt,
//     };
//   }
// };

// // ============================================================
// // SEND MAIL
// // ============================================================
// const sendMail = async (mailOptions) => {
//   try {
//     if (!isSMTPConfigured()) {
//       return {
//         success: false,
//         error: "Brevo SMTP configuration is incomplete",
//       };
//     }

//     if (!mailOptions || typeof mailOptions !== "object") {
//       return {
//         success: false,
//         error: "Mail options are required",
//       };
//     }

//     if (!mailOptions.to) {
//       return {
//         success: false,
//         error: "Email recipient is required",
//       };
//     }

//     if (!mailOptions.subject) {
//       return {
//         success: false,
//         error: "Email subject is required",
//       };
//     }

//     if (!mailOptions.text && !mailOptions.html) {
//       return {
//         success: false,
//         error: "Email text or HTML content is required",
//       };
//     }

//     startTimer("sendStart");
//     const transporter = getTransporter();
//     const from = mailOptions.from || getFromAddress();

//     const to = Array.isArray(mailOptions.to)
//       ? mailOptions.to.join(",")
//       : mailOptions.to;

//     const result = await transporter.sendMail({
//       from,
//       to,
//       subject: mailOptions.subject,
//       ...(mailOptions.text && { text: mailOptions.text }),
//       ...(mailOptions.html && { html: mailOptions.html }),
//       ...(mailOptions.cc && {
//         cc: Array.isArray(mailOptions.cc)
//           ? mailOptions.cc.join(",")
//           : mailOptions.cc,
//       }),
//       ...(mailOptions.bcc && {
//         bcc: Array.isArray(mailOptions.bcc)
//           ? mailOptions.bcc.join(",")
//           : mailOptions.bcc,
//       }),
//       ...(mailOptions.replyTo && { replyTo: mailOptions.replyTo }),
//       ...(mailOptions.attachments && { attachments: mailOptions.attachments }),
//     });

//     const sendDuration = endTimer("sendStart");
//     recordResponseTime(sendDuration);
//     timers.totalEmailsSent++;
//     timers.lastSuccessfulSend = new Date();
//     smtpConnected = true;
//     smtpLastError = null;
//     smtpLastCheckedAt = new Date();

//     console.log("");
//     console.log("================================================");
//     console.log("✅ EMAIL SENT SUCCESSFULLY THROUGH BREVO SMTP");
//     console.log(`🔒 SECURITY: ${BREVO_USE_SSL ? 'SSL' : 'TLS'} (PORT ${BREVO_SMTP_PORT})`);
//     console.log("🔌 NETWORK: IPv4");
//     console.log("📤 From:", from);
//     console.log("📨 To:", to);
//     console.log(`⏱️ Response Time: ${sendDuration}ms`);
//     console.log("📨 Message ID:", result.messageId || "N/A");
//     console.log("================================================");

//     return {
//       success: true,
//       info: result,
//       data: result,
//       error: null,
//       responseTime: sendDuration,
//     };
//   } catch (error) {
//     smtpConnected = false;
//     smtpLastError = error.message;
//     smtpLastCheckedAt = new Date();
//     timers.totalEmailsFailed++;
//     timers.lastFailedSend = new Date();

//     console.error("❌ BREVO SMTP EMAIL SENDING FAILED:", error.message);

//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// // ============================================================
// // SEND EMAIL
// // ============================================================
// const sendEmail = async ({
//   to,
//   subject,
//   text,
//   html,
//   cc,
//   bcc,
//   replyTo,
//   attachments,
// }) => {
//   if (!to) {
//     return {
//       success: false,
//       error: "Email recipient is required",
//     };
//   }

//   if (!subject) {
//     return {
//       success: false,
//       error: "Email subject is required",
//     };
//   }

//   if (!text && !html) {
//     return {
//       success: false,
//       error: "Email text or HTML content is required",
//     };
//   }

//   const mailOptions = {
//     from: getFromAddress(),
//     to,
//     subject,
//     ...(text && { text }),
//     ...(html && { html }),
//     ...(cc && { cc }),
//     ...(bcc && { bcc }),
//     ...(replyTo && { replyTo }),
//     ...(attachments && { attachments }),
//   };

//   return await sendMailWithRetry(mailOptions, 3);
// };

// // ============================================================
// // RETRY
// // ============================================================
// const sendMailWithRetry = async (mailOptions, maxRetries = 3) => {
//   let lastError = null;
//   const startTime = Date.now();

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       console.log(`📧 Sending email attempt ${attempt}/${maxRetries}...`);

//       const result = await sendMail(mailOptions);

//       if (result.success) {
//         result.totalAttempts = attempt;
//         result.totalTime = Date.now() - startTime;
//         return result;
//       }

//       lastError = result.error;
//     } catch (error) {
//       lastError = error.message;
//     }

//     if (attempt < maxRetries) {
//       const waitTime = attempt * 2000;
//       console.log(
//         `🔄 Retrying Brevo SMTP email in ${waitTime}ms (${attempt + 1}/${maxRetries})...`,
//       );
//       await new Promise((resolve) => setTimeout(resolve, waitTime));
//     }
//   }

//   return {
//     success: false,
//     error: lastError || "Brevo SMTP email sending failed",
//     totalAttempts: maxRetries,
//     totalTime: Date.now() - startTime,
//   };
// };

// // ============================================================
// // SAFE SEND
// // ============================================================
// const sendMailSafely = async (mailOptions) => {
//   try {
//     return await sendMailWithRetry(mailOptions, 3);
//   } catch (error) {
//     console.error("⚠️ Brevo SMTP email service error:", error.message);
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// // ============================================================
// // SMTP INFORMATION WITH TIMERS
// // ============================================================
// const getSMTPInfo = () => {
//   const uptimeSeconds = getUptime();
  
//   return {
//     service: "Brevo SMTP",
//     host: BREVO_SMTP_HOST,
//     port: BREVO_SMTP_PORT,
//     user: BREVO_SMTP_USER ? "✓ Configured" : "✗ Missing",
//     fromEmail: BREVO_FROM_EMAIL,
//     fromName: BREVO_FROM_NAME,
//     protocol: "SMTP",
//     security: BREVO_USE_SSL ? 'SSL' : 'TLS',
//     network: "IPv4 (forced)",
//     configured: isSMTPConfigured(),
//     transporterCreated: Boolean(smtpTransporter),
//     connected: smtpConnected,
//     status: smtpConnected ? "ONLINE" : "OFFLINE",
//     testEmail: BREVO_TEST_EMAIL,
//     startupTestSent: startupTestSent,
//     lastError: smtpLastError,
//     lastCheckedAt: smtpLastCheckedAt,
//     uptime: {
//       seconds: uptimeSeconds,
//       formatted: formatUptime(uptimeSeconds),
//     },
//     timers: {
//       totalEmailsSent: timers.totalEmailsSent,
//       totalEmailsFailed: timers.totalEmailsFailed,
//       successRate: timers.totalEmailsSent + timers.totalEmailsFailed > 0
//         ? Math.round((timers.totalEmailsSent / (timers.totalEmailsSent + timers.totalEmailsFailed)) * 100)
//         : 0,
//       averageResponseTime: Math.round(timers.averageResponseTime),
//       recentResponseTimes: timers.responseTimes.slice(-10).map(ms => Math.round(ms)),
//       lastSuccessfulSend: timers.lastSuccessfulSend,
//       lastFailedSend: timers.lastFailedSend,
//     },
//   };
// };

// // ============================================================
// // CLOSE
// // ============================================================
// const closeTransporter = async () => {
//   try {
//     if (smtpTransporter) {
//       smtpTransporter.close();
//     }
//     smtpTransporter = null;
//     smtpConnected = false;

//     Object.keys(timers).forEach(key => {
//       if (key !== 'totalEmailsSent' && 
//           key !== 'totalEmailsFailed' && 
//           key !== 'responseTimes' && 
//           key !== 'averageResponseTime' &&
//           key !== 'uptimeStart') {
//         timers[key] = null;
//       }
//     });

//     console.log("🔌 BREVO SMTP CLIENT CLOSED");
//     return {
//       success: true,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// // ============================================================
// // STARTUP VERIFICATION
// // ============================================================
// const startSMTPVerification = async () => {
//   console.log("");
//   console.log("================================================");
//   console.log("📧 EMAIL SERVICE STARTUP CHECK - BREVO");
//   console.log("================================================");

//   const result = await testConnection();

//   console.log("");
//   console.log("================================================");
//   console.log("📊 STATUS SUMMARY");
//   console.log("================================================");

//   if (result.connected) {
//     console.log("🟢 EMAIL SERVICE STATUS: ONLINE");
//     console.log("🟢 BREVO SMTP: CONNECTED");
//     console.log(`🔒 SECURITY: ${BREVO_USE_SSL ? 'SSL' : 'TLS'} (PORT ${BREVO_SMTP_PORT})`);
//     console.log("🔌 NETWORK: IPv4");
//     console.log(`🟢 TEST EMAIL SENT TO: ${BREVO_TEST_EMAIL}`);
//     console.log(`⏱️ Connection Time: ${result.connectionDuration || 'N/A'}ms`);
//     console.log(`⏱️ Send Time: ${result.sendDuration || 'N/A'}ms`);
//   } else {
//     console.log("🔴 EMAIL SERVICE STATUS: OFFLINE");
//     console.log("🔴 Reason:", result.error);
//   }

//   console.log("================================================");
//   console.log("");

//   return result;
// };

// // ============================================================
// // EXPORTS
// // ============================================================
// module.exports = {
//   getTransporter,
//   getSMTPInfo,
//   isSMTPConfigured,
//   testConnection,
//   startSMTPVerification,
//   sendEmail,
//   sendMail,
//   sendMailWithRetry,
//   sendMailSafely,
//   closeTransporter,
//   startTimer,
//   endTimer,
//   recordResponseTime,
//   getUptime,
//   formatUptime,
// };













const nodemailer = require("nodemailer");
require("dotenv").config();

// ============================================================
// FORCE IPv4 RESOLUTION (Fixes ENETUNREACH error)
// ============================================================
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// ============================================================
// BREVO SMTP CONFIGURATION - From your .env
// ============================================================
const BREVO_SMTP_HOST = process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com";
const BREVO_SMTP_PORT = parseInt(process.env.BREVO_SMTP_PORT) || 587;
const BREVO_SMTP_USER = process.env.BREVO_SMTP_USER || "b6f17d001@smtp-brevo.com";
const BREVO_SMTP_PASS = process.env.BREVO_SMTP_PASS || "";
const BREVO_FROM_NAME = process.env.BREVO_FROM_NAME || "INYUMBA";
const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL || "kingsleon250@gmail.com";
const BREVO_TEST_EMAIL = process.env.BREVO_TEST_EMAIL || "kingsleon250@gmail.com";
const BREVO_USE_SSL = process.env.BREVO_USE_SSL === 'true' || false;

// API Key is defined but NOT used (we're using SMTP)
const BREVO_API_KEY = process.env.BREVO_API_KEY || "";

// ============================================================
// STATE MANAGEMENT
// ============================================================
let smtpTransporter = null;
let smtpConnected = false;
let smtpLastError = null;
let smtpLastCheckedAt = null;
let startupTestSent = false;

// Timers and performance tracking
const timers = {
  connectionStart: null,
  connectionEnd: null,
  lastSendStart: null,
  lastSendEnd: null,
  totalEmailsSent: 0,
  totalEmailsFailed: 0,
  averageResponseTime: 0,
  responseTimes: [],
  uptimeStart: Date.now(),
  lastSuccessfulSend: null,
  lastFailedSend: null,
};

// ============================================================
// FROM ADDRESS
// ============================================================
const getFromAddress = () => {
  if (!BREVO_FROM_EMAIL) {
    throw new Error("BREVO_FROM_EMAIL is required");
  }
  return `"${BREVO_FROM_NAME}" <${BREVO_FROM_EMAIL}>`;
};

// ============================================================
// CONFIGURATION CHECKS
// ============================================================
const isSMTPConfigured = () => {
  return Boolean(BREVO_SMTP_USER && BREVO_SMTP_PASS && BREVO_FROM_EMAIL);
};

// ============================================================
// SMTP TRANSPORTER (BREVO)
// ============================================================
const getTransporter = () => {
  if (!isSMTPConfigured()) {
    throw new Error("Brevo SMTP configuration is incomplete. Please check BREVO_SMTP_USER, BREVO_SMTP_PASS, and BREVO_FROM_EMAIL");
  }

  if (!smtpTransporter) {
    const config = {
      host: BREVO_SMTP_HOST,
      port: BREVO_SMTP_PORT,
      secure: BREVO_USE_SSL,
      family: 4, // Force IPv4
      auth: {
        user: BREVO_SMTP_USER,
        pass: BREVO_SMTP_PASS,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      // For port 587 with STARTTLS
      requireTLS: BREVO_SMTP_PORT === 587 && !BREVO_USE_SSL,
    };

    smtpTransporter = nodemailer.createTransport(config);
  }

  return smtpTransporter;
};

// ============================================================
// TIMER UTILITIES
// ============================================================
const startTimer = (timerName) => {
  timers[timerName] = Date.now();
};

const endTimer = (timerName) => {
  if (timers[timerName]) {
    const duration = Date.now() - timers[timerName];
    timers[timerName] = null;
    return duration;
  }
  return 0;
};

const recordResponseTime = (duration) => {
  timers.responseTimes.push(duration);
  if (timers.responseTimes.length > 100) {
    timers.responseTimes.shift();
  }
  const sum = timers.responseTimes.reduce((a, b) => a + b, 0);
  timers.averageResponseTime = sum / timers.responseTimes.length;
};

const getUptime = () => {
  return Math.floor((Date.now() - timers.uptimeStart) / 1000);
};

const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

// ============================================================
// EMAIL VALIDATION
// ============================================================
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (Array.isArray(email)) {
    return email.every(e => re.test(e));
  }
  return re.test(email);
};

// ============================================================
// TEST SMTP (BREVO)
// ============================================================
const testConnection = async () => {
  console.log("");
  console.log("================================================");
  console.log("🔍 VERIFYING BREVO SMTP CONNECTION");
  console.log("================================================");

  smtpLastCheckedAt = new Date();

  if (!isSMTPConfigured()) {
    smtpConnected = false;
    smtpLastError = "Brevo SMTP configuration is incomplete";
    console.error("❌ BREVO SMTP CONFIGURATION INCOMPLETE");
    console.error("Required environment variables:");
    console.error("BREVO_SMTP_USER");
    console.error("BREVO_SMTP_PASS");
    console.error("BREVO_FROM_EMAIL");
    console.log("================================================");
    return {
      success: false,
      connected: false,
      error: smtpLastError,
      checkedAt: smtpLastCheckedAt,
    };
  }

  try {
    startTimer("connectionStart");
    const transporter = getTransporter();
    const from = getFromAddress();

    console.log("🔄 Connecting to Brevo SMTP...");
    console.log("🌐 Host:", BREVO_SMTP_HOST);
    console.log(`🔒 Port: ${BREVO_SMTP_PORT} (${BREVO_USE_SSL ? 'SSL' : 'STARTTLS'})`);
    console.log("🔌 Network: IPv4 (forced)");
    console.log("👤 User:", BREVO_SMTP_USER);
    console.log("📤 From:", from);
    console.log("📨 Test recipient:", BREVO_TEST_EMAIL);

    // Verify connection
    await transporter.verify();
    const connectionDuration = endTimer("connectionStart");
    console.log(`✅ Connection established in ${connectionDuration}ms`);

    // Send test email
    startTimer("sendStart");
    const result = await transporter.sendMail({
      from,
      to: BREVO_TEST_EMAIL,
      subject: "✨ INYUMBA Email Service Test - Brevo SMTP",
      text: "This is a test email from the INYUMBA application. The Brevo SMTP email service is working correctly.",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>INYUMBA Email Test - Brevo SMTP</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

              .container {
                max-width: 600px;
                margin: auto;
                padding: 40px 30px;
                background: #ffffff;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
                border: 1px solid #eaeef5;
              }

              .header {
                text-align: center;
                margin-bottom: 30px;
              }

              .logo-icon {
                display: inline-block;
                background: linear-gradient(135deg, #0b6bdf, #00b4d8);
                color: white;
                font-size: 28px;
                font-weight: 700;
                padding: 12px 24px;
                border-radius: 14px;
                letter-spacing: -0.5px;
              }

              .badge {
                display: inline-block;
                margin-top: 14px;
                background: #dcfce7;
                color: #166534;
                font-size: 13px;
                font-weight: 600;
                padding: 6px 18px;
                border-radius: 100px;
              }

              h2 {
                font-family: 'Inter', Arial, sans-serif;
                font-size: 26px;
                font-weight: 700;
                color: #1e293b;
                margin: 20px 0 10px;
              }

              .subtitle {
                font-family: 'Inter', Arial, sans-serif;
                font-size: 15px;
                color: #64748b;
                margin-bottom: 30px;
                line-height: 1.6;
              }

              .status-card {
                background: #f8fafc;
                border-radius: 16px;
                padding: 24px 28px;
                margin: 24px 0;
                border-left: 5px solid #0b6bdf;
              }

              .status-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                font-family: 'Inter', Arial, sans-serif;
                font-size: 14px;
                border-bottom: 1px solid #e9edf2;
              }

              .status-row:last-child {
                border-bottom: none;
              }

              .status-label {
                font-weight: 500;
                color: #475569;
              }

              .status-value {
                font-weight: 600;
                color: #0f172a;
              }

              .status-value.connected {
                color: #16a34a;
              }

              .divider {
                border: none;
                border-top: 2px dashed #e2e8f0;
                margin: 28px 0;
              }

              .footer {
                text-align: center;
                font-family: 'Inter', Arial, sans-serif;
                font-size: 13px;
                color: #94a3b8;
                margin-top: 30px;
                line-height: 1.8;
              }

              .footer a {
                color: #0b6bdf;
                text-decoration: none;
                font-weight: 500;
              }

              .footer a:hover {
                text-decoration: underline;
              }

              @media (max-width: 480px) {
                .container {
                  padding: 24px 16px;
                }
                .status-row {
                  flex-direction: column;
                  gap: 2px;
                  padding: 10px 0;
                }
                .logo-icon {
                  font-size: 22px;
                  padding: 10px 18px;
                }
              }
            </style>
          </head>
          <body style="margin:0;padding:30px;font-family:'Inter',Arial,sans-serif;background:#f1f5f9;">
            <div class="container">

              <div class="header">
                <div class="logo-icon">INYUMBA</div>
                <div class="badge">✅ Brevo SMTP Test</div>
              </div>

              <h2>Email Service is Live 🚀</h2>
              <p class="subtitle">
                This is a test email from the <strong>INYUMBA</strong> application.
                Your Brevo SMTP configuration is working perfectly.
              </p>

              <div class="status-card">
                <div class="status-row">
                  <span class="status-label">📧 Service</span>
                  <span class="status-value">Brevo SMTP (Port ${BREVO_SMTP_PORT})</span>
                </div>
                <div class="status-row">
                  <span class="status-label">🔒 Security</span>
                  <span class="status-value">${BREVO_USE_SSL ? 'SSL' : 'STARTTLS'}</span>
                </div>
                <div class="status-row">
                  <span class="status-label">🔌 Network</span>
                  <span class="status-value">IPv4</span>
                </div>
                <div class="status-row">
                  <span class="status-label">📶 Status</span>
                  <span class="status-value connected">● Connected</span>
                </div>
                <div class="status-row">
                  <span class="status-label">👤 From</span>
                  <span class="status-value">${from}</span>
                </div>
                <div class="status-row">
                  <span class="status-label">📨 Recipient</span>
                  <span class="status-value">${BREVO_TEST_EMAIL}</span>
                </div>
                <div class="status-row">
                  <span class="status-label">⏱️ Response Time</span>
                  <span class="status-value">${connectionDuration}ms</span>
                </div>
                <div class="status-row">
                  <span class="status-label">⏱️ Sent at</span>
                  <span class="status-value">${new Date().toLocaleString("en-US", {
                    timeZone: "UTC",
                    dateStyle: "full",
                    timeStyle: "medium",
                  })} UTC</span>
                </div>
              </div>

              <hr class="divider" />

              <p style="font-family:'Inter',Arial,sans-serif;font-size:14px;color:#475569;text-align:center;margin:10px 0 0;">
                This automated test confirms that your email service is<br />
                <strong style="color:#16a34a;">fully operational</strong> and ready for production.
              </p>

              <div class="footer">
                <p>
                  © ${new Date().getFullYear()} <strong>INYUMBA</strong> &mdash; Built with ❤️<br />
                  <span style="font-size:12px;color:#cbd5e1;">
                    This is an automated system test. No action is required.
                  </span>
                </p>
              </div>

            </div>
          </body>
        </html>
      `,
    });

    const sendDuration = endTimer("sendStart");
    recordResponseTime(sendDuration);
    timers.totalEmailsSent++;
    timers.lastSuccessfulSend = new Date();
    smtpConnected = true;
    smtpLastError = null;
    smtpLastCheckedAt = new Date();
    startupTestSent = true;

    console.log("");
    console.log("================================================");
    console.log("✅ BREVO SMTP CONNECTION VERIFIED");
    console.log("🟢 EMAIL SERVICE: ONLINE");
    console.log("🟢 BREVO SMTP: CONNECTED");
    console.log(`🔒 SECURITY: ${BREVO_USE_SSL ? 'SSL' : 'STARTTLS'}`);
    console.log("🔌 NETWORK: IPv4");
    console.log(`🟢 TEST EMAIL SENT TO: ${BREVO_TEST_EMAIL}`);
    console.log(`⏱️ Connection Time: ${connectionDuration}ms`);
    console.log(`⏱️ Send Time: ${sendDuration}ms`);
    console.log("📨 Message ID:", result.messageId || "N/A");
    console.log("================================================");

    return {
      success: true,
      connected: true,
      error: null,
      data: result,
      testEmail: BREVO_TEST_EMAIL,
      checkedAt: smtpLastCheckedAt,
      connectionDuration,
      sendDuration,
    };
  } catch (error) {
    smtpConnected = false;
    smtpLastError = error.message;
    smtpLastCheckedAt = new Date();
    timers.totalEmailsFailed++;
    timers.lastFailedSend = new Date();

    console.error("");
    console.error("================================================");
    console.error("❌ BREVO SMTP CONNECTION FAILED");
    console.error("🔴 EMAIL SERVICE: OFFLINE");
    console.error("❌ Error:", error.message);
    if (error.code) {
      console.error("📋 Error Code:", error.code);
    }
    if (error.response) {
      console.error("📋 Response:", error.response);
    }
    console.error("================================================");

    return {
      success: false,
      connected: false,
      error: error.message,
      errorCode: error.code,
      checkedAt: smtpLastCheckedAt,
    };
  }
};

// ============================================================
// SEND MAIL
// ============================================================
const sendMail = async (mailOptions) => {
  try {
    if (!isSMTPConfigured()) {
      return {
        success: false,
        error: "Brevo SMTP configuration is incomplete",
      };
    }

    if (!mailOptions || typeof mailOptions !== "object") {
      return {
        success: false,
        error: "Mail options are required",
      };
    }

    if (!mailOptions.to) {
      return {
        success: false,
        error: "Email recipient is required",
      };
    }

    if (!mailOptions.subject) {
      return {
        success: false,
        error: "Email subject is required",
      };
    }

    if (!mailOptions.text && !mailOptions.html) {
      return {
        success: false,
        error: "Email text or HTML content is required",
      };
    }

    // Validate emails
    if (!validateEmail(mailOptions.to)) {
      return {
        success: false,
        error: "Invalid recipient email address",
      };
    }

    if (mailOptions.cc && !validateEmail(mailOptions.cc)) {
      return {
        success: false,
        error: "Invalid CC email address",
      };
    }

    if (mailOptions.bcc && !validateEmail(mailOptions.bcc)) {
      return {
        success: false,
        error: "Invalid BCC email address",
      };
    }

    startTimer("sendStart");
    const transporter = getTransporter();
    const from = mailOptions.from || getFromAddress();

    const to = Array.isArray(mailOptions.to)
      ? mailOptions.to.join(",")
      : mailOptions.to;

    const result = await transporter.sendMail({
      from,
      to,
      subject: mailOptions.subject,
      ...(mailOptions.text && { text: mailOptions.text }),
      ...(mailOptions.html && { html: mailOptions.html }),
      ...(mailOptions.cc && {
        cc: Array.isArray(mailOptions.cc)
          ? mailOptions.cc.join(",")
          : mailOptions.cc,
      }),
      ...(mailOptions.bcc && {
        bcc: Array.isArray(mailOptions.bcc)
          ? mailOptions.bcc.join(",")
          : mailOptions.bcc,
      }),
      ...(mailOptions.replyTo && { replyTo: mailOptions.replyTo }),
      ...(mailOptions.attachments && { attachments: mailOptions.attachments }),
    });

    const sendDuration = endTimer("sendStart");
    recordResponseTime(sendDuration);
    timers.totalEmailsSent++;
    timers.lastSuccessfulSend = new Date();
    smtpConnected = true;
    smtpLastError = null;
    smtpLastCheckedAt = new Date();

    console.log("");
    console.log("================================================");
    console.log("✅ EMAIL SENT SUCCESSFULLY THROUGH BREVO SMTP");
    console.log(`🔒 SECURITY: ${BREVO_USE_SSL ? 'SSL' : 'STARTTLS'} (PORT ${BREVO_SMTP_PORT})`);
    console.log("🔌 NETWORK: IPv4");
    console.log("📤 From:", from);
    console.log("📨 To:", to);
    console.log(`⏱️ Response Time: ${sendDuration}ms`);
    console.log("📨 Message ID:", result.messageId || "N/A");
    console.log("================================================");

    return {
      success: true,
      info: result,
      data: result,
      error: null,
      responseTime: sendDuration,
      messageId: result.messageId,
    };
  } catch (error) {
    smtpConnected = false;
    smtpLastError = error.message;
    smtpLastCheckedAt = new Date();
    timers.totalEmailsFailed++;
    timers.lastFailedSend = new Date();

    console.error("❌ BREVO SMTP EMAIL SENDING FAILED:", error.message);
    if (error.code) {
      console.error("📋 Error Code:", error.code);
    }

    return {
      success: false,
      error: error.message,
      errorCode: error.code,
    };
  }
};

// ============================================================
// SEND EMAIL
// ============================================================
const sendEmail = async ({
  to,
  subject,
  text,
  html,
  cc,
  bcc,
  replyTo,
  attachments,
}) => {
  if (!to) {
    return {
      success: false,
      error: "Email recipient is required",
    };
  }

  if (!subject) {
    return {
      success: false,
      error: "Email subject is required",
    };
  }

  if (!text && !html) {
    return {
      success: false,
      error: "Email text or HTML content is required",
    };
  }

  const mailOptions = {
    from: getFromAddress(),
    to,
    subject,
    ...(text && { text }),
    ...(html && { html }),
    ...(cc && { cc }),
    ...(bcc && { bcc }),
    ...(replyTo && { replyTo }),
    ...(attachments && { attachments }),
  };

  return await sendMailWithRetry(mailOptions, 3);
};

// ============================================================
// RETRY
// ============================================================
const sendMailWithRetry = async (mailOptions, maxRetries = 3) => {
  let lastError = null;
  const startTime = Date.now();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 Sending email attempt ${attempt}/${maxRetries}...`);

      const result = await sendMail(mailOptions);

      if (result.success) {
        result.totalAttempts = attempt;
        result.totalTime = Date.now() - startTime;
        return result;
      }

      lastError = result.error;
    } catch (error) {
      lastError = error.message;
    }

    if (attempt < maxRetries) {
      const waitTime = attempt * 2000;
      console.log(
        `🔄 Retrying Brevo SMTP email in ${waitTime}ms (${attempt + 1}/${maxRetries})...`
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  return {
    success: false,
    error: lastError || "Brevo SMTP email sending failed",
    totalAttempts: maxRetries,
    totalTime: Date.now() - startTime,
  };
};

// ============================================================
// SAFE SEND
// ============================================================
const sendMailSafely = async (mailOptions) => {
  try {
    return await sendMailWithRetry(mailOptions, 3);
  } catch (error) {
    console.error("⚠️ Brevo SMTP email service error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================================
// SMTP INFORMATION
// ============================================================
const getSMTPInfo = () => {
  const uptimeSeconds = getUptime();
  
  return {
    service: "Brevo SMTP",
    host: BREVO_SMTP_HOST,
    port: BREVO_SMTP_PORT,
    user: BREVO_SMTP_USER ? "✓ Configured" : "✗ Missing",
    fromEmail: BREVO_FROM_EMAIL,
    fromName: BREVO_FROM_NAME,
    protocol: "SMTP",
    security: BREVO_USE_SSL ? 'SSL' : 'STARTTLS',
    network: "IPv4 (forced)",
    configured: isSMTPConfigured(),
    transporterCreated: Boolean(smtpTransporter),
    connected: smtpConnected,
    status: smtpConnected ? "ONLINE" : "OFFLINE",
    testEmail: BREVO_TEST_EMAIL,
    startupTestSent: startupTestSent,
    lastError: smtpLastError,
    lastCheckedAt: smtpLastCheckedAt,
    apiKey: BREVO_API_KEY ? "✓ Defined (not used in SMTP mode)" : "✗ Missing",
    uptime: {
      seconds: uptimeSeconds,
      formatted: formatUptime(uptimeSeconds),
    },
    timers: {
      totalEmailsSent: timers.totalEmailsSent,
      totalEmailsFailed: timers.totalEmailsFailed,
      successRate: timers.totalEmailsSent + timers.totalEmailsFailed > 0
        ? Math.round((timers.totalEmailsSent / (timers.totalEmailsSent + timers.totalEmailsFailed)) * 100)
        : 0,
      averageResponseTime: Math.round(timers.averageResponseTime),
      recentResponseTimes: timers.responseTimes.slice(-10).map(ms => Math.round(ms)),
      lastSuccessfulSend: timers.lastSuccessfulSend,
      lastFailedSend: timers.lastFailedSend,
    },
  };
};

// ============================================================
// CLOSE
// ============================================================
const closeTransporter = async () => {
  try {
    if (smtpTransporter) {
      smtpTransporter.close();
    }
    smtpTransporter = null;
    smtpConnected = false;

    Object.keys(timers).forEach(key => {
      if (key !== 'totalEmailsSent' && 
          key !== 'totalEmailsFailed' && 
          key !== 'responseTimes' && 
          key !== 'averageResponseTime' &&
          key !== 'uptimeStart') {
        timers[key] = null;
      }
    });

    console.log("🔌 BREVO SMTP CLIENT CLOSED");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================================
// STARTUP VERIFICATION
// ============================================================
const startSMTPVerification = async () => {
  console.log("");
  console.log("================================================");
  console.log("📧 EMAIL SERVICE STARTUP CHECK - BREVO SMTP");
  console.log("================================================");

  const result = await testConnection();

  console.log("");
  console.log("================================================");
  console.log("📊 STATUS SUMMARY");
  console.log("================================================");

  if (result.connected) {
    console.log("🟢 EMAIL SERVICE STATUS: ONLINE");
    console.log("🟢 BREVO SMTP: CONNECTED");
    console.log(`🔒 SECURITY: ${BREVO_USE_SSL ? 'SSL' : 'STARTTLS'} (PORT ${BREVO_SMTP_PORT})`);
    console.log("🔌 NETWORK: IPv4");
    console.log(`🟢 TEST EMAIL SENT TO: ${BREVO_TEST_EMAIL}`);
    console.log(`⏱️ Connection Time: ${result.connectionDuration || 'N/A'}ms`);
    console.log(`⏱️ Send Time: ${result.sendDuration || 'N/A'}ms`);
  } else {
    console.log("🔴 EMAIL SERVICE STATUS: OFFLINE");
    console.log("🔴 Reason:", result.error);
    if (result.errorCode) {
      console.log("📋 Error Code:", result.errorCode);
    }
  }

  console.log("================================================");
  console.log("");

  return result;
};

// ============================================================
// EXPORTS
// ============================================================
module.exports = {
  // Main functions
  getTransporter,
  getSMTPInfo,
  isSMTPConfigured,
  testConnection,
  startSMTPVerification,
  sendEmail,
  sendMail,
  sendMailWithRetry,
  sendMailSafely,
  closeTransporter,
  
  // Timer utilities
  startTimer,
  endTimer,
  recordResponseTime,
  getUptime,
  formatUptime,

  // Configuration (read-only)
  BREVO_SMTP_HOST,
  BREVO_SMTP_PORT,
  BREVO_SMTP_USER,
  BREVO_SMTP_PASS,
  BREVO_FROM_NAME,
  BREVO_FROM_EMAIL,
  BREVO_TEST_EMAIL,
  BREVO_USE_SSL,
  BREVO_API_KEY, // Exported but not used in SMTP mode
};