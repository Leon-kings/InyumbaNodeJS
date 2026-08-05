const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      trim: true,
    },

    // ==========================
    // Guest Information
    // ==========================
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },

    idNumber: {
      type: String,
      trim: true,
      default: "",
    },

    university: {
      type: String,
      trim: true,
      default: "",
    },

    studentId: {
      type: String,
      trim: true,
      default: "",
    },

    purpose: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================
    // House Information
    // ==========================
    houseId: {
      type: String,
      required: [true, "House ID is required"],
      trim: true,
    },

    houseName: {
      type: String,
      required: [true, "House name is required"],
      trim: true,
    },

    houseType: {
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

    ownerName: {
      type: String,
      trim: true,
      default: "",
    },

    ownerContact: {
      type: String,
      trim: true,
      default: "",
    },

    ownerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // ==========================
    // Booking Details
    // ==========================
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },

    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
    },

    months: {
      type: Number,
      required: [true, "Months is required"],
      min: 1,
    },

    guests: {
      type: Number,
      required: [true, "Guests is required"],
      min: 1,
    },

    specialRequests: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================
    // Payment
    // ==========================
    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },

    serviceFee: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["momo", "bank", "cash"],
      default: "momo",
    },

    momoNumber: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================
    // Payment Screenshot
    // ==========================
    paymentScreenshot: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },

    // ==========================
    // Booking Status
    // ==========================
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// ==========================
// Auto-generate Booking ID
// ==========================
BookingSchema.pre("save", function () {
  if (!this.bookingId) {
    const now = new Date();

    const date =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");

    const random = Math.floor(1000 + Math.random() * 9000);

    this.bookingId = `BK${date}-${random}`;
  }
});

// ==========================
// Indexes
// ==========================
BookingSchema.index({ email: 1, createdAt: -1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ houseId: 1 });

module.exports =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
