import express from "express";
import tasksRoutes from "./src/routes/tasksRoutes.js"; // Rotas de tasks
import userRoutes from "./src/routes/userRoutes.js"; // Rotas de users
import { requestLogger } from "./src/middlewares/logger.js"; // Middleware de logging
import tagRoutes from "./src/routes/tagRoutes.js"; // Rotas de tags

const app = express();

app.use(requestLogger);


app.use(express.json());


app.use("/tasks", tasksRoutes);
app.use("/users", userRoutes); 
app.use("/tags", tagRoutes);

app.listen(3000, () => {
    console.log("Servidor ClickUp a correr na porta 3000");
});
