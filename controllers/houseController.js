// const House = require("../models/House");
// const Notification = require("../models/Notification");
// const { validationResult } = require("express-validator");
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");
// const nodemailer = require("nodemailer");
// const crypto = require("crypto");
// const mongoose = require("mongoose");

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configure Cloudinary Storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "HOUSES",
//     allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
//     transformation: [
//       { width: 800, height: 600, crop: "limit" },
//       { quality: "auto" },
//     ],
//   },
// });

// // Configure Multer for multiple images
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 10MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only images are allowed"), false);
//     }
//   },
// });

// // Email Configuration
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: false,

//   family: 4,

//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },

//   tls: {
//     rejectUnauthorized: false,
//   },

//   connectionTimeout: 60000,
//   greetingTimeout: 60000,
//   socketTimeout: 60000,
// });

// // Email Functions
// const sendHouseNotification = async ({
//   type,
//   houseName,
//   location,
//   hostEmail,
//   adminEmail,
//   houseId,
// }) => {
//   try {
//     const adminEmailAddress =
//       adminEmail || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
//     const locationStr = `${location.province}, ${location.district}, ${location.sector}`;

//     // Send to Admin
//     const adminMailOptions = {
//       from: process.env.SMTP_USER,
//       to: adminEmailAddress,
//       subject: `🏠 House ${type}: ${houseName}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px; }
//             .header { background: linear-gradient(135deg, #FF385C 0%, #D70466 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
//             .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; }
//             .alert-box { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #FF385C; margin: 20px 0; }
//             .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; text-align: center; }
//             .btn { display: inline-block; background: #FF385C; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h2 style="margin: 0;">🏠 House ${type}</h2>
//             </div>
//             <div class="content">
//               <div class="alert-box">
//                 <h3 style="margin: 0; color: #856404;">${houseName}</h3>
//                 <p style="margin: 10px 0 0 0;"><strong>📍 Location:</strong> ${locationStr}</p>
//               </div>
//               <p><strong>Type:</strong> ${type}</p>
//               <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
//               <p>Please review the house details in the admin panel.</p>
//               <br>
             
//             <div class="footer">
//               <p>This is an automated notification from INYUMBA PROJECT.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `,
//     };

//     await transporter.sendMail(adminMailOptions);

//     // Send to Host if email exists
//     if (hostEmail) {
//       const hostMailOptions = {
//         from: process.env.SMTP_USER,
//         to: hostEmail,
//         subject: `🏠 Your House ${type}: ${houseName}`,
//         html: `
//           <!DOCTYPE html>
//           <html>
//           <head>
//             <style>
//               body { font-family: Arial, sans-serif; }
//               .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px; }
//               .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
//               .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; }
//               .alert-box { background: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0; }
//               .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; text-align: center; }
//             </style>
//           </head>
//           <body>
//             <div class="container">
//               <div class="header">
//                 <h2 style="margin: 0;">🏠 House ${type}</h2>
//               </div>
//               <div class="content">
//                 <div class="alert-box">
//                   <h3 style="margin: 0; color: #155724;">${houseName}</h3>
//                   <p style="margin: 10px 0 0 0;"><strong>📍 Location:</strong> ${locationStr}</p>
//                 </div>
//                 <p>Your house has been <strong>${type.toLowerCase()}</strong> in the system.</p>
//                 <p>If you have any questions, please contact our support team.</p>
//               </div>
//               <div class="footer">
//                 <p>This is an automated notification from INYUMBA PROJECT.</p>
//               </div>
//             </div>
//           </body>
//         </html>
//         `,
//       };

//       await transporter.sendMail(hostMailOptions);
//     }

//     console.log(`✅ ${type} notification emails sent`);
//     return true;
//   } catch (error) {
//     console.error(`❌ Error sending ${type} notification:`, error.message);
//     return false;
//   }
// };

// // Create Notification for Users
// const createUserNotification = async ({
//   type,
//   houseId,
//   houseName,
//   location,
//   metadata = {},
// }) => {
//   try {
//     const locationStr = `${location.province}, ${location.district}, ${location.sector}`;

//     let message = "";
//     switch (type) {
//       case "house_created":
//         message = `🏠 New house "${houseName}" has been listed in ${locationStr}`;
//         break;
//       case "house_updated":
//         message = `📝 House "${houseName}" has been updated in ${locationStr}`;
//         break;
//       case "house_deleted":
//         message = `🗑️ House "${houseName}" has been removed from ${locationStr}`;
//         break;
//       case "house_status_changed":
//         message = `🔄 House "${houseName}" status changed from "${metadata.oldStatus}" to "${metadata.newStatus}" in ${locationStr}`;
//         break;
//       default:
//         message = `📢 Update for house "${houseName}" in ${locationStr}`;
//     }

//     const notification = new Notification({
//       type,
//       houseId,
//       houseName,
//       location: {
//         province: location.province,
//         district: location.district,
//         sector: location.sector,
//       },
//       message,
//       isRead: false,
//       isGlobal: true,
//       status: "new",
//       metadata,
//     });

//     await notification.save();
//     console.log(`✅ User notification created: ${message}`);
//     return notification;
//   } catch (error) {
//     console.error("❌ Error creating user notification:", error);
//     return null;
//   }
// };

// // ============ CONTROLLER FUNCTIONS ============

// // 1. Create House

// exports.createHouse = async (req, res) => {
//   try {
//     // ===========================
//     // VALIDATION
//     // ===========================

