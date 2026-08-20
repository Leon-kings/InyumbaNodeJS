// const nodemailer = require("nodemailer");
// require("dotenv").config();

// /* ============================================================
//    RESEND SMTP ENVIRONMENT
// ============================================================ */

// const SMTP_HOST = process.env.SMTP_HOST || "smtp.resend.com";

// const SMTP_PORT = parseInt(process.env.SMTP_PORT, 10) || 465;

// const SMTP_USER = process.env.SMTP_USER || "resend";

// const SMTP_PASS = process.env.SMTP_PASS || "";

// const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

// const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "INYUMBA";

// /* ============================================================
//    SMTP STATUS
// ============================================================ */

// let transporter = null;

// let smtpConnected = false;

// let smtpLastError = null;

// let smtpLastCheckedAt = null;

// /* ============================================================
//    SMTP CONFIGURATION CHECK
// ============================================================ */

// const isSMTPConfigured = () => {
//   return Boolean(
//     SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && ADMIN_EMAIL,
//   );
// };

// /* ============================================================
//    CREATE RESEND SMTP TRANSPORTER
// ============================================================ */

// const createTransporter = () => {
//   console.log("");
//   console.log("================================================");
//   console.log("📧 CREATING RESEND SMTP TRANSPORTER");
//   console.log("================================================");

//   console.log("SMTP Host:", SMTP_HOST);
//   console.log("SMTP Port:", SMTP_PORT);
//   console.log("SMTP User:", SMTP_USER);

//   console.log("SMTP Password:", SMTP_PASS ? "Configured ✅" : "Missing ❌");

//   console.log("Admin Email:", ADMIN_EMAIL || "Missing ❌");

//   console.log("From Name:", EMAIL_FROM_NAME);

//   console.log("================================================");

//   return nodemailer.createTransport({
//     host: SMTP_HOST,

//     port: SMTP_PORT,

//     /*
//      * Port 465 = secure TLS connection.
//      * Port 587 = STARTTLS.
//      */
//     secure: SMTP_PORT === 465,

//     auth: {
//       user: SMTP_USER,
//       pass: SMTP_PASS,
//     },

//     tls: {
//       minVersion: "TLSv1.2",

//       servername: SMTP_HOST,

//       rejectUnauthorized: true,
//     },

//     /*
//      * Connection timeout.
//      */
//     connectionTimeout: 150000,

//     /*
//      * SMTP greeting timeout.
//      */
//     greetingTimeout: 150000,

//     /*
//      * Socket timeout.
//      */
//     socketTimeout: 150000,

//     /*
//      * Keep the connection alive.
//      */
//     pool: true,

//     maxConnections: 3,

//     maxMessages: 1000,
//   });
// };

// /* ============================================================
//    GET TRANSPORTER
// ============================================================ */

// const getTransporter = () => {
//   if (!isSMTPConfigured()) {
//     throw new Error("Resend SMTP configuration is incomplete");
//   }

//   if (!transporter) {
//     transporter = createTransporter();
//   }

//   return transporter;
// };

// /* ============================================================
//    VERIFY RESEND SMTP CONNECTION
// ============================================================ */

// const testConnection = async () => {
//   console.log("");

//   console.log("================================================");

//   console.log("🔍 VERIFYING RESEND SMTP CONNECTION");

//   console.log("================================================");

//   smtpLastCheckedAt = new Date();

//   /* ============================================================
//      CHECK ENVIRONMENT
//   ============================================================ */

//   if (!isSMTPConfigured()) {
//     smtpConnected = false;

//     smtpLastError = "Resend SMTP configuration is incomplete";

//     console.error("❌ RESEND SMTP CONFIGURATION INCOMPLETE");

//     console.error("Required environment variables:");

//     console.error("❌ SMTP_HOST");

//     console.error("❌ SMTP_PORT");

//     console.error("❌ SMTP_USER");

//     console.error("❌ SMTP_PASS");

//     console.error("❌ ADMIN_EMAIL");

//     console.log("================================================");

//     return {
//       success: false,

//       connected: false,

//       host: SMTP_HOST,

//       port: SMTP_PORT,

//       user: SMTP_USER,

//       error: smtpLastError,
//     };
//   }

//   try {
//     /* ==========================================================
//        CREATE TRANSPORTER
//     ========================================================== */

//     const smtp = getTransporter();

//     /* ==========================================================
//        CONNECT
//     ========================================================== */

//     console.log("");

//     console.log(`🔄 Connecting to ${SMTP_HOST}:${SMTP_PORT}...`);

