// const nodemailer = require("nodemailer");
// const dns = require("dns");
// require("dotenv").config();

// // Force IPv4
// dns.setDefaultResultOrder("ipv4first");

// // SMTP Configuration
// const SMTP_CONFIG = {
//   host: process.env.SMTP_HOST || "smtp.gmail.com",
//   port: parseInt(process.env.SMTP_PORT) || 587,
//   secure: false,
//   family: 4,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//     minVersion: "TLSv1.2",
//   },
//   debug: process.env.NODE_ENV === "development",
//   logger: process.env.NODE_ENV === "development",
// };

// // Create transporter
// let transporter = nodemailer.createTransport(SMTP_CONFIG);

// // Alternative configuration using different ports if needed
// const getAlternativeConfig = () => {
//   return {
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     family: 4,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   };
// };

// // Function to test connection with multiple strategies
// const testConnection = async () => {
//   // Try primary configuration
//   try {
//     await transporter.verify();
//     console.log("✅ SMTP Transporter connected successfully");
//     return true;
//   } catch (primaryError) {
//     console.log("⚠️ Primary connection failed:", primaryError.message);
    
//     // Try alternative configuration (port 465 with SSL)
//     try {
//       console.log("🔄 Trying alternative SMTP configuration...");
//       const altConfig = getAlternativeConfig();
//       transporter = nodemailer.createTransport(altConfig);
//       await transporter.verify();
//       console.log("✅ SMTP Transporter connected with alternative config");
//       return true;
//     } catch (altError) {
//       console.error("❌ All SMTP connection attempts failed");
//       console.error("Primary error:", primaryError.message);
//       console.error("Alternative error:", altError.message);
//       return false;
//     }
//   }
// };

// // Run connection test
// testConnection();

// // Export transporter with retry capability
// const sendMailWithRetry = async (mailOptions, maxRetries = 3) => {
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       const info = await transporter.sendMail(mailOptions);
//       return { success: true, info };
//     } catch (error) {
//       console.log(`📧 Email attempt ${i + 1} failed:`, error.message);
      
//       // If it's a connection error, try to recreate transporter
//       if (error.code === "ENETUNREACH" || error.code === "ECONNREFUSED") {
//         console.log("🔄 Recreating transporter...");
//         transporter = nodemailer.createTransport(SMTP_CONFIG);
        
//         // Re-verify
//         try {
//           await transporter.verify();
//         } catch (verifyError) {
//           console.log("⚠️ Re-verification failed:", verifyError.message);
//         }
//       }
      
//       if (i === maxRetries - 1) {
//         return { success: false, error: error.message };
//       }
      
//       // Wait before retry (exponential backoff)
//       await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
//     }
//   }
// };

// module.exports = {
//   transporter,
//   sendMailWithRetry,
//   testConnection,
// };








// const nodemailer = require("nodemailer");
// const dns = require("dns");
// require("dotenv").config();

// // ============================================================
// // FORCE IPV4
// // ============================================================
// // This does NOT use or hardcode any IP address.
// // Node will resolve smtp.gmail.com normally and prefer IPv4.

// try {
//   dns.setDefaultResultOrder("ipv4first");
// } catch (error) {
//   console.log(
//     "⚠️ Could not configure DNS result order:",
//     error.message
//   );
// }

// // ============================================================
// // SMTP CONFIGURATION
// // ============================================================

// const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
// const SMTP_PORT = parseInt(process.env.SMTP_PORT, 10) || 587;
// const SMTP_USER = process.env.SMTP_USER;
// const SMTP_PASS = process.env.SMTP_PASS;

// // ============================================================
// // PRIMARY SMTP CONFIGURATION
// // ============================================================

// const SMTP_CONFIG = {
//   host: SMTP_HOST,
//   port: SMTP_PORT,
//   secure: false,

//   // Use IPv4 without specifying an IP address
//   family: 4,

//   auth: {
//     user: SMTP_USER,
//     pass: SMTP_PASS,
//   },

//   tls: {
//     rejectUnauthorized: false,
//     minVersion: "TLSv1.2",
//     servername: SMTP_HOST,
//   },

//   debug: process.env.NODE_ENV === "development",
//   logger: process.env.NODE_ENV === "development",
// };

// // ============================================================
// // CREATE PRIMARY TRANSPORTER
// // ============================================================

// let transporter = nodemailer.createTransport(SMTP_CONFIG);

// // ============================================================
// // ALTERNATIVE SMTP CONFIGURATION
// // ============================================================

// const getAlternativeConfig = () => {
//   return {
//     host: SMTP_HOST,
//     port: 465,
//     secure: true,

//     // Use IPv4 without specifying an IP address
//     family: 4,

//     auth: {
//       user: SMTP_USER,
//       pass: SMTP_PASS,
//     },

//     tls: {
//       rejectUnauthorized: false,
//       minVersion: "TLSv1.2",
//       servername: SMTP_HOST,
//     },

