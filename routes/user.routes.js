import { Router } from "express";

const userRouter = Router();


//GET /users/:id -> get users by id 

userRouter.get('/', (req, res) => res.send({title: 'GET all Users'}));

userRouter.get('/:id', (req, res) => res.send({title: 'GET  Users Details'}));

userRouter.post('/', (req, res) => res.send({title: 'CREATE new User'}));

userRouter.put('/:id', (req, res) => res.send({title: 'UPDATE Users'}));

userRouter.delete('/', (req, res) => res.send({title: 'DELETE Users'}));