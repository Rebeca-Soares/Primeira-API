const comments = []; // Relacionamento 1:N (Comentários pertencem a uma Task)
let commentId = 1;

export const createComment = (taskId, userId, conteudo) => {
    
    if (!conteudo || conteudo.trim() === "") {
        return { error: "Conteúdo do comentário não pode ser vazio" };
    }
    
    const newComment = {
        id: commentId++,
        taskId: Number(taskId), 
        userId: Number(userId), 
        conteudo: conteudo,
        dataCriacao: new Date().toISOString()
    };

    comments.push(newComment);
    return newComment;
};

export const getCommentsByTaskId = (taskId) => {
    const tId = Number(taskId);
    
    // Filtra o array global de comentários procurando aqueles que pertencem à tarefa (taskId)
    const taskComments = comments.filter(c => c.taskId === tId);

    // Dica: Ordenar por data de criação (mais recentes primeiro)
    return taskComments.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
};