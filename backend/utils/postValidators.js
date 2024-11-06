const { body, validationResult } = require('express-validator');

// Validation rules for creating and updating a post
exports.validatePost = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title must not exceed 100 characters'),
    
    body('content')
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 10 }).withMessage('Content must be at least 10 characters long'),

    body('tags')
        .optional()
        .isString().withMessage('Tags must be a string')
        .custom(value => {
            if (value) {
                const tagsArray = value.split(',').map(tag => tag.trim());
                if (tagsArray.length > 10) {
                    throw new Error('You can specify a maximum of 10 tags');
                }
            }
            return true;
        }),
];

// Middleware to handle validation results
exports.validatePostResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};
