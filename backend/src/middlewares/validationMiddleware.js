const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// User validation rules
const userValidation = {
  register: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('role').isIn(['student', 'tutor']).withMessage('Role must be student or tutor')
  ],
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  updateProfile: [
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('phoneNumber').optional().isMobilePhone().withMessage('Valid phone number is required')
  ]
};

// Request validation rules
const requestValidation = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('serviceTypeId').optional().isUUID(),
    body('moduleId').optional().isUUID(),
    body('deadline').optional().isISO8601(),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
  ],
  assign: [
    body('tutorId').isUUID().withMessage('Valid tutor ID is required')
  ],
  submitWork: [
    body('fileUrl').isURL().withMessage('Valid file URL is required'),
    body('notes').optional().trim()
  ]
};

// Booking validation rules
const bookingValidation = {
  create: [
    body('tutorId').isUUID().withMessage('Valid tutor ID is required'),
    body('scheduledDate').isISO8601().withMessage('Valid date is required'),
    body('duration').isInt({ min: 30, max: 180 }).withMessage('Duration must be between 30 and 180 minutes')
  ]
};

module.exports = { validate, userValidation, requestValidation, bookingValidation };