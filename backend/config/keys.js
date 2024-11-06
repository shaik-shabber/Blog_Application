if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const {
    MONGO_URI,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    JWT_SECRET
} = process.env;

const requiredEnvVars = [
    'MONGO_URI',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'JWT_SECRET',
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`Error: Missing environment variable: ${varName}`);
        process.exit(1);
    }
});

const cloudinary = {
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    apiSecret: CLOUDINARY_API_SECRET,
};

module.exports = {
    mongoURI: MONGO_URI,
    cloudinary,
    jwtSecret: JWT_SECRET
};
