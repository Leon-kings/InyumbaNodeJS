const House = require("../models/House");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { sendEmail } = require("../services/emailTransporter");

// ===========================================
// CLOUDINARY CONFIGURATION
// ===========================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===========================================
// CLOUDINARY STORAGE
// ===========================================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "HOUSES",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 800, height: 600, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

// ===========================================
// MULTER UPLOAD
// ===========================================
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"), false);
    }
  },
});

// ===========================================
// EMAIL TEMPLATES
// ===========================================

const getHouseNotificationEmail = (house, type, recipientType = "admin") => {
  const locationStr = `${house.location.province || "N/A"}, ${house.location.district || "N/A"}, ${house.location.sector || "N/A"}`;

  const isAdmin = recipientType === "admin";
  const isHost = recipientType === "host";

  const colors = {
    admin: {
      bg: "linear-gradient(135deg, #FF385C 0%, #D70466 100%)",
      alertBg: "#fff3cd",
      alertColor: "#856404",
      borderColor: "#FF385C",
    },
    host: {
      bg: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
      alertBg: "#d4edda",
      alertColor: "#155724",
      borderColor: "#28a745",
    },
    manager: {
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      alertBg: "#cce5ff",
      alertColor: "#004085",
      borderColor: "#667eea",
    },
    user: {
      bg: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      alertBg: "#d4edda",
      alertColor: "#155724",
      borderColor: "#11998e",
    },
  };

  const color = colors[recipientType] || colors.admin;

  return {
    subject: `🏠 House ${type}: ${house.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>House ${type}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px; }
          .header { background: ${color.bg}; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
          .header h2 { margin: 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert-box { background: ${color.alertBg}; padding: 15px; border-radius: 5px; border-left: 4px solid ${color.borderColor}; margin: 20px 0; }
          .alert-box h3 { margin: 0; color: ${color.alertColor}; }
          .details { margin: 15px 0; }
          .details p { margin: 5px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; text-align: center; }
          .btn { display: inline-block; background: ${color.borderColor}; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🏠 House ${type}</h2>
          </div>
          <div class="content">
            <div class="alert-box">
              <h3>${house.name}</h3>
              <p><strong>📍 Location:</strong> ${locationStr}</p>
              ${isHost ? `<p><strong>Status:</strong> ${house.status || "Pending"}</p>` : ""}
            </div>
            
            <div class="details">
              <p><strong>Type:</strong> ${type}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              ${house.pricePerMonth ? `<p><strong>Price:</strong> $${house.pricePerMonth}/month</p>` : ""}
              ${house.bedrooms ? `<p><strong>Bedrooms:</strong> ${house.bedrooms}</p>` : ""}
              ${house.bathrooms ? `<p><strong>Bathrooms:</strong> ${house.bathrooms}</p>` : ""}
              ${house.university ? `<p><strong>University:</strong> ${house.university}</p>` : ""}
            </div>
            
            ${
              isAdmin
                ? `
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
                <p style="margin: 0; text-align: center;">
                  <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/houses/${house._id}" 
                     style="display: inline-block; background: #667eea; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px;">
                    View & Manage
                  </a>
                </p>
              </div>
            `
                : ""
            }
            
            ${
              isHost
                ? `
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
                <p style="margin: 0; text-align: center;">
                  <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/host/houses/${house._id}" 
                     style="display: inline-block; background: #28a745; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px;">
                    View Your House
                  </a>
                </p>
              </div>
            `
                : ""
            }
            
            <div class="footer">
              <p>This is an automated notification from INYUMBA PROJECT.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

// ===========================================
// NOTIFICATION FUNCTIONS
// ===========================================

// Create notification for specific role
const createRoleNotification = async (house, type, role, userInfo = null) => {
  try {
    let title = "";
    let message = "";
    let priority = "normal";
    const locationStr = `${house.location.province || "N/A"}, ${house.location.district || "N/A"}, ${house.location.sector || "N/A"}`;

    switch (type) {
      case "house_created":
        title = "🏠 New House Listed";
        message = `New house "${house.name}" has been listed in ${locationStr}`;
        priority = "high";
        break;
      case "house_updated":
        title = "📝 House Updated";
        message = `House "${house.name}" has been updated in ${locationStr}`;
        priority = "normal";
        break;
      case "house_deleted":
        title = "🗑️ House Deleted";
        message = `House "${house.name}" has been removed from ${locationStr}`;
        priority = "high";
        break;
      case "house_status_changed":
        title = "🔄 House Status Changed";
        message = `House "${house.name}" status changed to ${house.status || "updated"}`;
        priority = "high";
        break;
      case "house_approved":
        title = "✅ House Approved";
        message = `House "${house.name}" has been approved and is now available`;
        priority = "high";
        break;
      case "house_rejected":
        title = "❌ House Rejected";
        message = `House "${house.name}" has been rejected`;
        priority = "high";
        break;
      default:
        title = "🏠 House Update";
        message = `Update for house "${house.name}"`;
    }

    // Get user info
    let userId = userInfo?.userId || null;
    let userEmail = userInfo?.email || house.host?.email || "";
    let userName = userInfo?.name || house.host?.name || "User";

    // If role is host, use host info
    if (role === "host" && house.host) {
      userId = house.host.userId || null;
      userEmail = house.host.email || "";
      userName = house.host.name || "Host";
    }

    const notification = new Notification({
      type: type,
      houseId: house._id,
      houseName: house.name,
      location: {
        province: house.location.province,
        district: house.location.district,
        sector: house.location.sector,
      },
      userId: userId,
      userName: userName,
      userEmail: userEmail,
      userRole: role,
      title,
      message,
      isRead: false,
      status: "new",
      targetRoles: [role],
      targetUserId: userId,
      targetUserEmail: userEmail,
      targetUserRole: role,
      priority,
      isGlobal: type === "house_created" || type === "house_updated",
      metadata: {
        houseName: house.name,
        location: locationStr,
        price: house.pricePerMonth,
        bedrooms: house.bedrooms,
        university: house.university,
        status: house.status,
        oldStatus: userInfo?.oldStatus || null,
        newStatus: house.status || null,
      },
    });

    await notification.save();
    console.log(`✅ ${role} notification created: ${message}`);
    return notification;
  } catch (error) {
    console.error(`❌ Error creating ${role} notification:`, error.message);
    return null;
  }
};

// Create notifications for all roles
const createAllRoleNotifications = async (house, type, userInfo = null) => {
  const roles = ["admin", "manager", "host", "user"];
  const notifications = [];

  for (const role of roles) {
    // Skip host if no host email
    if (role === "host" && !house.host?.email) continue;

    const notification = await createRoleNotification(
      house,
      type,
      role,
      userInfo,
    );
    if (notification) {
      notifications.push(notification);
    }
  }

  return notifications;
};

// ===========================================
// SEND EMAIL NOTIFICATIONS
// ===========================================

const sendHouseEmails = async (house, type, userInfo = null) => {
  try {
    const emailsSent = [];

    // Send to Admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminEmail) {
      const adminTemplate = getHouseNotificationEmail(house, type, "admin");
      const result = await sendEmail({
        to: adminEmail,
        subject: adminTemplate.subject,
        html: adminTemplate.html,
      });
      if (result.success) {
        emailsSent.push({ to: adminEmail, role: "admin" });
        console.log(`✅ Admin email sent to ${adminEmail}`);
      }
    }

    // Send to Host
    if (house.host?.email) {
      const hostTemplate = getHouseNotificationEmail(house, type, "host");
      const result = await sendEmail({
        to: house.host.email,
        subject: hostTemplate.subject,
        html: hostTemplate.html,
      });
      if (result.success) {
        emailsSent.push({ to: house.host.email, role: "host" });
        console.log(`✅ Host email sent to ${house.host.email}`);
      }
    }

    // Send to Managers
    const managers = await User.find({ role: "manager", isActive: true });
    for (const manager of managers) {
      const managerTemplate = getHouseNotificationEmail(house, type, "manager");
      const result = await sendEmail({
        to: manager.email,
        subject: managerTemplate.subject,
        html: managerTemplate.html,
      });
      if (result.success) {
        emailsSent.push({ to: manager.email, role: "manager" });
        console.log(`✅ Manager email sent to ${manager.email}`);
      }
    }

    return { success: true, emailsSent };
  } catch (error) {
    console.error("❌ Failed to send house emails:", error.message);
    return { success: false, error: error.message };
  }
};

// ===========================================
// CONTROLLER FUNCTIONS
// ===========================================

// 1. Create House
exports.createHouse = async (req, res) => {
  let houseSaved = false;

  try {
    // ==========================================================
    // VALIDATION RESULT
    // ==========================================================

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // ==========================================================
    // GET BODY DATA
    // ==========================================================

    const {
      houseId,
      name,
      houseType,
      description,
      location,
      university,
      pricePerMonth,
      bedrooms,
      bathrooms,
      guests,
      amenities,
      ownerName,
      ownerEmail,
      ownerContact,
      availability,
      status,
    } = req.body;

    // ==========================================================
    // REQUIRED BASIC FIELDS
    // ==========================================================

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "House name is required",
      });
    }

    if (!houseType || !String(houseType).trim()) {
      return res.status(400).json({
        success: false,
        message: "House type is required",
      });
    }

    // ==========================================================
    // CHECK IMAGES
    // ==========================================================

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // ==========================================================
    // PARSE LOCATION
    // ==========================================================

    let locationObj = {};

    try {
      if (typeof location === "string") {
        if (location.trim()) {
          locationObj = JSON.parse(location);
        }
      } else if (
        location &&
        typeof location === "object" &&
        !Array.isArray(location)
      ) {
        locationObj = location;
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid location data",
      });
    }

    // Make sure location is an object
    if (
      !locationObj ||
      typeof locationObj !== "object" ||
      Array.isArray(locationObj)
    ) {
      locationObj = {};
    }

    // ==========================================================
    // PARSE AVAILABILITY
    // ==========================================================

    let availabilityObj = {};

    try {
      if (typeof availability === "string") {
        if (availability.trim()) {
          availabilityObj = JSON.parse(availability);
        }
      } else if (
        availability &&
        typeof availability === "object" &&
        !Array.isArray(availability)
      ) {
        availabilityObj = availability;
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid availability data",
      });
    }

    // Make sure availability is an object
    if (
      !availabilityObj ||
      typeof availabilityObj !== "object" ||
      Array.isArray(availabilityObj)
    ) {
      availabilityObj = {};
    }

    // ==========================================================
    // PARSE AMENITIES
    // ==========================================================

    let amenitiesArray = [];

    try {
      if (typeof amenities === "string") {
        if (amenities.trim()) {
          amenitiesArray = JSON.parse(amenities);
        }
      } else if (Array.isArray(amenities)) {
        amenitiesArray = amenities;
      }

      // Support multipart/form-data:
      // amenities[]
      if (
        (!Array.isArray(amenitiesArray) || amenitiesArray.length === 0) &&
        req.body["amenities[]"]
      ) {
        if (Array.isArray(req.body["amenities[]"])) {
          amenitiesArray = req.body["amenities[]"];
        } else {
          amenitiesArray = [req.body["amenities[]"]];
        }
      }
    } catch (error) {
      if (Array.isArray(req.body["amenities[]"])) {
        amenitiesArray = req.body["amenities[]"];
      } else if (req.body["amenities[]"]) {
        amenitiesArray = [req.body["amenities[]"]];
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid amenities data",
        });
      }
    }

    // ==========================================================
    // NORMALIZE AMENITIES
    // ==========================================================

    if (!Array.isArray(amenitiesArray)) {
      amenitiesArray = [];
    }

    amenitiesArray = [
      ...new Set(
        amenitiesArray
          .map((item) => {
            if (item === null || item === undefined) {
              return "";
            }

            return String(item).trim();
          })
          .filter(Boolean),
      ),
    ];

    // ==========================================================
    // NORMALIZE NUMERIC VALUES
    // ==========================================================

    const numericPrice = Number(pricePerMonth);

    const numericBedrooms =
      bedrooms === undefined || bedrooms === null || bedrooms === ""
        ? 0
        : Number(bedrooms);

    const numericBathrooms =
      bathrooms === undefined || bathrooms === null || bathrooms === ""
        ? 0
        : Number(bathrooms);

    const numericGuests = Number(guests);

    // ==========================================================
    // PRICE VALIDATION
    // ==========================================================

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Monthly price must be a valid non-negative number",
      });
    }

    if (!Number.isInteger(numericPrice)) {
      return res.status(400).json({
        success: false,
        message: "Monthly price must be a whole number",
      });
    }

    // ==========================================================
    // BEDROOM VALIDATION
    // ==========================================================

    if (!Number.isFinite(numericBedrooms) || numericBedrooms < 0) {
      return res.status(400).json({
        success: false,
        message: "Bedrooms must be a valid non-negative number",
      });
    }

    if (!Number.isInteger(numericBedrooms)) {
      return res.status(400).json({
        success: false,
        message: "Bedrooms must be a whole number",
      });
    }

    // ==========================================================
    // BATHROOM VALIDATION
    // ==========================================================

    if (!Number.isFinite(numericBathrooms) || numericBathrooms < 0) {
      return res.status(400).json({
        success: false,
        message: "Bathrooms must be a valid non-negative number",
      });
    }

    if (!Number.isInteger(numericBathrooms)) {
      return res.status(400).json({
        success: false,
        message: "Bathrooms must be a whole number",
      });
    }

    // ==========================================================
    // GUEST VALIDATION
    // ==========================================================

    if (!Number.isFinite(numericGuests) || numericGuests < 1) {
      return res.status(400).json({
        success: false,
        message: "Guests must be at least 1",
      });
    }

    if (!Number.isInteger(numericGuests)) {
      return res.status(400).json({
        success: false,
        message: "Guests must be a whole number",
      });
    }

    // ==========================================================
    // NORMALIZE LOCATION
    //
    // House schema uses:
    // province
    // district
    // sector
    // cell
    // village
    // address
    // latitude
    // longitude
    //
    // NOT:
    // coordinates.lat
    // coordinates.lng
    // ==========================================================

    const normalizedLocation = {
      province: locationObj.province ? String(locationObj.province).trim() : "",

      district: locationObj.district ? String(locationObj.district).trim() : "",

      sector: locationObj.sector ? String(locationObj.sector).trim() : "",

      cell: locationObj.cell ? String(locationObj.cell).trim() : "",

      village: locationObj.village ? String(locationObj.village).trim() : "",

      address: locationObj.address ? String(locationObj.address).trim() : "",

      latitude: null,

      longitude: null,
    };

    // ==========================================================
    // SUPPORT OLD coordinates FORMAT
    // ==========================================================

    const latitude =
      locationObj.latitude ?? locationObj.coordinates?.lat ?? null;

    const longitude =
      locationObj.longitude ?? locationObj.coordinates?.lng ?? null;

    // ==========================================================
    // LATITUDE
    // ==========================================================

    if (latitude !== null && latitude !== "" && latitude !== undefined) {
      const numericLatitude = Number(latitude);

      if (
        !Number.isFinite(numericLatitude) ||
        numericLatitude < -90 ||
        numericLatitude > 90
      ) {
        return res.status(400).json({
          success: false,
          message: "Latitude must be between -90 and 90",
        });
      }

      normalizedLocation.latitude = numericLatitude;
    }

    // ==========================================================
    // LONGITUDE
    // ==========================================================

    if (longitude !== null && longitude !== "" && longitude !== undefined) {
      const numericLongitude = Number(longitude);

      if (
        !Number.isFinite(numericLongitude) ||
        numericLongitude < -180 ||
        numericLongitude > 180
      ) {
        return res.status(400).json({
          success: false,
          message: "Longitude must be between -180 and 180",
        });
      }

      normalizedLocation.longitude = numericLongitude;
    }

    // ==========================================================
    // NORMALIZE STATUS
    // ==========================================================

    const allowedStatuses = [
      "available",
      "unavailable",
      "pending",
      "booked",
      "maintenance",
      "inactive",
    ];

    const normalizedStatus =
      status && allowedStatuses.includes(String(status).trim().toLowerCase())
        ? String(status).trim().toLowerCase()
        : "pending";

    // ==========================================================
    // GET AUTHENTICATED USER
    // ==========================================================

    const userId = req.user?._id || req.user?.id || req.user?.userId || null;

    const userRole = req.user?.role || "user";

    // ==========================================================
    // NORMALIZE EMAIL
    // ==========================================================

    const normalizedOwnerEmail = ownerEmail
      ? String(ownerEmail).trim().toLowerCase()
      : "";

    const normalizedCreatedByEmail = req.user?.email
      ? String(req.user.email).trim().toLowerCase()
      : normalizedOwnerEmail;

    // ==========================================================
    // PREPARE CLOUDINARY IMAGES
    // ==========================================================

    const images = req.files.map((file) => ({
      public_id: file.public_id || file.filename || "",

      secure_url: file.secure_url || file.path || "",

      url: file.url || file.path || "",

      original_filename: file.originalname || "",
    }));

    // ==========================================================
    // CREATE HOUSE DATA
    //
    // IMPORTANT:
    // We DO NOT generate houseId here.
    //
    // House.js pre-save middleware generates it.
    // ==========================================================

    const houseData = {
      name: String(name).trim(),

      houseType: String(houseType).trim().toLowerCase(),

      description: description ? String(description).trim() : "",

      images,

      location: normalizedLocation,

      university: university ? String(university).trim() : "",

      pricePerMonth: numericPrice,

      currency: "RWF",

      bedrooms: numericBedrooms,

      bathrooms: numericBathrooms,

      guests: numericGuests,

      amenities: amenitiesArray,

      availability: availabilityObj,

      status: normalizedStatus,

      ownerName: ownerName ? String(ownerName).trim() : "",

      ownerEmail: normalizedOwnerEmail,

      ownerContact: ownerContact ? String(ownerContact).trim() : "",

      createdBy: userId,

      createdByEmail: normalizedCreatedByEmail,

      isActive: true,

      isFeatured: false,
    };

    // ==========================================================
    // OPTIONAL MANUAL HOUSE ID
    //
    // If the frontend/admin supplied a houseId,
    // allow it.
    //
    // Otherwise House.js generates it automatically.
    // ==========================================================

    if (houseId && String(houseId).trim()) {
      houseData.houseId = String(houseId).trim().toUpperCase();
    }

    // ==========================================================
    // CHECK MANUAL HOUSE ID DUPLICATE
    // ==========================================================

    if (houseData.houseId) {
      const existingHouse = await House.findOne({
        houseId: houseData.houseId,
      }).lean();

      if (existingHouse) {
        return res.status(409).json({
          success: false,
          message: "House ID already exists",
          data: {
            houseId: houseData.houseId,
          },
        });
      }
    }

    // ==========================================================
    // CREATE MONGOOSE DOCUMENT
    // ==========================================================

    const house = new House(houseData);

    // ==========================================================
    // SAVE HOUSE
    //
    // House.js handles houseId generation.
    //
    // NO next()
    // ==========================================================

    await house.save();

    houseSaved = true;

    // ==========================================================
    // USER INFORMATION FOR NOTIFICATIONS
    // ==========================================================

    const userInfo = {
      userId,

      email: normalizedOwnerEmail || normalizedCreatedByEmail,

      name: ownerName ? String(ownerName).trim() : req.user?.name || "",

      role: userRole,
    };

    // ==========================================================
    // CREATE ROLE-BASED NOTIFICATIONS
    // ==========================================================

    try {
      await createAllRoleNotifications(house, "house_created", userInfo);
    } catch (notificationError) {
      console.error(
        "House notification creation failed:",
        notificationError?.message || notificationError,
      );
    }

    // ==========================================================
    // SEND EMAILS
    // ==========================================================

    try {
      await sendHouseEmails(house, "Created", userInfo);
    } catch (emailError) {
      console.error(
        "House email notification failed:",
        emailError?.message || emailError,
      );
    }

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return res.status(201).json({
      success: true,

      message: "House created successfully and waiting for approval",

      data: house,
    });
  } catch (error) {
    // ==========================================================
    // LOG REAL ERROR
    // ==========================================================

    console.error("==================================================");

    console.error("❌ CREATE HOUSE ERROR");

    console.error("Error name:", error?.name);

    console.error("Error message:", error?.message);

    console.error("Error code:", error?.code);

    if (error?.errors) {
      console.error(
        "Validation errors:",
        Object.fromEntries(
          Object.entries(error.errors).map(([field, err]) => [
            field,
            err.message,
          ]),
        ),
      );
    }

    console.error("==================================================");

    // ==========================================================
    // CLOUDINARY CLEANUP
    //
    // ONLY CLEAN UP IF HOUSE WAS NOT SAVED.
    // ==========================================================

    if (!houseSaved && req.files?.length) {
      for (const file of req.files) {
        try {
          const publicId = file.public_id || file.filename;

          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (cleanupError) {
          console.error(
            "Cloudinary cleanup failed:",
            cleanupError?.message || cleanupError,
          );
        }
      }
    }

    // ==========================================================
    // MONGOOSE VALIDATION ERROR
    // ==========================================================

    if (error?.name === "ValidationError") {
      const validationErrors = Object.values(error.errors || {}).map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      }));

      return res.status(400).json({
        success: false,

        message: "House validation failed",

        errors: validationErrors,
      });
    }

    // ==========================================================
    // CAST ERROR
    // ==========================================================

    if (error?.name === "CastError") {
      return res.status(400).json({
        success: false,

        message: `Invalid value for ${error.path}`,

        error: error.message,
      });
    }

    // ==========================================================
    // DUPLICATE KEY ERROR
    // ==========================================================

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,

        message: "House with this unique value already exists",

        duplicateFields: error.keyValue || {},
      });
    }

    // ==========================================================
    // GENERAL ERROR
    // ==========================================================

    return res.status(500).json({
      success: false,

      message: "Failed to create house",

      error: error?.message || "Unknown server error",

      errorName: error?.name || "Error",

      errorCode: error?.code || null,
    });
  }
};

// 2. Get All Houses
exports.getAllHouses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const university = req.query.university;
    const province = req.query.province;
    const district = req.query.district;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const bedrooms = req.query.bedrooms;
    const search = req.query.search;

    let query = {};

    if (status) query.status = status;
    if (university) query.university = { $regex: university, $options: "i" };
    if (province)
      query["location.province"] = { $regex: province, $options: "i" };
    if (district)
      query["location.district"] = { $regex: district, $options: "i" };
    if (bedrooms) query.bedrooms = parseInt(bedrooms);
    if (minPrice || maxPrice) {
      query.pricePerMonth = {};
      if (minPrice) query.pricePerMonth.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerMonth.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { university: { $regex: search, $options: "i" } },
      ];
    }

    const [houses, total] = await Promise.all([
      House.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      House.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: houses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all houses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch houses",
    });
  }
};

// 3. Get House by ID
exports.getHouseById = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    res.status(200).json({
      success: true,
      data: house,
    });
  } catch (error) {
    console.error("Get house by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch house",
    });
  }
};

// 4. Get House by House ID
exports.getHouseByHouseId = async (req, res) => {
  try {
    const house = await House.findOne({ houseId: req.params.houseId });

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    res.status(200).json({
      success: true,
      data: house,
    });
  } catch (error) {
    console.error("Get house by houseId error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch house",
    });
  }
};

// 5. Get Houses by Host Email
// exports.getHousesByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const houses = await House.find({
//       "host.email": email.toLowerCase().trim(),
//     }).sort({ createdAt: -1 });

//     if (houses.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No houses found for this email",
//         data: [],
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       total: houses.length,
//       data: houses,
//     });
//   } catch (error) {
//     console.error("Get houses by email error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch houses",
//     });
//   }
// };

exports.getHousesByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = decodeURIComponent(email).trim().toLowerCase();

    const houses = await House.find({
      $or: [
        { ownerEmail: normalizedEmail },
        { "host.email": normalizedEmail },
        { createdByEmail: normalizedEmail },
      ],
    }).sort({ createdAt: -1 });

    if (houses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No houses found for this email",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      total: houses.length,
      data: houses,
    });
  } catch (error) {
    console.error("Get houses by email error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch houses",
      error: error.message,
    });
  }
};

// 6. Update House
exports.updateHouse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          await cloudinary.uploader.destroy(file.filename);
        }
      }
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const house = await House.findById(req.params.id);
    if (!house) {
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          await cloudinary.uploader.destroy(file.filename);
        }
      }
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    const {
      name,
      description,
      location,
      university,
      pricePerMonth,
      bedrooms,
      bathrooms,
      maxGuests,
      amenities,
      status,
      rating,
      totalReviews,
      host,
      availability,
      isActive,
    } = req.body;

    let changes = [];
    const oldStatus = house.status;

    if (name && name !== house.name) changes.push("name");
    if (status && status !== house.status) changes.push("status");
    if (location) changes.push("location");

    if (name) house.name = name;
    if (description) house.description = description;
    if (university) house.university = university;
    if (pricePerMonth) house.pricePerMonth = parseFloat(pricePerMonth);
    if (bedrooms) house.bedrooms = parseInt(bedrooms);
    if (bathrooms) house.bathrooms = parseInt(bathrooms);
    if (maxGuests) house.maxGuests = parseInt(maxGuests);
    if (status) house.status = status;
    if (rating !== undefined) house.rating = parseFloat(rating);
    if (totalReviews !== undefined) house.totalReviews = parseInt(totalReviews);
    if (isActive !== undefined)
      house.isActive = isActive === "true" || isActive === true;

    if (location) {
      try {
        const locationObj =
          typeof location === "string" ? JSON.parse(location) : location;
        house.location = {
          province: locationObj.province || house.location.province,
          district: locationObj.district || house.location.district,
          sector: locationObj.sector || house.location.sector,
          cell: locationObj.cell || house.location.cell,
          village: locationObj.village || house.location.village,
          coordinates: {
            lat:
              locationObj.coordinates?.lat ||
              house.location.coordinates?.lat ||
              null,
            lng:
              locationObj.coordinates?.lng ||
              house.location.coordinates?.lng ||
              null,
          },
        };
      } catch (e) {
        console.error("Location parse error:", e);
      }
    }

    if (amenities) {
      try {
        house.amenities =
          typeof amenities === "string" ? JSON.parse(amenities) : amenities;
      } catch (e) {
        house.amenities = [];
      }
    }

    if (host) {
      try {
        const hostObj = typeof host === "string" ? JSON.parse(host) : host;
        house.host = {
          userId: house.host.userId || null,
          name: hostObj.name || house.host.name,
          email: hostObj.email || house.host.email,
          phone: hostObj.phone || house.host.phone,
          responseRate:
            parseFloat(hostObj.responseRate) || house.host.responseRate,
          responseTime: hostObj.responseTime || house.host.responseTime,
        };
      } catch (e) {
        console.error("Host parse error:", e);
      }
    }

    if (availability) {
      try {
        const availabilityObj =
          typeof availability === "string"
            ? JSON.parse(availability)
            : availability;
        house.availability = {
          startDate: availabilityObj.startDate || house.availability.startDate,
          endDate: availabilityObj.endDate || house.availability.endDate,
        };
      } catch (e) {
        console.error("Availability parse error:", e);
      }
    }

    if (req.files && req.files.length > 0) {
      for (const img of house.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      house.images = req.files.map((file) => ({
        public_id: file.filename,
        url: file.path,
        secure_url: file.path,
      }));
    }

    await house.save();

    // ===========================
    // CREATE NOTIFICATIONS
    // ===========================
    const userInfo = {
      userId: house.host.userId || null,
      email: house.host.email || "",
      name: house.host.name || "",
      oldStatus: oldStatus,
    };

    await createAllRoleNotifications(house, "house_updated", userInfo);

    // Send notification if status changed
    if (oldStatus !== house.status) {
      await createAllRoleNotifications(house, "house_status_changed", userInfo);
    }

    // ===========================
    // SEND EMAILS
    // ===========================
    await sendHouseEmails(house, "Updated", userInfo);

    res.status(200).json({
      success: true,
      message: "House updated successfully",
      data: house,
    });
  } catch (error) {
    console.error("Update house error:", error);
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await cloudinary.uploader.destroy(file.filename);
      }
    }
    res.status(500).json({
      success: false,
      message: "Failed to update house",
    });
  }
};

// 7. Update House Status

// ============================================================
// UPDATE HOUSE STATUS
// ============================================================

exports.updateHouseStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================================
    // VALID STATUS VALUES
    // ==========================================================

    const validStatuses = [
      "available",
      "pending",
      "booked",
      "unavailable",
      "maintenance",
      "inactive",
    ];

    // ==========================================================
    // GET REQUESTED STATUS
    // ==========================================================

    const status = String(req.body?.status || "")
      .trim()
      .toLowerCase();

    // ==========================================================
    // VALIDATE STATUS
    // ==========================================================

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
        data: {
          validStatuses,
        },
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Must be one of: ${validStatuses.join(
          ", ",
        )}`,
        data: {
          requestedStatus: status,
          validStatuses,
        },
      });
    }

    // ==========================================================
    // VALIDATE HOUSE ID
    // ==========================================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid house ID",
      });
    }

    // ==========================================================
    // FIND HOUSE
    // ==========================================================

    const house = await House.findById(id).lean();

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    // ==========================================================
    // OLD STATUS
    // ==========================================================

    const oldStatus = String(house.status || "")
      .trim()
      .toLowerCase();

    // ==========================================================
    // UPDATE STATUS
    // ==========================================================
    // No check against oldStatus.
    //

    const updatedHouse = await House.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    // ==========================================================
    // VERIFY UPDATE
    // ==========================================================

    if (!updatedHouse) {
      return res.status(500).json({
        success: false,
        message: "Failed to update house status",
      });
    }

    const updatedStatus = String(updatedHouse.status || "")
      .trim()
      .toLowerCase();

    // ==========================================================
    // VERIFY REQUESTED STATUS WAS SAVED
    // ==========================================================

    if (updatedStatus !== status) {
      return res.status(500).json({
        success: false,
        message: "Status update failed",
        data: {
          houseId: updatedHouse.houseId,
          oldStatus,
          requestedStatus: status,
          currentStatus: updatedStatus,
        },
      });
    }

    // ==========================================================
    // NOTIFICATION TYPE
    // ==========================================================

    let notificationType = "house_status_changed";

    switch (status) {
      case "available":
        notificationType = "house_available";
        break;

      case "pending":
        notificationType = "house_pending";
        break;

      case "booked":
        notificationType = "house_booked";
        break;

      case "unavailable":
        notificationType = "house_unavailable";
        break;

      case "maintenance":
        notificationType = "house_maintenance";
        break;

      case "inactive":
        notificationType = "house_status_changed";
        break;
    }

    // ==========================================================
    // USER INFORMATION
    // ==========================================================

    const userInfo = {
      userId: updatedHouse.createdBy || null,

      email: updatedHouse.ownerEmail || updatedHouse.createdByEmail || "",

      name: updatedHouse.ownerName || "",

      oldStatus,
      newStatus: status,
    };

    // ==========================================================
    // SEND RESPONSE IMMEDIATELY
    // ==========================================================

    res.status(200).json({
      success: true,
      message: "House status updated successfully",
      data: {
        _id: updatedHouse._id,
        houseId: updatedHouse.houseId,
        name: updatedHouse.name,

        // New status
        status: updatedStatus,

        // Keep old status for information only
        oldStatus,

        // Requested status
        requestedStatus: status,

        updatedAt: updatedHouse.updatedAt,
      },
    });

    // ==========================================================
    // BACKGROUND NOTIFICATIONS
    // ==========================================================

    Promise.resolve().then(async () => {
      try {
        await createAllRoleNotifications(
          updatedHouse,
          notificationType,
          userInfo,
        );
      } catch (notificationError) {
        console.error(
          "❌ House notification failed:",
          notificationError.message,
        );
      }
    });

    // ==========================================================
    // BACKGROUND EMAILS
    // ==========================================================

    Promise.resolve().then(async () => {
      try {
        await sendHouseEmails(
          updatedHouse,
          `Status Changed: ${oldStatus} → ${status}`,
          userInfo,
        );
      } catch (emailError) {
        console.error("❌ House status email failed:", emailError.message);
      }
    });
  } catch (error) {
    console.error("❌ Update house status error:", error.message);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to update house status",
        error: error.message,
      });
    }
  }
};

