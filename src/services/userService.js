import { db } from "../../db.js";

// Busca todos os usuários com opções de filtro por nome e ordenação
export const fetchAllUsers = async (search, sort) => {
    let query = "SELECT * FROM users";
    const params = [];

    if (search) {
        query += " WHERE name LIKE ?";
        params.push(`%${search}%`);
    }
    if (sort === "asc") {
        query += ` ORDER BY name ASC`;
    } else if (sort === "desc") {
        query += ` ORDER BY name DESC`;
    }

    const [rows] = await db.query(query, params);
    return rows;
};

// Criação de usuário com validação de nome e email obrigatórios, e valor padrão para 'active'
export const createUser = async ({ name, email, active = true }) => {
    const query = "INSERT INTO users (name, email, active) VALUES (?, ?, ?)";
    const [result] = await db.query(query, [name, email, active]
    );

    return {
        id: result.insertId,
        name,
        email,
        active // Garante 'true' se não especificado
    };
};

// Validação de dados do usuário
export const validateUserData = ({ name, email, active }) => {
    if (!name || name.trim() === "") {
        return { error: "O nome é obrigatório." };
    }

    if (!email || !email.includes("@")) {
        return { error: "Email inválido" };
    }

    if (active !== undefined && typeof active !== "boolean") {
        return { error: "O campo 'active' deve ser booleano." };
    }

    return null; // Nenhum erro
};

// Busca usuário por ID (usada no middleware de validação)
export const findUserById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE id = ?",
        [id]);

        return rows[0]; // Retorna o primeiro resultado ou undefined se não encontrado
}

// Atualização de usuário com validação para campos opcionais e manutenção de valores existentes
export const updateUser = async (userId, {name, email, active}) => {
    const user = await findUserById(userId);

    if (!user) {
        return { error: "Usuário não encontrado" };
    }

    // Validações 
    if (name !== undefined && name.trim() === "") {
        return { error: "O nome não pode ser vazio." };
    }

    if (email !== undefined && !email.includes("@")) {
        return { error: "E-mail inválido." };
    }

    if (active !== undefined && typeof active !== "boolean") {
        return { error: "O campo 'active' deve ser um booleano." };
    }

    const updatedUser = {
        name: name ?? user.name,
        email: email ?? user.email,
        active: active ?? user.active,
    };

    const query = "UPDATE users SET name = ?, email = ?, active = ? WHERE id = ?";

    await db.query(query, [updatedUser.name, updatedUser.email, updatedUser.active, userId]);

    return { id: userId,
            name: updatedUser.name,
            email: updatedUser.email,
            active: updatedUser.active
    };
};

// Deleta usuário por ID com verificação de existência e retorno de mensagens apropriadas
export const deleteUser = async (userId) => {
    const [result] = await db.query(
        "DELETE FROM users WHERE id = ?", 
        [userId]);

    // affectedRows indica quantas linhas foram afetadas pela operação DELETE. Se for 0, significa que nenhum usuário com o ID fornecido foi encontrado para deletar.
    if (result.affectedRows === 0) {
        return { error: "Usuário não encontrado" };
    }
    return { message: "Usuário removido com sucesso" };
};

// Geração de estatísticas de usuários
export const getUserStats = async () => {
    const [totalRows] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
    const totalUsers = totalRows[0].totalUsers;

    const [activeRows] = await db.query("SELECT COUNT(*) AS activeUsers FROM users WHERE active = true");
    const activeUsers = activeRows[0].activeUsers;

    const inactiveUsers = totalUsers - activeUsers;
    const percentActiveUsers = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) + "%" 
        : "0%";

    return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        percentActiveUsers
    };
}

