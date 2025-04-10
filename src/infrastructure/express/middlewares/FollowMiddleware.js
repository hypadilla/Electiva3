const { param, body, validationResult } = require('express-validator');

const validateUsername = [
    param('username').notEmpty().withMessage('Username is required.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateUsername };
