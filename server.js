
const { startSMTPVerification } = require("./services/emailTransporter");

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

app.use(
  express.urlencoded({
    extended: true,
  }),
);

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

    mongoDatabase: mongoose.connection.name || null,

    mongoHost: mongoose.connection.host || null,

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

    database: {
      state: mongoose.connection.readyState,

      status:
        mongoose.connection.readyState === 1 ? "connected" : "not connected",
    },
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
   MONGODB EVENTS
============================================================ */

mongoose.connection.on("connected", () => {
  console.log("");

  console.log("================================================");

  console.log("🟢 MONGODB CONNECTION ESTABLISHED");

  console.log("🟢 Database:", mongoose.connection.name);

  console.log("🟢 Host:", mongoose.connection.host);

  console.log("🟢 Ready State:", mongoose.connection.readyState);

  console.log("================================================");
});

mongoose.connection.on("disconnected", () => {
  console.error("");

  console.error("================================================");

  console.error("🔴 MONGODB DISCONNECTED");

  console.error("🔴 Ready State:", mongoose.connection.readyState);

  console.error("================================================");
});

mongoose.connection.on("reconnected", () => {
  console.log("");

  console.log("================================================");

  console.log("🟢 MONGODB RECONNECTED");

  console.log("🟢 Ready State:", mongoose.connection.readyState);

  console.log("================================================");
});

mongoose.connection.on("error", (error) => {
  console.error("");

  console.error("================================================");

  console.error("❌ MONGODB ERROR");

  console.error("❌ Error:", error.message);

  console.error("❌ Ready State:", mongoose.connection.readyState);

  console.error("================================================");
});

/* ============================================================
   CONNECT DATABASE
============================================================ */

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }

    console.log("");

    console.log("================================================");

    console.log("🔄 CONNECTING TO MONGODB...");

    console.log("================================================");

    console.log("MONGO_URI:", "Configured ✅");

    console.log("Current Ready State:", mongoose.connection.readyState);

    console.log("================================================");

    await mongoose.connect(process.env.MONGO_URI);

    /* ========================================================
       VERIFY CONNECTION
    ======================================================== */

    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection was not established");
    }

    console.log("");

    console.log("================================================");

    console.log("🟢 MONGODB CONNECTED SUCCESSFULLY");

    console.log("🟢 Ready State:", mongoose.connection.readyState);

    console.log("================================================");

    return true;
  } catch (error) {
    console.error("");

    console.error("================================================");

    console.error("🔴 MONGODB CONNECTION FAILED");

    console.error("🔴 Error:", error.message);

    console.error("🔴 Ready State:", mongoose.connection.readyState);

    console.error("================================================");

    return false;
  }
};

/* ============================================================
   SERVER START
============================================================ */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log("");

  console.log("================================================");

  console.log("🚀 STARTING INYUMBA API");

  console.log("================================================");

  /* ==========================================================
     STEP 1
     CONNECT TO MONGODB FIRST
  ========================================================== */

  const dbConnected = await connectDB();

  /* ==========================================================
     DO NOT START SERVER IF DATABASE IS DOWN
  ========================================================== */

  if (!dbConnected) {
    console.error("");

    console.error("================================================");

    console.error("🔴 SERVER STARTUP ABORTED");

    console.error("🔴 MongoDB is not connected.");

    console.error("🔴 Database-dependent routes cannot safely run.");

    console.error("================================================");

    process.exit(1);
  }

  /* ==========================================================
     STEP 2
     START HTTP SERVER
  ========================================================== */

  const server = app.listen(PORT, "0.0.0.0", async () => {
    console.log("");

    console.log("================================================");

    console.log("🚀 INYUMBA API SERVER STARTED");

    console.log(`🌐 Port: ${PORT}`);

    console.log("🌍 Host: 0.0.0.0");

    console.log("❤️ Health: /health");

    console.log("✅ MongoDB: CONNECTED");

    console.log("================================================");

    /* ====================================================
           STEP 3
           VERIFY EMAIL SERVICE
        ==================================================== */

    try {
      await startSMTPVerification();
    } catch (error) {
      console.error("");

      console.error("🔴 EMAIL STARTUP CHECK FAILED");

      console.error("Reason:", error.message);

      console.error("⚠️ Server will remain online.");
    }
  });

  /* ==========================================================
     SERVER ERROR
  ========================================================== */

  server.on("error", (error) => {
    console.error("");

    console.error("❌ HTTP SERVER ERROR:");

    console.error(error.message);
  });
};

/* ============================================================
   START APPLICATION
============================================================ */

startServer();

/* ============================================================
   GRACEFUL SHUTDOWN
============================================================ */

const shutdown = async (signal) => {
  console.log("");

  console.log(`🛑 ${signal} RECEIVED`);

  try {
    await mongoose.connection.close();

    console.log("🟢 MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Shutdown error:", error.message);

    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("SIGINT", () => shutdown("SIGINT"));
