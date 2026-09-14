const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },

    bookingId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    payerName: {
      type: String,
      required: true,
      trim: true,
    },

    payerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    payerPhone: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      default: "RWF",
      uppercase: true,
      trim: true,
    },

    provider: {
      type: String,
      enum: ["kpay", "bank", "cash"],
      default: "kpay",
    },

    referenceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    transactionId: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "successful", "failed", "cancelled", "expired"],
      default: "pending",
    },

    reason: {
      type: String,
      default: "",
      trim: true,
    },

    initiatedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

PaymentSchema.index({ booking: 1, createdAt: -1 });
PaymentSchema.index({ payerPhone: 1 });

module.exports =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
