require('dotenv').config(); // Load environment variables
const express = require('express');
const connectDB = require('./config/db'); // Ensure this file connects to MongoDB correctly
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS Options
const corsOptions = {
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200 // For legacy browser support
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json()); // Middleware to parse JSON body
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
app.use(session({
    secret: process.env.SESSION_SECRET || 'myDevSecretKey', // Use a secret key from environment or default
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Secure cookies in production
}));

// Define Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/posts', postRoutes); // Post routes
app.use('/api/comments', commentRoutes); // Comment routes

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Blog Application API');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message,
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
