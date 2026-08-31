const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    // ===========================
    // USER OWNERSHIP
    // ===========================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // ===========================
    // CONTACT INFORMATION
    // ===========================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    // ===========================
    // STATUS
    // ===========================

    status: {
      type: String,
      enum: ["pending", "read", "replied", "archived"],
      default: "pending",
    },

    // ===========================
    // REQUEST INFORMATION
    // ===========================

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    // ===========================
    // REPLY INFORMATION
    // ===========================

    repliedAt: {
      type: Date,
      default: null,
    },

    readAt: {
      type: Date,
      default: null,
    },

    replyMessage: {
      type: String,
      trim: true,
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

// ===========================
// VIRTUALS
// ===========================

contactSchema.virtual("contactWithStatus").get(function () {
  return `${this.name} (${this.status})`;
});

contactSchema.virtual("notificationMessage").get(function () {
  const statusMessages = {
    pending: `📩 New contact from ${this.name} (${this.email})`,
    read: `👀 Contact from ${this.name} has been read`,
    replied: `✅ Reply sent to ${this.name} (${this.email})`,
    archived: `📦 Contact from ${this.name} has been archived`,
  };

  return statusMessages[this.status] || `📩 New contact from ${this.name}`;
});

contactSchema.virtual("messagePreview").get(function () {
  return this.message.length > 100
    ? this.message.substring(0, 100) + "..."
    : this.message;
});

contactSchema.virtual("responseTime").get(function () {
  if (!this.repliedAt) return null;

  const diff = this.repliedAt - this.createdAt;

  const hours = Math.floor(diff / (1000 * 60 * 60));

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

// ===========================
// INDEXES
// ===========================

contactSchema.index({
  userId: 1,
  createdAt: -1,
});

contactSchema.index({
  email: 1,
  createdAt: -1,
});

contactSchema.index({
  status: 1,
  createdAt: -1,
});

contactSchema.index({
  createdAt: -1,
});

contactSchema.index({
  name: "text",
  email: "text",
  message: "text",
});

// ===========================
// STATIC METHODS
// ===========================

contactSchema.statics.getStatistics = async function () {
  const total = await this.countDocuments();

  const pending = await this.countDocuments({
    status: "pending",
  });

  const read = await this.countDocuments({
    status: "read",
  });

  const replied = await this.countDocuments({
    status: "replied",
  });

  const archived = await this.countDocuments({
    status: "archived",
  });

  const recent = await this.find()
    .sort({
      createdAt: -1,
    })
    .limit(5);

  return {
    total,
    pending,
    read,
    replied,
    archived,
    recent,
  };
};

// ===========================
// INSTANCE METHODS
// ===========================

contactSchema.methods.getAdminNotification = function () {
  return {
    type: "contact_created",

    contactId: this._id,

    userId: this.userId,

    name: this.name,

    email: this.email,

    message: this.message,

    status: this.status,

    createdAt: this.createdAt,

    notificationMessage: `📩 New contact message from ${this.name}`,

    priority: this.status === "pending" ? "high" : "normal",
  };
};

contactSchema.methods.getUserNotification = function () {
  return {
    type: "contact_replied",

    contactId: this._id,

    userId: this.userId,

    replyMessage: this.replyMessage,

    repliedAt: this.repliedAt,

    notificationMessage: "✅ Your message has been replied to",
  };
};

contactSchema.methods.markAsRead = function () {
  if (this.status === "pending") {
    this.status = "read";
    this.readAt = new Date();
  }

  return this;
};

contactSchema.methods.markAsReplied = function (replyMessage) {
  this.status = "replied";

  this.replyMessage = replyMessage;

  this.repliedAt = new Date();

  return this;
};

contactSchema.methods.getResponseTimeHours = function () {
  if (!this.repliedAt) return null;

  const diff = this.repliedAt - this.createdAt;

  return (diff / (1000 * 60 * 60)).toFixed(1);
};

// ===========================
// QUERY HELPERS
// ===========================

contactSchema.query.pending = function () {
  return this.where("status").equals("pending");
};

contactSchema.query.unread = function () {
  return this.where("status").in(["pending", "read"]);
};

contactSchema.query.byEmail = function (email) {
  return this.where("email").regex(new RegExp(email, "i"));
};

// ===========================
// PRE SAVE MIDDLEWARE
// ===========================

contactSchema.pre("save", async function () {
  if (this.isModified("status")) {
    if (this.status === "read" && !this.readAt) {
      this.readAt = new Date();
    }

    if (this.status === "replied" && !this.repliedAt) {
      this.repliedAt = new Date();
    }
  }
});

// ===========================
// POST SAVE
// ===========================

contactSchema.post("save", async function (doc) {
  if (doc.isNew) {
    console.log(`📩 New contact saved: ${doc.name} (${doc.email})`);
  }
});

// ===========================
// EXPORT MODEL
// ===========================

module.exports =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);
