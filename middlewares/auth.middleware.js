import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to authorize users based on JWT token
const authorize = async (req, res, next) => {
    try {
        let token;

        // Check if the Authorization header exists and starts with 'Bearer'
        // Example: Authorization: Bearer abc.def.ghi
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Split the string by space (' ') to separate "Bearer" and the token
            // 'Bearer abc.def.ghi'.split(' ') results in ['Bearer', 'abc.def.ghi']
            // So we take the second element [1] which is the actual token
            token = req.headers.authorization.split(' ')[1];
        }

        // If token is not found, return Unauthorized response
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify the token using the secret key
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find the user from the decoded token payload
        const user = await User.findById(decoded.userId);

        // If user doesn't exist in DB, return Unauthorized response
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Attach the user object to the request so it can be accessed in next middleware or route
        req.user = user;

        // Continue to the next middleware or route handler
        next();

    } catch (error) {
        // Catch any error (e.g., invalid token) and return Unauthorized
        res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
    }
};

export default authorize;
