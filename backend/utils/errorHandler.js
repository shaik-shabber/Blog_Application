const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error for debugging (optional)
    console.error(err);

    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;
