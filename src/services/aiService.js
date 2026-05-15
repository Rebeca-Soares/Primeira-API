import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

// Inicializa o cliente do Gemini com a chave de API
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `És um assistente de gestão de tarefas chamado TaskBot. [Role]
A tua tarefa é ajudar o utilizador a criar, editar, listar e apagar tarefas, também dê sugestões de produtividade. [Task]

Regras vitais:
1. Se o utilizador pedir para atualizar, mudar, modificar ou editar uma tarefa, DEVES usar "action": "UPDATE".
2. Em "filter", escreve SEMPRE o NOME da tarefa que o utilizador quer alterar. NUNCA escrevas "last_task" ou vazio.
3. Coloca os novos valores (título, categoria, prioridade) dentro da chave "changes". Não cries chaves novas como "update" ou "space". 
4. Apenas delete a tarefa se o utilizador pedir para Deletar ou Apagar. NUNCA deletar sem um pedido explícito. Caso tenha finalizado a tarefa, marque a tarefa como concluida apenas.
5. ATENÇÃO: Cria APENAS UMA tarefa de cada vez. Se o utilizador enviar uma lista com várias, escolhe a primeira para criar e informa na "message" que só crias uma por vez e pede para enviar uma de cada vez, mas só se pedir mais de uma tarefa na mesma solicitação. 
Usa "category" para categoria. Usa "title" para o nome. Usa "priority" para prioridade.

Responde SEMPRE em JSON válido com este formato exato [Format], :
{
  "message": "Mensagem amigável a dizer o que fizeste",
  "action": "CREATE" | "UPDATE" | "DELETE" | "LIST" | "NONE",
  "task": { "title": "...", "category": "...", "priority": "URGENT", "dueDate": "..." },
  "filter": { "title": "nome da tarefa a procurar" },
  "changes": { "priority": "nova prioridade", "category": "nova categoria", "title": "novo titulo" }
}

Não incluas texto fora do JSON.

Regras: 
- Usa sempre português de Portugal
- Sê muito simpático, direto, conciso e fofo.
.
`

// Converter histórico do formato interno para o formato do Gemini
const formatHistory = (history) =>
    history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));


    // Função para chamadas com streaming
export const callGeminiStream = async (userMessage, history = []) => {
    const chat = genAI.chats.create({
        model: "gemini-3.1-flash-lite",
        config: {
            responseMimeType: "application/json",
            systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: formatHistory(history),
    });

    const stream = await chat.sendMessageStream({ message: userMessage });
    return stream;
};

// Função para chamadas sem streaming, útil para respostas rápidas ou quando o streaming não é necessário
export const callGemini = async (userMessage, history = []) => {
    const chat = genAI.chats.create({
        model: "gemini-3.1-flash-lite",
        config: {
            responseMimeType: "application/json",
            systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: formatHistory(history),
    });

    const response = await chat.sendMessage({ message: userMessage });

    return response.text;
};