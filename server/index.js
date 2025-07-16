const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimiter = require('./middleware/rateLimiter');

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// Logging middleware
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// Rate limiting
app.use('/api/', rateLimiter.general);
app.use('/api/auth', rateLimiter.auth);

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({extended: false, limit: '10mb'}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
    res.json({
        title: 'Gym Management API Documentation',
        version: '1.0.0',
        endpoints: {
            auth: {
                'POST /api/auth/login': 'Admin login with email and password'
            },
            users: {
                'GET /api/users': 'Get all users with pagination',
                'GET /api/users/:rollNumber': 'Get user by roll number',
                'POST /api/users': 'Create new user',
                'PUT /api/users/:rollNumber': 'Update user by roll number',
                'DELETE /api/users/:rollNumber': 'Delete user by roll number'
            },
            plans: {
                'GET /api/plans': 'Get all plans with pagination',
                'GET /api/plans/:id': 'Get plan by ID',
                'POST /api/plans': 'Create new plan',
                'PUT /api/plans/:id': 'Update plan by ID',
                'DELETE /api/plans/:id': 'Delete plan by ID'
            },
            subscriptions: {
                'GET /api/subscriptions': 'Get all subscriptions with pagination',
                'GET /api/subscriptions/:id': 'Get subscription by ID',
                'POST /api/subscriptions': 'Create new subscription',
                'PUT /api/subscriptions/:id': 'Update subscription by ID',
                'DELETE /api/subscriptions/:id': 'Delete subscription by ID',
                'GET /api/subscriptions/user/:userId': 'Get subscriptions by user ID',
                'GET /api/subscriptions/plan/:planId': 'Get subscriptions by plan ID'
            }
        },
        authentication: {
            type: 'Bearer Token',
            header: 'Authorization: Bearer <token>',
            note: 'All endpoints except /api/auth/login require authentication'
        }
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/subscriptions', require('./routes/subscriptions'));

// 404 handler for undefined routes
app.use('/*catchall', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// Enhanced global error handler
app.use((error, req, res, next) => {
    // Log error details
    console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent'),
        ip: req.ip
    });

    // Default error response
    let status = 500;
    let message = 'Internal Server Error';
    let details = null;

    // Handle specific error types
    if (error.name === 'ValidationError') {
        status = 400;
        message = 'Validation Error';
        details = error.details;
    } else if (error.name === 'UnauthorizedError' || error.message === 'Invalid token') {
        status = 401;
        message = 'Unauthorized';
    } else if (error.code === 'ENOTFOUND') {
        status = 503;
        message = 'Service Unavailable';
    } else if (error.code === 'P2002') {
        status = 409;
        message = 'Duplicate entry detected';
    } else if (error.code === 'P2025') {
        status = 404;
        message = 'Record not found';
    }

    // Don't expose stack traces in production
    const response = {
        error: message,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method
    };

    if (details) {
        response.details = details;
    }

    if (process.env.NODE_ENV !== 'production') {
        response.stack = error.stack;
    }

    res.status(status).json(response);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API Documentation available at: http://localhost:${PORT}/api/docs`);
});