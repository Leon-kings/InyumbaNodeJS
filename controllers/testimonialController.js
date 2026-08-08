
const Testimonial = require('../models/Testimonial');
const { cloudinary } = require('../cloudinary/cloudinary');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

// ===================== EMAIL SERVICE CONFIGURATION =====================
let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
 const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  family: 4,

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

  transporter.verify((error, success) => {
    if (error) {
      console.error(
        "❌ Email transporter verification failed:",
        error.message
      );
    } else {
      console.log("✅ Email transporter is ready to send messages");
    }
  });
} else {
  console.warn(
    "⚠️ Email credentials not configured. Email notifications will be disabled."
  );
}

// ===================== EMAIL FUNCTIONS =====================

const sendTestimonialEmailToAdmin = async ({ name, university, location, rating, title, content, houseName }) => {
  try {
    // Check if transporter is initialized
    if (!transporter) {
      console.log('ℹ️ Email service not configured - skipping admin email');
      return null;
    }

    // Check if email credentials are valid
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ Email credentials not configured properly');
      return null;
    }

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    
    const mailOptions = {
      from: `"INYUMBA PROJECT" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Testimonial Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #FF385C 0%, #D70466 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; }
            .rating { color: #FF385C; font-size: 24px; }
            .field { margin-bottom: 15px; }
            .field-label { font-weight: bold; color: #555; }
            .field-value { background: #f1f3f5; padding: 15px; border-radius: 5px; border-left: 4px solid #FF385C; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">⭐ New Testimonial Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">👤 Name</div>
                <div class="field-value">${name}</div>
              </div>
              <div class="field">
                <div class="field-label">🏫 University</div>
                <div class="field-value">${university}</div>
              </div>
              <div class="field">
                <div class="field-label">📍 Location</div>
                <div class="field-value">${location}</div>
              </div>
              <div class="field">
                <div class="field-label">⭐ Rating</div>
                <div class="field-value">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)</div>
              </div>
              <div class="field">
                <div class="field-label">🏠 House Name</div>
                <div class="field-value">${houseName}</div>
              </div>
              <div class="field">
                <div class="field-label">📝 Title</div>
                <div class="field-value">${title}</div>
              </div>
              <div class="field">
                <div class="field-label">💬 Testimonial</div>
                <div class="field-value">${content.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>Please review and approve this testimonial in the admin panel.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Testimonial admin email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending testimonial admin email:', error.message);
    // Don't throw error, just return null to avoid breaking the flow
    return null;
  }
};

const sendTestimonialEmailToUser = async ({ name, email }) => {
  try {
    // Check if transporter is initialized
    if (!transporter) {
      console.log('ℹ️ Email service not configured - skipping user email');
      return null;
    }

    // Check if email is provided and credentials are valid
    if (!email || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('ℹ️ Skipping user email - no email provided or credentials missing');
      return null;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('ℹ️ Skipping user email - invalid email format');
      return null;
    }

    const mailOptions = {
      from: `"INYUMBA PROJECT" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thank You for Your Testimonial',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #FF385C 0%, #D70466 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🙏 Thank You for Your Testimonial</h2>
            </div>
            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              <p>Thank you for sharing your experience with us! Your testimonial has been submitted and is pending review by our team.</p>
              <p>We will notify you once your testimonial is approved and published on our platform.</p>
              <p>Your feedback helps other students find the perfect accommodation.</p>
              <p style="margin-top: 20px;">Best regards,<br><strong>INYUMBA PROJECT Team</strong></p>
            </div>
            <div class="footer">
              <p>This is a confirmation email for your testimonial submission.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Testimonial user email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending testimonial user email:', error.message);
    // Don't throw error, just return null to avoid breaking the flow
    return null;
  }
};

// ===================== CONTROLLER FUNCTIONS =====================

