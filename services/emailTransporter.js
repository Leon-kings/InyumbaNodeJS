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
const dns = require("dns");
require("dotenv").config();

// Force IPv4
dns.setDefaultResultOrder("ipv4first");

// SMTP Configuration
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  family: 4,

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

// Create transporter
let transporter = nodemailer.createTransport(SMTP_CONFIG);

// Alternative configuration using port 465
const getAlternativeConfig = () => {
  return {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4,

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

// Function to test connection with multiple strategies
const testConnection = async () => {
  // Try primary configuration
  try {
    await transporter.verify();

    console.log("✅ SMTP Transporter connected successfully");

    return true;
  } catch (primaryError) {
    console.log("⚠️ Primary connection failed:", primaryError.message);

    // Try alternative configuration
    try {
      console.log("🔄 Trying alternative SMTP configuration...");

      const altConfig = getAlternativeConfig();

      transporter = nodemailer.createTransport(altConfig);

      await transporter.verify();

      console.log(
        "✅ SMTP Transporter connected with alternative config"
      );

      return true;
    } catch (altError) {
      console.error("❌ All SMTP connection attempts failed");
      console.error("Primary error:", primaryError.message);
      console.error("Alternative error:", altError.message);

      return false;
    }
  }
};

// Run connection test
testConnection();

// Export transporter with retry capability
const sendMailWithRetry = async (mailOptions, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const info = await transporter.sendMail(mailOptions);

      return {
        success: true,
        info,
      };
    } catch (error) {
      console.log(
        `📧 Email attempt ${i + 1} failed:`,
        error.message
      );

      // If it's a connection error, recreate transporter
      if (
        error.code === "ENETUNREACH" ||
        error.code === "ECONNREFUSED" ||
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ESOCKET"
      ) {
        console.log("🔄 Recreating transporter...");

        transporter = nodemailer.createTransport(SMTP_CONFIG);

        // Re-verify
        try {
          await transporter.verify();
        } catch (verifyError) {
          console.log(
            "⚠️ Re-verification failed:",
            verifyError.message
          );
        }
      }

      // Stop after final attempt
      if (i === maxRetries - 1) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Retry delay
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
};

module.exports = {
  transporter,
  sendMailWithRetry,
  testConnection,
};