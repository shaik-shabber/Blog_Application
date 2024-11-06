const express = require('express');
const { login, register, logout, updatePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', authMiddleware.authenticate, logout);
router.put('/update-password', authMiddleware.authenticate, updatePassword);

module.exports = router;
