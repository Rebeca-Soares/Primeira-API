import express from "express";
import * as taskController from "../controllers/taskController.js";
import { checkTasksExists } from "../middlewares/checkTasksExists.js";
import * as commentController from "../controllers/commentController.js";
import { checkUserExists } from "../middlewares/checkUserExists.js";


const router = express.Router();

// Estaticas
router.get("/stats", taskController.getTaskStats);

// Tasks
router.get("/", taskController.getAllTasks);
router.get("/:id", checkTasksExists, taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", checkTasksExists, taskController.updateTask);
router.patch("/:id", checkTasksExists, taskController.updateTask);
router.delete("/:id", checkTasksExists, taskController.deleteTask);

// Tag
router.post("/:id/tags", checkTasksExists, taskController.associateTag);

// Comments
router.post("/:id/comments", checkTasksExists, checkUserExists, commentController.createComment);
router.get("/:id/comments", checkTasksExists, commentController.getCommentsByTaskId);

export default router;