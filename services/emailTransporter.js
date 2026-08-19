
// const nodemailer = require("nodemailer");
// const dns = require("dns");

// require("dotenv").config();

// /* ============================================================
//    ENVIRONMENT
// ============================================================ */

// const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";

// const SMTP_PORT = parseInt(process.env.SMTP_PORT, 10) || 587;

// const SMTP_USER = process.env.SMTP_USER || "";

// const SMTP_PASS = process.env.SMTP_PASS || "";

// const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

// /* ============================================================
//    FORCE IPV4
// ============================================================ */

// try {
//   dns.setDefaultResultOrder("ipv4first");
// } catch (error) {
//   console.warn("⚠️ Could not set IPv4 preference:", error.message);
// }

// /* ============================================================
//    IPV4 DNS LOOKUP
// ============================================================ */

// const ipv4Lookup = (hostname, options, callback) => {
//   dns.lookup(
//     hostname,
//     {
//       family: 4,
//       all: false,
//     },
//     (error, address, family) => {
//       if (error) {
//         return callback(error);
//       }

//       callback(null, address, family);
//     },
//   );
// };

// /* ============================================================
//    SMTP CONFIGURATION CHECK
// ============================================================ */

// const isSMTPConfigured = () => {
//   return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);
// };

// /* ============================================================
//    CREATE TRANSPORTER
// ============================================================ */

// const createTransporter = () => {
//   const secure = SMTP_PORT === 465;

//   return nodemailer.createTransport({
//     host: SMTP_HOST,

//     port: SMTP_PORT,

//     secure,

//     // Force IPv4
//     family: 4,

//     auth: {
//       user: SMTP_USER,
//       pass: SMTP_PASS,
//     },

//     lookup: ipv4Lookup,

//     tls: {
//       servername: SMTP_HOST,
//       minVersion: "TLSv1.2",
//       rejectUnauthorized: false,
//     },

//     // ========================================================
//     // CONNECTION TIMEOUTS
//     // ========================================================

//     connectionTimeout: 150000,

//     greetingTimeout: 150000,

//     socketTimeout: 150000,

//     // ========================================================
//     // CONNECTION POOL
//     // ========================================================

//     pool: true,

//     maxConnections: 3,

//     maxMessages: 1000,
//   });
// };

// /* ============================================================
//    SINGLE REUSABLE TRANSPORTER
// ============================================================ */

// let transporter = null;

// /* ============================================================
//    GET TRANSPORTER
// ============================================================ */

// const getTransporter = () => {
//   if (!transporter) {
//     if (!isSMTPConfigured()) {
//       throw new Error("SMTP configuration is incomplete");
//     }

//     transporter = createTransporter();
//   }

//   return transporter;
// };

// /* ============================================================
//    CHECK SMTP CONNECTION
// ============================================================ */

// const testConnection = async () => {
//   try {
//     if (!isSMTPConfigured()) {
//       console.warn("⚠️ SMTP is not configured");

//       return {
//         success: false,
//         connected: false,
//         error: "SMTP configuration is incomplete",
//       };
//     }

//     const smtp = getTransporter();

//     await smtp.verify();

//     console.log("✅ SMTP connection verified successfully");

//     return {
//       success: true,
//       connected: true,
//       error: null,
//     };
//   } catch (error) {
//     console.error("❌ SMTP verification failed:", error.message);

//     return {
//       success: false,
//       connected: false,
//       error: error.message,
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

//     const smtp = getTransporter();

//     const info = await smtp.sendMail(mailOptions);

//     console.log("✅ Email sent successfully");

//     console.log("📨 Message ID:", info.messageId);

//     return {
//       success: true,
//       info,
//       error: null,
//     };
//   } catch (error) {
//     console.error("❌ Email sending failed:", error.message);

//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// /* ============================================================
//    SEND EMAIL
// ============================================================ */

// /*
//  * IMPORTANT
//  *
//  * Your controllers use:
//  *
//  * const { sendEmail } =
//  *   require("../services/emailTransporter");
//  *
//  * Therefore sendEmail MUST exist.
//  *
//  * This function accepts:
//  *
//  * {
//  *   to,
//  *   subject,
//  *   text,
//  *   html,
//  *   cc,
//  *   bcc,
//  *   replyTo,
//  *   attachments
//  * }
//  *
//  * and converts it into Nodemailer's mailOptions.
//  */

// const sendEmail = async ({
//   to,
//   subject,
//   text,
//   html,
//   cc,
//   bcc,
//   replyTo,
//   attachments,
//   from,
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
//      BUILD MAIL OPTIONS
//   ========================================================== */

//   const mailOptions = {
//     from: from || process.env.ADMIN_EMAIL || SMTP_USER,

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
//      SEND THROUGH MAIN MAIL FUNCTION
//   ========================================================== */

//   return await sendMailWithRetry(mailOptions, 3);
// };

// /* ============================================================
//    SEND MAIL WITH RETRY
// ============================================================ */

// const sendMailWithRetry = async (mailOptions, maxRetries = 3) => {
//   let lastError = null;

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const result = await sendMail(mailOptions);

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
//       console.log(`🔄 Retrying email (${attempt + 1}/${maxRetries})...`);

//       await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
//     }
//   }

//   return {
//     success: false,

//     error: lastError || "Email sending failed",
//   };
// };

// /* ============================================================
//    SAFE SEND
// ============================================================ */

// const sendMailSafely = async (mailOptions) => {
//   try {
//     return await sendMailWithRetry(mailOptions, 3);
//   } catch (error) {
//     console.error("⚠️ Email service error:", error.message);

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

//     configured: isSMTPConfigured(),
//   };
// };

// /* ============================================================
//    NO AUTOMATIC SMTP INITIALIZATION
// ============================================================ */

