const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    // =================================================
    // USER INFORMATION
    // =================================================
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },

    // =================================================
    // QUESTION DETAILS
    // =================================================
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      minlength: [10, "Question must be at least 10 characters"],
    },
    category: {
      type: String,
      enum: ["general", "house", "booking", "payment", "technical", "other"],
      default: "general",
    },

    // =================================================
    // STATUS
    // =================================================
    status: {
      type: String,
      enum: ["pending", "answered", "replied", "archived"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },

    // =================================================
    // REPLY
    // =================================================
    replyMessage: {
      type: String,
      default: null,
    },
    repliedAt: {
      type: Date,
      default: null,
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // =================================================
    // METADATA
    // =================================================
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    readAt: {
      type: Date,
      default: null,
    },

    // =================================================
    // IS ACTIVE
    // =================================================
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// =================================================
// INDEXES
// =================================================
questionSchema.index({ email: 1, createdAt: -1 });
questionSchema.index({ status: 1, createdAt: -1 });
questionSchema.index({ category: 1, createdAt: -1 });
questionSchema.index({ userId: 1, createdAt: -1 });
questionSchema.index({ priority: 1, status: 1 });

// =================================================
// VIRTUALS
// =================================================
questionSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diff = Math.floor((now - this.createdAt) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return `${Math.floor(diff / 604800)} weeks ago`;
});

questionSchema.virtual("isAnswered").get(function () {
  return this.status === "answered" || this.status === "replied";
});

// =================================================
// STATIC METHODS
// =================================================
questionSchema.statics.getStatistics = async function () {
  const total = await this.countDocuments();
  const pending = await this.countDocuments({ status: "pending" });
  const answered = await this.countDocuments({ status: "answered" });
  const replied = await this.countDocuments({ status: "replied" });
  const archived = await this.countDocuments({ status: "archived" });

  const byCategory = await this.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const byPriority = await this.aggregate([
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayQuestions = await this.countDocuments({
    createdAt: { $gte: today },
  });

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekQuestions = await this.countDocuments({
    createdAt: { $gte: weekAgo },
  });

  return {
    total,
    pending,
    answered,
    replied,
    archived,
    byCategory,
    byPriority,
    todayQuestions,
    weekQuestions,
  };
};

// =================================================
// MODEL EXPORT
// =================================================
const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);

module.exports = Question;
