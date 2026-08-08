const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req) => {
  try {
    let token;

    // ===========================
    // GET TOKEN
    // ===========================

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Not authorized. Please login.",
      };
    }

    // ===========================
    // VERIFY TOKEN
    // ===========================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ===========================
    // FIND USER
    // ===========================

    const user = await User.findById(decoded.id);

    if (!user) {
      return {
        success: false,
        status: 401,
        message: "User no longer exists.",
      };
    }

    // ===========================
    // CHECK ACTIVE ACCOUNT
    // ===========================

    if (!user.isActive) {
      return {
        success: false,
        status: 403,
        message: "Your account has been deactivated.",
      };
    }

    // ===========================
    // RETURN USER
    // ===========================

    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
  } catch (error) {
    console.error(
      "AUTHENTICATION ERROR:",
      error.message
    );

    if (error.name === "TokenExpiredError") {
      return {
        success: false,
        status: 401,
        message: "Token has expired. Please login again.",
      };
    }

    if (error.name === "JsonWebTokenError") {
      return {
        success: false,
        status: 401,
        message: "Invalid authentication token.",
      };
    }

    return {
      success: false,
      status: 401,
      message: "Authentication failed.",
    };
  }
};

module.exports = {
  authenticateUser,
};