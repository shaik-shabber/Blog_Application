const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Content is required'],
            minlength: [1, 'Comment content must be at least 1 character long'],
            maxlength: [500, 'Comment content must not exceed 500 characters']
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: [true, 'Post is required']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Comment', commentSchema);
