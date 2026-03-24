import * as tagService from "../services/tagService.js";
import * as taskService from "../services/taskService.js";

// Lista todas as tags
export const getAllTags = async (req, res) => {
    try {
        const tags = await tagService.fetchAllTags();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar tags." });
    }
};


// Criação de tag com validação de nome obrigatório e prevenção de duplicatas
export const createTag = async (req, res) => {
    try {
        const tag = await tagService.createTag(req.body);

        if (tag.error) {
            return res.status(400).json({ error: tag.error }); // validação
        }

        res.status(201).json(tag);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar tag." });
    }
}

// Deleta tag e remove associações em tasks
export const deleteTag = async (req, res) => {
    try {
        const deletedTag = await tagService.deleteTag(req.params.id);

        if (deletedTag.error) {
            return res.status(404).json(deletedTag); // tag não encontrada
        }

        res.json({ message: "Tag deletada com sucesso"});
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar tag." });
    }
}

// Lista todas as tasks associadas a uma tag
export const getTasksByTagId = async (req, res) => {
    try {
        const tagId = req.params.id;

        const tag = await tagService.findTagById(tagId);
        if (!tag) {
            return res.status(404).json({ error: "Tag not found" });
        }
        const tasks = await taskService.getTasksByTagId(tagId);
        res.json(tasks); // retorna tasks associadas à tag
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar tasks por tag." });
    }
}