const Tag = require('../models/Tag');

exports.createTag = async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Tag name is required' });
    }

    try {
        const existingTag = await Tag.findOne({ name });
        if (existingTag) {
            return res.status(400).json({ success: false, message: 'Tag already exists' });
        }

        const tag = new Tag({ name });
        await tag.save();
        res.status(201).json({ success: true, message: 'Tag created successfully', tag });
    } catch (error) {
        console.error('Error creating tag:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, tags });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getTagById = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).json({ success: false, message: 'Tag not found' });
        }
        res.status(200).json({ success: true, tag });
    } catch (error) {
        console.error('Error fetching tag:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateTag = async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Tag name is required' });
    }

    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).json({ success: false, message: 'Tag not found' });
        }

        const existingTag = await Tag.findOne({ name });
        if (existingTag) {
            return res.status(400).json({ success: false, message: 'Tag already exists' });
        }

        tag.name = name;
        const updatedTag = await tag.save();
        res.status(200).json({ success: true, message: 'Tag updated successfully', tag: updatedTag });
    } catch (error) {
        console.error('Error updating tag:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).json({ success: false, message: 'Tag not found' });
        }

        await tag.deleteOne();
        res.status(200).json({ success: true, message: 'Tag deleted successfully' });
    } catch (error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
