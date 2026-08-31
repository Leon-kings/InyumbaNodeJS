const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ===========================
    // USER INFORMATION
    // ===========================
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: false,
      trim: true,
      match: [/^\+?[0-9]{7,15}$/, "Please provide a valid phone number"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    // ===========================
    // ACCOUNT STATUS
    // ===========================
    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "host", "manager"],
      default: "user",
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    // ===========================
    // EMAIL VERIFICATION
    // ===========================
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationCode: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    // ===========================
    // PASSWORD RESET
    // ===========================
    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },

    // ===========================
    // USER STATISTICS
    // ===========================
    statistics: {
      totalIncome: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalExpenses: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalSavings: {
        type: Number,
        default: 0,
        min: 0,
      },

      monthlyIncome: {
        type: Number,
        default: 0,
        min: 0,
      },

      monthlyExpenses: {
        type: Number,
        default: 0,
        min: 0,
      },

      monthlyBudget: {
        type: Number,
        default: 0,
        min: 0,
      },

      membersCount: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  },
  {
    timestamps: true,
  }
);


// ===========================
// INDEXES
// ===========================

userSchema.index({
  emailVerificationCode: 1,
  emailVerificationExpires: 1,
});

userSchema.index({
  resetPasswordToken: 1,
  resetPasswordExpires: 1,
});


// ===========================
// REMOVE PRIVATE DATA
// ===========================

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.emailVerificationCode;
    delete ret.emailVerificationExpires;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.__v;

    return ret;
  },
});


// ===========================
// VIRTUAL CONFIRM PASSWORD
// ===========================

userSchema.virtual("confirmPassword")
.set(function(value) {
  this._confirmPassword = value;
})
.get(function() {
  return this._confirmPassword;
});


// ===========================
// PASSWORD VALIDATION
// NO next()
// ===========================

userSchema.pre("validate", function () {

  if (
    this.isModified("password") &&
    this._confirmPassword &&
    this.password !== this._confirmPassword
  ) {
    this.invalidate(
      "confirmPassword",
      "Passwords do not match"
    );
  }

});


// ===========================
// METHODS
// ===========================

userSchema.methods.isVerificationCodeExpired = function () {

  if (!this.emailVerificationExpires) {
    return true;
  }

  return Date.now() > this.emailVerificationExpires.getTime();

};


userSchema.methods.isResetTokenExpired = function () {

  if (!this.resetPasswordExpires) {
    return true;
  }

  return Date.now() > this.resetPasswordExpires.getTime();

};


userSchema.methods.generateVerificationCode = function () {

  const crypto = require("crypto");

  const code = crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase();

  this.emailVerificationCode = code;

  this.emailVerificationExpires =
    new Date(Date.now() + 24 * 60 * 60 * 1000);

  return code;

};


// ===========================
// STATIC METHODS
// ===========================

userSchema.statics.findByVerificationCode = function(email, code){

  return this.findOne({
    email,
    emailVerificationCode: code,
    emailVerificationExpires:{
      $gt:new Date()
    }
  });

};


userSchema.statics.findByResetToken = function(token){

  return this.findOne({
    resetPasswordToken: token,
    resetPasswordExpires:{
      $gt:new Date()
    }
  });

};


// ===========================
// EXPORT MODEL
// ===========================

module.exports =
mongoose.models.User ||
mongoose.model("User", userSchema);