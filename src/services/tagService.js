import db from "../../db.js";
import * as taskService from "./taskService.js";


// Busca todas as tags
export const fetchAllTags = async () => {
    const [rows] = await db.query("SELECT * FROM tags");
    return rows;
};

// Criação de tag com validação de nome obrigatório e prevenção de duplicatas
export const createTag = async ({name}) => {

    if (!name || name.trim() === "") {
        return { error: "O nome da tag é obrigatório" };
    }

    const [rows] = await db.query("SELECT * FROM tags WHERE name = ?", [name.trim()]);
    if (rows.length > 0) {
        return { error: "Tag já existe" };
    }

    const [result] = await db.query("INSERT INTO tags (name) VALUES (?)", [name]);

    return {
        id: result.insertId,
        name: name,
    };
}

// Deleta tag e remove associações em tasks
export const deleteTag = async (tagId) => {
    const [result] = await db.query("DELETE FROM tags WHERE id = ?", [tagId]);

    if (result.affectedRows === 0) 
        return { error: "Tag não encontrada" };

    return { message: "Tag deletada com sucesso"}; 
};

// Busca tag por ID
export const findTagById = async (tagId) => {
    const [rows] = await db.query("SELECT * FROM tags WHERE id = ?", [tagId]);
    return rows[0]; // retorna a tag encontrada ou undefined
};