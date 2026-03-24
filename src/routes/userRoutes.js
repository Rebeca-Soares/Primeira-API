import express from "express";
import { getUserStats, getAllUsers,createUser, removeUser, updateUser, getUserById } from "../controllers/userController.js";
import { checkUserExists } from "../middlewares/checkUserExists.js";
import { getAllComments } from "../controllers/commentController.js";

const router = express.Router();

// Estatisticas

router.get("/stats", getUserStats);

// Usuários 
router.get("/", getAllUsers);
router.get("/:id", checkUserExists, getUserById);
router.post("/", createUser);
router.put("/:id", checkUserExists, updateUser);
router.patch("/:id", checkUserExists, updateUser);
router.delete("/:id", checkUserExists, removeUser);
router.get("/", getAllComments);

export default router;