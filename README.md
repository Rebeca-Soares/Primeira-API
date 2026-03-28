# Projeto 1 - Criando uma API - Gestor de Tarefas

API REST completa desenvolvida em Node.js e Express para a gestão de utilizadores, tarefas, tags e comentários.

O projeto utiliza uma arquitetura de **Services** e **Controllers**, onde toda a lógica de negócio é isolada nos serviços e os dados são armazenados em um banco de dados relacional (MySQL).

## Autoria

- **Nome:** Rebeca Cerqueira
- **Repositório:** [GitHub - Primeira API](https://github.com/Rebeca-Soares/Primeira-API/tree/Aula_03_BD)

## Tecnologias

- **Node.js**
- **Express 5**
- **JavaScript**
- **MySQL**
- **npm**

## Requisitos

- O objetivo deste projeto é criar uma API completa para gerenciamento de tarefas, incluindo utilizadores, tarefas, tags e comentários.
- Deve ser entregue todos os endpoints mencionados em aula e nos exercícios de entrega.
- Usar Node.js com Express e JSON nas respostas.
- Todos os dados devem ser armazenados em um banco de dados relacional (MySQL).
- Validações e lógica de negócio devem ser feitas nos services, enquanto os controllers apenas retornam JSON.
- IDs são gerados automaticamente pelo banco de dados para todas as entidades (users, tasks, tags, comments).

## Instalação e Execução

1. Instale as dependências:

```bash
npm install
Inicie o servidor:

Bash
npm start
O servidor estará ativo em: http://localhost:3000.
```

Estrutura do Projeto:

```bash

src/
    controllers/
        commentController.js
        tagController.js
        taskController.js
        userController.js
    middlewares/
        checkUserExists.js
        checkTasksExists.js
        loggerMiddleware.js
    routes/
        tagRoutes.js
        taskRoutes.js
        userRoutes.js
    services/
        commentServices.js
        tagServices.js
        taskServices.js
        userServices.js
server.js
package.json
.gitignore
.database/
    ddl-create-tables.sql


```

## Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```properties
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=gerenciador_tarefas_users

# Server Configuration
PORT=3000
NODE_ENV=development

# API Configuration
API_URL=http://localhost:3000
```

## Endpoints da API

## Utilizadores (/users)

- GET /users: Lista utilizadores (suporta search e sort=asc|desc).

- GET /users/stats: Estatísticas de utilizadores ativos e inativos.

- POST /users: Criação de novo utilizador.

- PUT /users/:id: Atualização dos dados do utilizador.

- PATCH /users/:id: Alterna o estado ativo/inativo do utilizador.

- DELETE /users/:id: Remove um utilizador.

Exemplo de criação:

```bash
curl -X POST http://localhost:3000/users \
    -H "Content-Type: application/json" \
    -d '{"name": "Rebeca Cerqueira", "email": "rsc@example.com", "active": true}'
```

## Tarefas (/tasks)

- GET /tasks: Lista todas as tarefas (suporta search e sort).

- GET /tasks/stats: Estatísticas de tarefas pendentes e concluídas.

- POST /tasks: Criação de tarefa (campo concluida inicia como false).

- PUT /tasks/:id: Atualização de tarefa (gera dataConclusao automaticamente se concluída).

- DELETE /tasks/:id: Remoção de tarefa.

- POST /tasks/:id/tags: Associa uma tag à tarefa (N:N).

- POST /tasks/:id/comments: Cria um comentário vinculado à tarefa (1:N).

- GET /tasks/:id/comments: Lista os comentários de uma tarefa.

Exemplo de criação:

```bash
curl -X POST http://localhost:3000/tasks \
    -H "Content-Type: application/json" \
    -d '{"title": "Criar API", "category": "Trabalho", "responsibleName": "Rebeca"}'
```

## Tags (/tags)

- GET /tags: Lista todas as tags globais.

- POST /tags: Cria uma nova tag.

- DELETE /tags/:id: Remove a tag e limpa as suas associações nas tarefas.

- GET /tags/:id/tasks: Lista todas as tarefas associadas a uma tag.

Exemplo de criação:

```bash
curl -X POST http://localhost:3000/tasks/1/tags \
    -H "Content-Type: application/json" \
    -d '{"tagId": 2}'
```

## Comentários

```bash
curl -X POST http://localhost:3000/tasks/1/comments \
	-H "Content-Type: application/json" \
	-d '{"userId":1,"conteudo":"Tarefa iniciada."}'
```

## Validações Implementadas

- Utilizadores: 
O campo email deve ser válido e o nome é obrigatório para a criação.

- Tarefas: 
O titulo é obrigatório e tem que ter mais de 3 caracteres. Se a tarefa for marcada como completed, o sistema mantém a integridade dos dados.

- Tags: O nome da tag é obrigatório, não pode ser vazio e o sistema impede a criação de nomes duplicados.

## Relacionamentos:

- N:N (Tags): O sistema impede que a mesma tag seja associada múltiplas vezes à mesma tarefa.

- 1:N (Comentários): Cada comentário regista automaticamente a data e hora da criação.

- Segurança de Dados: Middlewares verificam a existência de User e Task antes de processar pedidos de atualização ou criação de vínculos.

## Middlewares e Validações

- logger.js: Regista no terminal o método, URL e timestamp de cada pedido.

- checkUserExists.js: Valida se o ID do utilizador existe antes de processar o pedido.

- checkTasksExists.js: Valida a existência da tarefa em rotas de comentários e tags.

## Notas Técnicas

- Os dados são voláteis. Ao reiniciar o servidor (server.js), todos os arrays voltam ao estado vazio ou inicial.

- Logs: Todas as requisições são registadas no terminal (Método, URL e Data) via middleware de logging.