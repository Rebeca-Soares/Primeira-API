import express from "express";
import { getUserStats, getAllUsers, postUser, removeUser, updateUser, getUserById } from "../controllers/userController.js";
import { checkUserExists } from "../middlewares/checkUserExists.js";

const router = express.Router();

// Estatisticas

router.get("/stats", getUserStats);

// Usuários 
router.get("/", getAllUsers);
router.get("/:id", checkUserExists, getUserById);
router.post("/", postUser);
router.put("/:id", checkUserExists, updateUser);
router.patch("/:id", checkUserExists, updateUser);
router.delete("/:id", checkUserExists, removeUser);

export default router;