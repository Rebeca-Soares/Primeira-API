import * as userService from "../services/userService.js";

// Recupera listafem geral de utilizafdores
export const getAllUsers = async (req, res) => {
    try {
        const { search, sort } = req.query;
        const users = await userService.fetchAllUsers(search, sort);

        if (!users || users.length === 0) {
            return res.status(404).json({ message: `Nenhum utilizador encontrado com o termo: "${search}"` });
        }

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar utilizadores." });
    }
};

//Busca por utilizador
export const getUserById = (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar utilizador." });
    }
}

//Criação de um novo usuario e validações
export const createUser = async (req, res) => {
    try { 
        const { name, email, active } = req.body;
        // Validar os dados do usuário usando o serviço
        const validationError = userService.validateUserData({ name, email, active });
        if (validationError) {
            return res.status(400).json(validationError);
        }
        // Criar o novo utilizador com valores padrão
        const newUser = await userService.createUser({ name, email, active});
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Erro ao criar utilizador:", error); // Log do erro no servidor
        res.status(500).json({ 
            error: "Erro ao criar utilizador.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined // Inclui detalhes apenas em dev
        });
    }
};

//Atualiza dados de um utilizador existente
export const updateUser = async (req, res) => {
    try {
        const user = req.user; // Obtém o usuário do middleware

        const { name, email, active } = req.body;

        // Atualizar o usuário
        const updatedUser = await userService.updateUser(user.id, { name, email, active });

        if (updatedUser.error) {
            return res.status(404).json(updatedUser);
        }

        res.json(updatedUser); // Retorna o usuário atualizado
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar utilizador." });
    }
};

//Remove um utilizador do sistema. Valida a conclusão da remoção no array em memória.
export const removeUser = async (req, res) => {

    try {
        const result = await userService.deleteUser(req.params.id);
        if (result.error) {
            return res.status(404).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Erro ao remover utilizador." });
    }
};

//Fornece métricas agregadas da base de utilizadores
export const getUserStats = async (req, res) => {
    try {
        const stats = await userService.getUserStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: "Erro ao obter estatísticas de utilizadores." });
    }
}
