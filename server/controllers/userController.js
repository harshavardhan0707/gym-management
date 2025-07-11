const bcrypt = require('bcryptjs');
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

// Get all users with pagination
const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                rollNumber: true,
                email: true,
                phone: true,
                subscriptions: true
            }
        }),
        prisma.user.count()
    ]);

    res.json({
        users,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

// Get a user by rollNumber
const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
        where: { rollNumber: id },
        select: {
            id: true,
            name: true,
            rollNumber: true,
            email: true,
            phone: true,
            subscriptions: {
                include: {
                    plan: true
                }
            }
        }
    });
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
});

// TODO: Implement user creation with subscription handling - If the subscription creation fails, user shouldn't be created.
// Note: This function assumes that the subscription data is optional and can be provided in the request
// body. If a subscription is provided, it will create a new subscription for the user.
// If no subscription is provided, it will only create the user without a subscription. 
// Create a new user
const createUser = asyncHandler(async (req, res) => {
    const { name, email, phone, rollNumber, password, subscription } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: { 
            name, 
            email, 
            phone, 
            rollNumber, 
            password: hashedPassword 
        },
        select: {
            id: true,
            name: true,
            rollNumber: true,
            email: true,
            phone: true
        }
    });

    // If subscription details are provided, create the subscription
    let createdSubscription = null;
    if (subscription && subscription.planId) {
        createdSubscription = await prisma.subscriptions.create({
            data: {
                userId: user.id,
                planId: subscription.planId,
                startDate: subscription.startDate,
                endDate: subscription.endDate
            }
        });
    }

    res.status(201).json({
        message: 'User created successfully',
        user,
        subscription: createdSubscription
    });
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { rollNumber: id }
    });
    
    if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Hash password if provided
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
    }
    
    const user = await prisma.user.update({
        where: { rollNumber: id },
        data: updateData,
        select: {
            id: true,
            name: true,
            rollNumber: true,
            email: true,
            phone: true
        }
    });
    
    res.json({
        message: 'User updated successfully',
        user
    });
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { rollNumber: id }
    });
    
    if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    await prisma.user.delete({
        where: { rollNumber: id }
    });
    
    res.json({ 
        message: 'User deleted successfully',
        rollNumber: id
    });
});

// Global error handler for user operations
const handleUserErrors = (error, req, res, next) => {
    console.error('User route error:', error);
    
    if (error.code === 'P2002') {
        return res.status(409).json({ 
            error: 'User with this email, phone, or roll number already exists' 
        });
    }
    
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    handleValidationErrors,
    handleUserErrors
};
