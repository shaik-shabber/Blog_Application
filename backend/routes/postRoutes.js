const express = require('express');
const { 
    createPost, 
    getAllPosts, 
    getPostById, 
    updatePost, 
    deletePost,
    likePost,
    getPostsByUser,
    getPostsByTitle, 
    getPostsByUserName, 
    getUserProfile
} = require('../controllers/postController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../utils/multer');

const router = express.Router();

router.get('/title/:title', getPostsByTitle);
router.get('/me', authenticate, getUserProfile);
router.get('/me/posts', authenticate, getPostsByUser);
router.post('/', authenticate, upload.single('file'), createPost);
router.put('/:id', authenticate, upload.single('image'), updatePost);
router.post('/:id/like', authenticate, likePost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.get('/user/:authorName', getPostsByUserName);
router.delete('/:id', authenticate, deletePost);

module.exports = router;
