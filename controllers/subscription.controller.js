import Subscription from "../models/subscription.model.js";
import { WorkflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

/**
 * Create a new subscription for the authenticated user.
 * Data comes from req.body and user ID from req.user (set by authorize middleware).
 */
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id, // associate subscription with the logged-in user
    });

    await WorkflowClient.trigger({
      url: SERVER_URL
    });


    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error); // pass error to global error handler
  }
};

/**
 * Get all subscriptions in the system.
 * This is useful for admin or debugging purposes. It includes user info via populate.
 */
export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find().populate("user");
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific subscription by its ID.
 * Returns 404 if the subscription doesn't exist.
 */
export const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all subscriptions for a specific user.
 * Only the owner (authenticated user) is allowed to access this data.
 */
export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Validate that the user is accessing their own subscriptions
    if (req.user._id.toString() !== req.params.id) {
      const error = new Error("You're not the owner of this account");
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a subscription by its ID.
 * Runs validators and returns the updated document.
 */
export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a subscription permanently from the database.
 */
export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    res.status(200).json({ success: true, message: "Subscription deleted" });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a subscription by marking it inactive.
 * This preserves the record but disables future renewals.
 */
export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { isActive: false, cancelledAt: new Date() },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all active subscriptions with renewal dates in the next 7 days.
 * Useful for notifying users or auto-renewal logic.
 */
export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const subscriptions = await Subscription.find({
      renewalDate: { $gte: now, $lte: nextWeek },
      isActive: true,
    });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};
