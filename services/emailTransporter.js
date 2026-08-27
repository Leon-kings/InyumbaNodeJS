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

// // const getTransporter = () => {

// //   if (!isSMTPConfigured()) {
// //     throw new Error("Gmail SMTP configuration is incomplete");
// //   }

// //   if (!smtpTransporter) {
// //     smtpTransporter = nodemailer.createTransport({
// //       host: SMTP_HOST,
// //       port: 465, // 🔒 Fixed to port 465
// //       secure: true, // 🔒 Always true for port 465 (SSL/TLS)
// //       auth: {
// //         user: SMTP_USER,
// //         pass: SMTP_PASS,
// //       },
// //     });
// //   }

// //   return smtpTransporter;
// // };

// if (!smtpTransporter) {
//     smtpTransporter = nodemailer.createTransport({
//       host: SMTP_HOST,
//       port: SMTP_PORT,
//       secure: SMTP_PORT === 465,

//       auth: {
//         user: SMTP_USER,
//         pass: SMTP_PASS,
//       },

//       connectionTimeout: 15000,
//       greetingTimeout: 15000,
//       socketTimeout: 20000,

//       tls: {
//         servername: SMTP_HOST,
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

// ============================================================
// EMAIL SERVICE - GMAIL SMTP / NODEMAILER
// ============================================================

const nodemailer = require("nodemailer");
require("dotenv").config();

// ============================================================
// CONFIGURATION
// ============================================================

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";

// Use 587 by default because 465 was timing out.
// 465 = SSL/TLS
// 587 = STARTTLS
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);

const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "INYUMBA";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SMTP_USER;

// Optional test recipient.
// Put TEST_EMAIL in .env if you want to change it.
const TEST_EMAIL = process.env.TEST_EMAIL || SMTP_USER;

// ============================================================
// SMTP STATE
// ============================================================

let smtpTransporter = null;

let smtpConnected = false;

let smtpLastError = null;

let smtpLastCheckedAt = null;

let startupTestSent = false;

// Prevent multiple simultaneous verification calls.
let verificationInProgress = false;

// ============================================================
// SMTP SECURITY
// ============================================================

const isSecureConnection = SMTP_PORT === 465;

// ============================================================
// FROM ADDRESS
// ============================================================

const getFromAddress = () => {
  if (!ADMIN_EMAIL) {
    throw new Error("ADMIN_EMAIL is required");
  }

  return `"${EMAIL_FROM_NAME}" <${ADMIN_EMAIL}>`;
};

// ============================================================
// CONFIGURATION CHECK
// ============================================================

const isSMTPConfigured = () => {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && ADMIN_EMAIL);
};

// Keep compatibility with your existing code.
const isResendConfigured = isSMTPConfigured;

// ============================================================
// ERROR DESCRIPTION
// ============================================================

const getSMTPErrorMessage = (error) => {
  if (!error) {
    return "Unknown SMTP error";
  }

  const code = error.code || "";
  const message = error.message || String(error);

  // Connection timeout
  if (
    code === "ETIMEDOUT" ||
    code === "ESOCKET" ||
    message.toLowerCase().includes("connection timeout") ||
    message.toLowerCase().includes("timeout")
  ) {
    return (
      `SMTP connection timeout to ${SMTP_HOST}:${SMTP_PORT}. ` +
      `The server may be blocking the SMTP port, the network may be unavailable, ` +
      `or Gmail may be unreachable from this hosting environment.`
    );
  }

  // DNS failure
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
    return (
      `Cannot resolve SMTP host ${SMTP_HOST}. ` +
      `Check DNS/network connectivity.`
    );
  }

  // Connection refused
  if (code === "ECONNREFUSED") {
    return (
      `SMTP connection refused by ${SMTP_HOST}:${SMTP_PORT}. ` +
      `The SMTP port may be blocked or unavailable.`
    );
  }

  // Authentication
  if (
    code === "EAUTH" ||
    message.includes("535") ||
    message.toLowerCase().includes("authentication")
  ) {
    return (
      "Gmail SMTP authentication failed. " +
      "Make sure SMTP_USER is correct and SMTP_PASS is a Gmail App Password."
    );
  }

  // TLS errors
  if (
    message.toLowerCase().includes("certificate") ||
    message.toLowerCase().includes("tls") ||
    message.toLowerCase().includes("ssl")
  ) {
    return (
      `TLS/SSL connection failed with ${SMTP_HOST}:${SMTP_PORT}. ` +
      `Check SMTP_PORT and secure configuration.`
    );
  }

  return message;
};

