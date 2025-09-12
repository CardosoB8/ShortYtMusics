// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

// Endpoint para gerar texto com IA
app.post('/api/generate-text', async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error('API_KEY not configured.');
            return res.status(500).json({ error: 'Erro no servidor: Chave de API não configurada.' });
        }

        const { prompt } = req.body;
        const systemPrompt = `Você é um criador de conteúdo especializado em mensagens curtas e de impacto para redes sociais, como status do WhatsApp. Seu objetivo é gerar mensagens criativas, inspiradoras ou engraçadas baseadas no prompt do usuário. Responda apenas com a mensagem, sem frases introdutórias ou explicações.`;
        const userQuery = `Gere um status de WhatsApp com base no seguinte: "${prompt}". A mensagem deve ser concisa e ter no máximo 150 caracteres.`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        // --- MUDANÇA AQUI ---
        // A URL agora usa o modelo gemini-2.0-flash
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        // --- FIM DA MUDANÇA ---

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na API externa:', response.status, errorText);
            return res.status(response.status).json({ error: 'Erro ao gerar texto com a IA.' });
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
            res.json({ text: text });
        } else {
            res.status(500).json({ error: 'Não foi possível gerar a mensagem. Resposta da IA incompleta.' });
        }

    } catch (error) {
        console.error('Erro no servidor durante a chamada da API de texto:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Endpoint para gerar imagem com IA
app.post('/api/generate-image', async (req, res) => {
    // Código de geração de imagem permanece o mesmo
    // ...
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
