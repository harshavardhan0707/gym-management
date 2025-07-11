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

// Get all plans with pagination
const getAllPlans = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [plans, total] = await Promise.all([
        prisma.plan.findMany({
            skip,
            take: limit,
            orderBy: { id: 'asc' }
        }),
        prisma.plan.count()
    ]);

    res.json({ plans, total, page, limit });
});

// Create a new plan
const createPlan = asyncHandler(async (req, res) => {
    const { name, duration, price, description } = req.body;

    const newPlan = await prisma.plan.create({
        data: {
            name,
            duration,
            price,
            description
        }
    });

    res.status(201).json(newPlan);
});

// Get a plan by ID
const getPlanById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const plan = await prisma.plan.findUnique({
        where: { id }
    });
    if (!plan) {
        return res.status(404).json({ error: 'Plan not found' });
    }
    res.json(plan);
});

// Update a plan by ID
const updatePlan = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, duration, price, description } = req.body;

    const updatedPlan = await prisma.plan.update({
        where: { id },
        data: {
            name,
            duration,
            price,
            description
        }
    });

    res.json(updatedPlan);
});

// Delete a plan by ID
const deletePlan = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const plan = await prisma.plan.findUnique({
        where: { id }
    });
    if (!plan) {
        return res.status(404).json({ error: 'Plan not found' });
    }
    await prisma.plan.delete({
        where: { id }
    });
    res.status(204).send();
});

module.exports = {
    getAllPlans,
    createPlan,
    getPlanById,
    updatePlan,
    deletePlan,
    handleValidationErrors
};
