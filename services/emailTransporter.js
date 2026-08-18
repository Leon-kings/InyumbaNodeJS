const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter with IPv4 forced
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  family: 4, // force IPv4
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Transporter Error:", error.message);
  } else {
    console.log("✅ SMTP Transporter is ready to send emails");
  }
});

module.exports = transporter;