//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       if (req.files?.length) {
//         for (const file of req.files) {
//           await cloudinary.uploader.destroy(file.filename || file.public_id);
//         }
//       }

//       return res.status(400).json({
//         success: false,
//         errors: errors.array(),
//       });
//     }

//     // ===========================
//     // GET BODY DATA
//     // ===========================

//     const {
//       houseId,
//       name,
//       description,
//       location,
//       university,
//       pricePerMonth,
//       bedrooms,
//       bathrooms,
//       maxGuests,
//       amenities,
//       host,
//       availability,
//     } = req.body;

//     // ===========================
//     // CHECK IMAGES
//     // ===========================

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one image is required",
//       });
//     }

//     // ===========================
//     // PARSE JSON FIELDS
//     // ===========================

//     let locationObj = {};
//     let hostObj = {};
//     let availabilityObj = {};
//     let amenitiesArray = [];

//     try {
//       locationObj =
//         typeof location === "string" ? JSON.parse(location) : location || {};
//     } catch (error) {
//       locationObj = {};
//     }

//     try {
//       hostObj = typeof host === "string" ? JSON.parse(host) : host || {};
//     } catch (error) {
//       hostObj = {};
//     }

//     try {
//       availabilityObj =
//         typeof availability === "string"
//           ? JSON.parse(availability)
//           : availability || {};
//     } catch (error) {
//       availabilityObj = {};
//     }

//     try {
//       amenitiesArray =
//         typeof amenities === "string" ? JSON.parse(amenities) : amenities || [];
//     } catch (error) {
//       amenitiesArray = [];
//     }

//     // ===========================
//     // GENERATE IMAGES
//     // ===========================

//     const images = req.files.map((file) => ({
//       public_id: file.filename || file.public_id,

//       url: file.path,

//       secure_url: file.path,
//     }));

//     // ===========================
//     // GENERATE HOUSE ID
//     // ===========================

//     const finalHouseId =
//       houseId || `HSE-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

//     // ===========================
//     // CHECK DUPLICATE ID
//     // ===========================

//     const existingHouse = await House.findOne({
//       houseId: finalHouseId,
//     });

//     if (existingHouse) {
//       for (const file of req.files) {
//         await cloudinary.uploader.destroy(file.filename || file.public_id);
//       }

//       return res.status(400).json({
//         success: false,
//         message: "House ID already exists",
//       });
//     }

//     // ===========================
//     // CREATE HOUSE
//     // ===========================

//     const house = new House({
//       houseId: finalHouseId,

//       name,

//       description,

//       images,

//       location: {
//         province: locationObj.province || "",

//         district: locationObj.district || "",

//         sector: locationObj.sector || "",

//         cell: locationObj.cell || "",

//         village: locationObj.village || "",

//         coordinates: {
//           lat: locationObj.coordinates?.lat || null,

//           lng: locationObj.coordinates?.lng || null,
//         },
//       },

//       university,

//       pricePerMonth: Number(pricePerMonth),

//       bedrooms: Number(bedrooms),

//       bathrooms: Number(bathrooms),

//       maxGuests: Number(maxGuests),

//       amenities: amenitiesArray,

//       // USER CANNOT APPROVE HOUSE
//       status: "pending",

//       rating: 4,

//       totalReviews: 10,

//       host: {
//         name: hostObj.name || "",

//         email: hostObj.email || "",

//         phone: hostObj.phone || "",

//         responseRate: 5,

//         responseTime: "48 hours",
//       },

//       isActive: true,
//     });

//     await house.save();

//     // ===========================
//     // CREATE NOTIFICATION
//     // ===========================

//     try {
//       await createUserNotification({
//         type: "house_created",

//         houseId: house._id,

//         houseName: house.name,

//         location: house.location,
//       });
//     } catch (error) {
//       console.log("Notification error:", error.message);
//     }

//     // ===========================
//     // SEND EMAIL
//     // ===========================

//     try {
//       await sendHouseNotification({
//         type: "Created",

//         houseName: house.name,

//         location: house.location,

//         hostEmail: hostObj.email,

//         adminEmail: process.env.ADMIN_EMAIL || "inyumba@yahoo.fr",