//     console.log(`🔐 SMTP authentication user: ${SMTP_USER}`);

//     /* ==========================================================
//        VERIFY
//     ========================================================== */

//     await smtp.verify();

//     /* ==========================================================
//        SUCCESS
//     ========================================================== */

//     smtpConnected = true;

//     smtpLastError = null;

//     smtpLastCheckedAt = new Date();

//     console.log("");

//     console.log("✅ RESEND SMTP CONNECTION VERIFIED");

//     console.log("🟢 EMAIL SERVICE: ONLINE");

//     console.log("🟢 RESEND SMTP: CONNECTED");

//     console.log(`🟢 SMTP SERVER: ${SMTP_HOST}`);

//     console.log(`🟢 SMTP PORT: ${SMTP_PORT}`);

//     console.log(`🟢 SMTP USER: ${SMTP_USER}`);

//     console.log("================================================");

//     return {
//       success: true,

//       connected: true,

//       host: SMTP_HOST,

//       port: SMTP_PORT,

//       user: SMTP_USER,

//       error: null,

//       checkedAt: smtpLastCheckedAt,
//     };
//   } catch (error) {
//     /* ==========================================================
//        FAILURE
//     ========================================================== */

//     smtpConnected = false;

//     smtpLastError = error.message;

//     smtpLastCheckedAt = new Date();

//     console.error("");

//     console.error("❌ RESEND SMTP CONNECTION FAILED");

//     console.error("🔴 EMAIL SERVICE: OFFLINE");

//     console.error("🔴 RESEND SMTP: NOT CONNECTED");

//     console.error("❌ Error:", error.message);

//     console.error(`❌ SMTP Server: ${SMTP_HOST}`);

//     console.error(`❌ SMTP Port: ${SMTP_PORT}`);

//     console.error("================================================");

//     return {
//       success: false,

//       connected: false,

//       host: SMTP_HOST,

//       port: SMTP_PORT,

//       user: SMTP_USER,

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
//     /* ==========================================================
//        CHECK CONFIGURATION
//     ========================================================== */

//     if (!isSMTPConfigured()) {
//       return {
//         success: false,

//         error: "Resend SMTP configuration is incomplete",
//       };
//     }

//     /* ==========================================================
//        VALIDATE OPTIONS
//     ========================================================== */

//     if (!mailOptions || typeof mailOptions !== "object") {
//       return {
//         success: false,

//         error: "Mail options are required",
//       };
//     }

//     /* ==========================================================
//        GET TRANSPORTER
//     ========================================================== */

//     const smtp = getTransporter();

//     /* ==========================================================
//        SEND
//     ========================================================== */

//     const info = await smtp.sendMail(mailOptions);

//     /* ==========================================================
//        SUCCESS
//     ========================================================== */

//     smtpConnected = true;

//     smtpLastError = null;

//     smtpLastCheckedAt = new Date();

//     console.log("");

//     console.log("✅ EMAIL SENT SUCCESSFULLY THROUGH RESEND");

//     console.log("📨 Message ID:", info.messageId);

//     return {
//       success: true,

//       info,

//       error: null,
//     };
//   } catch (error) {
//     smtpConnected = false;

//     smtpLastError = error.message;

//     smtpLastCheckedAt = new Date();

//     console.error("");

//     console.error("❌ RESEND EMAIL SENDING FAILED");

//     console.error("❌ Error:", error.message);

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
//   /* ==========================================================
//      VALIDATE RECIPIENT
//   ========================================================== */

//   if (!to) {
//     return {
//       success: false,

//       error: "Email recipient is required",
//     };
//   }

//   /* ==========================================================
//      VALIDATE SUBJECT
//   ========================================================== */

//   if (!subject) {
//     return {
//       success: false,

//       error: "Email subject is required",
//     };
//   }

//   /* ==========================================================
//      VALIDATE CONTENT
//   ========================================================== */

//   if (!text && !html) {
//     return {
//       success: false,

//       error: "Email text or HTML content is required",
//     };
//   }

//   /* ==========================================================
//      MAIL OPTIONS
//   ========================================================== */

//   const mailOptions = {
//     from: `"${EMAIL_FROM_NAME}" <${ADMIN_EMAIL}>`,

//     to,

//     subject,

//     ...(text
//       ? {
//           text,
//         }
//       : {}),

//     ...(html
//       ? {
//           html,
//         }
//       : {}),

//     ...(cc
//       ? {
//           cc,
//         }
//       : {}),

//     ...(bcc
//       ? {
//           bcc,
//         }
//       : {}),