// 1. Submit Testimonial
exports.submitTestimonial = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there's an uploaded image, delete it from Cloudinary
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => ({
          field: e.path,
          message: e.msg
        }))
      });
    }

    const { name, university, location, rating, title, content, houseName, email } = req.body;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    // Create testimonial
    const testimonial = new Testimonial({
      name,
      university,
      location,
      rating: parseInt(rating),
      title,
      content,
      houseName,
      email: email || '',
      image: {
        public_id: req.file.filename,
        url: req.file.path,
        secure_url: req.file.path
      },
      verified: false,
      status: 'pending'
    });

    await testimonial.save();

    // Send emails asynchronously (don't await to avoid blocking response)
    // This will run in the background
    setImmediate(async () => {
      try {
        // Send admin email
        const adminResult = await sendTestimonialEmailToAdmin({ 
          name, university, location, rating, title, content, houseName 
        });
        
        // Send user email if provided
        if (email) {
          await sendTestimonialEmailToUser({ name, email });
        }

        if (adminResult) {
          console.log('✅ Admin email processed successfully');
        }
      } catch (err) {
        console.error('❌ Background email processing error:', err.message);
      }
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully',
      data: {
        id: testimonial._id,
        name: testimonial.name,
        university: testimonial.university,
        rating: testimonial.rating,
        status: testimonial.status,
        image: testimonial.image.secure_url
      }
    });

  } catch (error) {
    console.error('Submit testimonial error:', error);
    // If there's an uploaded image, delete it from Cloudinary
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to submit testimonial'
    });
  }
};

// 2. Get All Testimonials (with filters)
exports.getAllTestimonials = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 20, 1);
    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
      Testimonial.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Testimonial.countDocuments({})
    ]);

    res.status(200).json({
      success: true,
      data: testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Get all testimonials error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
      error: error.message
    });
  }
};
// 3. Get Testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });

  } catch (error) {
    console.error('Get testimonial by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonial'
    });
  }
};

// 4. Get Testimonials by University
exports.getTestimonialsByUniversity = async (req, res) => {
  try {
    const university = req.params.university;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
      Testimonial.find({ 
        university: { $regex: university, $options: 'i' },
        status: 'approved'
      })
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Testimonial.countDocuments({ 
        university: { $regex: university, $options: 'i' },
        status: 'approved'
      })
    ]);

    res.status(200).json({
      success: true,
      data: testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get testimonials by university error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials'
    });
  }
};

// 5. Get Featured Testimonials
exports.getFeaturedTestimonials = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const testimonials = await Testimonial.find({
      featured: true,
      status: 'approved'
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: testimonials
    });

  } catch (error) {
    console.error('Get featured testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured testimonials'
    });
  }
};

// 6. Update Testimonial Status (Approve/Reject)
exports.updateTestimonialStatus = async (req, res) => {
  try {
    const { status, verified } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    if (status) testimonial.status = status;
    if (verified !== undefined) testimonial.verified = verified;

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });

  } catch (error) {
    console.error('Update testimonial status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial'
    });
  }
};

// 7. Toggle Featured Status
exports.toggleFeatured = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    testimonial.featured = !testimonial.featured;
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: `Testimonial ${testimonial.featured ? 'featured' : 'unfeatured'} successfully`,
      data: testimonial
    });

  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle featured status'
    });
  }
};

// 8. Delete Testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(testimonial.image.public_id);

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });

  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial'
    });
  }
};

// 9. Update Testimonial (with image update)
exports.updateTestimonial = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    const { name, university, location, rating, title, content, houseName } = req.body;

    // Update fields
    if (name) testimonial.name = name;
    if (university) testimonial.university = university;
    if (location) testimonial.location = location;
    if (rating) testimonial.rating = parseInt(rating);
    if (title) testimonial.title = title;
    if (content) testimonial.content = content;
    if (houseName) testimonial.houseName = houseName;

    // Update image if new one uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(testimonial.image.public_id);
      
      testimonial.image = {
        public_id: req.file.filename,
        url: req.file.path,
        secure_url: req.file.path
      };
    }

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });

  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial'
    });
  }
};

// 10. Get Testimonial Statistics
exports.getTestimonialStatistics = async (req, res) => {
  try {
    const stats = await Testimonial.getStatistics();
    
    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get testimonial statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics'
    });
  }
};

// 11. Get Top Rated Testimonials
exports.getTopRated = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const testimonials = await Testimonial.find({
      status: 'approved'
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: testimonials
    });

  } catch (error) {
    console.error('Get top rated testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top rated testimonials'
    });
  }
};

// 12. Get Recent Testimonials
exports.getRecentTestimonials = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const testimonials = await Testimonial.find({
      status: 'approved'
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: testimonials
    });

  } catch (error) {
    console.error('Get recent testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent testimonials'
    });
  }
};