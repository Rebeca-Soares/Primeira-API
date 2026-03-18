import express from "express";
import * as tagController from "../controllers/tagController.js";

const router = express.Router();

router.get("/", tagController.getAllTags);
router.post("/", tagController.createTag);
router.delete("/:id", tagController.deleteTag);
router.get("/:id/tasks", tagController.getTasksByTagId); // Rota para obter as tasks associadas a uma tag específica

export default router;