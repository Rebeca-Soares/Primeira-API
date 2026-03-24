import * as taskService from "../services/taskService.js";

export const checkTasksExists = async (req, res, next) => {
    const taskId = req.params.id;   
    const task = await taskService.findTaskById(taskId);
    
    if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    req.task = task;
    next();
};