// ============================================================
// CREATE SMTP TRANSPORTER
// ============================================================

const getTransporter = () => {
  if (!isSMTPConfigured()) {
    throw new Error(
      "Gmail SMTP configuration is incomplete. " +
        "Required: SMTP_USER, SMTP_PASS and ADMIN_EMAIL.",
    );
  }

  if (!smtpTransporter) {
    console.log("");
    console.log("================================================");
    console.log("📧 CREATING GMAIL SMTP TRANSPORTER");
    console.log("================================================");
    console.log("🌐 Host:", SMTP_HOST);
    console.log("🔌 Port:", SMTP_PORT);
    console.log("🔒 Security:", isSecureConnection ? "SSL/TLS" : "STARTTLS");
    console.log("👤 User:", SMTP_USER);
    console.log("================================================");

    smtpTransporter = nodemailer.createTransport({
      host: SMTP_HOST,

      port: SMTP_PORT,

      // 465 = true
      // 587 = false (STARTTLS)
      secure: isSecureConnection,

      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },

      // Connection timeout
      connectionTimeout: 15000,

      // SMTP greeting timeout
      greetingTimeout: 15000,

      // Socket timeout
      socketTimeout: 20000,

      // TLS configuration
      tls: {
        servername: SMTP_HOST,

        // Do not reject valid Gmail certificates.
        rejectUnauthorized: true,
      },

      // Do not automatically open a connection.
      pool: false,

      // Maximum number of messages per connection.
      maxMessages: 100,

      // Debugging can be enabled from .env:
      // SMTP_DEBUG=true
      logger: process.env.SMTP_DEBUG === "true",
      debug: process.env.SMTP_DEBUG === "true",
    });
  }

  return smtpTransporter;
};

// ============================================================
// VERIFY SMTP CONNECTION
// ============================================================

const verifySMTPConnection = async () => {
  if (!isSMTPConfigured()) {
    return {
      success: false,
      connected: false,
      error: "Gmail SMTP configuration is incomplete",
    };
  }

  try {
    const transporter = getTransporter();

    console.log("🔄 Verifying Gmail SMTP connection...");

    console.log(`🌐 ${SMTP_HOST}:${SMTP_PORT}`);

    await transporter.verify();

    smtpConnected = true;

    smtpLastError = null;

    smtpLastCheckedAt = new Date();

    console.log("");
    console.log("================================================");
    console.log("✅ GMAIL SMTP CONNECTION VERIFIED");
    console.log("🟢 EMAIL SERVICE: ONLINE");
    console.log("🟢 SMTP: CONNECTED");
    console.log("🌐 Host:", SMTP_HOST);
    console.log("🔌 Port:", SMTP_PORT);
    console.log("🔒 Security:", isSecureConnection ? "SSL/TLS" : "STARTTLS");
    console.log("================================================");

    return {
      success: true,
      connected: true,
      error: null,
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: isSecureConnection,
      checkedAt: smtpLastCheckedAt,
    };
  } catch (error) {
    smtpConnected = false;

    smtpLastError = getSMTPErrorMessage(error);

    smtpLastCheckedAt = new Date();

    console.error("");
    console.error("================================================");
    console.error("❌ GMAIL SMTP CONNECTION FAILED");
    console.error("🔴 EMAIL SERVICE: OFFLINE");
    console.error("🌐 Host:", SMTP_HOST);
    console.error("🔌 Port:", SMTP_PORT);
    console.error("❌ Error:", smtpLastError);

    if (error.code) {
      console.error("❌ Error Code:", error.code);
    }

    console.error("================================================");

    return {
      success: false,
      connected: false,
      error: smtpLastError,
      code: error.code || null,
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: isSecureConnection,
      checkedAt: smtpLastCheckedAt,
    };
  }
};

// ============================================================
// SEND TEST EMAIL
// ============================================================

