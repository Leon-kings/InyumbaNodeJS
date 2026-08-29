
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// /* ============================================================
//    SMTP CONFIGURATION
// ============================================================ */

// const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";

// // Use the port from .env.
// // Default is 465 if SMTP_PORT is not provided.
// const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;

// // Port 465 = SSL/TLS immediately.
// // Port 587 = STARTTLS.
// const SMTP_SECURE =
//   process.env.SMTP_SECURE !== undefined
//     ? process.env.SMTP_SECURE === "true"
//     : SMTP_PORT === 465;

// const SMTP_USER = process.env.SMTP_USER || "";
// const SMTP_PASS = process.env.SMTP_PASS || "";

// const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "INYUMBA";

// const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SMTP_USER;

// const TEST_EMAIL = "kingsleon250@gmail.com";

// /* ============================================================
//    SMTP STATE
// ============================================================ */

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
//    CONFIGURATION CHECK
// ============================================================ */

// const isSMTPConfigured = () => {
//   return Boolean(SMTP_USER && SMTP_PASS && ADMIN_EMAIL);
// };

// // Kept for compatibility with your existing code.
// const isResendConfigured = isSMTPConfigured;

// /* ============================================================
//    SMTP TRANSPORTER
// ============================================================ */

// const getTransporter = () => {
//   if (!isSMTPConfigured()) {
//     throw new Error("SMTP configuration is incomplete");
//   }

//   if (!smtpTransporter) {
//     smtpTransporter = nodemailer.createTransport({
//       host: SMTP_HOST,
//       port: SMTP_PORT,
//       secure: SMTP_SECURE,

//       auth: {
//         user: SMTP_USER,
//         pass: SMTP_PASS,
//       },
//     });
//   }

//   return smtpTransporter;
// };

// /* ============================================================
//    TEST SMTP CONNECTION
// ============================================================ */

// const testConnection = async () => {
//   console.log("");
//   console.log("================================================");
//   console.log("🔍 VERIFYING SMTP CONNECTION");
//   console.log("================================================");

//   smtpLastCheckedAt = new Date();

//   if (!isSMTPConfigured()) {
//     smtpConnected = false;

//     smtpLastError = "SMTP configuration is incomplete";

//     console.error("❌ SMTP CONFIGURATION INCOMPLETE");

//     console.error("Required environment variables:");

//     console.error("SMTP_HOST");
//     console.error("SMTP_PORT");
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

//     console.log("🔄 Connecting to SMTP...");
//     console.log("🌐 Host:", SMTP_HOST);
//     console.log("🔌 Port:", SMTP_PORT);
//     console.log("🔒 Security:", SMTP_SECURE ? "SSL/TLS" : "STARTTLS");
//     console.log("📤 From:", from);
//     console.log("📨 Test recipient:", TEST_EMAIL);

//     // Verify SMTP connection.
//     await transporter.verify();

//     console.log("✅ SMTP CONNECTION VERIFIED");

//     // Send startup test email.
//     const result = await transporter.sendMail({
//       from,
//       to: TEST_EMAIL,

//       subject: "✨ INYUMBA Email Service Test",

//       text: "This is a test email from the INYUMBA application. The SMTP email service is working correctly.",

//       html: `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8" />

//   <meta
//     name="viewport"
//     content="width=device-width, initial-scale=1.0"
//   />

//   <title>INYUMBA Email Test</title>

//   <style>
//     @import url(
//       'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
//     );

//     .container {
//       max-width: 600px;
//       margin: auto;
//       padding: 40px 30px;
//       background: #ffffff;
//       border-radius: 20px;
//       box-shadow:
//         0 20px 60px rgba(0, 0, 0, 0.08);
//       border: 1px solid #eaeef5;
//     }

//     .header {
//       text-align: center;
//       margin-bottom: 30px;
//     }

//     .logo-icon {
//       display: inline-block;
//       background:
//         linear-gradient(
//           135deg,
//           #6366f1,
//           #8b5cf6
//         );
//       color: white;
//       font-size: 28px;
//       font-weight: 700;
//       padding: 12px 24px;
//       border-radius: 14px;
//       letter-spacing: -0.5px;
//     }

