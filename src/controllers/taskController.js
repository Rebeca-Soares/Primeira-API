import * as taskService from "../services/taskService.js";
import * as tagService from "../services/tagService.js";

export const getAllTasks = (req, res) => {
    const { search, sort } = req.query;
    const tasks = taskService.getAllTasks(search, sort);
    res.json(tasks); // retorna tasks filtradas/ordenadas
};

export const getTaskById = (req, res) => {
    res.json(req.task); // task já vem do middleware
}

export const createTask = (req, res) => {
    const task = taskService.createTask(req.body);
    if (task.error) {
        return res.status(400).json({ error: task.error }); // validação de título obrigatório
    }
    res.status(201).json(task);
}

export const updateTask = (req, res) => {
    const task = taskService.updateTask(req.task.id, req.body);
    if (task.error) {
        return res.status(404).json(task); // task inexistente 
    }
    res.json(task);
}

export const deleteTask = (req, res) => {
    const result = taskService.deleteTask(req.params.id);
    if (result?.error) {
        return res.status(404).json(result); //task não encontrada
    }
    res.json({ message: "Tarefa deletada com sucesso", task: result });
};

export const getTaskStats = (req, res) => {
    const stats = taskService.getTaskStats();
    res.json(stats); // estatisticas gerais
};

export const associateTag = (req, res) => {
    const taskId = req.params.id;
    const { tagId } = req.body;

    // Verifica se a tarefa existe
    const task = taskService.findTaskById(taskId);
    if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    // Verifica se a tag existe
    const tag = tagService.findTagById(tagId);
    if (!tag) {
        return res.status(404).json({ error: "Tag não encontrada" });
    }

    // Cria associação
    const result = taskService.addTagToTask(taskId, tagId);

    if (result.error) {
        return res.status(400).json(result); //tag duplicada
    }

    res.status(201).json(result);  //associação criada
};