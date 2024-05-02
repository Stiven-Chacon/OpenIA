const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY || "API KEY OPENAI_API_KEY",
});
const openai = new OpenAIApi(configuration);

app.use(cors()); 

app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const chatResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });

        const reply = chatResponse.data.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/', (req, res) => {
    res.status(200).send("Api NODE.JS")
})

app.listen(PORT, () => {
    console.log(`El servidor está en http://localhost:${PORT}`);
});
