const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

router.post('/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
    ],
    authController.register
);

router.post('/login',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty()
    ],
    authController.login
);

module.exports = router;
