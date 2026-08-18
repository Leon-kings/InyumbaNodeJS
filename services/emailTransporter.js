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
const dns = require("dns").promises;
require("dotenv").config();

// ============================================================
// FORCE NODE TO PREFER IPV4
// ============================================================

try {
  require("dns").setDefaultResultOrder("ipv4first");
} catch (error) {
  console.log("⚠️ Could not set DNS result order:", error.message);
}

// ============================================================
// SMTP SETTINGS
// ============================================================

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

// ============================================================
// GET IPV4 ADDRESS FOR SMTP HOST
// ============================================================

const getIPv4Address = async () => {
  try {
    const addresses = await dns.resolve4(SMTP_HOST);

    if (!addresses || addresses.length === 0) {
      throw new Error(`No IPv4 address found for ${SMTP_HOST}`);
    }

    const ipv4 = addresses[0];

    console.log(`✅ Gmail IPv4 resolved: ${ipv4}`);

    return ipv4;
  } catch (error) {
    console.error(
      `❌ Failed to resolve IPv4 address for ${SMTP_HOST}:`,
      error.message
    );

    throw error;
  }
};

// ============================================================
// CREATE SMTP CONFIGURATION
// ============================================================

const createSMTPConfig = (ipv4, port = 587) => {
  const secure = port === 465;

  return {
    // IMPORTANT:
    // Use the resolved IPv4 address instead of smtp.gmail.com.
    // This prevents Node from connecting to Google's IPv6 address.
    host: ipv4,

    port,

    secure,

    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },

    // Keep Gmail hostname for TLS certificate verification.
    tls: {
      servername: SMTP_HOST,
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },

    // Explicitly use IPv4.
    family: 4,

    debug: process.env.NODE_ENV === "development",
    logger: process.env.NODE_ENV === "development",
  };
};

// ============================================================
// TRANSPORTER
// ============================================================

let transporter = null;

// ============================================================
// CREATE TRANSPORTER
// ============================================================

const createTransporter = async (port = 587) => {
  const ipv4 = await getIPv4Address();

  const config = createSMTPConfig(ipv4, port);

  transporter = nodemailer.createTransport(config);

  return transporter;
};

// ============================================================
// TEST PRIMARY SMTP CONNECTION
// ============================================================

const testPrimaryConnection = async () => {
  try {
    await createTransporter(587);

    await transporter.verify();

    console.log(
      "✅ SMTP Transporter connected successfully using IPv4 on port 587"
    );

    return true;
  } catch (error) {
    // Keep the error available to the fallback.
    return {
      success: false,
      error,
    };
  }
};

// ============================================================
// TEST ALTERNATIVE SMTP CONNECTION
// ============================================================

const testAlternativeConnection = async () => {
  try {
    await createTransporter(465);

    await transporter.verify();

    console.log(
      "✅ SMTP Transporter connected successfully using IPv4 on port 465"
    );

    return true;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

// ============================================================
// TEST CONNECTION
// ============================================================

const testConnection = async () => {
  // ==========================================================
  // CHECK SMTP CREDENTIALS
  // ==========================================================

  if (!SMTP_USER || !SMTP_PASS) {
    console.error("❌ SMTP credentials are not configured.");

    return false;
  }

  // ==========================================================
  // PRIMARY: PORT 587
  // ==========================================================

  const primaryResult = await testPrimaryConnection();

  if (primaryResult === true) {
    return true;
  }

  // ==========================================================
  // ALTERNATIVE: PORT 465
  // ==========================================================

  const alternativeResult = await testAlternativeConnection();

  if (alternativeResult === true) {
    return true;
  }

  // ==========================================================
  // BOTH FAILED
  // ==========================================================

  console.error("❌ SMTP connection could not be established.");

  if (primaryResult?.error) {
    console.error(
      "Port 587:",
      primaryResult.error.message
    );
  }

  if (alternativeResult?.error) {
    console.error(
      "Port 465:",
      alternativeResult.error.message
    );
  }

  return false;
};

// ============================================================
// SEND EMAIL WITH RETRY
// ============================================================

const sendMailWithRetry = async (
  mailOptions,
  maxRetries = 3
) => {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // ======================================================
      // MAKE SURE TRANSPORTER EXISTS
      // ======================================================

      if (!transporter) {
        await createTransporter(587);
      }

      // ======================================================
      // SEND EMAIL
      // ======================================================

      const info = await transporter.sendMail(mailOptions);

      console.log(
        `✅ Email sent successfully: ${info.messageId}`
      );

      return {
        success: true,
        info,
      };
    } catch (error) {
      lastError = error;

      console.error(
        `❌ Email attempt ${attempt}/${maxRetries} failed:`,
        error.message
      );

      // ======================================================
      // RECREATE TRANSPORTER FOR NETWORK ERRORS
      // ======================================================

      const connectionErrors = [
        "ENETUNREACH",
        "ECONNREFUSED",
        "ECONNRESET",
        "ETIMEDOUT",
        "ESOCKET",
        "ECONNABORTED",
        "EHOSTUNREACH",
        "EAI_AGAIN",
      ];

      if (connectionErrors.includes(error.code)) {
        try {
          // Re-resolve IPv4 and recreate transporter.
          await createTransporter(587);
        } catch (recreateError) {
          lastError = recreateError;
        }
      }

      // ======================================================
      // FINAL ATTEMPT
      // ======================================================

      if (attempt === maxRetries) {
        return {
          success: false,
          error: lastError?.message || "Email sending failed",
        };
      }

      // ======================================================
      // RETRY DELAY
      // ======================================================

      await new Promise((resolve) => {
        setTimeout(resolve, attempt * 2000);
      });
    }
  }

  return {
    success: false,
    error: lastError?.message || "Email sending failed",
  };
};

// ============================================================
// INITIALIZE SMTP
// ============================================================

testConnection().catch((error) => {
  console.error(
    "❌ SMTP initialization failed:",
    error.message
  );
});

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  transporter,
  sendMailWithRetry,
  testConnection,
  createTransporter,
};