// const nodemailer = require("nodemailer");

// require("dotenv").config();

// /* ============================================================
//    RESEND SMTP ENVIRONMENT
// ============================================================ */

// const SMTP_HOST =
//   process.env.SMTP_HOST || "smtp.resend.com";

// const SMTP_PORT =
//   parseInt(process.env.SMTP_PORT, 10) || 465;

// const SMTP_USER =
//   process.env.SMTP_USER || "resend";

// const SMTP_PASS =
//   process.env.SMTP_PASS || "";

// const ADMIN_EMAIL =
//   process.env.ADMIN_EMAIL || "";

// const EMAIL_FROM_NAME =
//   process.env.EMAIL_FROM_NAME || "INYUMBA";

// /* ============================================================
//    SMTP CONFIGURATION CHECK
// ============================================================ */

// const isSMTPConfigured = () => {
//   return Boolean(
//     SMTP_HOST &&
//     SMTP_PORT &&
//     SMTP_USER &&
//     SMTP_PASS &&
//     ADMIN_EMAIL
//   );
// };

// /* ============================================================
//    CREATE RESEND SMTP TRANSPORTER
// ============================================================ */

// const createTransporter = () => {
//   return nodemailer.createTransport({

//     host: "smtp.resend.com",

//     port: 465,

//     secure: true,

//     auth: {
//       user: "resend",
//       pass: SMTP_PASS,
//     },

//     tls: {
//       minVersion: "TLSv1.2",
//       servername: "smtp.resend.com",
//       rejectUnauthorized: true,
//     },

//     connectionTimeout: 150000,

//     greetingTimeout: 150000,

//     socketTimeout: 150000,

//     pool: true,

//     maxConnections: 3,

//     maxMessages: 1000,
//   });
// };

// let transporter = null;

// const getTransporter = () => {
//   if (!transporter) {
//     if (!isSMTPConfigured()) {
//       throw new Error(
//         "Resend SMTP configuration is incomplete"
//       );
//     }

//     transporter = createTransporter();
//   }

//   return transporter;
// };

// const testConnection = async () => {
//   try {
//     if (!isSMTPConfigured()) {
//       console.warn(
//         "⚠️ Resend SMTP configuration is incomplete"
//       );

//       return {
//         success: false,
//         connected: false,
//         error:
//           "Resend SMTP configuration is incomplete",
//       };
//     }

//     const smtp = getTransporter();

//     await smtp.verify();

//     console.log(
//       "✅ Resend SMTP connection verified successfully"
//     );

//     return {
//       success: true,
//       connected: true,
//       error: null,
//     };
//   } catch (error) {
//     console.error(
//       "❌ Resend SMTP verification failed:",
//       error.message
//     );

//     return {
//       success: false,
//       connected: false,
//       error: error.message,
//     };
//   }
// };

// const sendMail = async (mailOptions) => {
//   try {
//     if (!isSMTPConfigured()) {
//       return {
//         success: false,
//         error:
//           "Resend SMTP configuration is incomplete",
//       };
//     }

//     if (
//       !mailOptions ||
//       typeof mailOptions !== "object"
//     ) {
//       return {
//         success: false,
//         error: "Mail options are required",
//       };
//     }

//     const smtp = getTransporter();

//     const info = await smtp.sendMail(mailOptions);

//     console.log(
//       "✅ Email sent successfully through Resend"
//     );

//     console.log(
//       "📨 Message ID:",
//       info.messageId
//     );

//     return {
//       success: true,
//       info,
//       error: null,
//     };
//   } catch (error) {
//     console.error(
//       "❌ Resend email sending failed:",
//       error.message
//     );

//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

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
//       error:
//         "Email text or HTML content is required",
//     };
//   }

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

//   return await sendMailWithRetry(
//     mailOptions,
//     3
//   );
// };

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
//       const result =
//         await sendMail(mailOptions);

//       if (result.success) {
//         return result;
//       }

//       lastError = result.error;
//     } catch (error) {
//       lastError = error.message;
//     }

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

// const getSMTPInfo = () => {
//   return {
//     host: SMTP_HOST,

//     port: SMTP_PORT,

//     user: SMTP_USER,

//     adminEmail: ADMIN_EMAIL,

//     fromName: EMAIL_FROM_NAME,

//     configured:
//       isSMTPConfigured(),
//   };
// };

// module.exports = {
//   transporter,
//   getTransporter,
//   getSMTPInfo,
//   isSMTPConfigured,
//   testConnection,
//   sendEmail,
//   sendMail,
//   sendMailWithRetry,
//   sendMailSafely,
// };

const nodemailer = require("nodemailer");

require("dotenv").config();

/* ============================================================
   RESEND SMTP ENVIRONMENT
============================================================ */

const SMTP_HOST = process.env.SMTP_HOST || "smtp.resend.com";

const SMTP_PORT = parseInt(process.env.SMTP_PORT, 10) || 465;

const SMTP_USER = process.env.SMTP_USER || "resend";

const SMTP_PASS = process.env.SMTP_PASS || "";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "INYUMBA";

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
  console.log("================================================");
  console.log("📧 Creating Resend SMTP transporter...");
  console.log("================================================");

  console.log("SMTP Host:", SMTP_HOST);
  console.log("SMTP Port:", SMTP_PORT);
  console.log("SMTP User:", SMTP_USER);
  console.log("SMTP Password:", SMTP_PASS ? "Configured ✅" : "Missing ❌");
  console.log("Admin Email:", ADMIN_EMAIL);
  console.log("From Name:", EMAIL_FROM_NAME);

  return nodemailer.createTransport({
    host: SMTP_HOST,

    port: SMTP_PORT,

    secure: SMTP_PORT === 465,

    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },

    tls: {
      minVersion: "TLSv1.2",
      servername: SMTP_HOST,
      rejectUnauthorized: true,
    },

    /*
     * Resend SMTP connection timeouts.
     */
    connectionTimeout: 150000,

    greetingTimeout: 150000,

    socketTimeout: 150000,

    /*
     * Connection pooling.
     */
    pool: true,

    maxConnections: 3,

    maxMessages: 1000,
  });
};

