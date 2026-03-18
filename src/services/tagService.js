import * as taskService from "./taskService.js";

let tags = [];
let TagId = 1;

export const fetchAllTags = () => {
    return tags;
};

export const createTag = (tagData) => {
    if (!tagData.name || tagData.name.trim() === "") {
        return { error: "O nome da tag é obrigatório" };
    }

    // evita tags duplicadas
    const exists = tags.find(t => t.name.toLowerCase() === tagData.name.toLowerCase());
    if (exists) return { error: "Tag já existe" };

    const newTag = {
        id: TagId++,
        name: tagData.name.trim(),
    };

    tags.push(newTag);
    return newTag;
}

// Deleta tag e remove associações em tasks
export const deleteTag = (tagId) => {
    const idNum = Number(tagId);
    const tag = tags.find(t => t.id === idNum);
    if (!tag) return { error: "Tag não encontrada" };

    tags = tags.filter(t => t.id !== idNum);
    taskService.removeTagFromAllTasks(idNum); // limpa tag das tasks
    return tag; 
};

export const findTagById = (tagId) => {
    return tags.find(t => t.id === Number(tagId));
};