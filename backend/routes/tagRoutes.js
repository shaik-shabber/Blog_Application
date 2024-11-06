const express = require('express');
const {
    createTag,
    getAllTags,
    getTagById,
    updateTag,
    deleteTag,
} = require('../controllers/tagController');

const router = express.Router();

router.post('/', createTag);
router.get('/', getAllTags);
router.get('/:id', getTagById);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

module.exports = router;
