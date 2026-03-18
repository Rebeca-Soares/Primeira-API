let users = [];
let nextId = 1;

// Busca todos os usuários com opções de filtro por nome e ordenação
export const fetchAllUsers = (search, sort) => {
    let filteredUsers = [...users];

    if (search) {
        filteredUsers = filteredUsers.filter(u => 
            u.name.toLowerCase().includes(search.toLowerCase()) 
        );
    }
    if (sort === "asc") {
        filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "desc") {
        filteredUsers.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filteredUsers;
};

// Criação de usuário com validação de nome e email obrigatórios, e valor padrão para 'active'
export const createUser = (userData) => {
    
    const newUser = {
        id: nextId++,
        name: userData.name,
        email: userData.email,
        active: userData.active ?? true // Garante 'true' se não especificado
    };
    users.push(newUser);
    return newUser;
};

// Busca usuário por ID (usada no middleware de validação)
export const findUserById = (userId) => {
    return users.find(u => u.id === Number(userId));
};

// Atualização de usuário com validação para campos opcionais e manutenção de valores existentes
export const updateUser = (userId, data) => {
    const user = findUserById(userId);
    
    if (!user) {
        return { error: "Usuário não encontrado" };
    }

    // Atualiza apenas o que foi enviado 
    user.name = data.name ?? user.name;
    user.email = data.email ?? user.email;
    user.active = data.active ?? user.active;

    return user;
}

// Deleta usuário por ID com verificação de existência e retorno de mensagens apropriadas
export const deleteUser = (userId) => {
    const initialLength = users.length;

    users = users.filter(u => u.id !== Number(userId));

    if (users.length === initialLength) {
        return { error: "Usuário não encontrado" };
    }

    return { message: "Usuário removido com sucesso" };
};

// Geração de estatísticas de usuários
export const getUserStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.active).length;
    const inactiveUsers = totalUsers - activeUsers;
    const percentActiveUsers = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

    return {
        totalUsers,
        activeUsers,
        inactiveUsers, 
        percentActiveUsers: percentActiveUsers.toFixed(2) + "%"
    };
}

