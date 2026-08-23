// const mongoose = require("mongoose");

// const houseSchema = new mongoose.Schema(
//   {
//     houseId: {
//       type: String,
//       required: [true, "House ID is required"],
//       unique: true,
//       trim: true,
//     },

//     name: {
//       type: String,
//       required: [true, "House name is required"],
//       trim: true,
//       minlength: [3, "House name must be at least 3 characters"],
//       maxlength: [100, "House name cannot exceed 100 characters"],
//     },

//     description: {
//       type: String,
//       required: [true, "Description is required"],
//       trim: true,
//       minlength: [20, "Description must be at least 20 characters"],
//       maxlength: [2000, "Description cannot exceed 2000 characters"],
//     },

//     images: [
//       {
//         public_id: {
//           type: String,
//           required: true,
//         },

//         url: {
//           type: String,
//           required: true,
//         },

//         secure_url: {
//           type: String,
//           required: true,
//         },
//       },
//     ],

//     location: {
//       province: {
//         type: String,
//         required: [true, "Province is required"],
//         trim: true,
//       },

//       district: {
//         type: String,
//         required: [true, "District is required"],
//         trim: true,
//       },

//       sector: {
//         type: String,
//         required: [true, "Sector is required"],
//         trim: true,
//       },

//       cell: {
//         type: String,
//         required: [true, "Cell is required"],
//         trim: true,
//       },

//       village: {
//         type: String,
//         required: [true, "Village is required"],
//         trim: true,
//       },

//       coordinates: {
//         lat: {
//           type: Number,
//           default: null,
//         },

//         lng: {
//           type: Number,
//           default: null,
//         },
//       },
//     },

//     university: {
//       type: String,
//       required: [true, "University is required"],
//       trim: true,
//     },

//     pricePerMonth: {
//       type: Number,
//       required: [true, "Price per month is required"],
//       min: [0, "Price must be greater than or equal to 0"],
//     },

//     bedrooms: {
//       type: Number,
//       required: [true, "Number of bedrooms is required"],
//       min: [0, "Bedrooms must be at least 0"],
//     },

//     bathrooms: {
//       type: Number,
//       required: [true, "Number of bathrooms is required"],
//       min: [0, "Bathrooms must be at least 0"],
//     },

//     maxGuests: {
//       type: Number,
//       required: [true, "Maximum guests is required"],
//       min: [1, "Maximum guests must be at least 1"],
//     },

//     amenities: {
//       type: [String],
//       default: [],
//     },

//     status: {
//       type: String,
//       enum: [
//         "available",
//         "pending",
//         "booked",
//         "unavailable",
//         "maintenance",
//       ],
//       default: "available",
//     },

//     rating: {
//       type: Number,
//       default: 5,
//       min: 0,
//       max: 5,
//     },

//     totalReviews: {
//       type: Number,
//       default: 10,
//       min: 0,
//     },

//     host: {
//       name: {
//         type: String,
//         required: [true, "Host name is required"],
//         trim: true,
//       },

//       email: {
//         type: String,
//         required: [true, "Host email is required"],
//         lowercase: true,
//         trim: true,
//         match: [
//           /^\S+@\S+\.\S+$/,
//           "Please enter a valid email",
//         ],
//       },

//       phone: {
//         type: String,
//         trim: true,
//       },

//       responseRate: {
//         type: Number,
//         default: 100,
//         min: 0,
//         max: 100,
//       },

//       responseTime: {
//         type: String,
//         default: "24 hours",
//       },
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // ===========================
// // VIRTUALS
// // ===========================

// // Virtual for full location string
// houseSchema.virtual("locationString").get(function () {
//   return `${this.location.province}, ${this.location.district}, ${this.location.sector}`;
// });

// // Virtual for short location (province, district)
// houseSchema.virtual("shortLocation").get(function () {
//   return `${this.location.province}, ${this.location.district}`;
// });

// // Virtual for location with village
// houseSchema.virtual("fullLocation").get(function () {
//   return `${this.location.village}, ${this.location.sector}, ${this.location.district}, ${this.location.province}`;
// });

// // Virtual for notification message
// houseSchema.virtual("notificationMessage").get(function () {
//   return `🏠 New house "${this.name}" has been listed in ${this.locationString}`;
// });

