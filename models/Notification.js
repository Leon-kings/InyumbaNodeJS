// ============================================================
// MODELS / NOTIFICATION.JS
// ============================================================

const mongoose = require("mongoose");

// ============================================================
// NOTIFICATION SCHEMA
// ============================================================

const notificationSchema = new mongoose.Schema(
  {
    // ==========================================================
    // NOTIFICATION TYPE
    // ==========================================================

    type: {
      type: String,

      required: [true, "Notification type is required"],

      trim: true,

      enum: [
        // ======================================================
        // GENERAL
        // ======================================================

        "system",
        "general",
        "announcement",

        // ======================================================
        // AUTH / USER
        // ======================================================

        "user_registered",
        "user_updated",
        "user_deleted",
        "user_login",
        "user_logout",
        "email_verified",
        "email_verification",
        "user_created",
        "password_changed",
        "password_reset",
        "profile_updated",

        // ======================================================
        // CONTACT
        // ======================================================

        "contact_created",
        "contact_updated",
        "contact_deleted",
        "contact_replied",

        // ======================================================
        // QUESTIONS
        // ======================================================

        "question_created",
        "question_updated",
        "question_deleted",
        "question_answered",
        "question_replied",

        // ======================================================
        // REQUESTS
        // ======================================================

        "request_created",
        "request_updated",
        "request_deleted",
        "request_approved",
        "request_rejected",
        "request_status_changed",

        // ======================================================
        // HOUSES
        // ======================================================

        "house_created",
        "house_updated",
        "house_deleted",
        "house_status_changed",
        "house_available",
        "house_unavailable",
        "house_pending",
        "house_booked",
        "house_maintenance",

        // ======================================================
        // BOOKINGS
        // ======================================================

        "booking_created",
        "booking_updated",
        "booking_deleted",
        "booking_confirmed",
        "booking_cancelled",
        "booking_completed",
        "booking_status_changed",

        // ======================================================
        // BOOKING PAYMENT
        // ======================================================

        "booking_payment_pending",
        "booking_payment_verified",
        "booking_payment_rejected",
        "booking_payment_received",
        "booking_payment_completed",
        "booking_payment_failed",

        // ======================================================
        // PAYMENTS
        // ======================================================

        "payment_created",
        "payment_pending",
        "payment_verified",
        "payment_rejected",
        "payment_completed",
        "payment_failed",

        // ======================================================
        // ADMIN
        // ======================================================

        "admin_created",
        "admin_updated",
        "admin_deleted",

        // ==================================================
        // TESTIMONIALS
        // ==================================================

        "testimonial_created",
        "testimonial_updated",
        "testimonial_deleted",
        "testimonial_approved",
        "testimonial_rejected",
        "testimonial_featured",
        "testimonial_unfeatured",
      ],
    },

    // ==========================================================
    // NOTIFICATION TITLE
    // ==========================================================

    title: {
      type: String,
      trim: true,
      maxlength: [300, "Title cannot exceed 300 characters"],
      default: "",
    },

    // ==========================================================
    // MESSAGE
    // ==========================================================

    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },

    // ==========================================================
    // USER WHO CAUSED THE ACTION
    // ==========================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    userName: {
      type: String,
      trim: true,
      default: "",
    },

    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // ==========================================================
    // TARGET USER
    // ==========================================================

    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    targetUserName: {
      type: String,
      trim: true,
      default: "",
    },

    targetUserEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // ==========================================================
    // TESTIMONIAL REFERENCE
    // ==========================================================

    testimonialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Testimonial",
      default: null,
    },

    testimonialName: {
      type: String,
      trim: true,
      default: "",
    },

    testimonialEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // ==========================================================
    // TARGET ROLES
    // ==========================================================

    targetRoles: {
      type: [
        {
          type: String,

          enum: [
            "admin",
            "manager",
            "user",
            "host",
            "superadmin",
            "support",
            "guest",
            "all",
          ],
        },
      ],

      default: [],
    },

    // ==========================================================
    // QUESTION REFERENCE
    // ==========================================================

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      default: null,
    },

    // ==========================================================
    // CONTACT REFERENCE
    // ==========================================================

    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      default: null,
    },

    // ==========================================================
    // REQUEST REFERENCE
    // ==========================================================

    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },

    // ==========================================================
    // HOUSE REFERENCE
    // ==========================================================
    //
    // IMPORTANT:
    // This must be the MongoDB House _id.
    //
    // Example:
    // houseId: house._id
    //
    // This allows:
    //
    // .populate("houseId")
    //
    // ==========================================================

    houseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      default: null,
    },

    // ==========================================================
    // CUSTOM HOUSE REFERENCE
    // ==========================================================
    //
    // Example:
    // HSE-26-0001-123
    //
    // ==========================================================

    houseReference: {
      type: String,
      trim: true,
      default: "",
    },

    houseName: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================================
    // BOOKING REFERENCE
    // ==========================================================

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    bookingReference: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================================
    // PAYMENT REFERENCE
    // ==========================================================

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    // ==========================================================
    // INCOME REFERENCE
    // ==========================================================

    incomeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Income",
      default: null,
    },

    // ==========================================================
    // EXPENSE REFERENCE
    // ==========================================================

    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
      default: null,
    },

    // ==========================================================
    // BUDGET REFERENCE
    // ==========================================================

    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      default: null,
    },

    // ==========================================================
    // SAVINGS REFERENCE
    // ==========================================================

    savingsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Savings",
      default: null,
    },

    // ==========================================================
    // PRIORITY
    // ==========================================================

    priority: {
      type: String,

      enum: ["low", "normal", "medium", "high", "urgent"],

      default: "normal",
    },

    // ==========================================================
    // STATUS
    // ==========================================================

    status: {
      type: String,

      enum: ["new", "read", "dismissed", "archived", "actioned"],

      default: "new",

      index: true,
    },

    // ==========================================================
    // READ STATUS
    // ==========================================================

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
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
    // ACTION URL
    // ==========================================================

    actionUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================================
    // IMAGE
    // ==========================================================

    image: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================================
    // LOCATION INFORMATION
    // ==========================================================

    location: {
      province: {
        type: String,
        trim: true,
        default: "",
      },

      district: {
        type: String,
        trim: true,
        default: "",
      },

      sector: {
        type: String,
        trim: true,
        default: "",
      },

      cell: {
        type: String,
        trim: true,
        default: "",
      },

      village: {
        type: String,
        trim: true,
        default: "",
      },
    },

    locationString: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================================
    // METADATA
    // ==========================================================

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ==========================================================
    // EXPIRATION
    // ==========================================================

    expiresAt: {
      type: Date,
      default: null,
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
// INDEXES
// ============================================================

// User notifications

notificationSchema.index({
  targetUserId: 1,
  createdAt: -1,
});

notificationSchema.index({
  targetUserEmail: 1,
  createdAt: -1,
});

notificationSchema.index({
  userId: 1,
  createdAt: -1,
});

// Notification type

notificationSchema.index({
  type: 1,
  createdAt: -1,
});

// Status

notificationSchema.index({
  status: 1,
  isRead: 1,
  createdAt: -1,
});

// House notifications

notificationSchema.index({
  houseId: 1,
  createdAt: -1,
});

// Booking notifications

notificationSchema.index({
  bookingId: 1,
  createdAt: -1,
});

// Question notifications

notificationSchema.index({
  questionId: 1,
  createdAt: -1,
});

// Request notifications

notificationSchema.index({
  requestId: 1,
  createdAt: -1,
});

// Contact notifications

notificationSchema.index({
  contactId: 1,
  createdAt: -1,
});

// ============================================================
// MARK AS READ
// ============================================================

notificationSchema.methods.markAsRead = async function () {
  this.isRead = true;

  this.status = "read";

  this.readAt = new Date();

  return this.save();
};

// ============================================================
// MARK AS UNREAD
// ============================================================

notificationSchema.methods.markAsUnread = async function () {
  this.isRead = false;

  this.status = "new";

  this.readAt = null;

  return this.save();
};

// ============================================================
// STATIC: MARK ALL USER NOTIFICATIONS AS READ
// ============================================================

notificationSchema.statics.markAllAsRead = async function (email) {
  if (!email) {
    return null;
  }

  return this.updateMany(
    {
      targetUserEmail: String(email).trim().toLowerCase(),

      isRead: false,

      isActive: true,
    },

    {
      $set: {
        isRead: true,
        status: "read",
        readAt: new Date(),
      },
    },
  );
};

// ============================================================
// VIRTUAL: IS EXPIRED
// ============================================================

notificationSchema.virtual("isExpired").get(function () {
  if (!this.expiresAt) {
    return false;
  }

  return new Date() > this.expiresAt;
});

// ============================================================
// CLEAN EMPTY REFERENCES
// ============================================================

notificationSchema.pre("validate", function () {
  const objectIdFields = [
    "userId",
    "targetUserId",
    "questionId",
    "contactId",
    "requestId",
    "houseId",
    "bookingId",
    "paymentId",
    "incomeId",
    "expenseId",
    "budgetId",
    "savingsId",
  ];

  objectIdFields.forEach((field) => {
    if (this[field] === "") {
      this[field] = null;
    }
  });
});

// ============================================================
// TTL INDEX
// ============================================================
//
// Only documents with expiresAt will automatically expire.
// Documents where expiresAt is null remain permanently.
//
// ============================================================

notificationSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

// ============================================================
// EXPORT MODEL
// ============================================================

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

module.exports = Notification;
