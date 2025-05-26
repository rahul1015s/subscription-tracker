import express from "express";

import { PORT } from "./config/env.js";

const app = express();

app.get('/',(req, res) => {
    res.send("welcome to Subscription tracker api")
})

app.listen(PORT, () => {
    console.log(`Subscription tracker Api is running PORT http://localhost:${PORT}`)
})

export default app;