//     ...(replyTo
//       ? {
//           replyTo,
//         }
//       : {}),

//     ...(attachments
//       ? {
//           attachments,
//         }
//       : {}),
//   };

//   return await sendMailWithRetry(mailOptions, 3);
// };

// /* ============================================================
//    SEND MAIL WITH RETRY
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
//       console.log(`🔄 Retrying Resend email (${attempt + 1}/${maxRetries})...`);

//       await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
//     }
//   }

//   return {
//     success: false,

//     error: lastError || "Resend email sending failed",
//   };
// };

// /* ============================================================
//    SAFE SEND MAIL
// ============================================================ */

// const sendMailSafely = async (mailOptions) => {
//   try {
//     return await sendMailWithRetry(mailOptions, 3);
//   } catch (error) {
//     console.error("⚠️ Resend email service error:", error.message);

//     return {
//       success: false,

//       error: error.message,
//     };
//   }
// };

// /* ============================================================
//    GET SMTP INFORMATION
// ============================================================ */

// const getSMTPInfo = () => {
//   return {
//     host: SMTP_HOST,

//     port: SMTP_PORT,

//     user: SMTP_USER,

//     adminEmail: ADMIN_EMAIL,

//     fromName: EMAIL_FROM_NAME,

//     configured: isSMTPConfigured(),

//     transporterCreated: Boolean(transporter),

//     connected: smtpConnected,

//     status: smtpConnected ? "ONLINE" : "OFFLINE",

//     lastError: smtpLastError,

//     lastCheckedAt: smtpLastCheckedAt,
//   };
// };

// /* ============================================================
//    CLOSE SMTP TRANSPORTER
// ============================================================ */

// const closeTransporter = async () => {
//   try {
//     if (transporter) {
//       transporter.close();

//       transporter = null;
//     }

//     smtpConnected = false;

//     console.log("");

//     console.log("🔌 RESEND SMTP TRANSPORTER CLOSED");

//     return {
//       success: true,
//     };
//   } catch (error) {
//     console.error("❌ Failed to close SMTP transporter:", error.message);

//     return {
//       success: false,

//       error: error.message,
//     };
//   }
// };

// /* ============================================================
//    START SMTP VERIFICATION
// ============================================================ */

// const startSMTPVerification = async () => {
//   console.log("");

//   console.log("================================================");

//   console.log("📧 EMAIL SERVICE STARTUP CHECK");

//   console.log("================================================");

//   const result = await testConnection();

//   console.log("");

//   if (result.connected) {
//     console.log("🟢 EMAIL SERVICE STATUS: ONLINE");
//   } else {
//     console.log("🔴 EMAIL SERVICE STATUS: OFFLINE");

//     console.log("🔴 Reason:", result.error);
//   }

//   console.log("================================================");

//   console.log("");

//   return result;
// };

// /* ============================================================
//    EXPORTS
// ============================================================ */

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
// };
// (*(((((((((((((((((((((((((((((((((((((((((((((((***************************))))))))))))))))))))))))))))))))))))))))))))))))
// const nodemailer = require("nodemailer");

// require("dotenv").config();

// /* ============================================================
//    RESEND SMTP ENVIRONMENT
//    ALWAYS USE PORT 465
// ============================================================ */

// const SMTP_HOST =
//   process.env.SMTP_HOST || "smtp.resend.com";

// /*
//  * IMPORTANT:
//  *
//  * Resend SMTP always uses port 465 in this application.
//  *
//  * SMTP_PORT is intentionally NOT read from .env.
//  * Port 587 is completely removed.
//  */
// const SMTP_PORT = 465;

// const SMTP_USER =
//   process.env.SMTP_USER || "resend";

// const SMTP_PASS =
//   process.env.SMTP_PASS || "";

// const ADMIN_EMAIL =
//   process.env.ADMIN_EMAIL || "";

// const EMAIL_FROM_NAME =
//   process.env.EMAIL_FROM_NAME || "INYUMBA";

// /* ============================================================
//    SMTP STATUS
// ============================================================ */

// let transporter = null;

// let smtpConnected = false;

// let smtpLastError = null;

// let smtpLastCheckedAt = null;

// /* ============================================================
//    SMTP CONFIGURATION CHECK
// ============================================================ */

// const isSMTPConfigured = () => {
//   return Boolean(
//     SMTP_HOST &&
//       SMTP_USER &&
//       SMTP_PASS &&
//       ADMIN_EMAIL
//   );
// };

// /* ============================================================
//    SMTP SECURITY
// ============================================================ */