//     debug: process.env.NODE_ENV === "development",
//     logger: process.env.NODE_ENV === "development",
//   };
// };

// // ============================================================
// // TEST SMTP CONNECTION
// // ============================================================

// const testConnection = async () => {
//   // ==========================================================
//   // CHECK SMTP CREDENTIALS
//   // ==========================================================

//   if (!SMTP_USER || !SMTP_PASS) {
//     console.error(
//       "❌ SMTP_USER or SMTP_PASS is missing from environment variables."
//     );

//     return false;
//   }

//   // ==========================================================
//   // PRIMARY CONNECTION - PORT 587
//   // ==========================================================

//   try {
//     transporter = nodemailer.createTransport(
//       SMTP_CONFIG
//     );

//     await transporter.verify();

//     console.log(
//       "✅ SMTP Transporter connected successfully on port 587"
//     );

//     return true;
//   } catch (primaryError) {
//     console.error(
//       "⚠️ Primary SMTP connection failed:",
//       primaryError.message
//     );

//     // ========================================================
//     // ALTERNATIVE CONNECTION - PORT 465
//     // ========================================================

//     try {
//       const alternativeConfig =
//         getAlternativeConfig();

//       transporter = nodemailer.createTransport(
//         alternativeConfig
//       );

//       await transporter.verify();

//       console.log(
//         "✅ SMTP Transporter connected successfully on port 465"
//       );

//       return true;
//     } catch (alternativeError) {
//       console.error(
//         "❌ SMTP connection failed on both configurations."
//       );

//       console.error(
//         "Port 587 error:",
//         primaryError.message
//       );

//       console.error(
//         "Port 465 error:",
//         alternativeError.message
//       );

//       return false;
//     }
//   }
// };

// // ============================================================
// // CONNECTION ERROR CHECK
// // ============================================================

// const isConnectionError = (error) => {
//   const connectionErrors = [
//     "ENETUNREACH",
//     "ECONNREFUSED",
//     "ECONNRESET",
//     "ETIMEDOUT",
//     "ESOCKET",
//     "EHOSTUNREACH",
//     "EAI_AGAIN",
//     "ECONNABORTED",
//     "ENOTFOUND",
//   ];

//   return connectionErrors.includes(error?.code);
// };

// // ============================================================
// // SEND EMAIL WITH RETRY
// // ============================================================

// const sendMailWithRetry = async (
//   mailOptions,
//   maxRetries = 3
// ) => {
//   let lastError = null;

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       // ======================================================
//       // MAKE SURE TRANSPORTER EXISTS
//       // ======================================================

//       if (!transporter) {
//         transporter =
//           nodemailer.createTransport(
//             SMTP_CONFIG
//           );
//       }

//       // ======================================================
//       // SEND EMAIL
//       // ======================================================

//       const info = await transporter.sendMail(
//         mailOptions
//       );

//       console.log(
//         `✅ Email sent successfully: ${info.messageId}`
//       );

//       return {
//         success: true,
//         info,
//       };
//     } catch (error) {
//       lastError = error;

//       console.error(
//         `⚠️ Email attempt ${attempt}/${maxRetries} failed:`,
//         error.message
//       );

//       // ======================================================
//       // RECREATE TRANSPORTER IF NETWORK ERROR
//       // ======================================================

//       if (isConnectionError(error)) {
//         try {
//           transporter =
//             nodemailer.createTransport(
//               SMTP_CONFIG
//             );
//         } catch (recreateError) {
//           lastError = recreateError;
//         }
//       }

//       // ======================================================
//       // STOP AFTER FINAL ATTEMPT
//       // ======================================================

//       if (attempt === maxRetries) {
//         console.error(
//           "❌ Email sending failed after all attempts."
//         );

//         return {
//           success: false,
//           error:
//             lastError?.message ||
//             "Email sending failed",
//         };
//       }

//       // ======================================================
//       // RETRY DELAY
//       // ======================================================

//       await new Promise((resolve) => {
//         setTimeout(
//           resolve,
//           attempt * 2000
//         );
//       });
//     }
//   }

//   return {
//     success: false,
//     error:
//       lastError?.message ||
//       "Email sending failed",
//   };
// };

// // ============================================================
// // INITIAL SMTP CONNECTION TEST
// // ============================================================

// testConnection().catch((error) => {
//   console.error(
//     "❌ SMTP initialization error:",
//     error.message
//   );
// });

// // ============================================================
// // EXPORT
// // ============================================================

// module.exports = {
//   transporter,
//   sendMailWithRetry,
//   testConnection,
// };


















const nodemailer = require("nodemailer");
const dns = require("dns");
require("dotenv").config();

// ============================================================
// FORCE IPV4
// ============================================================
// No IP address is hardcoded.
// Node will resolve smtp.gmail.com normally.

try {
  dns.setDefaultResultOrder("ipv4first");
} catch (error) {
  console.log(
    "⚠️ DNS configuration warning:",
    error.message
  );
}

// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================