//     .badge {
//       display: inline-block;
//       margin-top: 14px;
//       background: #dcfce7;
//       color: #166534;
//       font-size: 13px;
//       font-weight: 600;
//       padding: 6px 18px;
//       border-radius: 100px;
//     }

//     h2 {
//       font-family: 'Inter', Arial, sans-serif;
//       font-size: 26px;
//       font-weight: 700;
//       color: #1e293b;
//       margin: 20px 0 10px;
//     }

//     .subtitle {
//       font-family: 'Inter', Arial, sans-serif;
//       font-size: 15px;
//       color: #64748b;
//       margin-bottom: 30px;
//       line-height: 1.6;
//     }

//     .status-card {
//       background: #f8fafc;
//       border-radius: 16px;
//       padding: 24px 28px;
//       margin: 24px 0;
//       border-left: 5px solid #22c55e;
//     }

//     .status-row {
//       display: flex;
//       justify-content: space-between;
//       padding: 8px 0;
//       font-family: 'Inter', Arial, sans-serif;
//       font-size: 14px;
//       border-bottom: 1px solid #e9edf2;
//     }

//     .status-row:last-child {
//       border-bottom: none;
//     }

//     .status-label {
//       font-weight: 500;
//       color: #475569;
//     }

//     .status-value {
//       font-weight: 600;
//       color: #0f172a;
//     }

//     .status-value.connected {
//       color: #16a34a;
//     }

//     .divider {
//       border: none;
//       border-top: 2px dashed #e2e8f0;
//       margin: 28px 0;
//     }

//     .footer {
//       text-align: center;
//       font-family: 'Inter', Arial, sans-serif;
//       font-size: 13px;
//       color: #94a3b8;
//       margin-top: 30px;
//       line-height: 1.8;
//     }

//     @media (max-width: 480px) {
//       .container {
//         padding: 24px 16px;
//       }

//       .status-row {
//         flex-direction: column;
//         gap: 2px;
//         padding: 10px 0;
//       }

//       .logo-icon {
//         font-size: 22px;
//         padding: 10px 18px;
//       }
//     }
//   </style>
// </head>

// <body
//   style="
//     margin:0;
//     padding:30px;
//     font-family:'Inter',Arial,sans-serif;
//     background:#f1f5f9;
//   "
// >
//   <div class="container">

//     <div class="header">
//       <div class="logo-icon">
//         INYUMBA
//       </div>

//       <div class="badge">
//         ✅ Test Email
//       </div>
//     </div>

//     <h2>
//       Email Service is Live 🚀
//     </h2>

//     <p class="subtitle">
//       This is a test email from the
//       <strong>INYUMBA</strong>
//       application.
//       Your SMTP email configuration is working correctly.
//     </p>

//     <div class="status-card">

//       <div class="status-row">
//         <span class="status-label">
//           📧 Service
//         </span>

//         <span class="status-value">
//           SMTP
//         </span>
//       </div>

//       <div class="status-row">
//         <span class="status-label">
//           🌐 Host
//         </span>

//         <span class="status-value">
//           ${SMTP_HOST}
//         </span>
//       </div>

//       <div class="status-row">
//         <span class="status-label">
//           🔌 Port
//         </span>

//         <span class="status-value">
//           ${SMTP_PORT}
//         </span>
//       </div>

//       <div class="status-row">
//         <span class="status-label">
//           🔒 Security
//         </span>

//         <span class="status-value">
//           ${SMTP_SECURE ? "SSL/TLS" : "STARTTLS"}
//         </span>
//       </div>

//       <div class="status-row">
//         <span class="status-label">
//           📶 Status
//         </span>

//         <span class="status-value connected">
//           ● Connected
//         </span>
//       </div>

//       <div class="status-row">
//         <span class="status-label">
//           👤 From
//         </span>

//         <span class="status-value">
//           ${from}
//         </span>
//       </div>

//       <div class="status-row">
//         <span class="status-label">
//           📨 Recipient
//         </span>

//         <span class="status-value">
//           ${TEST_EMAIL}
//         </span>
//       </div>

//       <div class="status-row">
//         <span class="status-label">
//           ⏱️ Sent at
//         </span>

//         <span class="status-value">
//           ${new Date().toLocaleString("en-US", {
//             timeZone: "UTC",
//             dateStyle: "full",
//             timeStyle: "medium",
//           })} UTC
//         </span>
//       </div>

