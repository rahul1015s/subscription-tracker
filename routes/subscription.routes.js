import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  getUserSubscriptions,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
  getUpcomingRenewals
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// Protect upcoming renewals
subscriptionRouter.get("/upcoming-renewals", authorize, getUpcomingRenewals);

// User-specific subscription list
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

// Admin (or logged-in user) only
subscriptionRouter.get("/", authorize, getAllSubscriptions);

// Only authenticated users can create subscriptions
subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.get("/:id", authorize, getSubscriptionById);
subscriptionRouter.put("/:id", authorize, updateSubscription);
subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);
subscriptionRouter.delete("/:id", authorize, deleteSubscription);

export default subscriptionRouter;
