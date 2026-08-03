const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    university: {
      type: String,
      required: [true, "University is required"],
      trim: true,
      minlength: [2, "University must be at least 2 characters"],
      maxlength: [200, "University cannot exceed 200 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      minlength: [2, "Location must be at least 2 characters"],
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [20, "Content must be at least 20 characters"],
      maxlength: [1000, "Content cannot exceed 1000 characters"],
    },
    houseName: {
      type: String,
      required: [true, "House name is required"],
      trim: true,
      minlength: [2, "House name must be at least 2 characters"],
      maxlength: [200, "House name cannot exceed 200 characters"],
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better performance
testimonialSchema.index({ rating: -1, createdAt: -1 });
testimonialSchema.index({ university: 1, createdAt: -1 });
testimonialSchema.index({ location: 1, createdAt: -1 });
testimonialSchema.index({ status: 1, createdAt: -1 });

// Static method to get statistics
testimonialSchema.statics.getStatistics = async function () {
  const stats = await this.aggregate([
    {
      $match: { status: "approved" },
    },
    {
      $facet: {
        total: [{ $count: "count" }],
        averageRating: [{ $group: { _id: null, avg: { $avg: "$rating" } } }],
        byRating: [
          { $group: { _id: "$rating", count: { $sum: 1 } } },
          { $sort: { _id: -1 } },
        ],
        byUniversity: [
          { $group: { _id: "$university", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ],
        byLocation: [
          { $group: { _id: "$location", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ],
      },
    },
  ]);

  const result = stats[0];
  return {
    total: result.total[0]?.count || 0,
    averageRating: result.averageRating[0]?.avg || 0,
    byRating: result.byRating,
    byUniversity: result.byUniversity,
    byLocation: result.byLocation,
  };
};

module.exports = mongoose.model("Testimonial", testimonialSchema);