// 8. Delete House

exports.deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================================
    // VALIDATE HOUSE ID
    // ==========================================================

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "House ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid house ID",
      });
    }

    // ==========================================================
    // FIND HOUSE
    // ==========================================================

    const house = await House.findById(id);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    console.log("==================================================");
    console.log("🗑️ DELETE HOUSE");
    console.log("House ID:", house._id);
    console.log("House Name:", house.name);
    console.log("Requested by user:", req.user?.id || "Unknown");
    console.log("==================================================");

    // ==========================================================
    // USER INFORMATION
    // ==========================================================
    // No ownership restriction is applied here.
    // ANY user who can access this route can delete the house.
    // ==========================================================

    const userInfo = {
      userId: house.host?.userId || house.createdBy || null,

      email:
        house.host?.email || house.ownerEmail || house.createdByEmail || "",

      name: house.host?.name || house.ownerName || "",
    };

    // ==========================================================
    // CREATE NOTIFICATIONS
    // ==========================================================

    try {
      await createAllRoleNotifications(house, "house_deleted", userInfo);

      console.log("✅ House deletion notifications created");
    } catch (notificationError) {
      console.error(
        "❌ House notification failed:",
        notificationError?.message || notificationError,
      );
    }

    // ==========================================================
    // SEND EMAILS
    // ==========================================================

    try {
      await sendHouseEmails(house, "Deleted", userInfo);

      console.log("✅ House deletion emails processed");
    } catch (emailError) {
      console.error(
        "❌ House deletion email failed:",
        emailError?.message || emailError,
      );
    }

    // ==========================================================
    // DELETE CLOUDINARY IMAGES
    // ==========================================================

    if (Array.isArray(house.images)) {
      for (const img of house.images) {
        try {
          const publicId =
            img?.public_id || img?.publicId || img?.publicID || null;

          if (!publicId) {
            console.warn("⚠️ Image has no Cloudinary public ID. Skipping.");
            continue;
          }

          await cloudinary.uploader.destroy(publicId);

          console.log("✅ Cloudinary image deleted:", publicId);
        } catch (cloudinaryError) {
          console.error(
            "❌ Cloudinary image deletion failed:",
            cloudinaryError?.message || cloudinaryError,
          );
        }
      }
    }

    // ==========================================================
    // DELETE HOUSE
    // ==========================================================

    await house.deleteOne();

    console.log("✅ House deleted successfully");

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return res.status(200).json({
      success: true,
      message: "House deleted successfully",
      data: {
        _id: house._id,
        houseId: house.houseId || null,
        name: house.name || null,
      },
    });
  } catch (error) {
    console.error("==================================================");
    console.error("❌ DELETE HOUSE ERROR");
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);
    console.error("==================================================");

    if (res.headersSent) {
      return;
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete house",
      error: error?.message || "Unknown error",
    });
  }
};

