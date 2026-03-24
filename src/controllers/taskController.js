import * as taskService from "../services/taskService.js";
import * as tagService from "../services/tagService.js";


 //Retorna a listagem de tarefas com suporte a query params para filtros e ordenação
export const getAllTasks = async (req, res) => {
    try {
    const { search, sort } = req.query;
    const tasks = await taskService.getAllTasks(search, sort);

    if (search && tasks.length === 0) {
        res.status(404).json({ message: "Nenhuma tarefa encontrada com o título especificado" });
    }
    
    res.json(tasks); 
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar tarefas." });
    }
};

//Recupera uma tarefa específica injetada previamente pelo middleware de validação
export const getTaskById = (req, res) => {
    try {
        res.json(req.task); 
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar tarefa." });
    }
};

//Orquestra a criação de uma nova tarefa com validação
export const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body);

        // Validação do service (título obrigatório, etc.)
        if (task.error) {
            return res.status(400).json({ error: task.error });
        }

        // Retorna a tarefa criada com status 201
        res.status(201).json(task);
    } catch (error) {
        console.error(error); // opcional, bom para debug
        res.status(500).json({ 
            error: "Erro ao criar tarefa."
        });
    }
};

// Atualiza os dados da tarefa utilizando o objeto validado no middleware e a lógica de gestão de conclusão definida no serviço
export const updateTask = async (req, res) => {
    try {
    const task = await taskService.updateTask(req.task.id, req.body);
    if (task.error) {
        return res.status(404).json(task); // task inexistente 
    }
    res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar tarefa." });
    }
};

//Remove uma tarefa e retorna o objeto deletado para confirmação
export const deleteTask = async (req, res) => {
    try {
        const result = await taskService.deleteTask(req.params.id);
        if (result?.error) {
            return res.status(404).json(result); //task não encontrada
        }
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao deletar tarefa." });
    }
};

//Endpoint de agregação de dados para geração de métricas
export const getTaskStats = async (req, res) => {
    try {
        const stats = await taskService.getTaskStats();
        res.json(stats); // estatisticas gerais
    } catch (error) {
        res.status(500).json({ error: "Erro ao obter estatísticas." });
    }
};

//Realiza o vínculo entre Tarefas e Tags com validação cruzada de existência
export const associateTag = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { tagId } = req.body;

        // Cria associação
        const result = await taskService.addTagToTask(taskId, tagId);

        if (result.error) {
            return res.status(400).json(result); //tag duplicada
        }

        res.status(201).json(result);  //associação criada
    } catch (error) {
        res.status(500).json({ error: "Erro ao associar tag à tarefa." });
    }
};
