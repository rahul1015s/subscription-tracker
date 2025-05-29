import express from "express";
import cookieParser from "cookie-parser";

import { PORT } from "./config/env.js";

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

// This lets your app understand and work with data sent in JSON format.
// For example, if someone sends: { "name": "Rahul" }, this lets you read it using req.body.name
app.use(express.json());

// This helps your app read data sent from HTML forms (like login or signup forms).
// extended: false means it will only handle simple form data (nothing too complex).
app.use(express.urlencoded({ extended: false }));

// This lets your app read cookies from the user's browser.
// After this, you can access cookies using req.cookies
app.use(cookieParser());
app.use(arcjetMiddleware); // Arcjet Middleware must befor the routes

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

// ✅ Global error handler (should be after all routes)
app.use(errorMiddleware);

app.get('/',(req, res) => {
    res.send("welcome to Subscription tracker api")
})

app.listen(PORT, async () => {
    console.log(`Subscription tracker Api is running PORT http://localhost:${PORT}`)

   await  connectToDatabase();
})

export default app;