//     </div>

//     <hr class="divider" />

//     <p
//       style="
//         font-family:'Inter',Arial,sans-serif;
//         font-size:14px;
//         color:#475569;
//         text-align:center;
//         margin:10px 0 0;
//       "
//     >
//       This automated test confirms that your
//       email service is
//       <strong style="color:#16a34a;">
//         fully operational
//       </strong>
//       and ready for production.
//     </p>

//     <div class="footer">
//       <p>
//         © ${new Date().getFullYear()}
//         <strong>INYUMBA</strong>
//         &mdash; Built with ❤️
//         <br />

//         <span
//           style="
//             font-size:12px;
//             color:#cbd5e1;
//           "
//         >
//           This is an automated system test.
//           No action is required.
//         </span>
//       </p>
//     </div>

//   </div>
// </body>
// </html>
//       `,
//     });

//     smtpConnected = true;
//     smtpLastError = null;
//     smtpLastCheckedAt = new Date();
//     startupTestSent = true;

//     console.log("");
//     console.log("================================================");
//     console.log("✅ SMTP CONNECTION VERIFIED");
//     console.log("🟢 EMAIL SERVICE: ONLINE");
//     console.log("🌐 HOST:", SMTP_HOST);
//     console.log("🔌 PORT:", SMTP_PORT);
//     console.log("🔒 SECURITY:", SMTP_SECURE ? "SSL/TLS" : "STARTTLS");
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
//     console.error("❌ SMTP CONNECTION FAILED");
//     console.error("🔴 EMAIL SERVICE: OFFLINE");
//     console.error("🌐 HOST:", SMTP_HOST);
//     console.error("🔌 PORT:", SMTP_PORT);
//     console.error("🔒 SECURITY:", SMTP_SECURE ? "SSL/TLS" : "STARTTLS");
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
//         error: "SMTP configuration is incomplete",
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
//     console.log("✅ EMAIL SENT SUCCESSFULLY");
//     console.log("🌐 HOST:", SMTP_HOST);
//     console.log("🔌 PORT:", SMTP_PORT);
//     console.log("🔒 SECURITY:", SMTP_SECURE ? "SSL/TLS" : "STARTTLS");
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

//     console.error("❌ SMTP EMAIL SENDING FAILED:", error.message);

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
//       console.log(`🔄 Retrying SMTP email (${attempt + 1}/${maxRetries})...`);

//       await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
//     }
//   }

//   return {
//     success: false,
//     error: lastError || "SMTP email sending failed",
//   };
// };

// /* ============================================================
//    SAFE SEND
// ============================================================ */

// const sendMailSafely = async (mailOptions) => {
//   try {
//     return await sendMailWithRetry(mailOptions, 3);
//   } catch (error) {
//     console.error("⚠️ SMTP email service error:", error.message);

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

//     port: SMTP_PORT,

//     user: SMTP_USER,

//     adminEmail: ADMIN_EMAIL,

//     fromName: EMAIL_FROM_NAME,

//     service: "SMTP",

//     protocol: "SMTP",

//     security: SMTP_SECURE ? "SSL/TLS" : "STARTTLS",

//     configured: isSMTPConfigured(),

//     transporterCreated: Boolean(smtpTransporter),

//     connected: smtpConnected,

//     status: smtpConnected ? "ONLINE" : "OFFLINE",

//     startupTestEmail: TEST_EMAIL,

//     startupTestSent,

//     lastError: smtpLastError,

//     lastCheckedAt: smtpLastCheckedAt,
//   };
// };

// /* ============================================================
//    CLOSE TRANSPORTER
// ============================================================ */

// const closeTransporter = async () => {
//   try {
//     if (smtpTransporter) {
//       smtpTransporter.close();
//     }

//     smtpTransporter = null;

//     smtpConnected = false;

//     console.log("🔌 SMTP CLIENT CLOSED");

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
//   console.log("📧 EMAIL SERVICE STARTUP CHECK");
//   console.log("================================================");

//   console.log("🌐 Host:", SMTP_HOST);
//   console.log("🔌 Port:", SMTP_PORT);
//   console.log("🔒 Security:", SMTP_SECURE ? "SSL/TLS" : "STARTTLS");

//   const result = await testConnection();

//   console.log("");

