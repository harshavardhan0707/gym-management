const { PrismaClient } = require('../generated/prisma');
const { validationResult } = require('express-validator');
const prisma = new PrismaClient();

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: errors.array() 
        });
    }
    next();
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all subscriptions with pagination
const getAllSubscriptions = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const [subscriptions, total] = await Promise.all([
        prisma.subscriptions.findMany({
            skip,
            take: limit,
            orderBy: { id: 'desc' }
        }),
        prisma.subscriptions.count()
    ]);

    res.json({ subscriptions, total });
});

// Create a new subscription
const createSubscription = asyncHandler(async (req, res) => {
    const { userId, planId, startDate, endDate, status } = req.body;

    const newSubscription = await prisma.subscriptions.create({
        data: {
            userId,
            planId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status
        }
    });

    res.status(201).json(newSubscription);
});

// Get a subscription by ID
const getSubscriptionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subscription = await prisma.subscriptions.findUnique({
        where: { id: parseInt(id) }
    });
    if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json(subscription);
});

// Update a subscription by ID
const updateSubscription = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId, planId, startDate, endDate, status } = req.body;
    const updatedSubscription = await prisma.subscriptions.update({
        where: { id: parseInt(id) },
        data: {
            userId,
            planId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            status
        }
    });
    res.json(updatedSubscription);
});

// Delete a subscription by ID
const deleteSubscription = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedSubscription = await prisma.subscriptions.delete({
        where: { id: parseInt(id) }
    });
    res.json(deletedSubscription);
});

// Get all subscriptions for a user
const getSubscriptionsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const subscriptions = await prisma.subscriptions.findMany({
        where: { userId: parseInt(userId) },
        include: {
            plan: true
        }
    });
    if (subscriptions.length === 0) {
        return res.status(404).json({ error: 'No subscriptions found for this user' });
    }
    res.json(subscriptions);
});

// Get all subscriptions for a plan
const getSubscriptionsByPlan = asyncHandler(async (req, res) => {
    const { planId } = req.params;
    const subscriptions = await prisma.subscriptions.findMany({
        where: { planId: parseInt(planId) },
        include: {
            user: true
        }
    });
    if (subscriptions.length === 0) {
        return res.status(404).json({ error: 'No subscriptions found for this plan' });
    }
    res.json(subscriptions);
});

module.exports = {
    getAllSubscriptions,
    createSubscription,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription,
    getSubscriptionsByUser,
    getSubscriptionsByPlan,
    handleValidationErrors
};
