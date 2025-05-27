import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => res.send({title: 'GET all subscription'}))

subscriptionRouter.get("/:id", (req, res) => res.send({title: 'GET subscription details'}))

subscriptionRouter.put("/:id", (req, res) => res.send({title: 'UPDATE subscription'}))

subscriptionRouter.delete("/:id", (req, res) => res.send({title: 'DELETE subscription'}))

subscriptionRouter.get("/user/:id", (req, res) => res.send({title: 'GET all users subscription'}))

subscriptionRouter.put("/:id/cancle", (req, res) => res.send({title: 'CANCLE subscription'}))

subscriptionRouter.get("/upcoming-renewals", (req, res) => res.send({title: 'GET upcoming renewals'}))

export default subscriptionRouter;