//   if (result.connected) {
//     console.log("🟢 EMAIL SERVICE STATUS: ONLINE");

//     console.log("🟢 SMTP: CONNECTED");

//     console.log(`🔌 PORT: ${SMTP_PORT}`);

//     console.log("🔒 SECURITY:", SMTP_SECURE ? "SSL/TLS" : "STARTTLS");

//     console.log(`🟢 TEST EMAIL SENT TO: ${TEST_EMAIL}`);
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

//   isResendConfigured,

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

/* ============================================================
   SMTP CONFIGURATION
   ============================================================ */

const SMTP_HOST =
  process.env.SMTP_HOST || "smtp.mail.yahoo.com";

const SMTP_PORT =
  Number(process.env.SMTP_PORT) || 465;

const SMTP_SECURE =
  process.env.SMTP_SECURE !== undefined
    ? String(process.env.SMTP_SECURE).toLowerCase() === "true"
    : true;

const SMTP_USER =
  process.env.SMTP_USER || "";

const SMTP_PASS =
  process.env.SMTP_PASS || "";

const EMAIL_FROM_NAME =
  process.env.EMAIL_FROM_NAME || "INYUMBA";

const TEST_EMAIL =
  process.env.TEST_EMAIL || "kingsleon250@gmail.com";


/* ============================================================
   SMTP STATE
   ============================================================ */

let smtpTransporter = null;

let smtpConnected = false;

let smtpLastError = null;

let smtpLastCheckedAt = null;


/*
 * Prevent the startup test email from being sent more than
 * once during the lifetime of this Node.js process.
 */
let startupTestSent = false;


/*
 * Prevent two simultaneous startup calls from sending
 * two test emails.
 */
let startupTestSending = null;


/* ============================================================
   GET FROM ADDRESS
   ============================================================ */

const getFromAddress = () => {
  if (!SMTP_USER) {
    throw new Error(
      "SMTP_USER is required"
    );
  }

  return `"${EMAIL_FROM_NAME}" <${SMTP_USER}>`;
};


/* ============================================================
   SMTP CONFIGURATION CHECK
   ============================================================ */

const isSMTPConfigured = () => {
  return Boolean(
    SMTP_HOST &&
    SMTP_PORT &&
    SMTP_USER &&
    SMTP_PASS
  );
};


/*
 * Kept for compatibility with existing code.
 */
const isResendConfigured = () => {
  return isSMTPConfigured();
};


/* ============================================================
   CREATE SMTP TRANSPORTER
   ============================================================ */

const getTransporter = () => {

  if (!isSMTPConfigured()) {
    throw new Error(
      "SMTP configuration is incomplete. " +
      "Check SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS."
    );
  }


  /*
   * Reuse existing transporter.
   */
  if (smtpTransporter) {
    return smtpTransporter;
  }


  smtpTransporter =
    nodemailer.createTransport({

      host:
        SMTP_HOST,

      port:
        SMTP_PORT,

      secure:
        SMTP_SECURE,

      auth: {

        user:
          SMTP_USER,

        pass:
          SMTP_PASS,

      },

      /*
       * Port 465 uses SSL/TLS immediately.
       */
      tls: {

        minVersion:
          "TLSv1.2",

      },

      /*
       * Prevent the application from waiting forever
       * when the SMTP server cannot be reached.
       */
      connectionTimeout:
        30000,

      greetingTimeout:
        30000,

      socketTimeout:
        30000,

      /*
       * Do not use connection pooling.
       * This keeps the sending behavior simple and avoids
       * unexpected repeated sends.
       */
      pool:
        false,

    });


  return smtpTransporter;
};


/* ============================================================
   TEST SMTP CONNECTION
   ============================================================ */