// // Virtual for status badge
// houseSchema.virtual("statusBadge").get(function () {
//   const badges = {
//     available: { color: "success", label: "Available" },
//     booked: { color: "success", label: "Booked" },
//     pending: { color: "warning", label: "Pending" },
//     unavailable: { color: "danger", label: "Unavailable" },
//     maintenance: { color: "secondary", label: "Maintenance" },
//   };
//   return badges[this.status] || { color: "secondary", label: this.status };
// });

// // Virtual for price formatted
// houseSchema.virtual("priceFormatted").get(function () {
//   return new Intl.NumberFormat("rw-RW", {
//     style: "currency",
//     currency: "RWF",
//     minimumFractionDigits: 0,
//   }).format(this.pricePerMonth);
// });

// // Virtual for days remaining on availability
// houseSchema.virtual("daysRemaining").get(function () {
//   if (!this.availability?.endDate) return null;
//   const now = new Date();
//   const end = new Date(this.availability.endDate);
//   const diffTime = end - now;
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   return diffDays > 0 ? diffDays : 0;
// });

// // Virtual for isAvailable
// houseSchema.virtual("isAvailable").get(function () {
//   return this.status === "available" && this.isActive === true;
// });

// // ===========================
// // INDEXES
// // ===========================

// houseSchema.index({
//   status: 1,
//   createdAt: -1,
// });

// houseSchema.index({
//   university: 1,
//   status: 1,
// });

// houseSchema.index({
//   "location.province": 1,
//   status: 1,
// });

// houseSchema.index({
//   "location.district": 1,
//   status: 1,
// });

// houseSchema.index({
//   pricePerMonth: 1,
// });

// // Compound index for search
// houseSchema.index({
//   name: "text",
//   description: "text",
//   university: "text",
// });

// // ===========================
// // STATIC METHODS
// // ===========================

// houseSchema.statics.getStatistics = async function () {
//   const stats = await this.aggregate([
//     {
//       $facet: {
//         total: [
//           {
//             $count: "count",
//           },
//         ],

//         available: [
//           {
//             $match: {
//               status: "available",
//             },
//           },
//           {
//             $count: "count",
//           },
//         ],

//         pending: [
//           {
//             $match: {
//               status: "pending",
//             },
//           },
//           {
//             $count: "count",
//           },
//         ],

//         unavailable: [
//           {
//             $match: {
//               status: "unavailable",
//             },
//           },
//           {
//             $count: "count",
//           },
//         ],

//         maintenance: [
//           {
//             $match: {
//               status: "maintenance",
//             },
//           },
//           {
//             $count: "count",
//           },
//         ],

//         byUniversity: [
//           {
//             $group: {
//               _id: "$university",
//               count: {
//                 $sum: 1,
//               },
//             },
//           },
//           {
//             $sort: {
//               count: -1,
//             },
//           },
//           {
//             $limit: 10,
//           },
//         ],

//         byProvince: [
//           {
//             $group: {
//               _id: "$location.province",
//               count: {
//                 $sum: 1,
//               },
//             },
//           },
//           {
//             $sort: {
//               count: -1,
//             },
//           },
//         ],

//         byDistrict: [
//           {
//             $group: {
//               _id: "$location.district",
//               count: {
//                 $sum: 1,
//               },
//             },
//           },
//           {
//             $sort: {
//               count: -1,
//             },
//           },
//           {
//             $limit: 10,
//           },
//         ],

//         avgPrice: [
//           {
//             $group: {
//               _id: null,
//               avg: {
//                 $avg: "$pricePerMonth",
//               },
//             },
//           },
//         ],

//         minPrice: [
//           {
//             $group: {
//               _id: null,
//               min: {
//                 $min: "$pricePerMonth",
//               },
//             },
//           },
//         ],

//         maxPrice: [
//           {
//             $group: {
//               _id: null,
//               max: {
//                 $max: "$pricePerMonth",
//               },
//             },
//           },
//         ],

//         avgRating: [
//           {
//             $group: {
//               _id: null,
//               avg: {
//                 $avg: "$rating",
//               },
//             },
//           },
//         ],

//         totalBedrooms: [
//           {
//             $group: {
//               _id: null,
//               total: {
//                 $sum: "$bedrooms",
//               },
//             },
//           },
//         ],

