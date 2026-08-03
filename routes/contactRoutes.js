const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');

// Validation rules
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
    .escape()
];

// Public Routes
router.post('/', contactValidation, contactController.submitContact);

// Admin Routes
router.get('/', contactController.getAllContacts);
router.put('/:id', contactValidation, contactController.editContact);
router.get('/statistics', contactController.getStatistics);
router.get('/:email', contactController.getContactsByEmail);
router.get('/:id', contactController.getContactById);
router.put('/:id/status', contactController.updateContactStatus);
router.put('/:id/reply', contactController.replyToContact);
router.delete('/:id', contactController.deleteContact);
router.post('/bulk-delete', contactController.bulkDeleteContacts);
router.get('/export/csv', contactController.exportContacts);

module.exports = router;