import * as tagService from "../services/tagService.js";
import * as taskService from "../services/taskService.js";

export const getAllTags = (req, res) => {
    const tags = tagService.fetchAllTags();
    res.json(tags);
};

export const createTag = (req, res) => {
    const tag = tagService.createTag(req.body);

    if (tag.error) {
        return res.status(400).json({ error: tag.error }); // validação
    }

    res.status(201).json(tag);
}

export const deleteTag = (req, res) => {
    const deletedTag = tagService.deleteTag(req.params.id);

    if (deletedTag.error) {
        return res.status(404).json(deletedTag); // tag não encontrada
    }

    res.json({ message: "Tag deleted successfully", tag: deletedTag });
}

// Lista todas as tasks associadas a uma tag
export const getTasksByTagId = (req, res) => {
    const { id } = req.params;

    const tag = tagService.findTagById(id);
    if (!tag) {
        return res.status(404).json({ error: "Tag not found" });
    }
    const tasks = taskService.getTasksByTagId(id);
    res.json(tasks); // retorna tasks associadas à tag
}