// const SMTP_SECURITY = "Implicit TLS / SSL";

// /* ============================================================
//    CREATE RESEND SMTP TRANSPORTER
// ============================================================ */

// const createTransporter = () => {
//   console.log("");
//   console.log("================================================");
//   console.log("📧 CREATING RESEND SMTP TRANSPORTER");
//   console.log("================================================");

//   console.log(
//     "SMTP Host:",
//     SMTP_HOST
//   );

//   console.log(
//     "SMTP Port:",
//     SMTP_PORT
//   );

//   console.log(
//     "SMTP User:",
//     SMTP_USER
//   );

//   console.log(
//     "SMTP Password:",
//     SMTP_PASS
//       ? "Configured ✅"
//       : "Missing ❌"
//   );

//   console.log(
//     "Admin Email:",
//     ADMIN_EMAIL || "Missing ❌"
//   );

//   console.log(
//     "From Name:",
//     EMAIL_FROM_NAME
//   );

//   console.log(
//     "SMTP Security:",
//     SMTP_SECURITY
//   );

//   console.log(
//     "SMTP Protocol:",
//     "SMTPS"
//   );

//   console.log("================================================");

//   /* ==========================================================
//      RESEND SMTP CONFIGURATION

//      PORT 465 ONLY

//      secure: true
//      Implicit TLS / SSL

//      NO STARTTLS
//      NO PORT 587
//      NO TIMEOUT SETTINGS
//   ========================================================== */

//   const config = {
//     host: SMTP_HOST,

//     port: 465,

//     secure: true,

//     auth: {
//       user: SMTP_USER,
//       pass: SMTP_PASS,
//     },

//     tls: {
//       minVersion: "TLSv1.2",

//       servername: SMTP_HOST,

//       rejectUnauthorized: true,
//     },
//   };

//   return nodemailer.createTransport(config);
// };

// /* ============================================================
//    GET TRANSPORTER
// ============================================================ */

// const getTransporter = () => {
//   if (!isSMTPConfigured()) {
//     throw new Error(
//       "Resend SMTP configuration is incomplete"
//     );
//   }

//   if (!transporter) {
//     transporter = createTransporter();
//   }

//   return transporter;
// };

// /* ============================================================
//    VERIFY RESEND SMTP CONNECTION
// ============================================================ */

// const testConnection = async () => {
//   console.log("");
//   console.log("================================================");
//   console.log("🔍 VERIFYING RESEND SMTP CONNECTION");
//   console.log("================================================");

//   smtpLastCheckedAt = new Date();

//   /* ==========================================================
//      CHECK CONFIGURATION
//   ========================================================== */

//   if (!isSMTPConfigured()) {
//     smtpConnected = false;

//     smtpLastError =
//       "Resend SMTP configuration is incomplete";

//     console.error(
//       "❌ RESEND SMTP CONFIGURATION INCOMPLETE"
//     );

//     console.error("");

//     console.error(
//       "Required environment variables:"
//     );

//     console.error(
//       "SMTP_HOST"
//     );

//     console.error(
//       "SMTP_USER"
//     );

//     console.error(
//       "SMTP_PASS"
//     );

//     console.error(
//       "ADMIN_EMAIL"
//     );

//     console.error("");

//     console.error(
//       "SMTP_PORT is not required."
//     );

//     console.error(
//       "SMTP port is permanently set to 465."
//     );

//     console.log("================================================");

//     return {
//       success: false,

//       connected: false,

//       host: SMTP_HOST,

//       port: 465,

//       user: SMTP_USER,

//       error: smtpLastError,

//       checkedAt: smtpLastCheckedAt,
//     };
//   }

//   try {
//     /* ========================================================
//        CREATE / GET TRANSPORTER
//     ======================================================== */

//     const smtp = getTransporter();

//     /* ========================================================
//        CONNECTION INFORMATION
//     ======================================================== */

//     console.log(
//       `🔄 Connecting to ${SMTP_HOST}:465...`
//     );

//     console.log(
//       `🔐 SMTP authentication user: ${SMTP_USER}`
//     );

//     console.log(
//       "🔐 Security mode: Implicit TLS / SSL"
//     );

//     console.log(
//       "🔐 SMTP protocol: SMTPS"
//     );

//     /* ========================================================
//        VERIFY SMTP CONNECTION
//     ======================================================== */

//     await smtp.verify();

//     /* ========================================================
//        SUCCESS
//     ======================================================== */

//     smtpConnected = true;

//     smtpLastError = null;

