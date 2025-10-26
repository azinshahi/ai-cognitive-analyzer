const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/analyze', async (req, res) => {
  const userInput = req.body.userInput;

  if (!userInput) {
    return res.json({ risk: 'none', message: 'Please enter a behavior description.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a cybersecurity and human behavior expert. Respond **only in JSON** with fields "risk" (high, medium, low) and "message" (one sentence explanation).'
        },
        { role: 'user', content: `Analyze this behavior: "${userInput}"` }
      ],
      temperature: 0.2
    });

    let aiText = completion.choices[0].message.content;

    // Remove Markdown code block if it exists
    aiText = aiText.replace(/```json|```/g, '').trim();

    let aiResponse;
    try {
      aiResponse = JSON.parse(aiText);
    } catch {
      aiResponse = { risk: 'medium', message: aiText };
    }

    res.json(aiResponse);

  } catch (err) {
    console.error(err);
    res.json({ risk: 'medium', message: 'Error analyzing behavior.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
