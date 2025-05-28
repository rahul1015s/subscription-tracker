import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();


//GET /users/:id -> get users by id 

userRouter.get('/', getUsers);

// Route to get a specific user's details by ID
// Protected by the `authorize` middleware to ensure only authenticated users can access it
// Calls the `getUser` controller to fetch user data (excluding password) from the database
userRouter.get('/:id', authorize, getUser);

userRouter.post('/', (req, res) => res.send({title: 'CREATE new User'}));

userRouter.put('/:id', (req, res) => res.send({title: 'UPDATE Users'}));

userRouter.delete('/', (req, res) => res.send({title: 'DELETE Users'}));

export default userRouter;