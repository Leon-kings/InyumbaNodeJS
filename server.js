// const dns = require('dns');
// dns.setDefaultResultOrder('ipv4first');
// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const nodemailer = require('nodemailer');
// require('dotenv').config();

// dotenv.config();

// /* ---------------- ROUTES ---------------- */
// const authRoutes = require("./routes/authRoutes");
// const contactRoutes = require("./routes/contactRoutes");
// const testimonialRoutes = require("./routes/testimonialRoutes");
// const teamRoutes = require("./routes/teamRoutes");
// const houseRoutes = require("./routes/houseRoutes");
// const requestRoutes = require("./routes/requestRoutes");
// const bookingRoutes = require("./routes/bookingRoutes");
// const questionRoutes = require("./routes/questionRoutes");

// /* ---------------- APP ---------------- */
// const app = express();

// /* ---------------- GLOBAL MIDDLEWARE ---------------- */
// app.use(helmet());
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));

// /* ---------------- ROUTES ---------------- */

// app.use("/auth", authRoutes);
// app.use("/contact", contactRoutes);
// app.use("/testimonials", testimonialRoutes);
// app.use("/team", teamRoutes);
// app.use("/houses", houseRoutes);
// app.use("/requests", requestRoutes);
// app.use("/bookings", bookingRoutes);
// app.use("/questions", questionRoutes);

// /* ---------------- HEALTH CHECK ---------------- */

// app.get("/health", (req, res) => {
//   const dbState = mongoose.connection.readyState;

//   const dbStatus = {
//     0: "disconnected",
//     1: "connected",
//     2: "connecting",
//     3: "disconnecting",
//   };

//   res.status(200).json({
//     success: true,
//     status: "OK",
//     server: "running",
//     database: dbStatus[dbState] || "unknown",
//     dbState,
//     time: new Date().toISOString(),
//   });
// });

// /* ---------------- ROOT ---------------- */

// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "INYUMBA API is running",
//     version: "1.0.0",
//   });
// });

// /* ---------------- 404 ---------------- */

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route not found: ${req.originalUrl}`,
//   });
// });

// /* ---------------- DB CONNECTION ---------------- */

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 10000000,
//     });

//     console.log("✅ MongoDB connected");

//     return true;
//   } catch (error) {
//     console.error("❌ DB connection failed:", error.message);

//     return false;
//   }
// };

// /* ---------------- SERVER START ---------------- */

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   const dbConnected = await connectDB();

//   if (!dbConnected) {
//     console.error("❌ Server startup stopped because MongoDB is unavailable.");
//     process.exit(1);
//   }

//   const server = app.listen(PORT, "0.0.0.0", () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//     console.log(`❤️ Health check: /health`);
//   });

//   /* ---------------- GRACEFUL SHUTDOWN ---------------- */

//   const shutdown = async (signal) => {
//     console.log(`⚠️ ${signal} received`);

//     server.close(async () => {
//       try {
//         await mongoose.connection.close();
//         console.log("🔌 MongoDB disconnected");
//       } catch (error) {
//         console.error("❌ Error closing MongoDB:", error.message);
//       }

//       process.exit(0);
//     });
//   };

//   process.on("SIGINT", shutdown);
//   process.on("SIGTERM", shutdown);
// };

// // ============================================================
// // CREATE REUSABLE TRANSPORTER
// // ============================================================
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST || 'smtp.gmail.com',
//     port: parseInt(process.env.SMTP_PORT, 10) || 587,
//     secure: false, // true for 465, false for other ports

//     // Force IPv4 connection
//     family: 4,

//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },

//     tls: {
//       rejectUnauthorized: false,
//     },

//     // SMTP connection timeouts
//     connectionTimeout: 15000,
//     greetingTimeout: 15000,
//     socketTimeout: 20000,
//   });
// };

// // ============================================================
// // CHECK SMTP CONNECTION
// // ============================================================
// const checkEmailConnection = async () => {
//   try {
//     const transporter = createTransporter();

//     await transporter.verify();

//     console.log('✅ Email service connected successfully');
//     console.log(
//       `📧 SMTP: ${process.env.SMTP_HOST || 'smtp.gmail.com'}:${
//         process.env.SMTP_PORT || 587
//       }`
//     );

//     return {
//       connected: true,
//       transporter,
//     };
//   } catch (error) {
//     console.error(
//       '❌ Email service connection failed:',
//       error.message
//     );

//     return {
//       connected: false,
//       transporter: null,
//       error: error.message,
//     };
//   }
// };

// startServer();

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const {
  startSMTPVerification,
} = require("./services/emailTransporter");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

/* ============================================================
   ROUTES
============================================================ */

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const teamRoutes = require("./routes/teamRoutes");
const houseRoutes = require("./routes/houseRoutes");
const requestRoutes = require("./routes/requestRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const questionRoutes = require("./routes/questionRoutes");


/* ============================================================
   APP
============================================================ */

const app = express();

/* ============================================================
   GLOBAL MIDDLEWARE
============================================================ */

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

/* ============================================================
   ROUTES
============================================================ */

app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);
app.use("/testimonials", testimonialRoutes);
app.use("/team", teamRoutes);
app.use("/houses", houseRoutes);
app.use("/requests", requestRoutes);
app.use("/bookings", bookingRoutes);
app.use("/questions", questionRoutes);

/* ============================================================
   HEALTH CHECK
============================================================ */

app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;

  const dbStatus = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const database = dbStatus[dbState] || "unknown";

  return res.status(200).json({
    success: true,
    status: "OK",
    server: "running",
    database,
    dbState,
    time: new Date().toISOString(),
  });
});

/* ============================================================
   ROOT
============================================================ */

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "INYUMBA API is running",
    version: "1.0.0",
  });
});

/* ============================================================
   404
============================================================ */

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* ============================================================
   MONGODB CONNECTION
============================================================ */

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not configured");
      return false;
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected successfully");

    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);

    return false;
  }
};

/* ============================================================
   MONGODB EVENTS
============================================================ */

mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB connection established");
});

mongoose.connection.on("disconnected", () => {
  console.log("🟡 MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("🟢 MongoDB reconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("❌ MongoDB error:", error.message);
});

/* ============================================================
   SERVER START
============================================================ */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  /*
   * IMPORTANT:
   * The server starts regardless of MongoDB availability.
   * MongoDB connection is attempted separately.
   */

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log("==============================================");
    console.log("🚀 INYUMBA API SERVER STARTED");
    console.log(`🌐 Port: ${PORT}`);
    console.log("🌍 Host: 0.0.0.0");
    console.log("❤️ Health check: /health");
    console.log("==============================================");
  });
await startSMTPVerification();
  /*
   * Attempt MongoDB connection after the HTTP server
   * has already started.
   */

  const dbConnected = await connectDB();

  if (dbConnected) {
    console.log("✅ Database is ready");
  } else {
    console.warn("⚠️ MongoDB is currently unavailable.");

    console.warn("⚠️ Server will remain running.");

    console.warn(
      "⚠️ Database-dependent requests may fail until MongoDB reconnects.",
    );
  }
};

/* ============================================================
   START APPLICATION
============================================================ */

startServer();
