// Import the configured Arcjet instance (used for threat detection and rate limiting)
import aj from "../config/arcjet.js";

// Middleware to protect routes using Arcjet security checks
const arcjetMiddleware = async (req, res, next) => {
    try {
        // Analyze the incoming request with Arcjet's protect method
        const decision = await aj.protect(req, {requested: 1}); //1 tockcen from the bucket

        // If the request is denied, handle based on reason
        if (decision.isDenied()) {

            // If the denial reason is due to too many requests (rate limiting)
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: 'Rate limit exceeded' });
            }

            // If the denial reason is bot detection (e.g. suspicious automation)
            if (decision.reason.isBot()) {
                return res.status(403).json({ message: 'Bot detected' });
            }

            // For all other denial reasons (e.g. IP block, suspicious pattern, etc.)
            return res.status(403).json({ message: 'Access denied' });
        }

        // If Arcjet approves the request, move to the next middleware/route handler
        next();

    } catch (error) {
        // Log any unexpected Arcjet-related errors and pass to error handler
        console.log(`Arcjet Middleware Error: ${error}`);
        next(error);
    }
};


export default arcjetMiddleware;