//     smtpLastCheckedAt = new Date();

//     console.log("");

//     console.log("================================================");

//     console.log(
//       "✅ RESEND SMTP CONNECTION VERIFIED"
//     );

//     console.log(
//       "🟢 EMAIL SERVICE: ONLINE"
//     );

//     console.log(
//       "🟢 RESEND SMTP: CONNECTED"
//     );

//     console.log(
//       `🟢 SMTP SERVER: ${SMTP_HOST}`
//     );

//     console.log(
//       "🟢 SMTP PORT: 465"
//     );

//     console.log(
//       `🟢 SMTP USER: ${SMTP_USER}`
//     );

//     console.log(
//       "🟢 SECURITY: Implicit TLS / SSL"
//     );

//     console.log(
//       "🟢 PROTOCOL: SMTPS"
//     );

//     console.log("================================================");

//     return {
//       success: true,

//       connected: true,

//       host: SMTP_HOST,

//       port: 465,

//       user: SMTP_USER,

//       error: null,

//       checkedAt: smtpLastCheckedAt,
//     };
//   } catch (error) {
//     /* ========================================================
//        FAILURE
//     ======================================================== */

//     smtpConnected = false;

//     smtpLastError = error.message;

//     smtpLastCheckedAt = new Date();

//     console.error("");

//     console.error("================================================");

//     console.error(
//       "❌ RESEND SMTP CONNECTION FAILED"
//     );

//     console.error(
//       "🔴 EMAIL SERVICE: OFFLINE"
//     );

//     console.error(
//       "🔴 RESEND SMTP: NOT CONNECTED"
//     );

//     console.error(
//       "❌ Error:",
//       error.message
//     );

//     console.error(
//       `❌ SMTP Server: ${SMTP_HOST}`
//     );

//     console.error(
//       "❌ SMTP Port: 465"
//     );

//     console.error(
//       "❌ Security: Implicit TLS / SSL"
//     );

//     console.error("================================================");

//     return {
//       success: false,

//       connected: false,

//       host: SMTP_HOST,

//       port: 465,

//       user: SMTP_USER,

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
//     /* ========================================================
//        CHECK CONFIGURATION
//     ======================================================== */

//     if (!isSMTPConfigured()) {
//       return {
//         success: false,

//         error:
//           "Resend SMTP configuration is incomplete",
//       };
//     }

//     /* ========================================================
//        VALIDATE MAIL OPTIONS
//     ======================================================== */

//     if (
//       !mailOptions ||
//       typeof mailOptions !== "object"
//     ) {
//       return {
//         success: false,

//         error: "Mail options are required",
//       };
//     }

//     /* ========================================================
//        GET TRANSPORTER
//     ======================================================== */

//     const smtp = getTransporter();

//     /* ========================================================
//        SEND EMAIL
//     ======================================================== */

//     const info =
//       await smtp.sendMail(mailOptions);

//     /* ========================================================
//        SUCCESS
//     ======================================================== */

//     smtpConnected = true;

//     smtpLastError = null;

//     smtpLastCheckedAt = new Date();

//     console.log("");

//     console.log("================================================");

//     console.log(
//       "✅ EMAIL SENT SUCCESSFULLY THROUGH RESEND"
//     );

//     console.log(
//       "📨 Message ID:",
//       info.messageId
//     );

//     console.log(
//       "📡 SMTP:",
//       `${SMTP_HOST}:465`
//     );

//     console.log(
//       "🔐 Security: Implicit TLS / SSL"
//     );

//     console.log("================================================");

//     return {
//       success: true,

//       info,

//       error: null,
//     };
//   } catch (error) {
//     /* ========================================================
//        FAILURE
//     ======================================================== */

//     smtpConnected = false;

//     smtpLastError = error.message;

//     smtpLastCheckedAt = new Date();

//     console.error("");

//     console.error("================================================");

//     console.error(
//       "❌ RESEND EMAIL SENDING FAILED"
//     );

//     console.error(
//       "❌ Error:",
//       error.message
//     );

//     console.error(
//       "❌ SMTP:",
//       `${SMTP_HOST}:465`
//     );

//     console.error("================================================");

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
//   /* ==========================================================
//      VALIDATE RECIPIENT
//   ========================================================== */

//   if (!to) {
//     return {
//       success: false,

//       error: "Email recipient is required",
//     };
//   }

//   /* ==========================================================
//      VALIDATE SUBJECT
//   ========================================================== */

//   if (!subject) {
//     return {
//       success: false,

//       error: "Email subject is required",
//     };
//   }