/* ============================================================
   TRANSPORTER
============================================================ */

let transporter = null;

/* ============================================================
   GET TRANSPORTER
============================================================ */

const getTransporter = () => {
  if (!transporter) {
    if (!isSMTPConfigured()) {
      throw new Error("Resend SMTP configuration is incomplete");
    }

    transporter = createTransporter();
  }

  return transporter;
};

/* ============================================================
   VERIFY RESEND SMTP CONNECTION
============================================================ */

const testConnection = async () => {
  try {
    console.log("");
    console.log("================================================");
    console.log("🔍 VERIFYING RESEND SMTP CONNECTION");
    console.log("================================================");

    /* ---------------------------------------------
       CHECK ENVIRONMENT
    --------------------------------------------- */

    if (!isSMTPConfigured()) {
      console.error("❌ Resend SMTP configuration is incomplete");

      console.error("Required variables:");

      console.error("SMTP_HOST");

      console.error("SMTP_PORT");

      console.error("SMTP_USER");

      console.error("SMTP_PASS");

      console.error("ADMIN_EMAIL");

      return {
        success: false,
        connected: false,
        error: "Resend SMTP configuration is incomplete",
      };
    }

    /* ---------------------------------------------
       GET TRANSPORTER
    --------------------------------------------- */

    const smtp = getTransporter();

    /* ---------------------------------------------
       VERIFY CONNECTION
    --------------------------------------------- */

    console.log(`🔄 Connecting to ${SMTP_HOST}:${SMTP_PORT}...`);

    await smtp.verify();

    /* ---------------------------------------------
       SUCCESS
    --------------------------------------------- */

    console.log("");
    console.log("✅ RESEND SMTP CONNECTION VERIFIED");

    console.log(`✅ SMTP Server: ${SMTP_HOST}`);

    console.log(`✅ SMTP Port: ${SMTP_PORT}`);

    console.log(`✅ SMTP User: ${SMTP_USER}`);

    console.log("================================================");

    return {
      success: true,
      connected: true,
      host: SMTP_HOST,
      port: SMTP_PORT,
      user: SMTP_USER,
      error: null,
    };
  } catch (error) {
    console.error("");
    console.error("❌ RESEND SMTP CONNECTION FAILED");

    console.error("❌ Error:", error.message);

    console.error("================================================");

    return {
      success: false,
      connected: false,
      host: SMTP_HOST,
      port: SMTP_PORT,
      user: SMTP_USER,
      error: error.message,
    };
  }
};

/* ============================================================
   SEND MAIL
============================================================ */

const sendMail = async (mailOptions) => {
  try {
    /* ---------------------------------------------
       CHECK SMTP CONFIGURATION
    --------------------------------------------- */

    if (!isSMTPConfigured()) {
      return {
        success: false,
        error: "Resend SMTP configuration is incomplete",
      };
    }

    /* ---------------------------------------------
       VALIDATE MAIL OPTIONS
    --------------------------------------------- */

    if (!mailOptions || typeof mailOptions !== "object") {
      return {
        success: false,
        error: "Mail options are required",
      };
    }

    /* ---------------------------------------------
       GET SMTP TRANSPORTER
    --------------------------------------------- */

    const smtp = getTransporter();

    /* ---------------------------------------------
       SEND EMAIL
    --------------------------------------------- */

    const info = await smtp.sendMail(mailOptions);

    /* ---------------------------------------------
       SUCCESS
    --------------------------------------------- */

    console.log("✅ Email sent successfully through Resend");

    console.log("📨 Message ID:", info.messageId);

    return {
      success: true,
      info,
      error: null,
    };
  } catch (error) {
    console.error("❌ Resend email sending failed:", error.message);

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
  /* ---------------------------------------------
     VALIDATE RECIPIENT
  --------------------------------------------- */

  if (!to) {
    return {
      success: false,
      error: "Email recipient is required",
    };
  }

  /* ---------------------------------------------
     VALIDATE SUBJECT
  --------------------------------------------- */

  if (!subject) {
    return {
      success: false,
      error: "Email subject is required",
    };
  }

  /* ---------------------------------------------
     VALIDATE CONTENT
  --------------------------------------------- */

  if (!text && !html) {
    return {
      success: false,
      error: "Email text or HTML content is required",
    };
  }

  /* ---------------------------------------------
     MAIL OPTIONS
  --------------------------------------------- */

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

  /* ---------------------------------------------
     SEND WITH RETRY
  --------------------------------------------- */

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

    /* ---------------------------------------------
       RETRY
    --------------------------------------------- */

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
   SMTP INFORMATION
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
  };
};

/* ============================================================
   CLOSE SMTP CONNECTION
============================================================ */

const closeTransporter = async () => {
  try {
    if (transporter) {
      transporter.close();

      transporter = null;

      console.log("🔌 Resend SMTP transporter closed");
    }

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
   EXPORTS
============================================================ */

module.exports = {
  getTransporter,

  getSMTPInfo,

  isSMTPConfigured,

  testConnection,

  sendEmail,

  sendMail,

  sendMailWithRetry,

  sendMailSafely,

  closeTransporter,
};