// /*
//  * IMPORTANT:
//  *
//  * DO NOT call testConnection()
//  * here.
//  *
//  * The server will NOT automatically:
//  *
//  * ❌ connect to Gmail during startup
//  * ❌ test port 587
//  * ❌ test port 465
//  * ❌ print SMTP SERVICE: OFFLINE
//  * ❌ delay Render deployment
//  *
//  * SMTP is only contacted when:
//  *
//  * sendMail()
//  *
//  * or
//  *
//  * sendEmail()
//  *
//  * is actually called.
//  */

// /* ============================================================
//    EXPORT
// ============================================================ */

// module.exports = {
//   /*
//    * Nodemailer transporter
//    *
//    * IMPORTANT:
//    * This is the current cached value.
//    * Use getTransporter() when you need
//    * the actual initialized transporter.
//    */
//   transporter,

//   /*
//    * Transporter functions
//    */
//   getTransporter,

//   /*
//    * SMTP information
//    */
//   getSMTPInfo,

//   isSMTPConfigured,

//   testConnection,

//   /*
//    * Main email functions
//    */
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

const SMTP_HOST =
  process.env.SMTP_HOST || "smtp.resend.com";

const SMTP_PORT =
  parseInt(process.env.SMTP_PORT, 10) || 465;

const SMTP_USER =
  process.env.SMTP_USER || "resend";

const SMTP_PASS =
  process.env.SMTP_PASS || "";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "";

const EMAIL_FROM_NAME =
  process.env.EMAIL_FROM_NAME || "INYUMBA";


/* ============================================================
   SMTP CONFIGURATION CHECK
============================================================ */

const isSMTPConfigured = () => {
  return Boolean(
    SMTP_HOST &&
    SMTP_PORT &&
    SMTP_USER &&
    SMTP_PASS &&
    ADMIN_EMAIL
  );
};


/* ============================================================
   CREATE RESEND SMTP TRANSPORTER
============================================================ */

const createTransporter = () => {
  return nodemailer.createTransport({

    host: "smtp.resend.com",

    port: 465,

    secure: true,

    auth: {
      user: "resend",
      pass: SMTP_PASS,
    },

    tls: {
      minVersion: "TLSv1.2",
      servername: "smtp.resend.com",
      rejectUnauthorized: true,
    },

    connectionTimeout: 150000,

    greetingTimeout: 150000,

    socketTimeout: 150000,

    pool: true,

    maxConnections: 3,

    maxMessages: 1000,
  });
};


let transporter = null;


const getTransporter = () => {
  if (!transporter) {
    if (!isSMTPConfigured()) {
      throw new Error(
        "Resend SMTP configuration is incomplete"
      );
    }

    transporter = createTransporter();
  }

  return transporter;
};


const testConnection = async () => {
  try {
    if (!isSMTPConfigured()) {
      console.warn(
        "⚠️ Resend SMTP configuration is incomplete"
      );

      return {
        success: false,
        connected: false,
        error:
          "Resend SMTP configuration is incomplete",
      };
    }

    const smtp = getTransporter();

    await smtp.verify();

    console.log(
      "✅ Resend SMTP connection verified successfully"
    );

    return {
      success: true,
      connected: true,
      error: null,
    };
  } catch (error) {
    console.error(
      "❌ Resend SMTP verification failed:",
      error.message
    );

    return {
      success: false,
      connected: false,
      error: error.message,
    };
  }
};


const sendMail = async (mailOptions) => {
  try {
    if (!isSMTPConfigured()) {
      return {
        success: false,
        error:
          "Resend SMTP configuration is incomplete",
      };
    }

    if (
      !mailOptions ||
      typeof mailOptions !== "object"
    ) {
      return {
        success: false,
        error: "Mail options are required",
      };
    }

    const smtp = getTransporter();

    const info = await smtp.sendMail(mailOptions);

    console.log(
      "✅ Email sent successfully through Resend"
    );

    console.log(
      "📨 Message ID:",
      info.messageId
    );

    return {
      success: true,
      info,
      error: null,
    };
  } catch (error) {
    console.error(
      "❌ Resend email sending failed:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};


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
      error:
        "Email text or HTML content is required",
    };
  }


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


  return await sendMailWithRetry(
    mailOptions,
    3
  );
};

const sendMailWithRetry = async (
  mailOptions,
  maxRetries = 3
) => {

  let lastError = null;

  for (
    let attempt = 1;
    attempt <= maxRetries;
    attempt++
  ) {
    try {
      const result =
        await sendMail(mailOptions);

      if (result.success) {
        return result;
      }

      lastError = result.error;
    } catch (error) {
      lastError = error.message;
    }


    if (attempt < maxRetries) {
      console.log(
        `🔄 Retrying Resend email (${attempt + 1}/${maxRetries})...`
      );

      await new Promise((resolve) =>
        setTimeout(
          resolve,
          attempt * 2000
        )
      );
    }
  }

  return {
    success: false,

    error:
      lastError ||
      "Resend email sending failed",
  };
};


const sendMailSafely = async (
  mailOptions
) => {
  try {
    return await sendMailWithRetry(
      mailOptions,
      3
    );
  } catch (error) {
    console.error(
      "⚠️ Resend email service error:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};


const getSMTPInfo = () => {
  return {
    host: SMTP_HOST,

    port: SMTP_PORT,

    user: SMTP_USER,

    adminEmail: ADMIN_EMAIL,

    fromName: EMAIL_FROM_NAME,

    configured:
      isSMTPConfigured(),
  };
};


module.exports = {
  transporter,
  getTransporter,
  getSMTPInfo,
  isSMTPConfigured,
  testConnection,
  sendEmail,
  sendMail,
  sendMailWithRetry,
  sendMailSafely,
};