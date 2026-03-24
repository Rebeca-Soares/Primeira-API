import * as commentService from "../services/commentService.js";
import * as taskService from "../services/taskService.js";
import * as userService from "../services/userService.js";

export const getAllComments = async (req, res) => {
    try {
        const tags = await commentService.fetchAllComments();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar tags." });
    }
};

export const createComment = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { userId, conteudo } = req.body;

        // Validação: Conteudo é obrigatório
        if (!conteudo?.trim()) {
            return res.status(400).json({ error: "Conteúdo é obrigatório" });
        }

        //chama o serviço
        const result = await commentService.createComment(taskId, userId, conteudo);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar comentário" });
    }
};

// Busca comentários de uma tarefa específica, ordenados por data de criação (mais recentes primeiro)
export const getCommentsByTaskId = async (req, res) => {
    
    try {
        const comments = await commentService.getCommentsByTaskId(req.params.id);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar comentários" });
    }
};