import mongoose from "mongoose"
import User from '../models/user.model.js'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRE_IN, JWT_SECRET } from "../config/env.js";

//  User Signup Controller
export const signUp = async (req, res, next) => {
    //  Start a MongoDB session (for safe rollback if something fails)
    const session = await mongoose.startSession();
    session.startTransaction(); // like a safety net — if something fails, we undo everything

    try {
        const { name, email, password } = req.body;

        //  Check if the user already exists in the database
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409; // 409 = conflict
            throw error; // stop here and go to catch block
        }

        // Hash the password before saving (for security)
        const salt = await bcrypt.genSalt(10); // add some randomness
        const hashedPassword = await bcrypt.hash(password, salt); // scrambled version of password

        // Create a new user and save it in the current session
        const newUsers = await User.create(
            [{ name, email, password: hashedPassword }],
            { session }
        );

        // Generate a JWT token (used for login sessions)
        const token = jwt.sign(
            { userId: newUsers[0]._id }, // payload data inside token
            JWT_SECRET,                 // secret key to sign the token
            { expiresIn: JWT_EXPIRE_IN } // like: "7d" or "1h"
        );

        // Everything went well — save all to database
        await session.commitTransaction();
        session.endSession();

        // Send response to frontend
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0], // user info (you can customize fields)
            }
        });

    } catch (error) {
        //  Something went wrong — undo all DB actions
        session.abortTransaction();
        session.endSession();
        next(error); // send error to global error handler
    }
}



// Controller for handling user sign-in logic
export const signIn = async (req, res, next) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Step 1: Check if user exists in the database
        const user = await User.findOne({ email });

        if (!user) {
            // If no user found, throw 404 error
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Step 2: Compare input password with hashed password in DB
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // If password is invalid, throw 401 Unauthorized error
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        // Step 3: Generate JWT token if authentication is successful
        const token = jwt.sign(
            { userId: user._id },      // Payload: user ID
            JWT_SECRET,                // Secret key
            { expiresIn: JWT_EXPIRE_IN } // Token expiry time
        );

        // Step 4: Send success response with token and user data
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user 
            }
        });

    } catch (error) {
        // Pass any error to the global error handling middleware
        next(error);
    }
};



export const signOut = async (req, res, next) => {

}