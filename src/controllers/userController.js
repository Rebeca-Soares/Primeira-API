import * as userService from "../services/userService.js";

// Recupera listafem geral de utilizafdores
export const getAllUsers = (req, res) => {
    const { search, sort } = req.query;
    const users = userService.fetchAllUsers(search, sort);
    res.json(users);
};

//Busca por utilizador
export const getUserById = (req, res) => {
    if (!req.user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Segurança: O middleware checkUserExists garante que req.user existe
    res.json(req.user);
}

//Criação de um novo usuario e validações
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

//Atualiza dados de um utilizador existente
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


//Remove um utilizador do sistema. Valida a conclusão da remoção no array em memória.
export const removeUser = (req, res) => {
    const result = userService.deleteUser(req.params.id);

    if (result.error) {
        return res.status(404).json(result);
    }

    res.json(result);
};

//Fornece métricas agregadas da base de utilizadores
export const getUserStats = (req, res) => {
    const stats = userService.getUserStats();
    res.json(stats);
}