const sendTestEmail = async () => {
  if (!isSMTPConfigured()) {
    return {
      success: false,
      sent: false,
      error: "Gmail SMTP configuration is incomplete",
    };
  }

  if (!TEST_EMAIL) {
    return {
      success: false,
      sent: false,
      error: "TEST_EMAIL or SMTP_USER is required",
    };
  }

  try {
    const transporter = getTransporter();

    const from = getFromAddress();

    console.log("");
    console.log("================================================");
    console.log("📨 SENDING SMTP TEST EMAIL");
    console.log("================================================");

    console.log("📤 From:", from);
    console.log("📨 To:", TEST_EMAIL);

    const result = await transporter.sendMail({
      from,

      to: TEST_EMAIL,

      subject: "✨ INYUMBA Email Service Test",

      text:
        "This is a test email from the INYUMBA application. " +
        "Your Gmail SMTP email service is working correctly.",

      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>INYUMBA Email Test</title>

  <style>
    body {
      margin: 0;
      padding: 30px;
      background: #f1f5f9;
      font-family: Arial, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: auto;
      padding: 40px 30px;
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #eaeef5;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo {
      display: inline-block;
      padding: 12px 24px;
      background: #6366f1;
      color: white;
      font-size: 28px;
      font-weight: 700;
      border-radius: 14px;
    }

    .badge {
      display: inline-block;
      margin-top: 14px;
      padding: 6px 18px;
      background: #dcfce7;
      color: #166534;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
    }

    h2 {
      color: #1e293b;
      text-align: center;
    }

    .subtitle {
      color: #64748b;
      text-align: center;
      line-height: 1.6;
    }

    .status-card {
      background: #f8fafc;
      border-radius: 16px;
      padding: 24px;
      margin-top: 24px;
      border-left: 5px solid #22c55e;
    }

    .row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e9edf2;
      font-size: 14px;
    }

    .row:last-child {
      border-bottom: none;
    }

    .label {
      color: #475569;
      font-weight: 500;
    }

    .value {
      color: #0f172a;
      font-weight: 600;
      text-align: right;
    }

    .connected {
      color: #16a34a;
    }

    .footer {
      margin-top: 30px;
      text-align: center;
      color: #94a3b8;
      font-size: 13px;
      line-height: 1.8;
    }

    @media (max-width: 480px) {
      body {
        padding: 15px;
      }

      .container {
        padding: 25px 18px;
      }

      .row {
        flex-direction: column;
        gap: 4px;
      }

      .value {
        text-align: left;
      }
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="header">
      <div class="logo">
        INYUMBA
      </div>

      <div class="badge">
        ✅ SMTP Test Email
      </div>
    </div>

    <h2>
      Email Service is Working 🚀
    </h2>

    <p class="subtitle">
      Your INYUMBA application successfully
      connected to Gmail SMTP and sent this
      test email.
    </p>

    <div class="status-card">

      <div class="row">
        <span class="label">
          📧 Service
        </span>

        <span class="value">
          Gmail SMTP
        </span>
      </div>

      <div class="row">
        <span class="label">
          🌐 Host
        </span>

        <span class="value">
          ${SMTP_HOST}
        </span>
      </div>

      <div class="row">
        <span class="label">
          🔌 Port
        </span>

        <span class="value">
          ${SMTP_PORT}
        </span>
      </div>

      <div class="row">
        <span class="label">
          🔒 Security
        </span>

        <span class="value">
          ${isSecureConnection ? "SSL/TLS" : "STARTTLS"}
        </span>
      </div>

      <div class="row">
        <span class="label">
          📶 Status
        </span>

        <span class="value connected">
          ● Connected
        </span>
      </div>

      <div class="row">
        <span class="label">
          👤 From
        </span>

        <span class="value">
          ${from}
        </span>
      </div>

      <div class="row">
        <span class="label">
          📨 Recipient
        </span>

        <span class="value">
          ${TEST_EMAIL}
        </span>
      </div>

      <div class="row">
        <span class="label">
          ⏱️ Sent
        </span>

        <span class="value">
          ${new Date().toLocaleString()}
        </span>
      </div>

    </div>

    <div class="footer">
      <strong>INYUMBA</strong><br />

      This is an automated SMTP test.
      No action is required.
    </div>

  </div>

</body>
</html>
        `,
    });

    smtpConnected = true;

    smtpLastError = null;

    smtpLastCheckedAt = new Date();

    startupTestSent = true;

    console.log("");
    console.log("================================================");
    console.log("✅ SMTP TEST EMAIL SENT SUCCESSFULLY");
    console.log("🟢 EMAIL SERVICE: ONLINE");
    console.log("📨 Recipient:", TEST_EMAIL);
    console.log("📨 Message ID:", result.messageId || "N/A");
    console.log("================================================");

    return {
      success: true,
      sent: true,
      connected: true,
      error: null,
      data: result,
      testEmail: TEST_EMAIL,
      checkedAt: smtpLastCheckedAt,
    };
  } catch (error) {
    smtpConnected = false;

    smtpLastError = getSMTPErrorMessage(error);

    smtpLastCheckedAt = new Date();

    console.error("❌ SMTP TEST EMAIL FAILED:", smtpLastError);

    return {
      success: false,
      sent: false,
      connected: false,
      error: smtpLastError,
      code: error.code || null,
      checkedAt: smtpLastCheckedAt,
    };
  }
};

// ============================================================
// TEST SMTP CONNECTION
// ============================================================
//
// This function ONLY verifies the connection.
// It does NOT send an email.
//
// ============================================================

const testConnection = async () => {
  if (verificationInProgress) {
    return {
      success: false,
      connected: smtpConnected,
      error: "SMTP verification already in progress",
      checkedAt: smtpLastCheckedAt,
    };
  }

  verificationInProgress = true;

  try {
    return await verifySMTPConnection();
  } finally {
    verificationInProgress = false;
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
        error: "Gmail SMTP configuration is incomplete",
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

    const transporter = getTransporter();

    const from = mailOptions.from || getFromAddress();

    const to = Array.isArray(mailOptions.to)
      ? mailOptions.to.join(",")
      : mailOptions.to;

    const result = await transporter.sendMail({
      from,

      to,

      subject: mailOptions.subject,

      ...(mailOptions.text && {
        text: mailOptions.text,
      }),

      ...(mailOptions.html && {
        html: mailOptions.html,
      }),

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

      ...(mailOptions.replyTo && {
        replyTo: mailOptions.replyTo,
      }),

      ...(mailOptions.attachments && {
        attachments: mailOptions.attachments,
      }),
    });

    smtpConnected = true;

    smtpLastError = null;

    smtpLastCheckedAt = new Date();

    console.log("");
    console.log("================================================");
    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("🌐 SMTP:", `${SMTP_HOST}:${SMTP_PORT}`);
    console.log("📤 From:", from);
    console.log("📨 Message ID:", result.messageId || "N/A");
    console.log("================================================");

    return {
      success: true,
      info: result,
      data: result,
      error: null,
    };
  } catch (error) {
    smtpConnected = false;

    smtpLastError = getSMTPErrorMessage(error);

    smtpLastCheckedAt = new Date();

    console.error("❌ GMAIL SMTP EMAIL SENDING FAILED:", smtpLastError);

    return {
      success: false,
      error: smtpLastError,
      code: error.code || null,
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

    ...(text && {
      text,
    }),

    ...(html && {
      html,
    }),

    ...(cc && {
      cc,
    }),

    ...(bcc && {
      bcc,
    }),

    ...(replyTo && {
      replyTo,
    }),

    ...(attachments && {
      attachments,
    }),
  };

  return await sendMailWithRetry(mailOptions, 3);
};

// ============================================================
// SEND MAIL WITH RETRY
// ============================================================

const sendMailWithRetry = async (mailOptions, maxRetries = 3) => {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 Sending email attempt ${attempt}/${maxRetries}...`);

      const result = await sendMail(mailOptions);

      if (result.success) {
        return result;
      }

      lastError = result.error;
    } catch (error) {
      lastError = getSMTPErrorMessage(error);
    }

    if (attempt < maxRetries) {
      const delay = attempt * 2000;

      console.log(`🔄 Retrying SMTP email in ${delay / 1000} seconds...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  console.error("❌ All SMTP email attempts failed.");

  return {
    success: false,
    error: lastError || "Gmail SMTP email sending failed",
  };
};

// ============================================================
// SAFE SEND
// ============================================================

const sendMailSafely = async (mailOptions) => {
  try {
    return await sendMailWithRetry(mailOptions, 3);
  } catch (error) {
    const message = getSMTPErrorMessage(error);

    console.error("⚠️ Gmail SMTP email service error:", message);

    return {
      success: false,
      error: message,
    };
  }
};

// ============================================================
// SMTP INFORMATION
// ============================================================

const getSMTPInfo = () => {
  return {
    host: SMTP_HOST,

    port: SMTP_PORT,

    user: SMTP_USER,

    adminEmail: ADMIN_EMAIL,

    fromName: EMAIL_FROM_NAME,

    service: "Gmail SMTP",

    protocol: "SMTP",

    secure: isSecureConnection,

    security: isSecureConnection ? "SSL/TLS" : "STARTTLS",

    configured: isSMTPConfigured(),

    transporterCreated: Boolean(smtpTransporter),

    connected: smtpConnected,

    status: smtpConnected ? "ONLINE" : "OFFLINE",

    startupTestEmail: TEST_EMAIL,

    startupTestSent: startupTestSent,

    lastError: smtpLastError,

    lastCheckedAt: smtpLastCheckedAt,
  };
};

// ============================================================
// CLOSE SMTP TRANSPORTER
// ============================================================

const closeTransporter = async () => {
  try {
    if (smtpTransporter) {
      smtpTransporter.close();
    }

    smtpTransporter = null;

    smtpConnected = false;

    console.log("🔌 GMAIL SMTP CLIENT CLOSED");

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
//
// IMPORTANT:
// This verifies SMTP but does NOT send a test email.
// This prevents every server restart from sending an
// unnecessary test email.
//
// ============================================================

const startSMTPVerification = async (sendStartupTest = false) => {
  console.log("");
  console.log("================================================");
  console.log("📧 EMAIL SERVICE STARTUP CHECK");
  console.log("================================================");

  console.log("🌐 SMTP Host:", SMTP_HOST);

  console.log("🔌 SMTP Port:", SMTP_PORT);

  console.log("🔒 Security:", isSecureConnection ? "SSL/TLS" : "STARTTLS");

  console.log("📧 SMTP User:", SMTP_USER || "NOT CONFIGURED");

  console.log("================================================");

  // ----------------------------------------------------------
  // Configuration check
  // ----------------------------------------------------------

  if (!isSMTPConfigured()) {
    smtpConnected = false;

    smtpLastError = "SMTP configuration is incomplete";

    console.error("🔴 EMAIL SERVICE STATUS: OFFLINE");

    console.error("❌ Required environment variables:");

    console.error("   SMTP_HOST");

    console.error("   SMTP_PORT");

    console.error("   SMTP_USER");

    console.error("   SMTP_PASS");

    console.error("   ADMIN_EMAIL");

    console.log("================================================");

    return {
      success: false,
      connected: false,
      error: smtpLastError,
    };
  }

  // ----------------------------------------------------------
  // Verify connection
  // ----------------------------------------------------------

  const result = await testConnection();

  console.log("");

  if (result.connected) {
    console.log("🟢 EMAIL SERVICE STATUS: ONLINE");

    console.log("🟢 GMAIL SMTP: CONNECTED");

    console.log("🌐 SMTP:", `${SMTP_HOST}:${SMTP_PORT}`);

    console.log("🔒 SECURITY:", isSecureConnection ? "SSL/TLS" : "STARTTLS");

    // --------------------------------------------------------
    // Optional startup test email
    // --------------------------------------------------------

    if (sendStartupTest === true) {
      const testResult = await sendTestEmail();

      if (testResult.success) {
        console.log("🟢 STARTUP TEST EMAIL SENT");
      } else {
        console.error(
          "⚠️ SMTP connected but test email failed:",
          testResult.error,
        );
      }
    }
  } else {
    console.log("🔴 EMAIL SERVICE STATUS: OFFLINE");

    console.log("🔴 Reason:", result.error);

    console.log("");
    console.log("⚠️ IMPORTANT:");

    console.log("The application will continue running.");

    console.log("Email functionality will retry when used.");
  }

  console.log("================================================");

  return result;
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getTransporter,

  getSMTPInfo,

  isSMTPConfigured,

  isResendConfigured,

  verifySMTPConnection,

  testConnection,

  sendTestEmail,

  startSMTPVerification,

  sendEmail,

  sendMail,

  sendMailWithRetry,

  sendMailSafely,

  closeTransporter,
};
