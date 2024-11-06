const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            immutable: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Tag', tagSchema);
