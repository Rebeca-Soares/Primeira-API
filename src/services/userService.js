let users = [];
let nextId = 1;

export const fetchAllUsers = (search, sort) => {
    let filteredUsers = [...users];

    if (search) {
        filteredUsers = filteredUsers.filter(u => 
            u.name.toLowerCase().includes(search.toLowerCase()) // filtra por nome
        );
    }
    if (sort === "asc") {
        filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "desc") {
        filteredUsers.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filteredUsers;
};

export const createUser = (userData) => {
    
    const newUser = {
        id: nextId++,
        name: userData.name,
        email: userData.email,
        active: userData.active ?? true
    };
    users.push(newUser);
    return newUser;
};

export const findUserById = (userId) => {
    return users.find(u => u.id === Number(userId));
};

export const updateUser = (userId, data) => {
    const user = findUserById(userId);
    
    if (!user) {
        return { error: "Usuário não encontrado" };
    }

    // Atualiza apenas o que foi enviado (nullish coalescing)
    user.name = data.name ?? user.name;
    user.email = data.email ?? user.email;
    user.active = data.active ?? user.active;

    return user;
}

export const deleteUser = (userId) => {
    const initialLength = users.length;

    users = users.filter(u => u.id !== Number(userId));

    if (users.length === initialLength) {
        return { error: "Usuário não encontrado" };
    }

    return { message: "Usuário removido com sucesso" };
};

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

