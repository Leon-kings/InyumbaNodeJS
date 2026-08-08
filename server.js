// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");

// dotenv.config();

// /* ---------------- ROUTES ---------------- */
// const authRoutes = require("./routes/authRoutes");
// const contactRoutes = require("./routes/contactRoutes");
// const testimonialRoutes = require("./routes/testimonialRoutes");
// const teamRoutes = require("./routes/teamRoutes");
// const houseRoutes = require("./routes/houseRoutes");
// const requestRoutes = require("./routes/requestRoutes");
// const bookingRoutes = require('./routes/bookingRoutes');

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
// app.use('/bookings', bookingRoutes);

// /* ---------------- HEALTH CHECK ---------------- */
// app.get("/health", (req, res) => {
//   res.json({
//     status: "OK",
//     dbState: mongoose.connection.readyState,
//     time: new Date().toISOString(),
//   });
// });

// /* ---------------- ROOT ---------------- */
// app.get("/", (req, res) => {
//   res.json({
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
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ MongoDB connected");
//   } catch (error) {
//     console.error("❌ DB connection failed:", error.message);
//     setTimeout(connectDB, 5000); // retry
//   }
// };

// /* ---------------- SERVER START ---------------- */
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   await connectDB();
//   const server = app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });

//   /* ---------------- GRACEFUL SHUTDOWN ---------------- */

//   const shutdown = async (signal) => {
//     console.log(`⚠️ ${signal} received`);

//     server.close(async () => {
//       await mongoose.connection.close();

//       console.log("🔌 MongoDB disconnected");

//       process.exit(0);
//     });
//   };

//   process.on("SIGINT", shutdown);
//   process.on("SIGTERM", shutdown);
// };

// startServer();












const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

/* ---------------- ROUTES ---------------- */
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const teamRoutes = require("./routes/teamRoutes");
const houseRoutes = require("./routes/houseRoutes");
const requestRoutes = require("./routes/requestRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

/* ---------------- APP ---------------- */
const app = express();

/* ---------------- GLOBAL MIDDLEWARE ---------------- */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ---------------- ROUTES ---------------- */

app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);
app.use("/testimonials", testimonialRoutes);
app.use("/team", teamRoutes);
app.use("/houses", houseRoutes);
app.use("/requests", requestRoutes);
app.use("/bookings", bookingRoutes);

/* ---------------- HEALTH CHECK ---------------- */

app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;

  const dbStatus = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(200).json({
    success: true,
    status: "OK",
    server: "running",
    database: dbStatus[dbState] || "unknown",
    dbState,
    time: new Date().toISOString(),
  });
});

/* ---------------- ROOT ---------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "INYUMBA API is running",
    version: "1.0.0",
  });
});

/* ---------------- 404 ---------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* ---------------- DB CONNECTION ---------------- */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB connected");

    return true;
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);

    return false;
  }
};

/* ---------------- SERVER START ---------------- */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbConnected = await connectDB();

  if (!dbConnected) {
    console.error("❌ Server startup stopped because MongoDB is unavailable.");
    process.exit(1);
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`❤️ Health check: /health`);
  });

  /* ---------------- GRACEFUL SHUTDOWN ---------------- */

  const shutdown = async (signal) => {
    console.log(`⚠️ ${signal} received`);

    server.close(async () => {
      try {
        await mongoose.connection.close();
        console.log("🔌 MongoDB disconnected");
      } catch (error) {
        console.error("❌ Error closing MongoDB:", error.message);
      }

      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer();