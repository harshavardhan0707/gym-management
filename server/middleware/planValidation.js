const { body, param } = require('express-validator');

// Plan validation middleware
const validatePlan = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Plan name must be 2-100 characters'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be up to 500 characters')
];

const validatePlanUpdate = [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('duration').optional().isInt({ min: 1 }),
    body('price').optional().isFloat({ min: 0 }),
    body('description').optional().trim().isLength({ max: 500 })
];

const validatePlanId = [
    param('id').trim().isLength({ min: 1 }).withMessage('Invalid plan ID')
];

module.exports = {
    validatePlan,
    validatePlanUpdate,
    validatePlanId
};
