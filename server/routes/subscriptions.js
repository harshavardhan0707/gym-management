const express = require('express');
const auth = require('../middleware/auth');
const {
    validateSubscriptions,
    validateSubscriptionsUpdate,
    validateSubscriptionsId,
    validateUserId,
    validatePlanId
} = require('../middleware/subscriptionValidation');
const {
    getAllSubscriptions,
    createSubscription,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription,
    getSubscriptionsByUser,
    getSubscriptionsByPlan,
    checkSubscription, // Add this import
    handleValidationErrors
} = require('../controllers/subscriptionController');

const router = express.Router();

// Make /check public
router.get('/check', checkSubscription); // Public route

// Apply authentication to all other routes
router.use(auth);

// Routes
router.get('/', getAllSubscriptions);
router.post('/', validateSubscriptions, handleValidationErrors, createSubscription);
router.get('/:id', validateSubscriptionsId, handleValidationErrors, getSubscriptionById);
router.put('/:id', validateSubscriptionsId, validateSubscriptionsUpdate, handleValidationErrors, updateSubscription);
router.delete('/:id', validateSubscriptionsId, handleValidationErrors, deleteSubscription);
router.get('/user/:userId', validateUserId, handleValidationErrors, getSubscriptionsByUser);
router.get('/plan/:planId', validatePlanId, handleValidationErrors, getSubscriptionsByPlan);

module.exports = router;