//         recent: [
//           {
//             $sort: {
//               createdAt: -1,
//             },
//           },
//           {
//             $limit: 5,
//           },
//           {
//             $project: {
//               name: 1,
//               houseId: 1,
//               location: 1,
//               pricePerMonth: 1,
//               status: 1,
//               createdAt: 1,
//             },
//           },
//         ],
//       },
//     },
//   ]);

//   const result = stats[0];

//   return {
//     total: result.total[0]?.count || 0,
//     available: result.available[0]?.count || 0,
//     pending: result.pending[0]?.count || 0,
//     unavailable: result.unavailable[0]?.count || 0,
//     maintenance: result.maintenance[0]?.count || 0,
//     byUniversity: result.byUniversity,
//     byProvince: result.byProvince,
//     byDistrict: result.byDistrict,
//     avgPrice: result.avgPrice[0]?.avg || 0,
//     minPrice: result.minPrice[0]?.min || 0,
//     maxPrice: result.maxPrice[0]?.max || 0,
//     avgRating: result.avgRating[0]?.avg || 0,
//     totalBedrooms: result.totalBedrooms[0]?.total || 0,
//     recent: result.recent || [],
//   };
// };

// // ===========================
// // INSTANCE METHODS
// // ===========================

// // Check if house is available for booking
// houseSchema.methods.isAvailableForBooking = function () {
//   const now = new Date();
//   const start = new Date(this.availability.startDate);
//   const end = new Date(this.availability.endDate);
//   return (
//     this.status === "available" &&
//     this.isActive === true &&
//     now >= start &&
//     now <= end
//   );
// };

// // Get availability status
// houseSchema.methods.getAvailabilityStatus = function () {
//   const now = new Date();
//   const start = new Date(this.availability.startDate);
//   const end = new Date(this.availability.endDate);

//   if (this.status !== "available") return this.status;
//   if (now < start) return "coming_soon";
//   if (now > end) return "expired";
//   return "available_now";
// };

// // Get formatted address
// houseSchema.methods.getFormattedAddress = function () {
//   return `${this.location.village}, ${this.location.sector}, ${this.location.district}, ${this.location.province}`;
// };

// // Get notification data for frontend
// houseSchema.methods.getNotificationData = function (type, metadata = {}) {
//   return {
//     type: type,
//     houseId: this._id,
//     houseName: this.name,
//     houseId: this.houseId,
//     location: {
//       province: this.location.province,
//       district: this.location.district,
//       sector: this.location.sector,
//     },
//     locationString: this.locationString,
//     price: this.priceFormatted,
//     status: this.status,
//     isAvailable: this.isAvailable,
//     message: this.getNotificationMessage(type),
//     metadata: metadata,
//     image: this.images[0]?.secure_url || null,
//     createdAt: new Date(),
//   };
// };

// // Get notification message based on type
// houseSchema.methods.getNotificationMessage = function (type) {
//   const messages = {
//     house_created: `🏠 New house "${this.name}" has been listed in ${this.locationString}`,
//     house_updated: `📝 House "${this.name}" has been updated in ${this.locationString}`,
//     house_deleted: `🗑️ House "${this.name}" has been removed from ${this.locationString}`,
//     house_status_changed: `🔄 House "${this.name}" status changed in ${this.locationString}`,
//     house_available: `✅ House "${this.name}" is now available in ${this.locationString}`,
//     house_unavailable: `❌ House "${this.name}" is no longer available in ${this.locationString}`,
//   };
//   return messages[type] || `📢 Update for house "${this.name}" in ${this.locationString}`;
// };

// // ===========================
// // PRE-SAVE MIDDLEWARE
// // ===========================

// // // Auto-generate houseId if not provided
// // houseSchema.pre("save", async function (next) {
// //   if (!this.houseId) {
// //     const count = await this.constructor.countDocuments();
// //     const year = new Date().getFullYear().toString().slice(-2);
// //     const random = Math.floor(Math.random() * 1000)
// //       .toString()
// //       .padStart(3, "0");
// //     this.houseId = `HSE-${year}-${String(count + 1).padStart(4, "0")}-${random}`;
// //   }
// //   next();
// // });

