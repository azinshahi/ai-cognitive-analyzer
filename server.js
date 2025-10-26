const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// initialize OpenAI with environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/analyze', async (req, res) => {
  const userInput = req.body.userInput; // exactly this

  if (!userInput) {
    return res.json({ risk: 'none', message: 'Please enter a behavior description.' });
  }

  try {
    const prompt = `
You are a cybersecurity and human behavior expert.
Analyze this behavior for cybersecurity risk and classify as High, Medium, or Low risk.
Behavior: "${userInput}"
Respond in JSON: { "risk": "high/medium/low", "message": "<short explanation>" }
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2
    });

    let aiResponse;
    try {
      aiResponse = JSON.parse(completion.choices[0].message.content);
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
