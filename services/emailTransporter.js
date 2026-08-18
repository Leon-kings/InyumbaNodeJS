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








const nodemailer = require("nodemailer");
require("dotenv").config();

// ============================================================
// SMTP CONFIGURATION
// ============================================================

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  },

  debug: process.env.NODE_ENV === "development",
  logger: process.env.NODE_ENV === "development",
};

// ============================================================
// CREATE TRANSPORTER
// ============================================================

let transporter = nodemailer.createTransport(SMTP_CONFIG);

// ============================================================
// ALTERNATIVE SMTP CONFIGURATION
// ============================================================

const getAlternativeConfig = () => {
  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },

    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },

    debug: process.env.NODE_ENV === "development",
    logger: process.env.NODE_ENV === "development",
  };
};

// ============================================================
// TEST SMTP CONNECTION
// ============================================================

const testConnection = async () => {
  try {
    await transporter.verify();

    console.log("✅ SMTP Transporter connected successfully");

    return true;
  } catch (primaryError) {
    try {
      const alternativeConfig = getAlternativeConfig();

      transporter = nodemailer.createTransport(
        alternativeConfig
      );

      await transporter.verify();

      console.log(
        "✅ SMTP Transporter connected successfully using alternative configuration"
      );

      return true;
    } catch (alternativeError) {
      console.error("❌ SMTP connection failed");

      return false;
    }
  }
};

// ============================================================
// SEND MAIL WITH RETRY
// ============================================================

const sendMailWithRetry = async (
  mailOptions,
  maxRetries = 3
) => {
  let lastError = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const info = await transporter.sendMail(mailOptions);

      return {
        success: true,
        info,
      };
    } catch (error) {
      lastError = error;

      // Recreate transporter for connection errors
      if (
        error.code === "ENETUNREACH" ||
        error.code === "ECONNREFUSED" ||
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ESOCKET" ||
        error.code === "EHOSTUNREACH" ||
        error.code === "EAI_AGAIN"
      ) {
        transporter = nodemailer.createTransport(
          SMTP_CONFIG
        );
      }

      // Final attempt
      if (i === maxRetries - 1) {
        return {
          success: false,
          error: lastError.message,
        };
      }

      // Retry delay
      await new Promise((resolve) => {
        setTimeout(resolve, Math.pow(2, i) * 1000);
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
// INITIALIZE SMTP CONNECTION
// ============================================================

testConnection().catch(() => {
  // Keep SMTP initialization failure silent
});

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  transporter,
  sendMailWithRetry,
  testConnection,
};