// // // ===========================
// // // QUERY HELPERS
// // // ===========================

// // // Add query helper for available houses
// // houseSchema.query.available = function () {
// //   return this.where("status").equals("available").where("isActive").equals(true);
// // };

// // // Add query helper by location
// // houseSchema.query.byLocation = function (province, district) {
// //   let query = this;
// //   if (province) query = query.where("location.province").equals(province);
// //   if (district) query = query.where("location.district").equals(district);
// //   return query;
// // };

// // // Add query helper by price range
// // houseSchema.query.byPriceRange = function (min, max) {
// //   let query = this;
// //   if (min) query = query.where("pricePerMonth").gte(min);
// //   if (max) query = query.where("pricePerMonth").lte(max);
// //   return query;
// // };

// // // Add query helper by university
// // houseSchema.query.byUniversity = function (university) {
// //   return this.where("university").regex(new RegExp(university, "i"));
// // };

// // module.exports =
// //   mongoose.models.House ||
// //   mongoose.model("House", houseSchema);

// // ===========================
// // PRE-SAVE MIDDLEWARE
// // ===========================

// // Auto-generate houseId if not provided
// houseSchema.pre("save", async function () {
//   if (!this.houseId) {
//     const count = await this.constructor.countDocuments();

//     const year = new Date()
//       .getFullYear()
//       .toString()
//       .slice(-2);

//     const random = Math.floor(Math.random() * 1000)
//       .toString()
//       .padStart(3, "0");

//     this.houseId = `HSE-${year}-${String(count + 1).padStart(4, "0")}-${random}`;
//   }
// });

// // ===========================
// // QUERY HELPERS
// // ===========================

// // Add query helper for available houses
// houseSchema.query.available = function () {
//   return this
//     .where("status")
//     .equals("available")
//     .where("isActive")
//     .equals(true);
// };

// // Add query helper by location
// houseSchema.query.byLocation = function (province, district) {
//   let query = this;

//   if (province) {
//     query = query.where("location.province").equals(province);
//   }

//   if (district) {
//     query = query.where("location.district").equals(district);
//   }

//   return query;
// };

// // Add query helper by price range
// houseSchema.query.byPriceRange = function (min, max) {
//   let query = this;

//   if (min) {
//     query = query.where("pricePerMonth").gte(min);
//   }

//   if (max) {
//     query = query.where("pricePerMonth").lte(max);
//   }

//   return query;
// };

// // Add query helper by university
// houseSchema.query.byUniversity = function (university) {
//   return this.where("university")
//     .regex(new RegExp(university, "i"));
// };

// // ===========================
// // MODEL EXPORT
// // ===========================

// module.exports =
//   mongoose.models.House ||
//   mongoose.model("House", houseSchema);

// ============================================================
// MODELS / HOUSE.JS
// ============================================================

const mongoose = require("mongoose");

// ============================================================
// IMAGE SCHEMA
// ============================================================

const imageSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      trim: true,
      default: "",
    },

    secure_url: {
      type: String,
      trim: true,
      default: "",
    },

    url: {
      type: String,
      trim: true,
      default: "",
    },

    original_filename: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  },
);

// ============================================================
// LOCATION SCHEMA
// ============================================================

const locationSchema = new mongoose.Schema(
  {
    province: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    district: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    sector: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    cell: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    village: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },
  },
  {
    _id: false,
  },
);

// ============================================================
// AVAILABILITY SCHEMA
// ============================================================

const availabilitySchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      default: () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        return date;
      },
    },
  },
  {
    _id: false,
  },
);

// ============================================================
// HOUSE SCHEMA
// ============================================================

