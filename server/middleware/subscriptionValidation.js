const { body, param } = require('express-validator');

// Subscription validation middleware
const validateSubscriptions = [
    body('userId').isInt().withMessage('User ID must be an integer'),
    body('planId').isInt().withMessage('Plan ID must be an integer'),
    body('startDate').isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').isISO8601().withMessage('End date must be a valid date'),
    body('paymentStatus').isIn(['paid', 'unpaid', 'active', 'inactive', 'expired', 'expiring_soon']).withMessage('Payment status must be a valid status')
];

const validateSubscriptionsUpdate = [
    body('userId').optional().isInt(),
    body('planId').optional().isInt(),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    body('paymentStatus').optional().isIn(['paid', 'unpaid', 'active', 'inactive', 'expired', 'expiring_soon'])
];

const validateSubscriptionsId = [
    param('id').trim().isLength({ min: 1 }).withMessage('Invalid subscription ID')
];

const validateUserId = [
    param('userId').isInt().withMessage('User ID must be an integer')
];

const validatePlanId = [
    param('planId').isInt().withMessage('Plan ID must be an integer')
];

module.exports = {
    validateSubscriptions,
    validateSubscriptionsUpdate,
    validateSubscriptionsId,
    validateUserId,
    validatePlanId
};
