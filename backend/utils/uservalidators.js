const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Adjust the path as needed

// Validation rules for user registration
const validateUser = [
    body('name')
        .notEmpty().withMessage('Name is required.')
        .isLength({ max: 50 }).withMessage('Name must not exceed 50 characters.'),
    
    body('email')
        .isEmail().withMessage('Invalid email format.')
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('Email already in use.'); // Custom error for email uniqueness
            }
        }),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
        .matches(/\d/).withMessage('Password must contain at least one number.')
        .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character.'),
];

// Validation rules for user login
const validateLogin = [
    body('email')
        .isEmail().withMessage('Invalid email format.'),
    
    body('password')
        .notEmpty().withMessage('Password is required.'),
];

// Middleware to check validation results
const validateUserResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

module.exports = {
    validateUser,
    validateUserResults,
    validateLogin,
};
