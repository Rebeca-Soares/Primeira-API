const comments = []; // Relacionamento 1:N (Comentários pertencem a uma Task)
let commentId = 1;

// Criação de comentário vinculado a uma tarefa e utilizafor com validação de conteúdo obrigatório
export const createComment = (taskId, userId, conteudo) => {
    
    if (!conteudo || conteudo.trim() === "") {
        return { error: "Conteúdo do comentário não pode ser vazio" };
    }
    
    const newComment = {
        id: commentId++,
        taskId: Number(taskId), 
        userId: Number(userId), 
        conteudo: conteudo,
        dataCriacao: new Date().toISOString() // ISO format para facilitar ordenação posterior
    };

    comments.push(newComment);
    return newComment;
};

// Busca comentários de uma tarefa específica, ordenados por data de criação (mais recentes primeiro)
export const getCommentsByTaskId = (taskId) => {
    const tId = Number(taskId);
    
    const taskComments = comments.filter(c => c.taskId === tId);

    return taskComments.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
};