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
      maxlength: [100, "Province cannot exceed 100 characters"],
      default: "",
    },

    district: {
      type: String,
      trim: true,
      maxlength: [100, "District cannot exceed 100 characters"],
      default: "",
    },

    sector: {
      type: String,
      trim: true,
      maxlength: [100, "Sector cannot exceed 100 characters"],
      default: "",
    },

    cell: {
      type: String,
      trim: true,
      maxlength: [100, "Cell cannot exceed 100 characters"],
      default: "",
    },

    village: {
      type: String,
      trim: true,
      maxlength: [100, "Village cannot exceed 100 characters"],
      default: "",
    },

    address: {
      type: String,
      trim: true,
      maxlength: [500, "Address cannot exceed 500 characters"],
      default: "",
    },

    latitude: {
      type: Number,
      min: [-90, "Latitude cannot be less than -90"],
      max: [90, "Latitude cannot be greater than 90"],
      default: null,
    },

    longitude: {
      type: Number,
      min: [-180, "Longitude cannot be less than -180"],
      max: [180, "Longitude cannot be greater than 180"],
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
      sparse: true,
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
    // IMPORTANT: DO NOT REMOVE THESE FIELDS
    // ==========================================================

    ownerName: {
      type: String,
      trim: true,
      maxlength: [200, "Owner name cannot exceed 200 characters"],
      default: "",
    },

    ownerContact: {
      type: String,
      trim: true,
      maxlength: [50, "Owner contact cannot exceed 50 characters"],
      default: "",
    },

    ownerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [200, "Owner email cannot exceed 200 characters"],
      default: "",
      validate: {
        validator: function (value) {
          if (!value) {
            return true;
          }

          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },

        message: "Please provide a valid owner email",
      },
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
      maxlength: [200, "University cannot exceed 200 characters"],
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
        validator: function (value) {
          return Number.isInteger(value);
        },

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

      validate: {
        validator: function (value) {
          return Number.isInteger(value);
        },

        message: "Bedrooms must be a whole number",
      },
    },

    bathrooms: {
      type: Number,
      min: [0, "Bathrooms cannot be negative"],
      default: 0,

      validate: {
        validator: function (value) {
          return Number.isInteger(value);
        },

        message: "Bathrooms must be a whole number",
      },
    },

    // ==========================================================
    // GUEST CAPACITY
    // ==========================================================

    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      default: 1,
      },
   

    // ==========================================================
    // AMENITIES
    // ==========================================================

    amenities: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: [100, "Amenity cannot exceed 100 characters"],
        },
      ],

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

      default: () => ({
        startDate: new Date(),

        endDate: (() => {
          const date = new Date();
          date.setFullYear(date.getFullYear() + 1);
          return date;
        })(),
      }),
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

      default: "pending",

      index: true,
    },

    // ==========================================================
    // ACTIVE
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
      maxlength: [200, "Created by email cannot exceed 200 characters"],
      default: "",

      validate: {
        validator: function (value) {
          if (!value) {
            return true;
          }

          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },

        message: "Please provide a valid created by email",
      },
    },
  },

  // ==========================================================
  // SCHEMA OPTIONS
  // ==========================================================

  {
    timestamps: true,

    strict: true,

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
// METHOD: GET AVAILABILITY STATUS
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
// METHOD: GET FORMATTED ADDRESS
// ============================================================

houseSchema.methods.getFormattedAddress = function () {
  const parts = [
    this.location?.address,
    this.location?.village,
    this.location?.cell,
    this.location?.sector,
    this.location?.district,
    this.location?.province,
  ].filter(Boolean);

  return parts.join(", ");
};

// ============================================================
// METHOD: GET NOTIFICATION DATA
// ============================================================

houseSchema.methods.getNotificationData = function (type, metadata = {}) {
  return {
    type,

    houseId: this._id,

    houseReference: this.houseId,

    houseName: this.name,

    houseType: this.houseType,

    // ========================================================
    // OWNER INFORMATION
    // ========================================================

    owner: {
      name: this.ownerName || "",

      email: this.ownerEmail || "",

      contact: this.ownerContact || "",
    },

    ownerName: this.ownerName || "",

    ownerEmail: this.ownerEmail || "",

    ownerContact: this.ownerContact || "",

    // ========================================================
    // LOCATION
    // ========================================================

    location: {
      province: this.location?.province || "",

      district: this.location?.district || "",

      sector: this.location?.sector || "",

      cell: this.location?.cell || "",

      village: this.location?.village || "",

      address: this.location?.address || "",

      latitude: this.location?.latitude ?? null,

      longitude: this.location?.longitude ?? null,
    },

    locationString: this.locationString,

    // ========================================================
    // HOUSE DETAILS
    // ========================================================

    price: this.priceFormatted,

    pricePerMonth: this.pricePerMonth,

    currency: this.currency,

    guests: this.guests,

    bedrooms: this.bedrooms,

    bathrooms: this.bathrooms,

    status: this.status,

    isActive: this.isActive,

    isAvailable: this.isAvailable,

    // ========================================================
    // IMAGE
    // ========================================================

    image: this.images?.[0]?.secure_url || this.images?.[0]?.url || null,

    // ========================================================
    // MESSAGE
    // ========================================================

    message: this.getNotificationMessage(type),

    metadata,

    createdAt: new Date(),
  };
};

// ============================================================
// METHOD: GET NOTIFICATION MESSAGE
// ============================================================

houseSchema.methods.getNotificationMessage = function (type) {
  const location = this.locationString || "the listed location";

  const messages = {
    house_created: `🏠 New house "${this.name}" has been listed in ${location}`,

    house_updated: `📝 House "${this.name}" has been updated in ${location}`,

    house_deleted: `🗑️ House "${this.name}" has been removed from ${location}`,

    house_status_changed: `🔄 House "${this.name}" status has changed in ${location}`,

    house_available: `✅ House "${this.name}" is now available in ${location}`,

    house_unavailable: `❌ House "${this.name}" is no longer available in ${location}`,

    house_pending: `⏳ House "${this.name}" is pending approval in ${location}`,

    house_booked: `🏠 House "${this.name}" has been booked in ${location}`,

    house_maintenance: `🔧 House "${this.name}" is under maintenance in ${location}`,
  };

  return messages[type] || `📢 Update for house "${this.name}" in ${location}`;
};

// ============================================================
// PRE-VALIDATE
// IMPORTANT:
// NO next()
// NO callback
// ============================================================

houseSchema.pre("validate", function () {
  // ==========================================================
  // HOUSE ID
  // ==========================================================

  if (this.houseId) {
    this.houseId = String(this.houseId).trim().toUpperCase();
  }

  // ==========================================================
  // OWNER NAME
  // ==========================================================

  if (this.ownerName) {
    this.ownerName = String(this.ownerName).trim();
  }

  // ==========================================================
  // OWNER CONTACT
  // ==========================================================

  if (this.ownerContact) {
    this.ownerContact = String(this.ownerContact).trim();
  }

  // ==========================================================
  // OWNER EMAIL
  // ==========================================================

  if (this.ownerEmail) {
    this.ownerEmail = String(this.ownerEmail).trim().toLowerCase();
  }

  // ==========================================================
  // CREATED BY EMAIL
  // ==========================================================

  if (this.createdByEmail) {
    this.createdByEmail = String(this.createdByEmail).trim().toLowerCase();
  }

  // ==========================================================
  // CURRENCY
  // ==========================================================

  if (this.currency) {
    this.currency = String(this.currency).trim().toUpperCase();
  }

  // ==========================================================
  // HOUSE TYPE
  // ==========================================================

  if (this.houseType) {
    this.houseType = String(this.houseType).trim().toLowerCase();
  }

  // ==========================================================
  // UNIVERSITY
  // ==========================================================

  if (this.university) {
    this.university = String(this.university).trim();
  }

  // ==========================================================
  // AMENITIES
  // ==========================================================

  if (Array.isArray(this.amenities)) {
    this.amenities = [
      ...new Set(
        this.amenities
          .map((amenity) => {
            if (amenity === null || amenity === undefined) {
              return "";
            }

            return String(amenity).trim();
          })
          .filter(Boolean),
      ),
    ];
  }

  // ==========================================================
  // NUMERIC VALUES
  // ==========================================================

  if (this.guests !== undefined && this.guests !== null) {
    this.guests = Number(this.guests);
  }

  if (this.pricePerMonth !== undefined && this.pricePerMonth !== null) {
    this.pricePerMonth = Number(this.pricePerMonth);
  }

  if (this.bedrooms !== undefined && this.bedrooms !== null) {
    this.bedrooms = Number(this.bedrooms);
  }

  if (this.bathrooms !== undefined && this.bathrooms !== null) {
    this.bathrooms = Number(this.bathrooms);
  }

  // ==========================================================
  // LOCATION
  // ==========================================================

  if (this.location) {
    const locationFields = [
      "province",
      "district",
      "sector",
      "cell",
      "village",
      "address",
    ];

    locationFields.forEach((field) => {
      if (this.location[field] !== undefined && this.location[field] !== null) {
        this.location[field] = String(this.location[field]).trim();
      }
    });

    // ========================================================
    // LATITUDE
    // ========================================================

    if (
      this.location.latitude !== null &&
      this.location.latitude !== undefined &&
      this.location.latitude !== ""
    ) {
      this.location.latitude = Number(this.location.latitude);
    }

    // ========================================================
    // LONGITUDE
    // ========================================================

    if (
      this.location.longitude !== null &&
      this.location.longitude !== undefined &&
      this.location.longitude !== ""
    ) {
      this.location.longitude = Number(this.location.longitude);
    }
  }
});

// ============================================================
// PRE-SAVE
//
// IMPORTANT:
// NO next()
// NO callback
//
// Mongoose waits for this Promise automatically.
// ============================================================

houseSchema.pre("save", async function () {
  // ==========================================================
  // IF HOUSE ID ALREADY EXISTS
  // ==========================================================

  if (this.houseId) {
    this.houseId = String(this.houseId).trim().toUpperCase();

    return;
  }

  // ==========================================================
  // GENERATE UNIQUE HOUSE ID
  // ==========================================================

  const year = new Date().getFullYear().toString().slice(-2);

  let generatedHouseId;

  let exists = true;

  while (exists) {
    const random = Math.floor(100000 + Math.random() * 900000);

    generatedHouseId = `HSE-${year}-${random}`;

    exists = await this.constructor.exists({
      houseId: generatedHouseId,
    });
  }

  this.houseId = generatedHouseId;
});

// ============================================================
// QUERY HELPER: AVAILABLE
// ============================================================

houseSchema.query.available = function () {
  return this.where("status")
    .equals("available")
    .where("isActive")
    .equals(true);
};

// ============================================================
// QUERY HELPER: ACTIVE
// ============================================================

houseSchema.query.active = function () {
  return this.where("isActive").equals(true);
};

// ============================================================
// QUERY HELPER: BY LOCATION
// ============================================================

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

// ============================================================
// QUERY HELPER: BY PRICE RANGE
// ============================================================

houseSchema.query.byPriceRange = function (min, max) {
  let query = this;

  if (min !== undefined && min !== null && min !== "") {
    const numericMin = Number(min);

    if (Number.isFinite(numericMin)) {
      query = query.where("pricePerMonth").gte(numericMin);
    }
  }

  if (max !== undefined && max !== null && max !== "") {
    const numericMax = Number(max);

    if (Number.isFinite(numericMax)) {
      query = query.where("pricePerMonth").lte(numericMax);
    }
  }

  return query;
};

// ============================================================
// QUERY HELPER: BY UNIVERSITY
// ============================================================

houseSchema.query.byUniversity = function (university) {
  if (!university) {
    return this;
  }

  const escaped = String(university).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return this.where("university").regex(new RegExp(escaped, "i"));
};

// ============================================================
// QUERY HELPER: BY GUEST CAPACITY
// ============================================================

houseSchema.query.byGuests = function (guests) {
  if (guests === undefined || guests === null || guests === "") {
    return this;
  }

  const numberOfGuests = Number(guests);

  if (!Number.isFinite(numberOfGuests) || numberOfGuests < 1) {
    return this;
  }

  return this.where("guests").gte(Math.floor(numberOfGuests));
};

// ============================================================
// QUERY HELPER: BY HOUSE TYPE
// ============================================================

houseSchema.query.byHouseType = function (houseType) {
  if (!houseType) {
    return this;
  }

  return this.where("houseType").equals(String(houseType).trim().toLowerCase());
};

// ============================================================
// QUERY HELPER: BY STATUS
// ============================================================

houseSchema.query.byStatus = function (status) {
  if (!status) {
    return this;
  }

  return this.where("status").equals(String(status).trim().toLowerCase());
};

// ============================================================
// QUERY HELPER: BY OWNER EMAIL
// ============================================================

houseSchema.query.byOwnerEmail = function (email) {
  if (!email) {
    return this;
  }

  return this.where("ownerEmail").equals(String(email).trim().toLowerCase());
};

// ============================================================
// QUERY HELPER: BY CREATED BY EMAIL
// ============================================================

houseSchema.query.byCreatedByEmail = function (email) {
  if (!email) {
    return this;
  }

  return this.where("createdByEmail").equals(
    String(email).trim().toLowerCase(),
  );
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

houseSchema.index({
  createdBy: 1,
});

houseSchema.index({
  ownerEmail: 1,
});

houseSchema.index({
  guests: 1,
});

// ============================================================
// MODEL EXPORT
// ============================================================

const House = mongoose.models.House || mongoose.model("House", houseSchema);

module.exports = House;
