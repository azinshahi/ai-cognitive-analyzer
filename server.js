const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post('/analyze', async (req, res) => {
  try {
    const { activity } = req.body;
    if (!activity) return res.status(400).json({ error: 'Activity is required' });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a cybersecurity and human behavior expert. Evaluate the risk of the given activity and provide a risk level (Low, Moderate, High) with a brief explanation.' },
        { role: 'user', content: `Activity: ${activity}` }
      ],
      temperature: 0.2
    });

    const aiText = completion.choices[0].message.content;

    let riskLevel = 'Moderate';
    let explanation = aiText;
    const match = aiText.match(/Risk Level: (\w+)/i);
    if (match) {
      riskLevel = match[1];
      explanation = aiText.replace(match[0], '').trim();
    }

    res.json({ riskLevel, explanation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to analyze activity' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
