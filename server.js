// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos e JSON
app.use(cors());
app.use(express.json());

// Rota para a página inicial
// Isso vai servir o arquivo index.html quando a URL base for acessada
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para gerar texto com IA
app.post('/api/generate-text', async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured.' });
        }

        const { prompt } = req.body;
        const systemPrompt = `Você é um criador de conteúdo especializado em mensagens curtas e de impacto para redes sociais, como status do WhatsApp. Seu objetivo é gerar mensagens criativas, inspiradoras ou engraçadas baseadas no prompt do usuário. Responda apenas com a mensagem, sem frases introdutórias ou explicações.`;
        const userQuery = `Gere um status de WhatsApp com base no seguinte: "${prompt}". A mensagem deve ser concisa e ter no máximo 150 caracteres.`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
            res.json({ text: text });
        } else {
            res.status(500).json({ error: 'Não foi possível gerar a mensagem.' });
        }

    } catch (error) {
        console.error('Erro na chamada da API:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Endpoint para gerar imagem com IA
app.post('/api/generate-image', async (req, res) => {
    try {
        const apiKey = process.env.API_KEY; // Usando a mesma chave, se aplicável
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured.' });
        }

        const { prompt } = req.body;
        const payload = {
            instances: { prompt: prompt },
            parameters: { "sampleCount": 1 }
        };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        const base64Data = result?.predictions?.[0]?.bytesBase64Encoded;

        if (base64Data) {
            res.json({ base64: base64Data });
        } else {
            res.status(500).json({ error: 'Não foi possível gerar a imagem.' });
        }

    } catch (error) {
        console.error('Erro na chamada da API de imagem:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
