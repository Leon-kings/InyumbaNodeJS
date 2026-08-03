const House = require("../models/House");
const Notification = require("../models/Notification");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const nodemailer = require("nodemailer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "houses",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 800, height: 600, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

// Configure Multer for multiple images
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"), false);
    }
  },
});

// Email Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT == "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Email Functions
const sendHouseNotification = async ({
  type,
  houseName,
  location,
  hostEmail,
  adminEmail,
  houseId,
}) => {
  try {
    const adminEmailAddress =
      adminEmail || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    const locationStr = `${location.province}, ${location.district}, ${location.sector}`;

    // Send to Admin
    const adminMailOptions = {
      from: process.env.SMTP_USER,
      to: adminEmailAddress,
      subject: `🏠 House ${type}: ${houseName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #FF385C 0%, #D70466 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert-box { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #FF385C; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; text-align: center; }
            .btn { display: inline-block; background: #FF385C; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🏠 House ${type}</h2>
            </div>
            <div class="content">
              <div class="alert-box">
                <h3 style="margin: 0; color: #856404;">${houseName}</h3>
                <p style="margin: 10px 0 0 0;"><strong>📍 Location:</strong> ${locationStr}</p>
              </div>
              <p><strong>Type:</strong> ${type}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p>Please review the house details in the admin panel.</p>
              <br>
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/houses/${houseId}" class="btn">View House</a>
            </div>
            <div class="footer">
              <p>This is an automated notification from INYUMBA PROJECT.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    // Send to Host if email exists
    if (hostEmail) {
      const hostMailOptions = {
        from: process.env.SMTP_USER,
        to: hostEmail,
        subject: `🏠 Your House ${type}: ${houseName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px; }
              .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
              .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; }
              .alert-box { background: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">🏠 House ${type}</h2>
              </div>
              <div class="content">
                <div class="alert-box">
                  <h3 style="margin: 0; color: #155724;">${houseName}</h3>
                  <p style="margin: 10px 0 0 0;"><strong>📍 Location:</strong> ${locationStr}</p>
                </div>
                <p>Your house has been <strong>${type.toLowerCase()}</strong> in the system.</p>
                <p>If you have any questions, please contact our support team.</p>
              </div>
              <div class="footer">
                <p>This is an automated notification from INYUMBA PROJECT.</p>
              </div>
            </div>
          </body>
        </html>
        `,
      };

      await transporter.sendMail(hostMailOptions);
    }

    console.log(`✅ ${type} notification emails sent`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending ${type} notification:`, error.message);
    return false;
  }
};

// Create Notification for Users
const createUserNotification = async ({
  type,
  houseId,
  houseName,
  location,
  metadata = {},
}) => {
  try {
    const locationStr = `${location.province}, ${location.district}, ${location.sector}`;

    let message = "";
    switch (type) {
      case "house_created":
        message = `🏠 New house "${houseName}" has been listed in ${locationStr}`;
        break;
      case "house_updated":
        message = `📝 House "${houseName}" has been updated in ${locationStr}`;
        break;
      case "house_deleted":
        message = `🗑️ House "${houseName}" has been removed from ${locationStr}`;
        break;
      case "house_status_changed":
        message = `🔄 House "${houseName}" status changed from "${metadata.oldStatus}" to "${metadata.newStatus}" in ${locationStr}`;
        break;
      default:
        message = `📢 Update for house "${houseName}" in ${locationStr}`;
    }

    const notification = new Notification({
      type,
      houseId,
      houseName,
      location: {
        province: location.province,
        district: location.district,
        sector: location.sector,
      },
      message,
      isRead: false,
      isGlobal: true,
      status: "new",
      metadata,
    });

    await notification.save();
    console.log(`✅ User notification created: ${message}`);
    return notification;
  } catch (error) {
    console.error("❌ Error creating user notification:", error);
    return null;
  }
};

// ============ CONTROLLER FUNCTIONS ============