//   /* ==========================================================
//      VALIDATE CONTENT
//   ========================================================== */

//   if (!text && !html) {
//     return {
//       success: false,

//       error:
//         "Email text or HTML content is required",
//     };
//   }

//   /* ==========================================================
//      MAIL OPTIONS
//   ========================================================== */

//   const mailOptions = {
//     from: `"${EMAIL_FROM_NAME}" <${ADMIN_EMAIL}>`,

//     to,

//     subject,

//     ...(text
//       ? {
//           text,
//         }
//       : {}),

//     ...(html
//       ? {
//           html,
//         }
//       : {}),

//     ...(cc
//       ? {
//           cc,
//         }
//       : {}),

//     ...(bcc
//       ? {
//           bcc,
//         }
//       : {}),

//     ...(replyTo
//       ? {
//           replyTo,
//         }
//       : {}),

//     ...(attachments
//       ? {
//           attachments,
//         }
//       : {}),
//   };

//   /* ==========================================================
//      SEND
//   ========================================================== */

//   return await sendMailWithRetry(
//     mailOptions,
//     3
//   );
// };

// /* ============================================================
//    SEND MAIL WITH RETRY
// ============================================================ */

// const sendMailWithRetry = async (
//   mailOptions,
//   maxRetries = 3
// ) => {
//   let lastError = null;

//   for (
//     let attempt = 1;
//     attempt <= maxRetries;
//     attempt++
//   ) {
//     try {
//       console.log(
//         `📧 Sending email attempt ${attempt}/${maxRetries}...`
//       );

//       const result =
//         await sendMail(mailOptions);

//       if (result.success) {
//         return result;
//       }

//       lastError = result.error;
//     } catch (error) {
//       lastError = error.message;
//     }

//     /* ========================================================
//        RETRY
//     ======================================================== */

//     if (attempt < maxRetries) {
//       console.log(
//         `🔄 Retrying Resend email (${attempt + 1}/${maxRetries})...`
//       );

//       await new Promise((resolve) =>
//         setTimeout(
//           resolve,
//           attempt * 2000
//         )
//       );
//     }
//   }

//   return {
//     success: false,

//     error:
//       lastError ||
//       "Resend email sending failed",
//   };
// };

// /* ============================================================
//    SAFE SEND MAIL
// ============================================================ */

// const sendMailSafely = async (
//   mailOptions
// ) => {
//   try {
//     return await sendMailWithRetry(
//       mailOptions,
//       3
//     );
//   } catch (error) {
//     console.error(
//       "⚠️ Resend email service error:",
//       error.message
//     );

//     return {
//       success: false,

//       error: error.message,
//     };
//   }
// };

// /* ============================================================
//    GET SMTP INFORMATION
// ============================================================ */

// const getSMTPInfo = () => {
//   return {
//     host: SMTP_HOST,

//     /*
//      * ALWAYS 465
//      */
//     port: 465,

//     user: SMTP_USER,

//     adminEmail: ADMIN_EMAIL,

//     fromName: EMAIL_FROM_NAME,

//     configured:
//       isSMTPConfigured(),

//     transporterCreated:
//       Boolean(transporter),

//     connected:
//       smtpConnected,

//     status:
//       smtpConnected
//         ? "ONLINE"
//         : "OFFLINE",

//     security:
//       "Implicit TLS / SSL",

//     protocol:
//       "SMTPS",

//     lastError:
//       smtpLastError,

//     lastCheckedAt:
//       smtpLastCheckedAt,
//   };
// };

// /* ============================================================
//    CLOSE SMTP TRANSPORTER
// ============================================================ */

// const closeTransporter = async () => {
//   try {
//     if (transporter) {
//       transporter.close();

//       transporter = null;
//     }

//     smtpConnected = false;

//     console.log("");

//     console.log(
//       "🔌 RESEND SMTP TRANSPORTER CLOSED"
//     );

//     return {
//       success: true,
//     };
//   } catch (error) {
//     console.error(
//       "❌ Failed to close SMTP transporter:",
//       error.message
//     );

//     return {
//       success: false,

//       error: error.message,
//     };
//   }
// };

// /* ============================================================
//    START SMTP VERIFICATION
// ============================================================ */

// const startSMTPVerification = async () => {
//   console.log("");

//   console.log("================================================");

//   console.log(
//     "📧 EMAIL SERVICE STARTUP CHECK"
//   );

//   console.log("================================================");

//   const result =
//     await testConnection();

//   console.log("");

