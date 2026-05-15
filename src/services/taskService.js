import { db } from "../../db.js";

export const getAllTasks = async (search, sort) => {
    let query = "SELECT tasks.*, users.name as responsibleName FROM tasks LEFT JOIN users ON tasks.userId = users.id";
    const params = [];

    // Filtro por título 
    if (search) {
        query += " WHERE tasks.title LIKE ?";
        params.push(`%${search}%`);
    }

    // Ordenação por título
    if (sort === "asc") {
        query += " ORDER BY tasks.title ASC";
    } else if (sort === "desc") {
        query += " ORDER BY tasks.title DESC";
    }

    const [rows] = await db.query(query, params);
    return rows;
}


export const createTask = async ({title, category, priority, userId}) => {
    if (!title || title.length <= 3) {
        return { error: "O titulo da tarefa é obrigatório e tem que ter mais de 3 caracteres" };
    }
    
    if (title.length > 100) {
        return { error: `O título não pode ter mais de 100 caracteres. O teu tem ${title.length}.` };
    }

    const taskCategory = category || "Sem categoria";
    const taskPriority = priority || "normal"; // Valor por defeito


    const query = "INSERT INTO tasks (title, category, priority, userId, completed, conclusionDate, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(query, [title, taskCategory, taskPriority, userId || null, false, null, new Date()]);

    return {
        id: result.insertId,
        title,
        category: taskCategory,
        priority: taskPriority,
        userId: userId || null,
        completed: false,
        conclusionDate: null,
        createdAt: new Date()
    };
}

export const findTaskById = async (id) => {
    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
    return rows[0]; 
};

// CORRIGIDO: Agora recebe e salva userId
export const updateTask = async (taskId, {title, category, priority, userId, completed}) => {
    const task =  await findTaskById(taskId);

    const updatedTask = {
        title: title ?? task.title,
        category: category ?? task.category,
        priority: priority ?? task.priority,
        userId: userId !== undefined ? userId : task.userId
    }

    let updatedCompleted = completed !== undefined ? completed : task.completed;
    let conclusionDate = task.conclusionDate;

    if (completed !== undefined) {
        if (completed && !task.completed) {
            conclusionDate = new Date();
        } else if (!completed) {
            conclusionDate = null;
        }
    }

    const query = "UPDATE tasks SET title = ?, category = ?, priority = ?, userId = ?, completed = ?, conclusionDate = ? WHERE id = ?";
    
    await db.query(query, [
        updatedTask.title,
        updatedTask.category,
        updatedTask.priority,
        updatedTask.userId,
        updatedCompleted,
        conclusionDate,
        taskId
    ]);

    return {
        id: taskId,
        title: updatedTask.title,
        category: updatedTask.category,
        priority: updatedTask.priority,
        userId: updatedTask.userId,
        completed: updatedCompleted,
        conclusionDate,
        createdAt: task.createdAt
    };
}


// Exclusão de tarefa e limpeza de associações com tags
export const deleteTask = async (taskId) => {
    const [result] = await db.query("DELETE FROM tasks WHERE id = ?", [taskId]);

    if (result.affectedRows === 0) {
        return { error: "Tarefa não encontrada" };
    }

    return { message: "Tarefa deletada com sucesso" };
};

// Estatísticas gerais de tarefas
export const getTaskStats = async () => {
    const [totalRows] = await db.query("SELECT COUNT(*) AS totalTasks FROM tasks");
    const totalTasks = totalRows[0].totalTasks;
    
    const [completedRows] = await db.query("SELECT COUNT(*) AS completedTasks FROM tasks WHERE completed = true");
    const completedTasks = completedRows[0].completedTasks;
    
    const pendingTasks = totalTasks - completedTasks;

    const percentCompletedTasks = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) + "%" 
    : "0%";

    return {
        totalTasks,
        completedTasks,
        pendingTasks,
        percentCompletedTasks
    };
}

// Associação de tags a tarefas, evitando duplicações e validando existência de tarefa e tag
export const addTagToTask = async (taskId, tagId) => {
    const tId = Number(taskId);
    const tgId = Number(tagId);

    //verificar existência da tag
    const [tagRows] = await db.query("SELECT * FROM tags WHERE id = ?", [tgId]);

    if (tagRows.length === 0) {
        return {error: "Tag não encontrada"};
    }

    //evitar duplicação da mesma associação
    const [assocRows] = await db.query("SELECT * FROM task_tags WHERE taskId = ? AND tagId = ?", [tId, tgId]);

    if (assocRows.length > 0) {
        return { error: "Tag já associada a esta tarefa" };
    }

    //cria a associação tag task
    await db.query(
        "INSERT INTO task_tags (taskId, tagId) VALUES (?, ?)",
        [tId, tgId]);

    return { taskId: tId, tagId: tgId, message: "Tag associada à tarefa com sucesso" };
};

// Limpeza de associações de uma tag deletada em todas as tarefas
export const removeTagFromAllTasks = async (tagId) => {
    await db.query("DELETE FROM task_tags WHERE tagId = ?", [tagId]);
};

// Listar tarefas de uma tag, ignorando registos orfãos de tarefas deletadas
export const getTasksByTagId = async (tagId) => {
    const tId = Number(tagId);

    const [rows] = await db.query(
        "SELECT t.* FROM tasks t JOIN task_tags tt ON t.id = tt.taskId WHERE tt.tagId = ?",
        [tId]
    );

    return rows;
};