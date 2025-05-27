// Importing mongoose for schema and model creation
import mongoose from "mongoose";

// Defining a new schema for the User collection
const userSchema = new mongoose.Schema({
  // Name field
  name: { 
    type: String,                             // Must be a string
    required: [true, "User Name is required"], // Name is required with custom error message
    trim: true,                               // Removes leading/trailing whitespaces
    minLength: 2,                             // Minimum 2 characters
    maxLength: 50,                            // Maximum 50 characters
  },

  // Email field
  email: {
    type: String,                             // Must be a string
    required: [true, 'Email is required.'],   // Email is required with custom error message
    unique: true,                             // Must be unique across users
    trim: true,                               // Removes spaces around email
    lowercase: true,                          // Converts email to lowercase
    match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'] // Validates email format
  },

  // Password field
  password: {
    type: String,                             // Must be a string
    required: [true, 'User password is required'], // Password is required with custom error
    minLength: 6,                             // Must be at least 6 characters
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// Creating the User model from the schema
const User = mongoose.model('User', userSchema);

// Exporting the model to be used in other parts of the app
export default User;
