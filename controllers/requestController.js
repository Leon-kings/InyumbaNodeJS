const Request = require("../models/Request");
const Notification = require("../models/Notification");

const cloudinary = require("cloudinary").v2;

const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const nodemailer = require("nodemailer");

// =======================
// CLOUDINARY CONFIG
// =======================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =======================
// MULTER CONFIG
// =======================

const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "requests",

    allowed_formats: ["jpg", "jpeg", "png", "webp"],

    transformation: [
      {
        width: 800,
        height: 800,
        crop: "limit",
      },
    ],
  },
});

const upload = multer({
  storage,
});

// =======================
// MAIL CONFIG
// =======================

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,

  port: process.env.EMAIL_PORT,

  secure: false,

  auth: {
    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASSWORD,
  },
});

// =======================
// CREATE REQUEST
// =======================

exports.createRequest = async (req, res) => {
  try {
    const {
      name,

      email,

      message,

      language,
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,

        message: "All fields are required",
      });
    }

    let image = {};

    if (req.file) {
      image = {
        public_id: req.file.filename,

        url: req.file.path,

        format: req.file.format,
      };
    }

    const request = await Request.create({
      name,

      email,

      message,

      language,

      image,
    });

    // =======================
    // ADMIN NOTIFICATION
    // =======================

    const adminNotification = await Notification.create({
      type: "request_created",

      requestId: request._id,

      requestName: name,

      requestEmail: email,

      message: `New request received from ${name}`,

      targetRoles: ["admin"],

      priority: "high",

      metadata: {
        requestMessage: message,

        requestImage: image.url || null,
      },
    });

    // =======================
    // USER NOTIFICATION
    // =======================

    const userNotification = await Notification.create({
      type: "request_created",

      requestId: request._id,

      requestName: name,

      requestEmail: email,

      message: "Your request has been submitted successfully",

      targetRoles: ["user"],

      targetUserEmail: email,

      priority: "normal",
    });

    // Attach notification history

    request.notificationId = adminNotification._id;

    request.notifications.push(
      {
        notificationId: adminNotification._id,

        type: adminNotification.type,

        message: adminNotification.message,

        targetRoles: adminNotification.targetRoles,
      },

      {
        notificationId: userNotification._id,

        type: userNotification.type,

        message: userNotification.message,

        targetRoles: userNotification.targetRoles,
      },
    );

    request.lastNotification = {
      type: userNotification.type,

      message: userNotification.message,

      status: "new",

      createdAt: new Date(),
    };

    await request.save();

    // =======================
    // EMAIL TO ADMIN
    // =======================

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: process.env.EMAIL_USER,

      subject: "New Request Received",

      html: `


<h2>New Request</h2>


<p>
<b>Name:</b>${name}
</p>


<p>
<b>Email:</b>${email}
</p>


<p>
<b>Language:</b>${language}
</p>


<p>
<b>Message:</b>${message}
</p>



${
  image.url
    ? `

<img 
src="${image.url}" 
width="300"
/>

`
    : ""
}



`,
    });

    res.status(201).json({
      success: true,

      message: "Request created successfully",

      data: request,
    });
  } catch (error) {
    console.log("CREATE REQUEST ERROR", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =======================
// GET ALL REQUESTS
// =======================

exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find()

      .populate("notificationId")

      .populate("notifications.notificationId")

      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,

      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =======================
// GET SINGLE REQUEST
// =======================

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)

      .populate("notificationId")

      .populate("notifications.notificationId");

    if (!request) {
      return res.status(404).json({
        success: false,

        message: "Request not found",
      });
    }

    res.json({
      success: true,

      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =======================
// UPDATE REQUEST
// =======================

exports.updateRequest = async (req, res) => {
  try {
    const oldRequest = await Request.findById(req.params.id);

    if (!oldRequest) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,

      req.body,

      {
        new: true,
      },
    );

    // Status changed

    if (req.body.status && req.body.status !== oldRequest.status) {
      const notification = await Notification.create({
        type: "request_status_changed",

        requestId: updatedRequest._id,

        requestName: updatedRequest.name,

        requestEmail: updatedRequest.email,

        message: `Your request status changed to ${updatedRequest.status}`,

        targetRoles: ["user"],

        targetUserEmail: updatedRequest.email,

        priority: "high",

        metadata: {
          oldStatus: oldRequest.status,

          newStatus: updatedRequest.status,
        },
      });

      updatedRequest.notifications.push({
        notificationId: notification._id,

        type: notification.type,

        message: notification.message,

        targetRoles: notification.targetRoles,
      });

      updatedRequest.lastNotification = {
        type: notification.type,

        message: notification.message,

        status: "new",

        createdAt: new Date(),
      };

      await updatedRequest.save();
    }

    res.json({
      success: true,

      message: "Request updated",

      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =======================
// DELETE REQUEST
// =======================

exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.image?.public_id) {
      await cloudinary.uploader.destroy(request.image.public_id);
    }

    await Notification.create({
      type: "request_deleted",

      requestId: request._id,

      requestName: request.name,

      requestEmail: request.email,

      message: `Request from ${request.name} was deleted`,

      targetRoles: ["admin"],

      priority: "normal",
    });

    await Request.findByIdAndDelete(req.params.id);

    res.json({
      success: true,

      message: "Request deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports.upload = upload;
