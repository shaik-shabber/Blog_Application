const express = require('express');
const { getUserProfile, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.get('/profile', authMiddleware.authenticate, getUserProfile);
router.put('/profile', authMiddleware.authenticate, upload.single('profileImage'), updateProfile);

module.exports = router;
