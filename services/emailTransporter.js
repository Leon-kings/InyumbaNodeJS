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

const nodemailer = require("nodemailer");

require("dotenv").config();

/* ============================================================
   RESEND SMTP ENVIRONMENT
============================================================ */

const SMTP_HOST = process.env.SMTP_HOST || "smtp.resend.com";

const SMTP_PORT = parseInt(process.env.SMTP_PORT, 10) || 587;

const SMTP_USER = process.env.SMTP_USER || "resend";

const SMTP_PASS = process.env.SMTP_PASS || "";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "INYUMBA";

/* ============================================================
   SMTP STATUS
============================================================ */

let transporter = null;

let smtpConnected = false;

let smtpLastError = null;

let smtpLastCheckedAt = null;

/* ============================================================
   SMTP CONFIGURATION CHECK
============================================================ */

const isSMTPConfigured = () => {
  return Boolean(
    SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && ADMIN_EMAIL,
  );
};

/* ============================================================
   CREATE RESEND SMTP TRANSPORTER
============================================================ */

const createTransporter = () => {
  console.log("");

  console.log("================================================");

  console.log("📧 CREATING RESEND SMTP TRANSPORTER");

  console.log("================================================");

  console.log("SMTP Host:", SMTP_HOST);

  console.log("SMTP Port:", SMTP_PORT);

  console.log("SMTP User:", SMTP_USER);

  console.log("SMTP Password:", SMTP_PASS ? "Configured ✅" : "Missing ❌");

  console.log("Admin Email:", ADMIN_EMAIL ? ADMIN_EMAIL : "Missing ❌");

  console.log("From Name:", EMAIL_FROM_NAME);

  console.log("================================================");

  /*
   * Resend SMTP
   *
   * Port 587 = STARTTLS
   */

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: 587,
    secure: false,
    requireTLS: true,

    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },

    tls: {
      minVersion: "TLSv1.2",
      servername: SMTP_HOST,
      rejectUnauthorized: true,
    },
  });
};

/* ============================================================
   GET TRANSPORTER
============================================================ */

const getTransporter = () => {
  if (!isSMTPConfigured()) {
    throw new Error("Resend SMTP configuration is incomplete");
  }

  if (!transporter) {
    transporter = createTransporter();
  }

  return transporter;
};

/* ============================================================
   VERIFY RESEND SMTP CONNECTION
============================================================ */