// 1. Create House
exports.createHouse = async (req, res) => {
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

    const {
      houseId,
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

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    let locationObj = {};
    let hostObj = {};
    let availabilityObj = {};
    let amenitiesArray = [];

    try {
      locationObj =
        typeof location === "string" ? JSON.parse(location) : location;
    } catch (e) {
      locationObj = {};
    }

    try {
      hostObj = typeof host === "string" ? JSON.parse(host) : host;
    } catch (e) {
      hostObj = {};
    }

    try {
      availabilityObj =
        typeof availability === "string"
          ? JSON.parse(availability)
          : availability;
    } catch (e) {
      availabilityObj = {};
    }

    try {
      amenitiesArray =
        typeof amenities === "string" ? JSON.parse(amenities) : amenities || [];
    } catch (e) {
      amenitiesArray = [];
    }

    const images = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
      secure_url: file.path,
    }));

    const finalHouseId = houseId || `HSE-${String(Date.now()).slice(-6)}`;

    const house = new House({
      houseId: finalHouseId,
      name,
      description,
      images,
      location: {
        province: locationObj.province || "",
        district: locationObj.district || "",
        sector: locationObj.sector || "",
        cell: locationObj.cell || "",
        village: locationObj.village || "",
        coordinates: {
          lat: locationObj.coordinates?.lat || null,
          lng: locationObj.coordinates?.lng || null,
        },
      },
      university,
      pricePerMonth: parseFloat(pricePerMonth),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      maxGuests: parseInt(maxGuests),
      amenities: amenitiesArray,
      status: status || "pending",
      rating: parseFloat(rating) || 0,
      totalReviews: parseInt(totalReviews) || 0,
      host: {
        name: hostObj.name || "",
        email: hostObj.email || "",
        phone: hostObj.phone || "",
        responseRate: parseFloat(hostObj.responseRate) || 0,
        responseTime: hostObj.responseTime || "24 hours",
      },
      availability: {
        startDate: availabilityObj.startDate || new Date(),
        endDate:
          availabilityObj.endDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      isActive: isActive === "true" || isActive === true,
    });

    await house.save();

    // Create user notification for new house
    await createUserNotification({
      type: "house_created",
      houseId: house._id,
      houseName: house.name,
      location: house.location,
    });

    // Send email notifications
    await sendHouseNotification({
      type: "Created",
      houseName: house.name,
      location: house.location,
      hostEmail: hostObj.email,
      adminEmail: process.env.ADMIN_EMAIL,
      houseId: house._id,
    });

    res.status(201).json({
      success: true,
      message: "House created successfully",
      data: house,
    });
  } catch (error) {
    console.error("Create house error:", error);
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await cloudinary.uploader.destroy(file.filename);
      }
    }
    res.status(500).json({
      success: false,
      message: "Failed to create house",
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

// 5. Update House
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

    // Create notification for updates
    await createUserNotification({
      type: "house_updated",
      houseId: house._id,
      houseName: house.name,
      location: house.location,
      metadata: {
        oldStatus,
        newStatus: house.status,
        changedFields: changes,
      },
    });

    // Send notification if status changed
    if (oldStatus !== house.status) {
      await createUserNotification({
        type: "house_status_changed",
        houseId: house._id,
        houseName: house.name,
        location: house.location,
        metadata: {
          oldStatus,
          newStatus: house.status,
        },
      });
    }

    // Send email notifications
    await sendHouseNotification({
      type: "Updated",
      houseName: house.name,
      location: house.location,
      hostEmail: house.host.email,
      adminEmail: process.env.ADMIN_EMAIL,
      houseId: house._id,
    });

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

// 6. Update House Status
exports.updateHouseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    const oldStatus = house.status;
    house.status = status;
    await house.save();

    // Create notification for status change
    await createUserNotification({
      type: "house_status_changed",
      houseId: house._id,
      houseName: house.name,
      location: house.location,
      metadata: {
        oldStatus,
        newStatus: status,
      },
    });

    // Send email notification
    await sendHouseNotification({
      type: `Status Changed: ${oldStatus} → ${status}`,
      houseName: house.name,
      location: house.location,
      hostEmail: house.host.email,
      adminEmail: process.env.ADMIN_EMAIL,
      houseId: house._id,
    });

    res.status(200).json({
      success: true,
      message: "House status updated successfully",
      data: house,
    });
  } catch (error) {
    console.error("Update house status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update house status",
    });
  }
};

// 7. Delete House
exports.deleteHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    // Create notification before deleting
    await createUserNotification({
      type: "house_deleted",
      houseId: house._id,
      houseName: house.name,
      location: house.location,
    });

    // Delete all images from Cloudinary
    for (const img of house.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await house.deleteOne();

    // Send email notification
    await sendHouseNotification({
      type: "Deleted",
      houseName: house.name,
      location: house.location,
      hostEmail: house.host.email,
      adminEmail: process.env.ADMIN_EMAIL,
      houseId: house._id,
    });

    res.status(200).json({
      success: true,
      message: "House deleted successfully",
    });
  } catch (error) {
    console.error("Delete house error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete house",
    });
  }
};

// 8. Get House Statistics
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

// 9. Get Houses by University
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

// 10. Get Available Houses
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

// 11. Get Newly Added Houses (For Notifications)
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

// 12. Get House Notifications
exports.getHouseNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = { isGlobal: true };
    if (status) query.status = status;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("houseId", "name houseId location images")
        .lean(),
      Notification.countDocuments(query),
      Notification.getUnreadCount(),
    ]);

    res.status(200).json({
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
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// 13. Mark Notification as Read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    notification.status = "read";
    notification.readBy.push({
      userId: "admin",
      readAt: new Date(),
    });
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

// 14. Mark All Notifications as Read
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead();

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};

// 15. Get Unread Notification Count
exports.getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount();

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    console.error("Get unread notification count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get unread count",
    });
  }
};

// ===========================
// GET HOUSES BY HOST EMAIL
// ===========================

exports.getHousesByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const houses = await House.find({
      "host.email": email.toLowerCase().trim(),
    }).sort({ createdAt: -1 });

    if (houses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No houses found for this email",
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
    });
  }
};

// Export multer upload middleware
exports.upload = upload;
