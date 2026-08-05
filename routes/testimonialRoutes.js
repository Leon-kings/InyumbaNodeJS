const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const testimonialController = require('../controllers/testimonialController');
const { upload } = require('../cloudinary/cloudinary');

// Validation rules
const testimonialValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(),
  body('university')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('University must be between 2 and 200 characters')
    .escape(),
  body('location')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters')
    .escape(),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters')
    .escape(),
  body('content')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Content must be between 20 and 1000 characters')
    .escape(),
  body('houseName')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('House name must be between 2 and 200 characters')
    .escape(),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
];

// Public Routes
router.post(
  '/',
  upload.single('image'),
  testimonialValidation,
  testimonialController.submitTestimonial
);

// Get featured testimonials (public)
router.get('/featured', testimonialController.getFeaturedTestimonials);

// Get top rated testimonials (public)
router.get('/top-rated', testimonialController.getTopRated);

// Get recent testimonials (public)
router.get('/recent', testimonialController.getRecentTestimonials);

// Get testimonials by university (public)
router.get('/university/:university', testimonialController.getTestimonialsByUniversity);

// Get testimonial statistics (public)
router.get('/statistics', testimonialController.getTestimonialStatistics);

// Get all testimonials (public with filters)
router.get('/', testimonialController.getAllTestimonials);

// Admin Routes
// With admin=true query
router.get('/:id', testimonialController.getTestimonialById);
router.patch('/:id/status', testimonialController.updateTestimonialStatus);
router.put('/:id/featured', testimonialController.toggleFeatured);
router.put(
  '/:id',
  upload.single('image'),
  testimonialValidation,
  testimonialController.updateTestimonial
);
router.delete('/:id', testimonialController.deleteTestimonial);

module.exports = router;