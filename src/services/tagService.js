import * as taskService from "./taskService.js";

let tags = [];
let TagId = 1;

// Busca todas as tags
export const fetchAllTags = () => {
    return tags;
};

// Criação de tag com validação de nome obrigatório e prevenção de duplicatas
export const createTag = (tagData) => {
    if (!tagData.name || tagData.name.trim() === "") {
        return { error: "O nome da tag é obrigatório" };
    }

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
    //Mantém a integridade referencial ao remover a tag de todas as tarefas associadas.
    taskService.removeTagFromAllTasks(idNum); 
    return tag; 
};

// Busca tag por ID
export const findTagById = (tagId) => {
    return tags.find(t => t.id === Number(tagId));
};