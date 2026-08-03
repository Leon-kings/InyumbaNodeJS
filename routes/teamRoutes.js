const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const teamController = require('../controllers/teamController');

// Validation rules
const teamMemberValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('bio').trim().notEmpty().withMessage('Bio is required')
];

// Routes
router.post(
  '/',
  teamController.upload.single('image'),
  teamMemberValidation,
  teamController.createTeamMember
);

router.get('/', teamController.getAllTeamMembers);
router.get('/:id', teamController.getTeamMemberById);

router.put(
  '/:id',
  teamController.upload.single('image'),
  teamMemberValidation,
  teamController.updateTeamMember
);

router.delete('/:id', teamController.deleteTeamMember);

module.exports = router;