//         houseId: house._id,
//       });
//     } catch (error) {
//       console.log("Email notification error:", error.message);
//     }

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(201).json({
//       success: true,

//       message: "House created successfully and waiting for approval",

//       data: house,
//     });
//   } catch (error) {
//     console.error("Create house error:", error);

//     // REMOVE CLOUDINARY FILES
//     if (req.files?.length) {
//       for (const file of req.files) {
//         try {
//           await cloudinary.uploader.destroy(file.filename || file.public_id);
//         } catch (err) {
//           console.log("Cloudinary cleanup failed:", err.message);
//         }
//       }
//     }

//     return res.status(500).json({
//       success: false,

//       message: "Failed to create house",

//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// // ================================
// // GET HOUSES BY HOST EMAIL
// // GET /api/houses/:email
// // ================================
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
//       "host.email": email.toLowerCase(),
//     }).sort({ createdAt: -1 });

//     if (!houses || houses.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No houses found for this user",
//         data: [],
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Houses fetched successfully",
//       count: houses.length,
//       data: houses,
//     });
//   } catch (error) {
//     console.error("Get houses by email error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch houses",
//       error: error.message,
//     });
//   }
// };

// // 2. Get All Houses
// exports.getAllHouses = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const skip = (page - 1) * limit;
//     const status = req.query.status;
//     const university = req.query.university;
//     const province = req.query.province;
//     const district = req.query.district;
//     const minPrice = req.query.minPrice;
//     const maxPrice = req.query.maxPrice;
//     const bedrooms = req.query.bedrooms;
//     const search = req.query.search;

//     let query = {};

//     if (status) query.status = status;
//     if (university) query.university = { $regex: university, $options: "i" };
//     if (province)
//       query["location.province"] = { $regex: province, $options: "i" };
//     if (district)
//       query["location.district"] = { $regex: district, $options: "i" };
//     if (bedrooms) query.bedrooms = parseInt(bedrooms);
//     if (minPrice || maxPrice) {
//       query.pricePerMonth = {};
//       if (minPrice) query.pricePerMonth.$gte = parseFloat(minPrice);
//       if (maxPrice) query.pricePerMonth.$lte = parseFloat(maxPrice);
//     }
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//         { university: { $regex: search, $options: "i" } },
//       ];
//     }

//     const [houses, total] = await Promise.all([
//       House.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
//       House.countDocuments(query),
//     ]);

//     res.status(200).json({
//       success: true,
//       data: houses,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get all houses error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch houses",
//     });
//   }
// };

// // 3. Get House by ID
// exports.getHouseById = async (req, res) => {
//   try {
//     const house = await House.findById(req.params.id);

//     if (!house) {
//       return res.status(404).json({
//         success: false,
//         message: "House not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: house,
//     });
//   } catch (error) {
//     console.error("Get house by ID error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch house",
//     });
//   }
// };

// // 4. Get House by House ID
// exports.getHouseByHouseId = async (req, res) => {
//   try {
//     const house = await House.findOne({ houseId: req.params.houseId });

//     if (!house) {
//       return res.status(404).json({
//         success: false,
//         message: "House not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: house,
//     });
//   } catch (error) {
//     console.error("Get house by houseId error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch house",
//     });
//   }
// };

// // 5. Update House
// exports.updateHouse = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       if (req.files && req.files.length > 0) {
//         for (const file of req.files) {
//           await cloudinary.uploader.destroy(file.filename);
//         }
//       }
//       return res.status(400).json({
//         success: false,
//         errors: errors.array(),
//       });
//     }

//     const house = await House.findById(req.params.id);
//     if (!house) {
//       if (req.files && req.files.length > 0) {
//         for (const file of req.files) {
//           await cloudinary.uploader.destroy(file.filename);
//         }
//       }
//       return res.status(404).json({
//         success: false,
//         message: "House not found",
//       });
//     }

//     const {
//       name,
//       description,
//       location,
//       university,
//       pricePerMonth,
//       bedrooms,
//       bathrooms,
//       maxGuests,
//       amenities,
//       status,
//       rating,
//       totalReviews,
//       host,
//       availability,
//       isActive,
//     } = req.body;

//     let changes = [];
//     const oldStatus = house.status;

//     if (name && name !== house.name) changes.push("name");
//     if (status && status !== house.status) changes.push("status");
//     if (location) changes.push("location");

//     if (name) house.name = name;
//     if (description) house.description = description;
//     if (university) house.university = university;
//     if (pricePerMonth) house.pricePerMonth = parseFloat(pricePerMonth);
//     if (bedrooms) house.bedrooms = parseInt(bedrooms);
//     if (bathrooms) house.bathrooms = parseInt(bathrooms);
//     if (maxGuests) house.maxGuests = parseInt(maxGuests);
//     if (status) house.status = status;
//     if (rating !== undefined) house.rating = parseFloat(rating);
//     if (totalReviews !== undefined) house.totalReviews = parseInt(totalReviews);
//     if (isActive !== undefined)
//       house.isActive = isActive === "true" || isActive === true;

//     if (location) {
//       try {
//         const locationObj =
//           typeof location === "string" ? JSON.parse(location) : location;
//         house.location = {
//           province: locationObj.province || house.location.province,
//           district: locationObj.district || house.location.district,
//           sector: locationObj.sector || house.location.sector,
//           cell: locationObj.cell || house.location.cell,
//           village: locationObj.village || house.location.village,
//           coordinates: {
//             lat:
//               locationObj.coordinates?.lat ||
//               house.location.coordinates?.lat ||
//               null,
//             lng:
//               locationObj.coordinates?.lng ||
//               house.location.coordinates?.lng ||
//               null,
//           },
//         };
//       } catch (e) {
//         console.error("Location parse error:", e);
//       }
//     }

//     if (amenities) {
//       try {
//         house.amenities =
//           typeof amenities === "string" ? JSON.parse(amenities) : amenities;
//       } catch (e) {
//         house.amenities = [];
//       }
//     }

//     if (host) {
//       try {
//         const hostObj = typeof host === "string" ? JSON.parse(host) : host;
//         house.host = {
//           name: hostObj.name || house.host.name,
//           email: hostObj.email || house.host.email,
//           phone: hostObj.phone || house.host.phone,
//           responseRate:
//             parseFloat(hostObj.responseRate) || house.host.responseRate,
//           responseTime: hostObj.responseTime || house.host.responseTime,
//         };
//       } catch (e) {
//         console.error("Host parse error:", e);
//       }
//     }

//     if (availability) {
//       try {
//         const availabilityObj =
//           typeof availability === "string"
//             ? JSON.parse(availability)
//             : availability;
//         house.availability = {
//           startDate: availabilityObj.startDate || house.availability.startDate,
//           endDate: availabilityObj.endDate || house.availability.endDate,
//         };
//       } catch (e) {
//         console.error("Availability parse error:", e);
//       }
//     }

//     if (req.files && req.files.length > 0) {
//       for (const img of house.images) {
//         await cloudinary.uploader.destroy(img.public_id);
//       }

//       house.images = req.files.map((file) => ({
//         public_id: file.filename,
//         url: file.path,
//         secure_url: file.path,
//       }));
//     }

//     await house.save();

//     // Create notification for updates
//     await createUserNotification({
//       type: "house_updated",
//       houseId: house._id,
//       houseName: house.name,
//       location: house.location,
//       metadata: {
//         oldStatus,
//         newStatus: house.status,
//         changedFields: changes,
//       },
//     });

//     // Send notification if status changed
//     if (oldStatus !== house.status) {
//       await createUserNotification({
//         type: "house_status_changed",
//         houseId: house._id,
//         houseName: house.name,
//         location: house.location,
//         metadata: {
//           oldStatus,
//           newStatus: house.status,
//         },
//       });
//     }

//     // Send email notifications
//     await sendHouseNotification({
//       type: "Updated",
//       houseName: house.name,
//       location: house.location,
//       hostEmail: house.host.email,
//       adminEmail: process.env.ADMIN_EMAIL,
//       houseId: house._id,
//     });

//     res.status(200).json({
//       success: true,
//       message: "House updated successfully",
//       data: house,
//     });
//   } catch (error) {
//     console.error("Update house error:", error);
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         await cloudinary.uploader.destroy(file.filename);
//       }
//     }
//     res.status(500).json({
//       success: false,
//       message: "Failed to update house",
//     });
//   }
// };

// // 6. Update House Status
// exports.updateHouseStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const house = await House.findById(req.params.id);

//     if (!house) {
//       return res.status(404).json({
//         success: false,
//         message: "House not found",
//       });
//     }

//     const oldStatus = house.status;
//     house.status = status;
//     await house.save();

//     // Create notification for status change
//     await createUserNotification({
//       type: "house_status_changed",
//       houseId: house._id,
//       houseName: house.name,
//       location: house.location,
//       metadata: {
//         oldStatus,
//         newStatus: status,
//       },
//     });

//     // Send email notification
//     await sendHouseNotification({
//       type: `Status Changed: ${oldStatus} → ${status}`,
//       houseName: house.name,
//       location: house.location,
//       hostEmail: house.host.email,
//       adminEmail: process.env.ADMIN_EMAIL,
//       houseId: house._id,
//     });

//     res.status(200).json({
//       success: true,
//       message: "House status updated successfully",
//       data: house,
//     });
//   } catch (error) {
//     console.error("Update house status error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update house status",
//     });
//   }
// };

// // 7. Delete House
// exports.deleteHouse = async (req, res) => {
//   try {
//     const house = await House.findById(req.params.id);

//     if (!house) {
//       return res.status(404).json({
//         success: false,
//         message: "House not found",
//       });
//     }

//     // Create notification before deleting
//     await createUserNotification({
//       type: "house_deleted",
//       houseId: house._id,
//       houseName: house.name,
//       location: house.location,
//     });

//     // Delete all images from Cloudinary
//     for (const img of house.images) {
//       await cloudinary.uploader.destroy(img.public_id);
//     }

//     await house.deleteOne();

//     // Send email notification
//     await sendHouseNotification({
//       type: "Deleted",
//       houseName: house.name,
//       location: house.location,
//       hostEmail: house.host.email,
//       adminEmail: process.env.ADMIN_EMAIL,
//       houseId: house._id,
//     });

//     res.status(200).json({
//       success: true,
//       message: "House deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete house error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete house",
//     });
//   }
// };

// // 8. Get House Statistics
// exports.getHouseStatistics = async (req, res) => {
//   try {
//     const stats = await House.getStatistics();

//     res.status(200).json({
//       success: true,
//       data: stats,
//     });
//   } catch (error) {
//     console.error("Get house statistics error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get statistics",
//     });
//   }
// };

// // 9. Get Houses by University
// exports.getHousesByUniversity = async (req, res) => {
//   try {
//     const university = req.params.university;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const [houses, total] = await Promise.all([
//       House.find({
//         university: { $regex: university, $options: "i" },
//         status: "available",
//       })
//         .sort({ rating: -1, createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       House.countDocuments({
//         university: { $regex: university, $options: "i" },
//         status: "available",
//       }),
//     ]);

//     res.status(200).json({
//       success: true,
//       data: houses,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get houses by university error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch houses",
//     });
//   }
// };

// // 10. Get Available Houses
// exports.getAvailableHouses = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 20;

//     const houses = await House.find({
//       status: "available",
//       isActive: true,
//     })
//       .sort({ rating: -1, createdAt: -1 })
//       .limit(limit)
//       .lean();

//     res.status(200).json({
//       success: true,
//       data: houses,
//     });
//   } catch (error) {
//     console.error("Get available houses error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch available houses",
//     });
//   }
// };

// // 11. Get Newly Added Houses (For Notifications)
// exports.getNewlyAddedHouses = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;
//     const days = parseInt(req.query.days) || 7;

//     const dateLimit = new Date();
//     dateLimit.setDate(dateLimit.getDate() - days);

//     const houses = await House.find({
//       createdAt: { $gte: dateLimit },
//       status: "available",
//       isActive: true,
//     })
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .lean();

//     res.status(200).json({
//       success: true,
//       data: houses,
//       count: houses.length,
//       message:
//         houses.length > 0
//           ? `Found ${houses.length} newly added houses in the last ${days} days`
//           : "No newly added houses found",
//     });
//   } catch (error) {
//     console.error("Get newly added houses error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch newly added houses",
//     });
//   }
// };

// // ==========================================
// // 12. GET HOUSE NOTIFICATIONS
// // ==========================================

// exports.getHouseNotifications = async (req, res) => {
//   try {
//     const page =
//       parseInt(req.query.page, 10) || 1;

//     const limit =
//       parseInt(req.query.limit, 10) || 20;

//     const skip = (page - 1) * limit;

//     const status = req.query.status;

//     // ===========================
//     // BUILD QUERY
//     // ===========================

//     const query = {
//       isGlobal: true,
//     };

//     if (status) {
//       query.status = status;
//     }

//     // ===========================
//     // GET NOTIFICATIONS
//     // ===========================

//     const [
//       notifications,
//       total,
//       unreadCount,
//     ] = await Promise.all([
//       Notification.find(query)
//         .sort({
//           createdAt: -1,
//         })
//         .skip(skip)
//         .limit(limit)
//         .populate(
//           "houseId",
//           "name houseId location images"
//         )
//         .lean(),

//       Notification.countDocuments(query),

//       Notification.countDocuments({
//         isGlobal: true,
//         isRead: false,
//       }),
//     ]);

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,

//       data: notifications,

//       unreadCount,

//       pagination: {
//         page,
//         limit,
//         total,
//         pages:
//           Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Get house notifications error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch notifications",
//       error:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : undefined,
//     });
//   }
// };


// // ==========================================
// // 13. MARK NOTIFICATION AS READ
// // ==========================================

// exports.markNotificationAsRead = async (
//   req,
//   res
// ) => {
//   try {
//     const notification =
//       await Notification.findById(
//         req.params.id
//       );

//     // ===========================
//     // NOT FOUND
//     // ===========================

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Notification not found",
//       });
//     }

//     // ===========================
//     // MARK AS READ
//     // ===========================

//     notification.isRead = true;

//     notification.status = "read";

//     // ===========================
//     // READ DATE
//     // ===========================

//     notification.readAt =
//       new Date();

//     // ===========================
//     // ADD ADMIN TO READ BY
//     // ===========================

//     if (
//       Array.isArray(
//         notification.readBy
//       )
//     ) {
//       const alreadyRead =
//         notification.readBy.some(
//           (reader) =>
//             String(reader.userId) ===
//             "admin"
//         );

//       if (!alreadyRead) {
//         notification.readBy.push({
//           userId: "admin",
//           readAt: new Date(),
//         });
//       }
//     }

//     await notification.save();

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,
//       message:
//         "Notification marked as read",
//       data: notification,
//     });
//   } catch (error) {
//     console.error(
//       "Mark notification as read error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to mark notification as read",
//       error:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : undefined,
//     });
//   }
// };


// // ==========================================
// // 14. MARK ALL NOTIFICATIONS AS READ
// // ==========================================

// exports.markAllNotificationsAsRead = async (
//   req,
//   res
// ) => {
//   try {
//     // ===========================
//     // UPDATE ALL GLOBAL NOTIFICATIONS
//     // ===========================

//     const result =
//       await Notification.updateMany(
//         {
//           isGlobal: true,
//           isRead: false,
//         },
//         {
//           $set: {
//             isRead: true,
//             status: "read",
//             readAt: new Date(),
//           },
//         }
//       );

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,

//       message:
//         "All notifications marked as read",

//       modifiedCount:
//         result.modifiedCount,
//     });
//   } catch (error) {
//     console.error(
//       "Mark all notifications as read error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to mark all notifications as read",
//       error:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : undefined,
//     });
//   }
// };
// // 15. Get Unread Notification Count
// exports.getUnreadNotificationCount = async (req, res) => {
//   try {
//     const count = await Notification.getUnreadCount();

//     res.status(200).json({
//       success: true,
//       data: { unreadCount: count },
//     });
//   } catch (error) {
//     console.error("Get unread notification count error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get unread count",
//     });
//   }
// };

// // ===========================
// // GET HOUSES BY HOST EMAIL
// // ===========================

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

// // ============================================================
// // DELETE ONE NOTIFICATION
// // ============================================================

// exports.deleteNotification = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // ===========================
//     // VALIDATE ID
//     // ===========================

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Notification ID is required",
//       });
//     }

//     // ===========================
//     // FIND AND DELETE
//     // ===========================

//     const notification =
//       await Notification.findByIdAndDelete(id);

//     // ===========================
//     // NOT FOUND
//     // ===========================

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: "Notification not found",
//       });
//     }

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,
//       message: "Notification deleted successfully",
//       notification,
//     });
//   } catch (error) {
//     console.error(
//       "Delete notification error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete notification",
//       error:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : undefined,
//     });
//   }
// };


// // ============================================================
// // BULK DELETE NOTIFICATIONS
// // ============================================================

// exports.bulkDeleteNotifications = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     // ===========================
//     // VALIDATE IDS
//     // ===========================

//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Please provide an array of notification IDs",
//       });
//     }

//     // ===========================
//     // DELETE NOTIFICATIONS
//     // ===========================

//     const result =
//       await Notification.deleteMany({
//         _id: { $in: ids },
//       });

//     // ===========================
//     // RESPONSE
//     // ===========================

//     return res.status(200).json({
//       success: true,
//       message:
//         "Notifications deleted successfully",
//       deletedCount:
//         result.deletedCount,
//     });
//   } catch (error) {
//     console.error(
//       "Bulk delete notifications error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to delete notifications",
//       error:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : undefined,
//     });
//   }
// };


// // Export multer upload middleware
// exports.upload = upload;



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
  const locationStr = `${house.location.province || 'N/A'}, ${house.location.district || 'N/A'}, ${house.location.sector || 'N/A'}`;
  
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
              ${isHost ? `<p><strong>Status:</strong> ${house.status || 'Pending'}</p>` : ''}
            </div>
            
            <div class="details">
              <p><strong>Type:</strong> ${type}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              ${house.pricePerMonth ? `<p><strong>Price:</strong> $${house.pricePerMonth}/month</p>` : ''}
              ${house.bedrooms ? `<p><strong>Bedrooms:</strong> ${house.bedrooms}</p>` : ''}
              ${house.bathrooms ? `<p><strong>Bathrooms:</strong> ${house.bathrooms}</p>` : ''}
              ${house.university ? `<p><strong>University:</strong> ${house.university}</p>` : ''}
            </div>
            
            ${isAdmin ? `
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
                <p style="margin: 0; text-align: center;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/houses/${house._id}" 
                     style="display: inline-block; background: #667eea; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px;">
                    View & Manage
                  </a>
                </p>
              </div>
            ` : ''}
            
            ${isHost ? `
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
                <p style="margin: 0; text-align: center;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/host/houses/${house._id}" 
                     style="display: inline-block; background: #28a745; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px;">
                    View Your House
                  </a>
                </p>
              </div>
            ` : ''}
            
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
    const locationStr = `${house.location.province || 'N/A'}, ${house.location.district || 'N/A'}, ${house.location.sector || 'N/A'}`;

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
        message = `House "${house.name}" status changed to ${house.status || 'updated'}`;
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
    
    const notification = await createRoleNotification(house, type, role, userInfo);
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
  try {
    // ===========================
    // VALIDATION
    // ===========================

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (req.files?.length) {
        for (const file of req.files) {
          await cloudinary.uploader.destroy(file.filename || file.public_id);
        }
      }

      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // ===========================
    // GET BODY DATA
    // ===========================

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
      host,
      availability,
    } = req.body;

    // ===========================
    // CHECK IMAGES
    // ===========================

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // ===========================
    // PARSE JSON FIELDS
    // ===========================

    let locationObj = {};
    let hostObj = {};
    let availabilityObj = {};
    let amenitiesArray = [];

    try {
      locationObj = typeof location === "string" ? JSON.parse(location) : location || {};
    } catch (error) {
      locationObj = {};
    }

    try {
      hostObj = typeof host === "string" ? JSON.parse(host) : host || {};
    } catch (error) {
      hostObj = {};
    }

    try {
      availabilityObj = typeof availability === "string" ? JSON.parse(availability) : availability || {};
    } catch (error) {
      availabilityObj = {};
    }

    try {
      amenitiesArray = typeof amenities === "string" ? JSON.parse(amenities) : amenities || [];
    } catch (error) {
      amenitiesArray = [];
    }

    // ===========================
    // GENERATE IMAGES
    // ===========================

    const images = req.files.map((file) => ({
      public_id: file.filename || file.public_id,
      url: file.path,
      secure_url: file.path,
    }));

    // ===========================
    // GENERATE HOUSE ID
    // ===========================

    const finalHouseId = houseId || `HSE-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    // ===========================
    // CHECK DUPLICATE ID
    // ===========================

    const existingHouse = await House.findOne({ houseId: finalHouseId });

    if (existingHouse) {
      for (const file of req.files) {
        await cloudinary.uploader.destroy(file.filename || file.public_id);
      }

      return res.status(400).json({
        success: false,
        message: "House ID already exists",
      });
    }

    // ===========================
    // GET USER INFO
    // ===========================
    const userId = req.user?.id || null;
    const userRole = req.user?.role || "user";

    // ===========================
    // CREATE HOUSE
    // ===========================

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
      pricePerMonth: Number(pricePerMonth),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      maxGuests: Number(maxGuests),
      amenities: amenitiesArray,
      status: "pending",
      rating: 4,
      totalReviews: 10,
      host: {
        userId: userId,
        name: hostObj.name || "",
        email: hostObj.email || "",
        phone: hostObj.phone || "",
        responseRate: 5,
        responseTime: "48 hours",
      },
      isActive: true,
    });

    await house.save();
    console.log(`✅ House created: ${house.houseId}`);

    // ===========================
    // CREATE ROLE-BASED NOTIFICATIONS
    // ===========================
    const userInfo = {
      userId: userId,
      email: hostObj.email || "",
      name: hostObj.name || "",
      role: userRole,
    };
    await createAllRoleNotifications(house, "house_created", userInfo);

    // ===========================
    // SEND EMAILS
    // ===========================
    await sendHouseEmails(house, "Created", userInfo);

    // ===========================
    // RESPONSE
    // ===========================

    return res.status(201).json({
      success: true,
      message: "House created successfully and waiting for approval",
      data: house,
    });
  } catch (error) {
    console.error("Create house error:", error);

    // REMOVE CLOUDINARY FILES
    if (req.files?.length) {
      for (const file of req.files) {
        try {
          await cloudinary.uploader.destroy(file.filename || file.public_id);
        } catch (err) {
          console.log("Cloudinary cleanup failed:", err.message);
        }
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create house",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
    if (province) query["location.province"] = { $regex: province, $options: "i" };
    if (district) query["location.district"] = { $regex: district, $options: "i" };
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
    if (isActive !== undefined) house.isActive = isActive === "true" || isActive === true;

    if (location) {
      try {
        const locationObj = typeof location === "string" ? JSON.parse(location) : location;
        house.location = {
          province: locationObj.province || house.location.province,
          district: locationObj.district || house.location.district,
          sector: locationObj.sector || house.location.sector,
          cell: locationObj.cell || house.location.cell,
          village: locationObj.village || house.location.village,
          coordinates: {
            lat: locationObj.coordinates?.lat || house.location.coordinates?.lat || null,
            lng: locationObj.coordinates?.lng || house.location.coordinates?.lng || null,
          },
        };
      } catch (e) {
        console.error("Location parse error:", e);
      }
    }

    if (amenities) {
      try {
        house.amenities = typeof amenities === "string" ? JSON.parse(amenities) : amenities;
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
          responseRate: parseFloat(hostObj.responseRate) || house.host.responseRate,
          responseTime: hostObj.responseTime || house.host.responseTime,
        };
      } catch (e) {
        console.error("Host parse error:", e);
      }
    }

    if (availability) {
      try {
        const availabilityObj = typeof availability === "string" ? JSON.parse(availability) : availability;
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
// exports.updateHouseStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const house = await House.findById(req.params.id);

//     if (!house) {
//       return res.status(404).json({
//         success: false,
//         message: "House not found",
//       });
//     }

//     const oldStatus = house.status;
//     house.status = status;
//     await house.save();

//     // ===========================
//     // CREATE NOTIFICATIONS
//     // ===========================
//     const userInfo = {
//       userId: house.host.userId || null,
//       email: house.host.email || "",
//       name: house.host.name || "",
//       oldStatus: oldStatus,
//     };

//     const notificationType = status === "available" ? "house_approved" : "house_status_changed";
//     await createAllRoleNotifications(house, notificationType, userInfo);

//     // ===========================
//     // SEND EMAILS
//     // ===========================
//     await sendHouseEmails(house, `Status Changed: ${oldStatus} → ${status}`, userInfo);

//     res.status(200).json({
//       success: true,
//       message: "House status updated successfully",
//       data: house,
//     });
//   } catch (error) {
//     console.error("Update house status error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update house status",
//     });
//   }
// };

// ============================================================
// UPDATE HOUSE STATUS
// ============================================================

// exports.updateHouseStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     // ==========================================================
//     // VALIDATE STATUS
//     // ==========================================================

//     if (!status) {
//       return res.status(400).json({
//         success: false,
//         message: "Status is required",
//       });
//     }

//     const validStatuses = [
//       "available",
//       "pending",
//       "booked",
//       "unavailable",
//       "maintenance",
//     ];

//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Invalid status value. Must be one of: available, pending, booked, unavailable, maintenance",
//       });
//     }

//     // ==========================================================
//     // VALIDATE HOUSE ID
//     // ==========================================================

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid house ID",
//       });
//     }

//     // ==========================================================
//     // FIND EXISTING HOUSE
//     // ==========================================================

//     const existingHouse = await House.findById(id).lean();

//     if (!existingHouse) {
//       return res.status(404).json({
//         success: false,
//         message: "House not found",
//       });
//     }

//     // ==========================================================
//     // STORE OLD STATUS
//     // ==========================================================

//     const oldStatus = existingHouse.status;

//     // ==========================================================
//     // NO CHANGE
//     // ==========================================================

//     if (oldStatus === status) {
//       return res.status(200).json({
//         success: true,
//         message: `House is already ${status}`,
//         data: existingHouse,
//       });
//     }

//     // ==========================================================
//     // UPDATE ONLY STATUS
//     // ==========================================================
//     //
//     // IMPORTANT:
//     // Do NOT use house.save() here.
//     //
//     // findByIdAndUpdate() changes only the requested field and
//     // avoids re-validating unrelated required fields such as
//     // houseType.
//     //
//     // ==========================================================

//     const house = await House.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           status,
//         },
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!house) {
//       return res.status(404).json({
//         success: false,
//         message: "House not found",
//       });
//     }

//     // ==========================================================
//     // USER INFORMATION
//     // ==========================================================

//     const userInfo = {
//       userId: existingHouse.createdBy || null,

//       email:
//         existingHouse.ownerEmail ||
//         existingHouse.createdByEmail ||
//         "",

//       name:
//         existingHouse.ownerName ||
//         "",

//       oldStatus,

//       newStatus: status,
//     };

//     // ==========================================================
//     // NOTIFICATION TYPE
//     // ==========================================================

//     let notificationType = "house_status_changed";

//     if (status === "available") {
//       notificationType = "house_available";
//     }

//     if (status === "unavailable") {
//       notificationType = "house_unavailable";
//     }

//     if (status === "pending") {
//       notificationType = "house_pending";
//     }

//     if (status === "booked") {
//       notificationType = "house_booked";
//     }

//     if (status === "maintenance") {
//       notificationType = "house_maintenance";
//     }

//     // ==========================================================
//     // SEND RESPONSE IMMEDIATELY
//     // ==========================================================

//     res.status(200).json({
//       success: true,
//       message: "House status updated successfully",
//       data: {
//         _id: house._id,
//         houseId: house.houseId,
//         houseName: house.name,
//         status: house.status,
//         oldStatus,
//         updatedAt: house.updatedAt,
//       },
//     });

//     // ==========================================================
//     // BACKGROUND NOTIFICATION
//     // ==========================================================

//     Promise.resolve()
//       .then(async () => {
//         try {
//           await createAllRoleNotifications(
//             house,
//             notificationType,
//             userInfo
//           );
//         } catch (notificationError) {
//           console.error(
//             "❌ Failed to create house notification:",
//             notificationError.message
//           );
//         }
//       });

//     // ==========================================================
//     // BACKGROUND EMAIL
//     // ==========================================================

//     Promise.resolve()
//       .then(async () => {
//         try {
//           await sendHouseEmails(
//             house,
//             `Status Changed: ${oldStatus} → ${status}`,
//             userInfo
//           );
//         } catch (emailError) {
//           console.error(
//             "❌ Failed to send house status email:",
//             emailError.message
//           );
//         }
//       });
//   } catch (error) {
//     console.error(
//       "❌ Update house status error:",
//       error.message
//     );

//     if (!res.headersSent) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to update house status",
//         error: error.message,
//       });
//     }
//   }
// };

exports.updateHouseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("=== STATUS UPDATE DEBUG ===");
    console.log("House ID:", id);
    console.log("Requested status:", status);

    // Validate status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ['available', 'pending', 'booked', 'unavailable', 'maintenance', 'inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // Find the house
    const house = await House.findById(id);
    console.log("Found house:", house ? house.name : "NOT FOUND");
    console.log("Current status:", house ? house.status : "N/A");

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    const oldStatus = house.status;

    // Check if status is the same
    if (house.status === status) {
      return res.status(400).json({
        success: false,
        message: `House is already ${status}`,
      });
    }

    // Update using findByIdAndUpdate
    const updatedHouse = await House.findByIdAndUpdate(
      id,
      { $set: { status: status } },  // Use $set for clarity
      { 
        new: true,
        runValidators: true
      }
    );

    console.log("Updated house status:", updatedHouse ? updatedHouse.status : "UPDATE FAILED");

    // Check if the update actually worked
    if (!updatedHouse) {
      return res.status(500).json({
        success: false,
        message: "Failed to update house status",
      });
    }

    // Verify the status was actually updated
    if (updatedHouse.status !== status) {
      console.error("Status mismatch! Expected:", status, "Got:", updatedHouse.status);
      return res.status(500).json({
        success: false,
        message: "Status update failed - mismatch detected",
        data: updatedHouse,
      });
    }

    // ===========================
    // CREATE NOTIFICATIONS
    // ===========================
    const userInfo = {
      userId: updatedHouse.createdBy || null,
      email: updatedHouse.ownerEmail || "",
      name: updatedHouse.ownerName || "",
      oldStatus: oldStatus,
    };

    const notificationType = status === "available" ? "house_approved" : "house_status_changed";
    await createAllRoleNotifications(updatedHouse, notificationType, userInfo);

    // ===========================
    // SEND EMAILS
    // ===========================
    await sendHouseEmails(updatedHouse, `Status Changed: ${oldStatus} → ${status}`, userInfo);

    console.log("Status update successful! New status:", updatedHouse.status);

    res.status(200).json({
      success: true,
      message: "House status updated successfully",
      data: updatedHouse,
    });
  } catch (error) {
    console.error("Update house status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update house status",
      error: error.message,
    });
  }
};

// 8. Delete House
exports.deleteHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    // ===========================
    // CREATE NOTIFICATIONS BEFORE DELETE
    // ===========================
    const userInfo = {
      userId: house.host.userId || null,
      email: house.host.email || "",
      name: house.host.name || "",
    };

    await createAllRoleNotifications(house, "house_deleted", userInfo);

    // ===========================
    // SEND EMAILS
    // ===========================
    await sendHouseEmails(house, "Deleted", userInfo);

    // ===========================
    // DELETE IMAGES FROM CLOUDINARY
    // ===========================
    for (const img of house.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await house.deleteOne();

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
      message: houses.length > 0
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

// 15. Mark Notification as Read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Check permission
    const hasPermission =
      notification.targetRoles.includes(user.role) ||
      notification.targetUserId?.toString() === user.id ||
      notification.targetUserEmail === user.email ||
      notification.userId?.toString() === user.id ||
      user.role === "admin";

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to mark this notification as read",
      });
    }

    notification.isRead = true;
    notification.status = "read";
    notification.readAt = new Date();

    if (!notification.readBy) {
      notification.readBy = [];
    }

    notification.readBy.push({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
    });

    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 16. Mark All Notifications as Read
exports.markAllNotificationsAsRead = async (req, res) => {
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

    const result = await Notification.updateMany(
      filter,
      {
        $set: {
          isRead: true,
          status: "read",
          readAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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

// 18. Delete Notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Check permission
    const hasPermission =
      user.role === "admin" ||
      notification.targetUserId?.toString() === user.id ||
      notification.userId?.toString() === user.id;

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this notification",
      });
    }

    await notification.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Delete notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 19. Bulk Delete Notifications
exports.bulkDeleteNotifications = async (req, res) => {
  try {
    const { ids } = req.body;
    const user = req.user;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of notification IDs",
      });
    }

    let query = {
      _id: { $in: ids },
      type: { $regex: /^house_/ },
    };

    // Non-admin users can only delete their own notifications
    if (user.role !== "admin") {
      query.$or = [
        { targetUserId: user.id },
        { userId: user.id },
        { targetUserEmail: user.email },
      ];
    }

    const result = await Notification.deleteMany(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No notifications found to delete",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} notifications deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Bulk delete notifications error:", error);

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