const testConnection = async () => {

  console.log("");

  console.log(
    "================================================"
  );

  console.log(
    "🔍 VERIFYING SMTP CONNECTION"
  );

  console.log(
    "================================================"
  );


  smtpLastCheckedAt =
    new Date();


  /* ----------------------------------------------------------
     CHECK CONFIGURATION
     ---------------------------------------------------------- */

  if (!isSMTPConfigured()) {

    smtpConnected =
      false;

    smtpLastError =
      "SMTP configuration is incomplete";


    console.error(
      "❌ SMTP CONFIGURATION INCOMPLETE"
    );

    console.error(
      "Required environment variables:"
    );

    console.error(
      "SMTP_HOST"
    );

    console.error(
      "SMTP_PORT"
    );

    console.error(
      "SMTP_SECURE"
    );

    console.error(
      "SMTP_USER"
    );

    console.error(
      "SMTP_PASS"
    );


    console.log(
      "================================================"
    );


    return {

      success:
        false,

      connected:
        false,

      error:
        smtpLastError,

      checkedAt:
        smtpLastCheckedAt,

    };
  }


  try {

    const transporter =
      getTransporter();


    const from =
      getFromAddress();


    console.log(
      "🔄 Connecting to SMTP..."
    );

    console.log(
      "🌐 Host:",
      SMTP_HOST
    );

    console.log(
      "🔌 Port:",
      SMTP_PORT
    );

    console.log(
      "🔒 Security:",
      SMTP_SECURE
        ? "SSL/TLS"
        : "STARTTLS"
    );

    console.log(
      "📤 From:",
      from
    );

    console.log(
      "📨 Test recipient:",
      TEST_EMAIL
    );


    /* --------------------------------------------------------
       VERIFY CONNECTION
       -------------------------------------------------------- */

    await transporter.verify();


    smtpConnected =
      true;

    smtpLastError =
      null;

    smtpLastCheckedAt =
      new Date();


    console.log(
      "✅ SMTP CONNECTION VERIFIED"
    );


    /* --------------------------------------------------------
       DO NOT SEND DUPLICATE STARTUP EMAIL
       -------------------------------------------------------- */

    if (startupTestSent) {

      console.log("");

      console.log(
        "ℹ️ STARTUP TEST EMAIL ALREADY SENT"
      );

      console.log(
        `📨 Recipient: ${TEST_EMAIL}`
      );

      console.log(
        "⏭️ DUPLICATE TEST EMAIL SKIPPED"
      );

      console.log(
        "================================================"
      );


      return {

        success:
          true,

        connected:
          true,

        error:
          null,

        data:
          null,

        testEmail:
          TEST_EMAIL,

        startupTestSent:
          true,

        skippedDuplicateTestEmail:
          true,

        checkedAt:
          smtpLastCheckedAt,

      };
    }


    /* --------------------------------------------------------
       ANOTHER TEST EMAIL IS ALREADY BEING SENT
       -------------------------------------------------------- */

    if (startupTestSending) {

      console.log("");

      console.log(
        "ℹ️ STARTUP TEST EMAIL IS ALREADY IN PROGRESS"
      );

      console.log(
        "⏳ WAITING FOR EXISTING SEND..."
      );


      const existingResult =
        await startupTestSending;


      return {

        ...existingResult,

        skippedDuplicateTestEmail:
          true,

      };
    }


    /* --------------------------------------------------------
       SEND STARTUP TEST EMAIL
       -------------------------------------------------------- */

    startupTestSending =
      (async () => {

        console.log("");

        console.log(
          "📧 SENDING STARTUP TEST EMAIL"
        );

        console.log(
          `📨 Recipient: ${TEST_EMAIL}`
        );


        const result =
          await transporter.sendMail({

            /*
             * IMPORTANT:
             *
             * Sender is always SMTP_USER.
             */
            from,

            to:
              TEST_EMAIL,

            subject:
              "✨ INYUMBA Email Service Test",

            text:
              "This is a test email from the INYUMBA application. The SMTP email service is working correctly.",

            html: `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<title>
INYUMBA Email Test
</title>

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
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaeef5;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  display: inline-block;
  background:
    linear-gradient(
      135deg,
      #6366f1,
      #8b5cf6
    );
  color: white;
  font-size: 28px;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 14px;
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
  font-size: 26px;
  color: #1e293b;
  margin: 20px 0 10px;
}

.subtitle {
  font-size: 15px;
  color: #64748b;
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
  padding: 9px 0;
  font-size: 14px;
  border-bottom: 1px solid #e9edf2;
}

.status-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #475569;
}

.value {
  font-weight: 600;
  color: #0f172a;
}

.connected {
  color: #16a34a;
}

.divider {
  border: none;
  border-top: 2px dashed #e2e8f0;
  margin: 28px 0;
}

.footer {
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
  margin-top: 30px;
  line-height: 1.8;
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
      ✅ Test Email
    </div>

  </div>


  <h2>
    Email Service is Live 🚀
  </h2>


  <p class="subtitle">

    This is a test email from the
    <strong>INYUMBA</strong>
    application.

    Your SMTP email configuration
    is working correctly.

  </p>


  <div class="status-card">


    <div class="status-row">

      <span class="label">
        📧 Service
      </span>

      <span class="value">
        SMTP
      </span>

    </div>


    <div class="status-row">

      <span class="label">
        🌐 Host
      </span>

      <span class="value">
        ${SMTP_HOST}
      </span>

    </div>


    <div class="status-row">

      <span class="label">
        🔌 Port
      </span>

      <span class="value">
        ${SMTP_PORT}
      </span>

    </div>


    <div class="status-row">

      <span class="label">
        🔒 Security
      </span>

      <span class="value">
        ${
          SMTP_SECURE
            ? "SSL/TLS"
            : "STARTTLS"
        }
      </span>

    </div>


    <div class="status-row">

      <span class="label">
        📶 Status
      </span>

      <span class="value connected">
        ● Connected
      </span>

    </div>


    <div class="status-row">

      <span class="label">
        👤 From
      </span>

      <span class="value">
        ${SMTP_USER}
      </span>

    </div>


    <div class="status-row">

      <span class="label">
        📨 Recipient
      </span>

      <span class="value">
        ${TEST_EMAIL}
      </span>

    </div>


    <div class="status-row">

      <span class="label">
        ⏱️ Sent at
      </span>

      <span class="value">

        ${new Date().toLocaleString(
          "en-US",
          {
            timeZone: "UTC",
            dateStyle: "full",
            timeStyle: "medium",
          }
        )}

        UTC

      </span>

    </div>


  </div>


  <hr class="divider">


  <p
    style="
      font-size:14px;
      color:#475569;
      text-align:center;
    "
  >

    This automated test confirms
    that your email service is

    <strong style="color:#16a34a;">
      fully operational
    </strong>

    and ready for production.

  </p>


  <div class="footer">

    © ${new Date().getFullYear()}
    <strong>INYUMBA</strong>
    — Built with ❤️

    <br>

    <span style="font-size:12px;">

      This is an automated system test.
      No action is required.

    </span>

  </div>


</div>

</body>

</html>
            `,
          });


        /*
         * ONLY mark the startup email as sent after
         * Nodemailer successfully receives acceptance
         * from the SMTP server.
         */
        startupTestSent =
          true;


        smtpConnected =
          true;

        smtpLastError =
          null;

        smtpLastCheckedAt =
          new Date();


        console.log("");

        console.log(
          "================================================"
        );

        console.log(
          "✅ SMTP CONNECTION VERIFIED"
        );

        console.log(
          "🟢 EMAIL SERVICE: ONLINE"
        );

        console.log(
          "🌐 HOST:",
          SMTP_HOST
        );

        console.log(
          "🔌 PORT:",
          SMTP_PORT
        );

        console.log(
          "🔒 SECURITY:",
          SMTP_SECURE
            ? "SSL/TLS"
            : "STARTTLS"
        );

        console.log(
          `🟢 TEST EMAIL SENT TO: ${TEST_EMAIL}`
        );

        console.log(
          "📨 Message ID:",
          result.messageId ||
          "N/A"
        );

        console.log(
          "================================================"
        );


        return {

          success:
            true,

          connected:
            true,

          error:
            null,

          data:
            result,

          testEmail:
            TEST_EMAIL,

          startupTestSent:
            true,

          skippedDuplicateTestEmail:
            false,

          checkedAt:
            smtpLastCheckedAt,

        };

      })();


    try {

      return await startupTestSending;

    } finally {

      startupTestSending =
        null;

    }


  } catch (error) {

    smtpConnected =
      false;

    smtpLastError =
      error.message;

    smtpLastCheckedAt =
      new Date();


    console.error("");

    console.error(
      "================================================"
    );

    console.error(
      "❌ SMTP CONNECTION FAILED"
    );

    console.error(
      "🔴 EMAIL SERVICE: OFFLINE"
    );

    console.error(
      "🌐 HOST:",
      SMTP_HOST
    );

    console.error(
      "🔌 PORT:",
      SMTP_PORT
    );

    console.error(
      "🔒 SECURITY:",
      SMTP_SECURE
        ? "SSL/TLS"
        : "STARTTLS"
    );

    console.error(
      "📤 FROM:",
      SMTP_USER
    );

    console.error(
      "❌ Error:",
      error.message
    );

    console.error(
      "================================================"
    );


    return {

      success:
        false,

      connected:
        false,

      error:
        error.message,

      checkedAt:
        smtpLastCheckedAt,

    };
  }
};