const houseSchema = new mongoose.Schema(
  {
    // ==========================================================
    // HOUSE IDENTIFICATION
    // ==========================================================

    houseId: {
      type: String,
      unique: true,
      index: true,
      trim: true,
      uppercase: true,
    },

    // ==========================================================
    // BASIC HOUSE INFORMATION
    // ==========================================================

    name: {
      type: String,
      required: [true, "House name is required"],
      trim: true,
      minlength: [2, "House name must be at least 2 characters"],
      maxlength: [200, "House name cannot exceed 200 characters"],
    },

    houseType: {
      type: String,
      required: [true, "House type is required"],
      trim: true,
      lowercase: true,
      maxlength: [100, "House type cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
      default: "",
    },

    // ==========================================================
    // OWNER INFORMATION
    // ==========================================================

    ownerName: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    ownerContact: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "",
    },

    ownerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 200,
      default: "",
    },

    // ==========================================================
    // LOCATION
    // ==========================================================

    location: {
      type: locationSchema,
      default: () => ({}),
    },

    // ==========================================================
    // UNIVERSITY
    // ==========================================================

    university: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    // ==========================================================
    // PRICE
    // ==========================================================

    pricePerMonth: {
      type: Number,
      required: [true, "Monthly price is required"],
      min: [0, "Monthly price cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Monthly price must be a whole number",
      },
    },

    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: "RWF",
    },

    // ==========================================================
    // HOUSE CAPACITY
    // ==========================================================

    bedrooms: {
      type: Number,
      min: [0, "Bedrooms cannot be negative"],
      default: 0,
    },

    bathrooms: {
      type: Number,
      min: [0, "Bathrooms cannot be negative"],
      default: 0,
    },

    guests: {
      type: Number,
      min: [1, "Guests must be at least 1"],
      default: 1,
    },

    // ==========================================================
    // AMENITIES
    // ==========================================================

    amenities: {
      type: [String],
      default: [],
    },

    // ==========================================================
    // IMAGES
    // ==========================================================

    images: {
      type: [imageSchema],
      default: [],
    },

    // ==========================================================
    // AVAILABILITY
    // ==========================================================

    availability: {
      type: availabilitySchema,
      default: () => ({}),
    },

    // ==========================================================
    // STATUS
    // ==========================================================

    status: {
      type: String,
      enum: {
        values: [
          "available",
          "unavailable",
          "pending",
          "booked",
          "maintenance",
          "inactive",
        ],
        message: "{VALUE} is not a valid house status",
      },
      default: "available",
      index: true,
    },

    // ==========================================================
    // ACTIVE FLAG
    // ==========================================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ==========================================================
    // FEATURED
    // ==========================================================

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ==========================================================
    // CREATED BY
    // ==========================================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdByEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  },
);

// ============================================================
// VIRTUAL: LOCATION STRING
// ============================================================

houseSchema.virtual("locationString").get(function () {
  const parts = [
    this.location?.village,
    this.location?.cell,
    this.location?.sector,
    this.location?.district,
    this.location?.province,
  ].filter(Boolean);

  return parts.join(", ");
});

// ============================================================
// VIRTUAL: FORMATTED PRICE
// ============================================================

houseSchema.virtual("priceFormatted").get(function () {
  const price = Number(this.pricePerMonth || 0);

  return `${price.toLocaleString("en-US")} ${this.currency || "RWF"}`;
});

// ============================================================
// VIRTUAL: IS AVAILABLE
// ============================================================

houseSchema.virtual("isAvailable").get(function () {
  if (!this.isActive) {
    return false;
  }

  if (this.status !== "available") {
    return false;
  }

  if (
    !this.availability ||
    !this.availability.startDate ||
    !this.availability.endDate
  ) {
    return true;
  }

  const now = new Date();

  const start = new Date(this.availability.startDate);

  const end = new Date(this.availability.endDate);

  return now >= start && now <= end;
});

// ============================================================
// GET AVAILABILITY STATUS
// ============================================================

houseSchema.methods.getAvailabilityStatus = function () {
  if (!this.isActive) {
    return "inactive";
  }

  if (this.status !== "available") {
    return this.status;
  }

  if (
    !this.availability ||
    !this.availability.startDate ||
    !this.availability.endDate
  ) {
    return "available_now";
  }

  const now = new Date();

  const start = new Date(this.availability.startDate);

  const end = new Date(this.availability.endDate);

  if (now < start) {
    return "coming_soon";
  }

  if (now > end) {
    return "expired";
  }

  return "available_now";
};

// ============================================================
// GET FORMATTED ADDRESS
// ============================================================

houseSchema.methods.getFormattedAddress = function () {
  return [
    this.location?.village,
    this.location?.cell,
    this.location?.sector,
    this.location?.district,
    this.location?.province,
  ]
    .filter(Boolean)
    .join(", ");
};

