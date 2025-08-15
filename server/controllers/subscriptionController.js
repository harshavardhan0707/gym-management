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
            orderBy: { id: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        rollNumber: true
                    }
                },
                plan: {
                    select: {
                        id: true,
                        name: true,
                        duration: true
                    }
                }
            }
        }),
        prisma.subscriptions.count()
    ]);

    res.json({ subscriptions, total });
});

// Create a new subscription
const createSubscription = asyncHandler(async (req, res) => {
    const { userId, planId, startDate, endDate, paymentStatus } = req.body;
    
    // Log the incoming data for debugging
    console.log('Creating subscription with data:', { userId, planId, startDate, endDate, paymentStatus });
    
    if (!paymentStatus || typeof paymentStatus !== 'string') {
        return res.status(400).json({ error: 'paymentStatus is required and must be a string.' });
    }
    
    // Validate that user exists
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    
    if (!user) {
        return res.status(400).json({ error: 'User not found with the provided userId.' });
    }
    
    // Validate that plan exists
    const plan = await prisma.plan.findUnique({
        where: { id: planId }
    });
    
    if (!plan) {
        return res.status(400).json({ error: 'Plan not found with the provided planId.' });
    }
    
    try {
        const newSubscription = await prisma.subscriptions.create({
            data: {
                userId,
                planId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                paymentStatus
            }
        });
        
        console.log('Subscription created successfully:', newSubscription);
        res.status(201).json(newSubscription);
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ error: 'Failed to create subscription. Please try again.' });
    }
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
    const { userId, planId, startDate, endDate, paymentStatus } = req.body;
    if (paymentStatus && typeof paymentStatus !== 'string') {
        return res.status(400).json({ error: 'paymentStatus must be a string.' });
    }
    const updatedSubscription = await prisma.subscriptions.update({
        where: { id: parseInt(id) },
        data: {
            userId,
            planId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            paymentStatus
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

// Check subscription by roll number
const checkSubscription = asyncHandler(async (req, res) => {
    const { roll } = req.query;
    
    if (!roll) {
        return res.status(400).json({ error: 'Roll number is required' });
    }

    // Find user by roll number
    const user = await prisma.user.findUnique({
        where: { rollNumber: roll },
        include: {
            subscriptions: {
                include: {
                    plan: true
                },
                orderBy: {
                    endDate: 'desc'
                },
                take: 1
            }
        }
    });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    if (!user.subscriptions || user.subscriptions.length === 0) {
        return res.status(404).json({ error: 'No subscription found for this user' });
    }

    const subscription = user.subscriptions[0];
    const currentDate = new Date();
    const endDate = new Date(subscription.endDate);
    
    let status = 'active';
    if (endDate < currentDate) {
        status = 'expired';
    } else if ((endDate - currentDate) / (1000 * 60 * 60 * 24) <= 7) {
        status = 'expiring_soon';
    }

    res.json({
        user: {
            name: user.name,
            rollNumber: user.rollNumber,
            email: user.email
        },
        subscription: {
            ...subscription,
            status
        }
    });
});

module.exports = {
    getAllSubscriptions,
    createSubscription,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription,
    getSubscriptionsByUser,
    getSubscriptionsByPlan,
    checkSubscription,
    handleValidationErrors
};