//   if (result.connected) {
//     console.log(
//       "🟢 EMAIL SERVICE STATUS: ONLINE"
//     );

//     console.log(
//       "🟢 RESEND SMTP PORT: 465"
//     );

//     console.log(
//       "🟢 RESEND SMTP SECURITY: Implicit TLS / SSL"
//     );
//   } else {
//     console.log(
//       "🔴 EMAIL SERVICE STATUS: OFFLINE"
//     );

//     console.log(
//       "🔴 Reason:",
//       result.error
//     );
//   }

//   console.log("================================================");

//   console.log("");

//   return result;
// };

// /* ============================================================
//    EXPORTS
// ============================================================ */

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
// };















const nodemailer = require("nodemailer");
require("dotenv").config();

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";

const SMTP_PORT = "465"; // 🔒 Fixed to port 465 only

const SMTP_USER = process.env.SMTP_USER || "";

const SMTP_PASS = process.env.SMTP_PASS || "";

const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "INYUMBA";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SMTP_USER;

const TEST_EMAIL = "kingsleon250@gmail.com";

let smtpTransporter = null;

let smtpConnected = false;

let smtpLastError = null;

let smtpLastCheckedAt = null;

let startupTestSent = false;

/* ============================================================
   FROM ADDRESS
============================================================ */

const getFromAddress = () => {
  if (!ADMIN_EMAIL) {
    throw new Error("ADMIN_EMAIL is required");
  }

  return `"${EMAIL_FROM_NAME}" <${ADMIN_EMAIL}>`;
};

/* ============================================================
   CONFIGURATION
============================================================ */

const isSMTPConfigured = () => {
  return Boolean(SMTP_USER && SMTP_PASS && ADMIN_EMAIL);
};

const isResendConfigured = isSMTPConfigured;

/* ============================================================
   SMTP TRANSPORTER (GMAIL - PORT 465 ONLY)
============================================================ */

