import * as userService from "../services/userService.js";

export const getAllUsers = (req, res) => {
    const { search, sort } = req.query;
    const users = userService.fetchAllUsers(search, sort);
    res.json(users);
};

export const getUserById = (req, res) => {
    if (!req.user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(req.user);
}

export const postUser = (req, res) => {
    const { name, email, active } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ error: "O nome é obrigatório." });
    }

    // Validar se o email é válido
    if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Email inválido" });
    }

    if (active !== undefined && typeof active !== "boolean") {
        return res.status(400).json({ error: "O campo 'active' deve ser booleano." });
    }

    // Criar o novo utilizador com valores padrão
    const newUser = userService.createUser(
        {
            name,
            email,
            active
        }
);

    res.status(201).json(newUser);
};

export const updateUser = (req, res) => {
    const user = req.user; // Obtém o usuário do middleware

    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const { name, email, active } = req.body;

    if (name === "") {
        return res.status(400).json({ error: "Nome não pode ser vazio" });
    }
    
    if (email !== undefined && !email.includes("@")) {
        return res.status(400).json({ error: "E-mail inválido." });
    }

    if (active !== undefined && typeof active !== "boolean") {
        return res.status(400).json({ error: "O campo 'active' deve ser um booleano." });
    }

    const updatedUser = userService.updateUser(user.id, { name, email, active }); // usuario não encontrado 

    if (updatedUser.error) {
        return res.status(404).json(updatedUser);
    }

    res.json(updatedUser); // retorna o usuário atualizado 
};

export const removeUser = (req, res) => {
    const result = userService.deleteUser(req.params.id);

    if (result.error) {
        return res.status(404).json(result);
    }

    res.json(result);
};

// retorna usuário atualizado
export const getUserStats = (req, res) => {
    const stats = userService.getUserStats();
    res.json(stats);
}
