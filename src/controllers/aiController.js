import * as aiService from "../services/aiService.js";

export const handleChat = async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Mensagem é obrigatória" });
    }

    try {
        const aiResponse = await aiService.callGemini(message, history);
        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Erro no handleChat:", error);
        res.status(500).json({ error: error.message });
    }
};

export const handleChatStream = async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Mensagem é obrigatória" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
        const stream = await aiService.callGeminiStream(message, history);

        let fullText = "";

        for await (const chunk of stream) {
            const chunkText = chunk.text;
            if (chunkText) {
                fullText += chunkText;
                res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
            }
        }

        res.write(`data: ${JSON.stringify({ done: true, full: fullText })}\n\n`);
        res.end();

    } catch (error) {
        console.error("Erro no streaming:", error);
        
        const fallbackResponse = {
            message: "O assistente está sobrecarregado no momento (Erro 503). Por favor, tente novamente em alguns segundos.",
            action: "NONE"
        };
    
        if (!res.headersSent) {
            // Se a requisição ainda não começou a responder
            res.status(503).json(fallbackResponse);
        } else {
            // Se o stream já tinha começado
            res.write(JSON.stringify(fallbackResponse));
            res.end();
        }
    }
};