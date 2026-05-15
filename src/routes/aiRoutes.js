import express from "express";
import * as aiController from "../controllers/aiController.js";

const router = express.Router();

router.post("/chat", aiController.handleChat);
router.post("/chat/stream", aiController.handleChatStream);

export default router;