const getTransporter = () => {
  if (!isSMTPConfigured()) {
    throw new Error("Gmail SMTP configuration is incomplete");
  }

  if (!smtpTransporter) {
    smtpTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: 465, // 🔒 Fixed to port 465
      secure: true, // 🔒 Always true for port 465 (SSL/TLS)
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return smtpTransporter;
};

/* ============================================================
   TEST SMTP (GMAIL)
============================================================ */

const testConnection = async () => {
  console.log("");
  console.log("================================================");
  console.log("🔍 VERIFYING GMAIL SMTP CONNECTION (PORT 465)");
  console.log("================================================");

  smtpLastCheckedAt = new Date();

  if (!isSMTPConfigured()) {
    smtpConnected = false;

    smtpLastError = "Gmail SMTP configuration is incomplete";

    console.error("❌ GMAIL SMTP CONFIGURATION INCOMPLETE");

    console.error("Required environment variables:");

    console.error("SMTP_USER");

    console.error("SMTP_PASS");

    console.error("ADMIN_EMAIL");

    console.log("================================================");

    return {
      success: false,
      connected: false,
      error: smtpLastError,
      checkedAt: smtpLastCheckedAt,
    };
  }

  try {
    const transporter = getTransporter();

    const from = getFromAddress();

    console.log("🔄 Connecting to Gmail SMTP...");

    console.log("🌐 Host:", SMTP_HOST);

    console.log("🔒 Port: 465 (SSL/TLS)");

    console.log("📤 From:", from);

    console.log("📨 Test recipient:", TEST_EMAIL);

    await transporter.verify();

    const result = await transporter.sendMail({
      from,
      to: TEST_EMAIL,
      subject: "✨ INYUMBA Email Service Test",
      text: "This is a test email from the INYUMBA application. The Gmail SMTP email service is working correctly.",
      html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>INYUMBA Email Test</title>
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
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
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
            border-left: 5px solid #22c55e;
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
            color: #6366f1;
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

          <!-- Header -->
          <div class="header">
            <div class="logo-icon">INYUMBA</div>
            <div class="badge">✅ Test Email</div>
          </div>

          <h2>Email Service is Live 🚀</h2>
          <p class="subtitle">
            This is a test email from the <strong>INYUMBA</strong> application.
            Your Gmail SMTP configuration is working perfectly.
          </p>

          <!-- Status Card -->
          <div class="status-card">
            <div class="status-row">
              <span class="status-label">📧 Service</span>
              <span class="status-value">Gmail SMTP (Port 465)</span>
            </div>
            <div class="status-row">
              <span class="status-label">🔒 Security</span>
              <span class="status-value">SSL/TLS</span>
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
              <span class="status-value">${TEST_EMAIL}</span>
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

          <!-- Additional Info -->
          <p style="font-family:'Inter',Arial,sans-serif;font-size:14px;color:#475569;text-align:center;margin:10px 0 0;">
            This automated test confirms that your email service is<br />
            <strong style="color:#16a34a;">fully operational</strong> and ready for production.
          </p>

          <!-- Footer -->
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
    smtpConnected = true;

    smtpLastError = null;

    smtpLastCheckedAt = new Date();

    startupTestSent = true;

    console.log("");
    console.log("================================================");
    console.log("✅ GMAIL SMTP CONNECTION VERIFIED (PORT 465)");
    console.log("🟢 EMAIL SERVICE: ONLINE");
    console.log("🟢 GMAIL SMTP: CONNECTED");
    console.log("🔒 SECURITY: SSL/TLS");
    console.log(`🟢 TEST EMAIL SENT TO: ${TEST_EMAIL}`);
    console.log("📨 Message ID:", result.messageId || "N/A");
    console.log("================================================");

    return {
      success: true,
      connected: true,
      error: null,
      data: result,
      testEmail: TEST_EMAIL,
      checkedAt: smtpLastCheckedAt,
    };
  } catch (error) {
    smtpConnected = false;

    smtpLastError = error.message;

    smtpLastCheckedAt = new Date();

    console.error("");
    console.error("================================================");
    console.error("❌ GMAIL SMTP CONNECTION FAILED (PORT 465)");
    console.error("🔴 EMAIL SERVICE: OFFLINE");
    console.error("❌ Error:", error.message);
    console.error("================================================");

    return {
      success: false,
      connected: false,
      error: error.message,
      checkedAt: smtpLastCheckedAt,
    };
  }
};

/* ============================================================
   SEND MAIL
============================================================ */

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
    console.log("✅ EMAIL SENT SUCCESSFULLY THROUGH GMAIL SMTP");
    console.log("🔒 SECURITY: SSL/TLS (PORT 465)");
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

    smtpLastError = error.message;

    smtpLastCheckedAt = new Date();

    console.error("❌ GMAIL SMTP EMAIL SENDING FAILED:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

/* ============================================================
   SEND EMAIL
============================================================ */

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

/* ============================================================
   RETRY
============================================================ */

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
      lastError = error.message;
    }

    if (attempt < maxRetries) {
      console.log(
        `🔄 Retrying Gmail SMTP email (${attempt + 1}/${maxRetries})...`,
      );

      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
  }

  return {
    success: false,
    error: lastError || "Gmail SMTP email sending failed",
  };
};

/* ============================================================
   SAFE SEND
============================================================ */

const sendMailSafely = async (mailOptions) => {
  try {
    return await sendMailWithRetry(mailOptions, 3);
  } catch (error) {
    console.error("⚠️ Gmail SMTP email service error:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

/* ============================================================
   SMTP INFORMATION
============================================================ */

const getSMTPInfo = () => {
  return {
    host: SMTP_HOST,
    port: 465, // 🔒 Fixed port
    user: SMTP_USER,
    adminEmail: ADMIN_EMAIL,
    fromName: EMAIL_FROM_NAME,
    service: "Gmail SMTP",
    protocol: "SMTP",
    security: "SSL/TLS", // 🔒 Always SSL/TLS
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

/* ============================================================
   CLOSE
============================================================ */

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

/* ============================================================
   STARTUP VERIFICATION
============================================================ */

const startSMTPVerification = async () => {
  console.log("");
  console.log("================================================");
  console.log("📧 EMAIL SERVICE STARTUP CHECK (PORT 465)");
  console.log("================================================");

  const result = await testConnection();

  console.log("");

  if (result.connected) {
    console.log("🟢 EMAIL SERVICE STATUS: ONLINE");
    console.log("🟢 GMAIL SMTP: CONNECTED");
    console.log("🔒 SECURITY: SSL/TLS (PORT 465)");
    console.log(`🟢 TEST EMAIL SENT TO: ${TEST_EMAIL}`);
  } else {
    console.log("🔴 EMAIL SERVICE STATUS: OFFLINE");
    console.log("🔴 Reason:", result.error);
  }

  console.log("================================================");
  console.log("");

  return result;
};

module.exports = {
  getTransporter,
  getSMTPInfo,
  isSMTPConfigured,
  isResendConfigured,
  testConnection,
  startSMTPVerification,
  sendEmail,
  sendMail,
  sendMailWithRetry,
  sendMailSafely,
  closeTransporter,
};