// 9. Get House Statistics
exports.getHouseStatistics = async (req, res) => {
  try {
    const stats = await House.getStatistics();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get house statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get statistics",
    });
  }
};

// 10. Get Houses by University
exports.getHousesByUniversity = async (req, res) => {
  try {
    const university = req.params.university;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [houses, total] = await Promise.all([
      House.find({
        university: { $regex: university, $options: "i" },
        status: "available",
      })
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      House.countDocuments({
        university: { $regex: university, $options: "i" },
        status: "available",
      }),
    ]);

    res.status(200).json({
      success: true,
      data: houses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get houses by university error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch houses",
    });
  }
};

// 11. Get Available Houses
exports.getAvailableHouses = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const houses = await House.find({
      status: "available",
      isActive: true,
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: houses,
    });
  } catch (error) {
    console.error("Get available houses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available houses",
    });
  }
};

// 12. Get Newly Added Houses
exports.getNewlyAddedHouses = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const days = parseInt(req.query.days) || 7;

    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const houses = await House.find({
      createdAt: { $gte: dateLimit },
      status: "available",
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: houses,
      count: houses.length,
      message:
        houses.length > 0
          ? `Found ${houses.length} newly added houses in the last ${days} days`
          : "No newly added houses found",
    });
  } catch (error) {
    console.error("Get newly added houses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch newly added houses",
    });
  }
};

