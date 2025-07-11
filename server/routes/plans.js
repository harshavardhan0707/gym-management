const express = require('express');
const auth = require('../middleware/auth');
const {
    validatePlan,
    validatePlanUpdate,
    validatePlanId
} = require('../middleware/planValidation');
const {
    getAllPlans,
    createPlan,
    getPlanById,
    updatePlan,
    deletePlan,
    handleValidationErrors
} = require('../controllers/planController');

const router = express.Router();

// Apply authentication to all routes
router.use(auth);

// Routes
router.get('/', getAllPlans);
router.post('/', validatePlan, handleValidationErrors, createPlan);
router.get('/:id', validatePlanId, handleValidationErrors, getPlanById);
router.put('/:id', validatePlanId, validatePlanUpdate, handleValidationErrors, updatePlan);
router.delete('/:id', validatePlanId, handleValidationErrors, deletePlan);

module.exports = router;