import express from "express";

import { getNews } from "../controllers/proxyControllers.js";

const router = express.Router();

router.get("/get", getNews);

export default router;
