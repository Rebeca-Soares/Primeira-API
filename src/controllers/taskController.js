import * as taskService from "../services/taskService.js";
import * as tagService from "../services/tagService.js";


 //Retorna a listagem de tarefas com suporte a query params para filtros e ordenação
export const getAllTasks = (req, res) => {
    const { search, sort } = req.query;
    const tasks = taskService.getAllTasks(search, sort);
    res.json(tasks); 
};

//Recupera uma tarefa específica injetada previamente pelo middleware de validação
export const getTaskById = (req, res) => {
    res.json(req.task); 
}

//Orquestra a criação de uma nova tarefa com validação
export const createTask = (req, res) => {
    const task = taskService.createTask(req.body);
    if (task.error) {
        return res.status(400).json({ error: task.error }); // validação de título obrigatório
    }
    res.status(201).json(task);
}

// Atualiza os dados da tarefa utilizando o objeto validado no middleware e a lógica de gestão de conclusão definida no serviço
export const updateTask = (req, res) => {
    const task = taskService.updateTask(req.task.id, req.body);
    if (task.error) {
        return res.status(404).json(task); // task inexistente 
    }
    res.json(task);
}

//Remove uma tarefa e retorna o objeto deletado para confirmação
export const deleteTask = (req, res) => {
    const result = taskService.deleteTask(req.params.id);
    if (result?.error) {
        return res.status(404).json(result); //task não encontrada
    }
    res.json({ message: "Tarefa deletada com sucesso", task: result });
};

//Endpoint de agregação de dados para geração de métricas
export const getTaskStats = (req, res) => {
    const stats = taskService.getTaskStats();
    res.json(stats); // estatisticas gerais
};

//Realiza o vínculo entre Tarefas e Tags com validação cruzada de existência
export const associateTag = (req, res) => {
    const taskId = req.params.id;
    const { tagId } = req.body;

    // Validação de Integridade

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