const SMTP_HOST =
  process.env.SMTP_HOST || "smtp.gmail.com";

const SMTP_PORT =
  parseInt(process.env.SMTP_PORT, 10) || 587;

const SMTP_USER =
  process.env.SMTP_USER;

const SMTP_PASS =
  process.env.SMTP_PASS;

// ============================================================
// SMTP CONFIGURATION
// ============================================================

const SMTP_CONFIG = {
  host: SMTP_HOST,

  port: SMTP_PORT,

  secure: SMTP_PORT === 465,

  // Force IPv4 without hardcoding an IP address
  family: 4,

  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },

  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  },

  debug:
    process.env.NODE_ENV === "development",

  logger:
    process.env.NODE_ENV === "development",
};

// ============================================================
// CREATE TRANSPORTER
// ============================================================

let transporter =
  nodemailer.createTransport(
    SMTP_CONFIG
  );

// ============================================================
// CREATE TRANSPORTER AGAIN
// ============================================================

const recreateTransporter = () => {
  transporter =
    nodemailer.createTransport(
      SMTP_CONFIG
    );

  return transporter;
};

// ============================================================
// CHECK SMTP CONFIGURATION
// ============================================================

const isSMTPConfigured = () => {
  if (!SMTP_USER || !SMTP_PASS) {
    console.error(
      "❌ SMTP_USER or SMTP_PASS is missing."
    );

    return false;
  }

  return true;
};

// ============================================================
// TEST SMTP CONNECTION
// ============================================================
// IMPORTANT:
// This does NOT run automatically when the server starts.
// Calling verify() on startup is what was producing
// the repeated timeout messages.
//
// Call testConnection() manually when you actually
// want to test SMTP.

const testConnection = async () => {
  if (!isSMTPConfigured()) {
    return false;
  }

  try {
    const currentTransporter =
      recreateTransporter();

    await currentTransporter.verify();

    console.log(
      "✅ SMTP Transporter connected successfully"
    );

    return true;
  } catch (error) {
    console.error(
      "❌ SMTP connection failed:",
      error.message
    );

    return false;
  }
};

// ============================================================
// SEND EMAIL
// ============================================================

const sendMail = async (mailOptions) => {
  if (!isSMTPConfigured()) {
    return {
      success: false,
      error: "SMTP is not configured",
    };
  }

  try {
    const info =
      await transporter.sendMail(
        mailOptions
      );

    console.log(
      "✅ Email sent successfully:",
      info.messageId
    );

    return {
      success: true,
      info,
    };
  } catch (error) {
    console.error(
      "❌ Email sending failed:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================================
// SEND EMAIL WITH RETRY
// ============================================================

const sendMailWithRetry = async (
  mailOptions,
  maxRetries = 3
) => {
  if (!isSMTPConfigured()) {
    return {
      success: false,
      error: "SMTP is not configured",
    };
  }

  let lastError = null;

  for (
    let attempt = 1;
    attempt <= maxRetries;
    attempt++
  ) {
    try {
      const info =
        await transporter.sendMail(
          mailOptions
        );

      console.log(
        "✅ Email sent successfully:",
        info.messageId
      );

      return {
        success: true,
        info,
      };
    } catch (error) {
      lastError = error;

      console.error(
        `⚠️ Email attempt ${attempt}/${maxRetries} failed:`,
        error.message
      );

      // ======================================================
      // RECREATE TRANSPORTER
      // ======================================================

      if (
        error.code === "ENETUNREACH" ||
        error.code === "ECONNREFUSED" ||
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ESOCKET" ||
        error.code === "EHOSTUNREACH" ||
        error.code === "EAI_AGAIN" ||
        error.code === "ECONNABORTED" ||
        error.code === "ENOTFOUND"
      ) {
        recreateTransporter();
      }

      // ======================================================
      // LAST ATTEMPT
      // ======================================================

      if (attempt === maxRetries) {
        break;
      }

      // ======================================================
      // RETRY DELAY
      // ======================================================

      await new Promise((resolve) => {
        setTimeout(
          resolve,
          attempt * 2000
        );
      });
    }
  }

  return {
    success: false,
    error:
      lastError?.message ||
      "Email sending failed",
  };
};

// ============================================================
// SEND EMAIL SAFELY
// ============================================================
// Use this when email should NEVER cause the main request
// to fail.
//
// Example:
// await sendMailSafely(mailOptions);

const sendMailSafely = async (
  mailOptions
) => {
  try {
    const result =
      await sendMailWithRetry(
        mailOptions,
        3
      );

    if (!result.success) {
      console.error(
        "⚠️ Email service unavailable:",
        result.error
      );
    }

    return result;
  } catch (error) {
    console.error(
      "⚠️ Email service error:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================================
// GET TRANSPORTER
// ============================================================

const getTransporter = () => {
  return transporter;
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  transporter,
  getTransporter,
  sendMail,
  sendMailWithRetry,
  sendMailSafely,
  testConnection,
};