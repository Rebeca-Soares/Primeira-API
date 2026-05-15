import express from "express";
import cors from "cors";
import tasksRoutes from "./src/routes/tasksRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import tagRoutes from "./src/routes/tagRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import { requestLogger } from "./src/middlewares/logger.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(requestLogger);

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:5501", "http://localhost:5501"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.use("/tasks", tasksRoutes);
app.use("/tags", tagRoutes);
app.use("/users", userRoutes);
app.use("/ai", aiRoutes);

app.listen(3000, () => {
    console.log("Servidor ClickUp a correr na porta 3000");
});