/* ============================================================
   SEND MAIL
   ============================================================ */

const sendMail = async (
  mailOptions
) => {

  try {

    if (!isSMTPConfigured()) {

      return {

        success:
          false,

        error:
          "SMTP configuration is incomplete",

      };

    }


    if (
      !mailOptions ||
      typeof mailOptions !== "object"
    ) {

      return {

        success:
          false,

        error:
          "Mail options are required",

      };

    }


    if (!mailOptions.to) {

      return {

        success:
          false,

        error:
          "Email recipient is required",

      };

    }


    if (!mailOptions.subject) {

      return {

        success:
          false,

        error:
          "Email subject is required",

      };

    }


    if (
      !mailOptions.text &&
      !mailOptions.html
    ) {

      return {

        success:
          false,

        error:
          "Email text or HTML content is required",

      };

    }


    const transporter =
      getTransporter();


    /*
     * IMPORTANT:
     *
     * Always use SMTP_USER as sender unless the
     * application explicitly supplies a from address.
     *
     * This keeps Yahoo authentication and sender
     * identity consistent.
     */
    const from =
      mailOptions.from ||
      getFromAddress();


    const result =
      await transporter.sendMail({

        from,

        to:
          mailOptions.to,

        subject:
          mailOptions.subject,


        ...(mailOptions.text && {
          text:
            mailOptions.text,
        }),


        ...(mailOptions.html && {
          html:
            mailOptions.html,
        }),


        ...(mailOptions.cc && {
          cc:
            mailOptions.cc,
        }),


        ...(mailOptions.bcc && {
          bcc:
            mailOptions.bcc,
        }),


        ...(mailOptions.replyTo && {
          replyTo:
            mailOptions.replyTo,
        }),


        ...(mailOptions.attachments && {
          attachments:
            mailOptions.attachments,
        }),

      });


    smtpConnected =
      true;

    smtpLastError =
      null;

    smtpLastCheckedAt =
      new Date();


    console.log("");

    console.log(
      "================================================"
    );

    console.log(
      "✅ EMAIL SENT SUCCESSFULLY"
    );

    console.log(
      "📤 From:",
      from
    );

    console.log(
      "📨 To:",
      mailOptions.to
    );

    console.log(
      "📋 Subject:",
      mailOptions.subject
    );

    console.log(
      "📨 Message ID:",
      result.messageId ||
      "N/A"
    );

    console.log(
      "================================================"
    );


    return {

      success:
        true,

      info:
        result,

      data:
        result,

      error:
        null,

    };


  } catch (error) {

    smtpConnected =
      false;

    smtpLastError =
      error.message;

    smtpLastCheckedAt =
      new Date();


    console.error(
      "❌ SMTP EMAIL SENDING FAILED:",
      error.message
    );


    return {

      success:
        false,

      error:
        error.message,

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

      success:
        false,

      error:
        "Email recipient is required",

    };

  }


  if (!subject) {

    return {

      success:
        false,

      error:
        "Email subject is required",

    };

  }


  if (!text && !html) {

    return {

      success:
        false,

      error:
        "Email text or HTML content is required",

    };

  }


  const mailOptions = {

    /*
     * Always use SMTP_USER.
     */
    from:
      getFromAddress(),

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


  /*
   * ONE SMTP ATTEMPT ONLY.
   *
   * Do not automatically resend because the SMTP server
   * may have accepted the first message already.
   */
  return await sendMailWithRetry(
    mailOptions,
    1
  );
};


/* ============================================================
   SEND MAIL WITH RETRY
   ============================================================ */

const sendMailWithRetry = async (
  mailOptions,
  maxRetries = 1
) => {

  /*
   * We deliberately perform only ONE actual send.
   *
   * This protects the application from duplicate emails.
   */
  const attempts = 1;


  let lastError =
    null;


  for (
    let attempt = 1;
    attempt <= attempts;
    attempt++
  ) {

    console.log(
      `📧 Sending email attempt ${attempt}/${attempts}...`
    );


    try {

      const result =
        await sendMail(
          mailOptions
        );


      if (result.success) {

        return result;

      }


      lastError =
        result.error;


    } catch (error) {

      lastError =
        error.message;

    }


    /*
     * NEVER retry automatically.
     */
    break;
  }


  return {

    success:
      false,

    error:
      lastError ||
      "SMTP email sending failed",

  };
};


/* ============================================================
   SAFE SEND
   ============================================================ */

const sendMailSafely = async (
  mailOptions
) => {

  try {

    /*
     * One attempt only.
     */
    return await sendMailWithRetry(
      mailOptions,
      1
    );

  } catch (error) {

    console.error(
      "⚠️ SMTP email service error:",
      error.message
    );


    return {

      success:
        false,

      error:
        error.message,

    };

  }
};


/* ============================================================
   GET SMTP INFORMATION
   ============================================================ */

const getSMTPInfo = () => {

  return {

    host:
      SMTP_HOST,

    port:
      SMTP_PORT,

    user:
      SMTP_USER,

    from:
      SMTP_USER,

    fromName:
      EMAIL_FROM_NAME,

    testEmail:
      TEST_EMAIL,

    service:
      "SMTP",

    protocol:
      "SMTP",

    security:
      SMTP_SECURE
        ? "SSL/TLS"
        : "STARTTLS",

    configured:
      isSMTPConfigured(),

    transporterCreated:
      Boolean(
        smtpTransporter
      ),

    connected:
      smtpConnected,

    status:
      smtpConnected
        ? "ONLINE"
        : "OFFLINE",

    startupTestSent,

    startupTestSending:
      Boolean(
        startupTestSending
      ),

    lastError:
      smtpLastError,

    lastCheckedAt:
      smtpLastCheckedAt,

  };
};


/* ============================================================
   CLOSE SMTP TRANSPORTER
   ============================================================ */

const closeTransporter =
  async () => {

    try {

      if (smtpTransporter) {

        smtpTransporter.close();

      }


      smtpTransporter =
        null;


      smtpConnected =
        false;


      console.log(
        "🔌 SMTP CLIENT CLOSED"
      );


      return {

        success:
          true,

      };


    } catch (error) {

      return {

        success:
          false,

        error:
          error.message,

      };

    }
  };


/* ============================================================
   START SMTP VERIFICATION
   ============================================================ */

const startSMTPVerification =
  async () => {

    console.log("");

    console.log(
      "================================================"
    );

    console.log(
      "📧 EMAIL SERVICE STARTUP CHECK"
    );

    console.log(
      "================================================"
    );

    console.log(
      "🌐 Host:",
      SMTP_HOST
    );

    console.log(
      "🔌 Port:",
      SMTP_PORT
    );

    console.log(
      "🔒 Security:",
      SMTP_SECURE
        ? "SSL/TLS"
        : "STARTTLS"
    );

    console.log(
      "📤 Sender:",
      SMTP_USER
    );


    const result =
      await testConnection();


    console.log("");


    if (result.connected) {

      console.log(
        "🟢 EMAIL SERVICE STATUS: ONLINE"
      );

      console.log(
        "🟢 SMTP: CONNECTED"
      );

      console.log(
        `🔌 PORT: ${SMTP_PORT}`
      );

      console.log(
        "🔒 SECURITY:",
        SMTP_SECURE
          ? "SSL/TLS"
          : "STARTTLS"
      );


      if (
        result.skippedDuplicateTestEmail
      ) {

        console.log(
          "⏭️ STARTUP TEST EMAIL WAS NOT SENT AGAIN"
        );

      } else if (
        result.data
      ) {

        console.log(
          `🟢 TEST EMAIL SENT TO: ${TEST_EMAIL}`
        );

      }

    } else {

      console.log(
        "🔴 EMAIL SERVICE STATUS: OFFLINE"
      );

      console.log(
        "🔴 Reason:",
        result.error
      );

    }


    console.log(
      "================================================"
    );

    console.log("");


    return result;
  };


/* ============================================================
   EXPORTS
   ============================================================ */

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

