// Custom Express error handling middleware for better error messages
const errorMiddleware = (err, req, res, next) => {
  try {
    // Clone the original error to avoid modifying it directly
    let error = { ...err };

    // Preserve the original message
    error.message = err.message;

    // Log the raw error for debugging in the terminal
    console.error(err); 

    // ✅ Handle invalid MongoDB ObjectId (e.g., malformed _id in URL)
    if (err.name === 'CastError') {
      const message = 'Resource not found';
      error = new Error(message);
      error.statusCode = 404;
    }

    // ✅ Handle MongoDB duplicate key error (e.g., unique email conflict)
    if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      error = new Error(message);
      error.statusCode = 400;
    }

    // ✅ Handle Mongoose validation errors (e.g., required fields missing, invalid format)
    if (err.name === 'ValidationError') {
      // Collect all validation messages from Mongoose error object
      const message = Object.values(err.errors).map(val => val.message);
      error = new Error(message.join(', '));
      error.statusCode = 400;
    }

    // Send JSON response with appropriate status and error message
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error',
    });

  } catch (error) {
    // Pass any unexpected error to the default Express error handler
    next(error);
  }
};

export default errorMiddleware;
