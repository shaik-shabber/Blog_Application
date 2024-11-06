const Post = require('../models/Post');
const User = require('../models/User');
const uploadImage = require('../utils/cloudinary');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPostsByUserName = async (req, res) => {
    const { authorName } = req.params;

    try {
        const users = await User.find({ name: { $regex: authorName, $options: 'i' } });
        const userIds = users.map(user => user._id);

        if (!userIds.length) {
            return res.status(404).json({ success: false, message: 'No authors found with that name' });
        }

        const posts = await Post.find({ author: { $in: userIds } })
            .populate('author', 'name email profilePic bio interests');

        if (!posts.length) {
            return res.status(404).json({ success: false, message: 'No posts found for the specified authors' });
        }

        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getPostsByTitle = async (req, res) => {
    const { title } = req.params;

    try {
        const posts = await Post.find({ title: { $regex: title, $options: 'i' } })
            .populate('author', 'name profilePic');

        if (!posts.length) {
            return res.status(404).json({ success: false, message: 'No posts found with that title' });
        }

        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error('Error fetching posts by title:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.createPost = async (req, res) => {
    const { title, content, tags } = req.body;
    let imageUrl;

    try {
        const author = req.user._id;

        if (req.file) {
            try {
                imageUrl = await uploadImage(req.file.path);
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                return res.status(500).json({ success: false, message: 'Image upload failed', error: uploadError.message });
            }
        }

        const newPost = new Post({
            title,
            content,
            tags: tags ? JSON.parse(tags) : [],
            image: imageUrl || null,
            author,
        });

        const savedPost = await newPost.save();
        res.status(201).json({ success: true, message: 'Post created successfully', post: savedPost });
    } catch (error) {
        console.error('Error creating post:', error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    const { title, content, tags } = req.body;
    let imageUrl = null;

    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (req.file) {
            imageUrl = await uploadImage(req.file.path);
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.tags = tags || post.tags;
        post.image = imageUrl || post.image;

        const updatedPost = await post.save();
        res.json({ success: true, post: updatedPost });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name profilePic');
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getPostsByUser = async (req, res) => {
    const userId = req.user ? req.user._id : null;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const posts = await Post.find({ author: userId })
            .populate('author', 'name profilePic')
            .select('title content createdAt updatedAt image tags likes');

        res.status(200).json({ success: true, posts: posts.length ? posts : [] });
    } catch (error) {
        console.error('Error fetching posts by user:', error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name profilePic');
        
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        
        res.status(200).json({ success: true, post });
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.likePost = async (req, res) => {
    const postId = req.params.id;
    const authorId = req.user.id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const authorHasLiked = post.likedBy.some(id => id.toString() === authorId);

        if (!authorHasLiked) {
            post.likedBy.push(authorId);
            post.likes += 1;
        } else {
            post.likedBy = post.likedBy.filter(id => id.toString() !== authorId);
            post.likes -= 1;
        }

        await post.save();

        res.status(200).json({
            success: true,
            updatedLikes: post.likes,
            userHasLiked: !authorHasLiked,
            likedBy: post.likedBy,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
