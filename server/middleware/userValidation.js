const { body, param } = require('express-validator');

// User validation middleware
const validateUser = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('phone').isMobilePhone().withMessage('Invalid phone number format'),
    body('rollNumber').trim().isLength({ min: 1, max: 20 }).withMessage('Roll number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('role').optional().isIn(['user', 'admin', 'trainer']).withMessage('Role must be user, admin, or trainer')
];

const validateUserUpdate = [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().isMobilePhone(),
    body('rollNumber').optional().trim().isLength({ min: 1, max: 20 }),
    body('password').optional().isLength({ min: 6 }),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('role').optional().isIn(['user', 'admin', 'trainer']).withMessage('Role must be user, admin, or trainer')
];

const validateRollNumber = [
    param('id').trim().isLength({ min: 1 }).withMessage('Invalid roll number')
];

module.exports = {
    validateUser,
    validateUserUpdate,
    validateRollNumber
};
