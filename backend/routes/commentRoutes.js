const express = require('express');
const { 
    createComment, 
    getCommentsByPostId, 
    updateComment, 
    deleteComment 
} = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/posts/:id/comments', authenticate, createComment);
router.get('/posts/:id/comments', getCommentsByPostId);
router.put('/comments/:id', authenticate, updateComment);
router.delete('/:id', authenticate, deleteComment);

module.exports = router;
