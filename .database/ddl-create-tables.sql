CREATE DATABASE gerenciador_tarefas_users;
USE gerenciador_tarefas_users;

-- Tabela de Utilizadores
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT TRUE
);

-- Tabela de Tarefas
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(100) DEFAULT 'Sem categoria',
        priority VARCHAR(50) DEFAULT 'normal',
    userId INT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    conclusionDate DATETIME DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabela de Tags
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Tabela de Ligação (N:N)
CREATE TABLE task_tags (
    taskId INT NOT NULL, 
    tagId INT NOT NULL,  
    PRIMARY KEY (taskId, tagId),
    FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
);

-- Tabela de Comentários
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    taskId INT NOT NULL, 
    userId INT NULL,          
    conteudo TEXT NOT NULL,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT DEFAULT 1,
    role VARCHAR(50) NOT NULL, -- 'user' ou 'assistant'
    content TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);