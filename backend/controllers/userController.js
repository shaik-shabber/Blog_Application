const User = require('../models/User');
const uploadImage = require('../utils/cloudinary');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('name email profilePic location age bio interests blogTitle');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { name, location, age, bio, interests, blogTitle } = req.body;
    let profileImageUrl;

    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (req.file) {
            try {
                profileImageUrl = await uploadImage(req.file.path);
                user.profilePic = profileImageUrl;
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                return res.status(500).json({ success: false, message: 'Image upload failed', error: uploadError.message });
            }
        }

        user.name = name || user.name;
        user.location = location || user.location;
        user.age = age || user.age;
        user.bio = bio || user.bio;
        user.interests = interests ? JSON.parse(interests) : user.interests;
        user.blogTitle = blogTitle || user.blogTitle;

        await user.save();

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