// ==========================================
// NOTIFICATION FUNCTIONS (House Related)
// ==========================================

// 13. Get House Notifications
exports.getHouseNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const role = req.query.role;

    let query = {
      type: { $regex: /^house_/ },
    };

    if (status) query.status = status;
    if (role) query.targetRoles = { $in: [role] };

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("houseId", "name houseId location images")
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({
        ...query,
        isRead: false,
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get house notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 14. Get My House Notifications
exports.getMyHouseNotifications = async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 20, isRead } = req.query;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const query = {
      type: { $regex: /^house_/ },
      $or: [
        { targetRoles: { $in: [user.role] } },
        { targetUserId: user.id },
        { targetUserEmail: user.email },
        { userId: user.id },
      ],
    };

    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("houseId", "name houseId location images")
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({
        ...query,
        isRead: false,
      }),
    ]);

    return res.status(200).json({
      success: true,
      userRole: user.role,
      data: notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get my house notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// 15. Mark Notification as Read - FIXED (No role checking)
// exports.markNotificationAsRead = async (req, res) => {
//   try {
//     const { notificationId } = req.body;

//     if (!notificationId) {
//       return res.status(400).json({
//         success: false,
//         message: "Notification ID is required",
//       });
//     }

//     const notification = await Notification.findByIdAndUpdate(
//       notificationId,
//       {
//         $set: {
//           isRead: true,
//           status: "read",
//           readAt: new Date(),
//         },
//       },
//       { new: true }
//     );

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: "Notification not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Notification marked as read",
//       notification,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to mark notification as read",
//     });
//   }
// };

// 15. Mark Notification as Read - FIXED (Supports both params & body)
exports.markNotificationAsRead = async (req, res) => {
  try {
    // Check both param names for compatibility
    const notificationId = req.params.id || req.params.notificationId || req.body.notificationId;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        $set: {
          isRead: true,
          status: "read",
          readAt: new Date(),
        },
      },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

exports.getNotificationsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const notifications = await Notification.find({ email })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications",
      error: error.message,
    });
  }
};
// 16. Mark All Notifications as Read - FIXED (No role checking)

