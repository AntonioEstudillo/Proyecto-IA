const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 3000;

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/generate', async (req, res) => {
    const input = req.body.query;

    if (input.trim().toLowerCase() === "exit") {
        return res.json({ response: "Saliendo..." });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContentStream([input]);
        
        let generatedText = "";
        for await (const chunk of result.stream) {
            generatedText += chunk.text();
        }

        res.json({ response: generatedText });
    } catch (error) {
        res.status(500).json({ response: "Error al generar la respuesta" });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