const testConnection = async () => {
  console.log("");

  console.log("================================================");

  console.log("🔍 VERIFYING RESEND SMTP CONNECTION");

  console.log("================================================");

  smtpLastCheckedAt = new Date();

  /* ==========================================================
     CHECK CONFIGURATION
  ========================================================== */

  if (!isSMTPConfigured()) {
    smtpConnected = false;

    smtpLastError = "Resend SMTP configuration is incomplete";

    console.error("❌ RESEND SMTP CONFIGURATION INCOMPLETE");

    console.error("Required environment variables:");

    console.error("SMTP_HOST");

    console.error("SMTP_PORT");

    console.error("SMTP_USER");

    console.error("SMTP_PASS");

    console.error("ADMIN_EMAIL");

    console.log("================================================");

    return {
      success: false,

      connected: false,

      host: SMTP_HOST,

      port: SMTP_PORT,

      user: SMTP_USER,

      error: smtpLastError,

      checkedAt: smtpLastCheckedAt,
    };
  }

  try {
    /* ========================================================
       CREATE / GET TRANSPORTER
    ======================================================== */

    const smtp = getTransporter();

    /* ========================================================
       VERIFY CONNECTION
    ======================================================== */

    console.log("");

    console.log(`🔄 Connecting to ${SMTP_HOST}:${SMTP_PORT}...`);

    console.log(`🔐 SMTP authentication user: ${SMTP_USER}`);

    await smtp.verify();

    /* ========================================================
       SUCCESS
    ======================================================== */

    smtpConnected = true;

    smtpLastError = null;

    smtpLastCheckedAt = new Date();

    console.log("");

    console.log("================================================");

    console.log("✅ RESEND SMTP CONNECTION VERIFIED");

    console.log("🟢 EMAIL SERVICE: ONLINE");

    console.log("🟢 RESEND SMTP: CONNECTED");

    console.log(`🟢 SMTP SERVER: ${SMTP_HOST}`);

    console.log(`🟢 SMTP PORT: ${SMTP_PORT}`);

    console.log(`🟢 SMTP USER: ${SMTP_USER}`);

    console.log("================================================");

    return {
      success: true,

      connected: true,

      host: SMTP_HOST,

      port: SMTP_PORT,

      user: SMTP_USER,

      error: null,

      checkedAt: smtpLastCheckedAt,
    };
  } catch (error) {
    /* ========================================================
       FAILURE
    ======================================================== */

    smtpConnected = false;

    smtpLastError = error.message;

    smtpLastCheckedAt = new Date();

    console.error("");

    console.error("================================================");

    console.error("❌ RESEND SMTP CONNECTION FAILED");

    console.error("🔴 EMAIL SERVICE: OFFLINE");

    console.error("🔴 RESEND SMTP: NOT CONNECTED");

    console.error("❌ Error:", error.message);

    console.error(`❌ SMTP Server: ${SMTP_HOST}`);

    console.error(`❌ SMTP Port: ${SMTP_PORT}`);

    console.error("================================================");

    return {
      success: false,

      connected: false,

      host: SMTP_HOST,

      port: SMTP_PORT,

      user: SMTP_USER,

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
    /* ========================================================
       CHECK CONFIGURATION
    ======================================================== */

    if (!isSMTPConfigured()) {
      return {
        success: false,

        error: "Resend SMTP configuration is incomplete",
      };
    }

    /* ========================================================
       VALIDATE MAIL OPTIONS
    ======================================================== */

    if (!mailOptions || typeof mailOptions !== "object") {
      return {
        success: false,

        error: "Mail options are required",
      };
    }

    /* ========================================================
       GET TRANSPORTER
    ======================================================== */

    const smtp = getTransporter();

    /* ========================================================
       SEND EMAIL
    ======================================================== */

    const info = await smtp.sendMail(mailOptions);

    /* ========================================================
       SUCCESS
    ======================================================== */

    smtpConnected = true;

    smtpLastError = null;

    smtpLastCheckedAt = new Date();

    console.log("");

    console.log("================================================");

    console.log("✅ EMAIL SENT SUCCESSFULLY THROUGH RESEND");

    console.log("📨 Message ID:", info.messageId);

    console.log("================================================");

    return {
      success: true,

      info,

      error: null,
    };
  } catch (error) {
    smtpConnected = false;

    smtpLastError = error.message;

    smtpLastCheckedAt = new Date();

    console.error("");

    console.error("================================================");

    console.error("❌ RESEND EMAIL SENDING FAILED");

    console.error("❌ Error:", error.message);

    console.error("================================================");

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
  /* ==========================================================
     VALIDATE RECIPIENT
  ========================================================== */

  if (!to) {
    return {
      success: false,

      error: "Email recipient is required",
    };
  }

  /* ==========================================================
     VALIDATE SUBJECT
  ========================================================== */

  if (!subject) {
    return {
      success: false,

      error: "Email subject is required",
    };
  }

  /* ==========================================================
     VALIDATE CONTENT
  ========================================================== */

  if (!text && !html) {
    return {
      success: false,

      error: "Email text or HTML content is required",
    };
  }

  /* ==========================================================
     MAIL OPTIONS
  ========================================================== */

  const mailOptions = {
    from: `"${EMAIL_FROM_NAME}" <${ADMIN_EMAIL}>`,

    to,

    subject,

    ...(text
      ? {
          text,
        }
      : {}),

    ...(html
      ? {
          html,
        }
      : {}),

    ...(cc
      ? {
          cc,
        }
      : {}),

    ...(bcc
      ? {
          bcc,
        }
      : {}),

    ...(replyTo
      ? {
          replyTo,
        }
      : {}),

    ...(attachments
      ? {
          attachments,
        }
      : {}),
  };

  /* ==========================================================
     SEND
  ========================================================== */

  return await sendMailWithRetry(mailOptions, 3);
};

/* ============================================================
   SEND MAIL WITH RETRY
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

    /* ========================================================
       RETRY
    ======================================================== */

    if (attempt < maxRetries) {
      console.log(`🔄 Retrying Resend email (${attempt + 1}/${maxRetries})...`);

      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
  }

  return {
    success: false,

    error: lastError || "Resend email sending failed",
  };
};

/* ============================================================
   SAFE SEND MAIL
============================================================ */

const sendMailSafely = async (mailOptions) => {
  try {
    return await sendMailWithRetry(mailOptions, 3);
  } catch (error) {
    console.error("⚠️ Resend email service error:", error.message);

    return {
      success: false,

      error: error.message,
    };
  }
};

/* ============================================================
   GET SMTP INFORMATION
============================================================ */

const getSMTPInfo = () => {
  return {
    host: SMTP_HOST,

    port: SMTP_PORT,

    user: SMTP_USER,

    adminEmail: ADMIN_EMAIL,

    fromName: EMAIL_FROM_NAME,

    configured: isSMTPConfigured(),

    transporterCreated: Boolean(transporter),

    connected: smtpConnected,

    status: smtpConnected ? "ONLINE" : "OFFLINE",

    lastError: smtpLastError,

    lastCheckedAt: smtpLastCheckedAt,
  };
};

/* ============================================================
   CLOSE SMTP TRANSPORTER
============================================================ */

const closeTransporter = async () => {
  try {
    if (transporter) {
      transporter.close();

      transporter = null;
    }

    smtpConnected = false;

    console.log("");

    console.log("🔌 RESEND SMTP TRANSPORTER CLOSED");

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ Failed to close SMTP transporter:", error.message);

    return {
      success: false,

      error: error.message,
    };
  }
};

/* ============================================================
   START SMTP VERIFICATION
============================================================ */

const startSMTPVerification = async () => {
  console.log("");

  console.log("================================================");

  console.log("📧 EMAIL SERVICE STARTUP CHECK");

  console.log("================================================");

  const result = await testConnection();

  console.log("");

  if (result.connected) {
    console.log("🟢 EMAIL SERVICE STATUS: ONLINE");
  } else {
    console.log("🔴 EMAIL SERVICE STATUS: OFFLINE");

    console.log("🔴 Reason:", result.error);
  }

  console.log("================================================");

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

  testConnection,

  startSMTPVerification,

  sendEmail,

  sendMail,

  sendMailWithRetry,

  sendMailSafely,

  closeTransporter,
};