// exports.markAllNotificationsAsRead = async (req, res) => {
//   try {
//     const { notificationIds } = req.body;

//     if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Notification IDs are required",
//       });
//     }

//     const result = await Notification.updateMany(
//       {
//         _id: { $in: notificationIds },
//         source: "house",
//         isRead: false,
//       },
//       {
//         $set: {
//           isRead: true,
//           status: "read",
//           readAt: new Date(),
//         },
//       },
//     );

//     return res.status(200).json({
//       success: true,
//       message: `${result.modifiedCount} notifications marked as read`,
//       modifiedCount: result.modifiedCount,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to mark all notifications as read",
//     });
//   }
// };

// 16. Mark All Notifications as Read - FIXED (Supports both params & body)
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const notificationIds = req.body.notificationIds || req.params.ids;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Notification IDs are required",
      });
    }

    const result = await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        source: "house",
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          status: "read",
          readAt: new Date(),
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};

// 17. Get Unread Notification Count
exports.getUnreadNotificationCount = async (req, res) => {
  try {
    const user = req.user;
    const { role } = req.query;

    let filter = {
      type: { $regex: /^house_/ },
      isRead: false,
    };

    if (role) {
      filter.targetRoles = { $in: [role] };
    } else if (user) {
      filter.$or = [
        { targetRoles: { $in: [user.role] } },
        { targetUserId: user.id },
        { targetUserEmail: user.email },
        { userId: user.id },
      ];
    }

    const count = await Notification.countDocuments(filter);

    // Get counts by role
    const roleCounts = await Notification.aggregate([
      {
        $match: filter,
      },
      {
        $unwind: "$targetRoles",
      },
      {
        $group: {
          _id: "$targetRoles",
          count: { $sum: 1 },
        },
      },
    ]);

    const countsByRole = {};
    roleCounts.forEach((item) => {
      countsByRole[item._id] = item.count;
    });

    return res.status(200).json({
      success: true,
      totalUnread: count,
      byRole: countsByRole,
    });
  } catch (error) {
    console.error("Get unread notification count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get unread count",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ============================================================
// 18. DELETE NOTIFICATION
// ============================================================

// exports.deleteNotification = async (req, res) => {
//   try {
//     const { id } = req.params|| req.body.ids;

//     // ==========================================================
//     // VALIDATE ID
//     // ==========================================================

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Notification ID is required",
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid notification ID",
//       });
//     }

//     // ==========================================================
//     // FIND NOTIFICATION
//     // ==========================================================

//     const notification = await Notification.findById(id);

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: "Notification not found",
//       });
//     }

//     // ==========================================================
//     // DELETE NOTIFICATION
//     // ==========================================================

//     await Notification.deleteOne({
//       _id: notification._id,
//     });

//     // ==========================================================
//     // SUCCESS RESPONSE
//     // ==========================================================

//     return res.status(200).json({
//       success: true,
//       message: "Notification deleted successfully",
//       data: {
//         _id: notification._id,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Delete notification error:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete notification",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// // ============================================================
// // 19. BULK DELETE NOTIFICATIONS
// // ============================================================

// exports.bulkDeleteNotifications = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     // ==========================================================
//     // VALIDATE IDS
//     // ==========================================================

//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide an array of notification IDs",
//       });
//     }

//     // ==========================================================
//     // REMOVE DUPLICATES
//     // ==========================================================

//     const uniqueIds = [
//       ...new Set(ids.map((id) => String(id).trim()).filter(Boolean)),
//     ];

//     if (uniqueIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No valid notification IDs provided",
//       });
//     }

//     // ==========================================================
//     // VALIDATE MONGODB IDS
//     // ==========================================================

//     const invalidIds = uniqueIds.filter(
//       (id) => !mongoose.Types.ObjectId.isValid(id),
//     );

//     if (invalidIds.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "One or more notification IDs are invalid",
//         data: {
//           invalidIds,
//         },
//       });
//     }

//     // ==========================================================
//     // DELETE NOTIFICATIONS
//     // ==========================================================

//     const result = await Notification.deleteMany({
//       _id: {
//         $in: uniqueIds,
//       },
//     });

//     // ==========================================================
//     // NOTHING FOUND
//     // ==========================================================

//     if (result.deletedCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No notifications found to delete",
//         deletedCount: 0,
//       });
//     }

//     // ==========================================================
//     // SUCCESS
//     // ==========================================================

//     return res.status(200).json({
//       success: true,
//       message: `${result.deletedCount} notification${
//         result.deletedCount === 1 ? "" : "s"
//       } deleted successfully`,
//       deletedCount: result.deletedCount,
//       requestedCount: uniqueIds.length,
//     });
//   } catch (error) {
//     console.error("❌ Bulk delete notifications error:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete notifications",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

exports.deleteNotification = async (req, res) => {
  try {
    const id = req.params.id || req.body.id || req.body.notificationId;

    // ==========================================================
    // VALIDATE ID
    // ==========================================================

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    // ==========================================================
    // FIND NOTIFICATION
    // ==========================================================

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // ==========================================================
    // DELETE NOTIFICATION
    // ==========================================================

    await Notification.deleteOne({
      _id: notification._id,
    });

    // ==========================================================
    // SUCCESS RESPONSE
    // ==========================================================

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: {
        _id: notification._id,
      },
    });
  } catch (error) {
    console.error("❌ Delete notification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ============================================================
// 19. BULK DELETE NOTIFICATIONS
// ============================================================

exports.bulkDeleteNotifications = async (req, res) => {
  try {
    const ids = req.body.ids || req.body.notificationIds;

    // ==========================================================
    // VALIDATE IDS
    // ==========================================================

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of notification IDs",
      });
    }

    // ==========================================================
    // REMOVE DUPLICATES
    // ==========================================================

    const uniqueIds = [
      ...new Set(ids.map((id) => String(id).trim()).filter(Boolean)),
    ];

    if (uniqueIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid notification IDs provided",
      });
    }

    // ==========================================================
    // VALIDATE MONGODB IDS
    // ==========================================================

    const invalidIds = uniqueIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id),
    );

    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more notification IDs are invalid",
        data: {
          invalidIds,
        },
      });
    }

    // ==========================================================
    // DELETE NOTIFICATIONS
    // ==========================================================

    const result = await Notification.deleteMany({
      _id: {
        $in: uniqueIds,
      },
    });

    // ==========================================================
    // NOTHING FOUND
    // ==========================================================

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No notifications found to delete",
        deletedCount: 0,
      });
    }

    // ==========================================================
    // SUCCESS
    // ==========================================================

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} notification${
        result.deletedCount === 1 ? "" : "s"
      } deleted successfully`,
      deletedCount: result.deletedCount,
      requestedCount: uniqueIds.length,
    });
  } catch (error) {
    console.error("❌ Bulk delete notifications error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notifications",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
// 20. Get Notification Statistics
exports.getNotificationStats = async (req, res) => {
  try {
    const user = req.user;

    const query = {
      type: { $regex: /^house_/ },
    };

    // If not admin, only show user's notifications
    if (user.role !== "admin") {
      query.$or = [
        { targetRoles: { $in: [user.role] } },
        { targetUserId: user.id },
        { targetUserEmail: user.email },
        { userId: user.id },
      ];
    }

    const [total, unread, read, byType, byRole] = await Promise.all([
      Notification.countDocuments(query),
      Notification.countDocuments({ ...query, isRead: false }),
      Notification.countDocuments({ ...query, isRead: true }),
      Notification.aggregate([
        { $match: query },
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Notification.aggregate([
        { $match: query },
        { $unwind: "$targetRoles" },
        { $group: { _id: "$targetRoles", count: { $sum: 1 } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        total,
        unread,
        read,
        byType,
        byRole,
      },
    });
  } catch (error) {
    console.error("Get notification stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get notification statistics",
    });
  }
};

// Export multer upload middleware
exports.upload = upload;
