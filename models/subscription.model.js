// Importing mongoose for schema and model creation
import mongoose from "mongoose";

// Define the schema for a Subscription document
const subscriptionSchema = new mongoose.Schema({

  // Name of the subscription (e.g., "Netflix", "Spotify")
  name: {
    type: String,
    required: [true, 'Subscription name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },

  // Price of the subscription (must be ≥ 0)
  price: {
    type: Number,
    required: [true, 'Subscription price is required'],
    min: [0, 'Price must be greater than 0'], 
  },

  // Currency used (restricted to INR, USD, EUR)
  currency: {
    type: String,
    enum: ['INR', 'USD', 'EUR'], 
    default: 'INR',
  },

  // Frequency of subscription billing
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
  },

  // Category of subscription content
  category: {
    type: String,
    enum: [
      'sports', 
      'news', 
      'entertainment', 
      'lifestyle', 
      'technology', 
      'finance',  
      'politics', 
      'other'
    ],
    required: true,
  },

  // Method used for payment (e.g., UPI, Card, Netbanking)
  paymentMethod: {
    type: String,
    required: true,
    trim: true,
  },

  // Current status of the subscription
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active',
  },

  // When the subscription started
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value <= new Date(),
      message: 'Start date must be in the past',
    },
  },

  // When the subscription renews next
  renewalDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: 'Renewal date must be after the start date',
    },
  },

  // Reference to the user who owns the subscription
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Optimizes queries by user ID
  }

}, { timestamps: true }); 

// Middleware to auto-set or update renewal date & status before saving
subscriptionSchema.pre('save', function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
  }

  // Automatically set status to expired if renewal date has already passed
  if (this.renewalDate < new Date()) {
    this.status = 'expired';
  }

  next();
});

// Creating the Subscription model
const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Exporting the model for use elsewhere
export default Subscription;
