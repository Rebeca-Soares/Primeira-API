import * as commentService from "../services/commentService.js";
import * as taskService from "../services/taskService.js";
import * as userService from "../services/userService.js";

export const createComment = (req, res) => {
    const taskId = req.params.id;
    const { userId, conteudo } = req.body;

    // Validação 3: Conteudo é obrigatório
    if (!conteudo?.trim()) {
        return res.status(400).json({ error: "Conteúdo é obrigatório" });
    }

    const result = commentService.createComment(taskId, userId, conteudo);
    res.status(201).json(result);
};

export const getCommentsByTaskId = (req, res) => {
    
    const comments = commentService.getCommentsByTaskId(req.params.id);
    res.json(comments);
};