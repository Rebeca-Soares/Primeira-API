import db from "../../db.js";

// Busca todas os comentarios
export const fetchAllComments = async () => {
    const [rows] = await db.query("SELECT * FROM comments");
    return rows;
};

// Criação 

// Criação de comentário vinculado a uma tarefa e utilizafor com validação de conteúdo obrigatório
export const createComment = async (taskId, userId, conteudo) => {
    
    if (!conteudo || conteudo.trim() === "") {
        return { error: "Conteúdo do comentário não pode ser vazio" };
    }

    const query = `INSERT INTO comments (taskId, userId, conteudo) VALUES (?, ?, ?)`;

    const [result] = await db.execute(query, [taskId, userId, conteudo]);
    
    return {
        id: result.insertId,
        taskId: Number(taskId), 
        userId: userId ? Number(userId) : null, 
        conteudo
    }
};

// Busca comentários de uma tarefa específica, ordenados por data de criação (mais recentes primeiro)
export const getCommentsByTaskId = async (taskId) => {
    const tId = Number(taskId);
    
    const query = `
    SELECT * FROM comments WHERE taskId = ? ORDER BY dataCriacao DESC`;    
    
    const [rows] = await db.execute(query, [tId]);

    return rows;
};