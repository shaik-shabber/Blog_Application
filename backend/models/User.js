const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        location: {
            type: String,
            default: 'Not specified',
        },
        age: {
            type: Number,
            default: 0,
        },
        profilePic: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            default: 'No bio available',
        },
        interests: {
            type: [String],
            default: [],
        },
        blogTitle: {
            type: String,
            default: 'Untitled Blog',
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
