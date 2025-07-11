const express = require('express');
const auth = require('../middleware/auth');
const {
    validateUser,
    validateUserUpdate,
    validateRollNumber
} = require('../middleware/userValidation');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    handleValidationErrors,
    handleUserErrors
} = require('../controllers/userController');

const router = express.Router();

// Apply authentication to all routes
router.use(auth);

// Routes
router.get('/', getAllUsers);
router.get('/:id', validateRollNumber, handleValidationErrors, getUserById);
router.post('/', validateUser, handleValidationErrors, createUser);
router.put('/:id', validateRollNumber, validateUserUpdate, handleValidationErrors, updateUser);
router.delete('/:id', validateRollNumber, handleValidationErrors, deleteUser);

// Global error handler for this router
router.use(handleUserErrors);

module.exports = router;