// ============================================================
// HOUSE NOTIFICATION DATA
// ============================================================
//
// IMPORTANT:
// houseId = MongoDB _id
// houseReference = custom HSE-... ID
//
// Do NOT define houseId twice.
// ============================================================

houseSchema.methods.getNotificationData = function (type, metadata = {}) {
  return {
    type,

    // MongoDB ObjectId
    houseId: this._id,

    // Custom house identifier
    houseReference: this.houseId,

    houseName: this.name,

    location: {
      province: this.location?.province || "",
      district: this.location?.district || "",
      sector: this.location?.sector || "",
      cell: this.location?.cell || "",
      village: this.location?.village || "",
    },

    locationString: this.locationString,

    price: this.priceFormatted,

    pricePerMonth: this.pricePerMonth,

    currency: this.currency,

    status: this.status,

    isAvailable: this.isAvailable,

    message: this.getNotificationMessage(type),

    metadata,

    image: this.images?.[0]?.secure_url || this.images?.[0]?.url || null,

    createdAt: new Date(),
  };
};

// ============================================================
// HOUSE NOTIFICATION MESSAGE
// ============================================================

houseSchema.methods.getNotificationMessage = function (type) {
  const messages = {
    house_created: `🏠 New house "${this.name}" has been listed in ${this.locationString}`,

    house_updated: `📝 House "${this.name}" has been updated in ${this.locationString}`,

    house_deleted: `🗑️ House "${this.name}" has been removed from ${this.locationString}`,

    house_status_changed: `🔄 House "${this.name}" status changed in ${this.locationString}`,

    house_available: `✅ House "${this.name}" is now available in ${this.locationString}`,

    house_unavailable: `❌ House "${this.name}" is no longer available in ${this.locationString}`,

    house_pending: `⏳ House "${this.name}" is pending approval in ${this.locationString}`,

    house_booked: `🏠 House "${this.name}" has been booked in ${this.locationString}`,

    house_maintenance: `🔧 House "${this.name}" is under maintenance in ${this.locationString}`,
  };

  return (
    messages[type] ||
    `📢 Update for house "${this.name}" in ${this.locationString}`
  );
};

// ============================================================
// PRE-SAVE: GENERATE HOUSE ID
// ============================================================
//
// Generates:
// HSE-26-0001-123
//
// Uses the document count only as the sequence source.
// ============================================================

houseSchema.pre("save", async function () {
  if (this.houseId) {
    return;
  }

  const count = await this.constructor.countDocuments();

  const year = new Date().getFullYear().toString().slice(-2);

  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  this.houseId = `HSE-${year}-${String(count + 1).padStart(4, "0")}-${random}`;
});

// ============================================================
// QUERY HELPERS
// ============================================================

// Available houses
houseSchema.query.available = function () {
  return this.where("status")
    .equals("available")
    .where("isActive")
    .equals(true);
};

// Active houses
houseSchema.query.active = function () {
  return this.where("isActive").equals(true);
};

// Filter by location
houseSchema.query.byLocation = function (province, district) {
  let query = this;

  if (province) {
    query = query.where("location.province").equals(province);
  }

  if (district) {
    query = query.where("location.district").equals(district);
  }

  return query;
};

// Filter by price range
houseSchema.query.byPriceRange = function (min, max) {
  let query = this;

  if (min !== undefined && min !== null) {
    query = query.where("pricePerMonth").gte(Number(min));
  }

  if (max !== undefined && max !== null) {
    query = query.where("pricePerMonth").lte(Number(max));
  }

  return query;
};

// Filter by university
houseSchema.query.byUniversity = function (university) {
  if (!university) {
    return this;
  }

  return this.where("university").regex(new RegExp(university, "i"));
};

// ============================================================
// INDEXES
// ============================================================

houseSchema.index({
  status: 1,
  isActive: 1,
});

houseSchema.index({
  "location.province": 1,
  "location.district": 1,
});

houseSchema.index({
  "location.district": 1,
  "location.sector": 1,
});

houseSchema.index({
  university: 1,
});

houseSchema.index({
  pricePerMonth: 1,
});

houseSchema.index({
  createdAt: -1,
});

// ============================================================
// MODEL
// ============================================================

module.exports = mongoose.models.House || mongoose.model("House", houseSchema);
