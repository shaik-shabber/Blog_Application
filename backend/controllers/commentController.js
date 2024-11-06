const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.createComment = async (req, res) => {
    const { content } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    try {
        const newComment = new Comment({
            content,
            post: postId,
            user: userId
        });

        const savedComment = await newComment.save();
        await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

        res.status(201).json({ success: true, comment: savedComment });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getCommentsByPostId = async (req, res) => {
    const postId = req.params.id;

    try {
        const comments = await Comment.find({ post: postId }).populate('user', 'name profilePic');
        
        if (!comments.length) {
            return res.status(404).json({ success: false, message: 'No comments found for this post' });
        }

        res.status(200).json({ success: true, comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateComment = async (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this comment' });
        }

        comment.content = content;
        comment.updatedAt = Date.now();

        const updatedComment = await comment.save();
        res.status(200).json({ success: true, comment: updatedComment });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    const commentId = req.params.id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();
        await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
