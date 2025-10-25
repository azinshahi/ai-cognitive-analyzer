// server/server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Replace with your OpenAI API key later via environment variable
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post('/analyze', async (req, res) => {
    const { userInput } = req.body;

    if (!userInput) {
        return res.json({ risk: 'none', message: 'Please enter a behavior description.' });
    }

    try {
        const prompt = `
Analyze this user behavior for cybersecurity risk.
Classify as High, Medium, or Low risk and explain why in one sentence.
Behavior: "${userInput}"
Respond in JSON: { "risk": "high/medium/low", "message": "<explanation>" }
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-5-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0
        });

        const responseText = completion.choices[0].message.content;

        let aiResponse;
        try { 
            aiResponse = JSON.parse(responseText); 
        } catch { 
            aiResponse = { risk: 'medium', message: 'AI could not parse input.' }; 
        }

        res.json(aiResponse);

    } catch (error) {
        console.error(error);
        res.json({ risk: 'medium', message: 'Error analyzing behavior.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
