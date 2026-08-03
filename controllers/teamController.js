const TeamMember = require('../models/TeamMember');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'team-members',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 500, height: 500, crop: 'limit' },
      { quality: 'auto' }
    ]
  }
});

// Configure Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// ============ CONTROLLER FUNCTIONS ============

// 1. Create Team Member
exports.createTeamMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, role, bio, social } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    // Parse social links
    let socialObj = {};
    if (social) {
      try {
        socialObj = typeof social === 'string' ? JSON.parse(social) : social;
      } catch (e) {
        socialObj = {};
      }
    }

    const teamMember = new TeamMember({
      name,
      role,
      bio,
      image: {
        public_id: req.file.filename,
        url: req.file.path,
        secure_url: req.file.path
      },
      social: {
        linkedin: socialObj.linkedin || '#',
        twitter: socialObj.twitter || '#'
      }
    });

    await teamMember.save();

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: teamMember
    });

  } catch (error) {
    console.error('Create team member error:', error);
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create team member'
    });
  }
};

// 2. Get All Team Members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: teamMembers
    });

  } catch (error) {
    console.error('Get all team members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members'
    });
  }
};

// 3. Get Team Member by ID
exports.getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });

  } catch (error) {
    console.error('Get team member by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team member'
    });
  }
};

// 4. Update Team Member
exports.updateTeamMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const { name, role, bio, social } = req.body;

    if (name) teamMember.name = name;
    if (role) teamMember.role = role;
    if (bio) teamMember.bio = bio;

    if (social) {
      try {
        const socialObj = typeof social === 'string' ? JSON.parse(social) : social;
        teamMember.social = {
          linkedin: socialObj.linkedin || teamMember.social.linkedin || '#',
          twitter: socialObj.twitter || teamMember.social.twitter || '#'
        };
      } catch (e) {
        console.error('Social parse error:', e);
      }
    }

    if (req.file) {
      await cloudinary.uploader.destroy(teamMember.image.public_id);
      teamMember.image = {
        public_id: req.file.filename,
        url: req.file.path,
        secure_url: req.file.path
      };
    }

    await teamMember.save();

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: teamMember
    });

  } catch (error) {
    console.error('Update team member error:', error);
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update team member'
    });
  }
};

// 5. Delete Team Member
exports.deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    await cloudinary.uploader.destroy(teamMember.image.public_id);
    await teamMember.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully'
    });

  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team member'
    });
  }
};

// Export multer upload middleware
exports.upload = upload;