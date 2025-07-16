const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: { error: message },
        standardHeaders: true,
        legacyHeaders: false
    });
};

module.exports = {
    general: createRateLimiter(15 * 60 * 1000, 100, 'Too many requests'),
    auth: createRateLimiter(15 * 60 * 1000, 20, 'Too many login attempts') // Increased from 5 to 20
};