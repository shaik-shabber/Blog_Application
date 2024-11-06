const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Define storage settings for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Specify the destination folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`; // Generate a unique filename
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

// File filter to only allow specific image and video files
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi']; // Allowed video MIME types
    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images (jpg, jpeg, png) and videos (mp4, mov, avi) are allowed'), false);
    }
};

// Initialize upload with limits and filters
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB (adjust as needed)
});

// Export the upload middleware
module.exports = upload;
