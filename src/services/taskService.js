let tasks = [];
let id = 1;
let taskTags = []; //Relações Task - Tag

export const getAllTasks = (search, sort) => {
    let filteredTasks = [...tasks];

    // filtro por título
    if (search) {
        filteredTasks = filteredTasks.filter(t => 
            t.title.toLowerCase().includes(search.toLowerCase()) 
        );
    }

    // ordenação por título
    if (sort === "asc") {
        filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "desc") {
        filteredTasks.sort((a, b) => b.title.localeCompare(a.title));
    }

    return filteredTasks;
}

// Busca tarefa por ID (usada no middleware de validação)
export const findTaskById = (taskId) => {
    return tasks.find(t => t.id == Number(taskId));
};

// Criação de tarefa com validação de título obrigatório e mínimo de caracteres
export const createTask = (taskData) => {
    if (!taskData.title || taskData.title.length <= 3) {
        return { error: "O titulo da tarefa é obrigatório e tem que ter mais de 3 caracteres" };
    }

    const newTask = {
        id: id++,
        title: taskData.title,
        category: taskData.category || "Sem categoria",
        responsibleName: taskData.responsibleName,
        completed: false,
        conclusionDate: undefined // Requisito: deve ser undefined até à conclusão
    };

    tasks.push(newTask);
    return newTask;
}

// Atualização de tarefa com lógica para definir ou limpar a data de conclusão
export const updateTask = (taskId, data) => {
    const task = tasks.find(t => t.id == Number(taskId));
    
    if (!task) {
        return { error: "Tarefa não encontrada"};
    }

    // Atualização apenas os campos enviados 
    task.title = data.title ?? task.title;
    task.category = data.category ?? task.category;
    task.responsibleName = data.responsibleName ?? task.responsibleName;

    // Gestão automatica de timestamp de conclusão
    if (data.completed !== undefined) {
        if (data.completed && !task.completed) {
            task.conclusionDate = new Date().toLocaleString();
        } else if (!data.completed) {
            task.conclusionDate = undefined;
        }
        task.completed = data.completed;
    }

    return task;
}

// Exclusão de tarefa e limpeza de associações com tags
export const deleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === Number(taskId));

    if (!taskToDelete) {
        return { error: "Tarefa não encontrada" };
    }

    tasks = tasks.filter(t => t.id !== Number(taskId));
    taskTags = taskTags.filter(rel => rel.taskId !== Number(taskId)); // Remove associações da tarefa deletada

    return taskToDelete;

};

// Estatísticas gerais de tarefas
export const getTaskStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const percentActiveTasks = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
        "Total Tasks": totalTasks,
        "Concluídas": completedTasks,
        "Pendentes": pendingTasks,
        percentActiveTasks: percentActiveTasks.toFixed(2) + "%"
    };
}

// Associação de tags a tarefas, evitando duplicações e validando existência de tarefa e tag
export const addTagToTask = (taskId, tagId) => {
    const tId = Number(taskId);
    const tgId = Number(tagId);

    //evitar duplicação da mesma associação
    const exists = taskTags.find(taskTag => taskTag.taskId === tId && taskTag.tagId === tgId)

    if (exists) {
        return {error: "Tag já associada a esta tarefa"};
    }
    const newAssociation = { taskId: tId, tagId: tgId };
    taskTags.push(newAssociation);
    return newAssociation;
};

// Limpeza de associações de uma tag deletada em todas as tarefas
export const removeTagFromAllTasks = (tagId) => {
    taskTags = taskTags.filter(a => a.tagId !== Number(tagId));
};

// Listar tarefas de uma tag, ignorando registos orfãos de tarefas deletadas
export const getTasksByTagId = (tagId) => {
    const tId = Number(tagId);
    const relationsTags = taskTags.filter(a => a.tagId === tId);

    const tasksOfTag = relationsTags
        .map(rel => tasks.find(t => t.id === rel.taskId))
        .filter(t => t); //remover tasks deletadas

    return tasksOfTag;
};