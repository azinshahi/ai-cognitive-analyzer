import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { behavior } = req.body;

  if (!behavior) {
    return res.status(400).json({ risk: 'error', message: 'No behavior provided.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a cybersecurity assistant. Assess the risk level of user behavior and explain why.'
          },
          {
            role: 'user',
            content: behavior
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('🔴 OpenAI error:', data);
      return res.status(500).json({ risk: 'error', message: 'OpenAI API failed.' });
    }

    const reply = data.choices[0].message.content;
    res.json({ risk: 'high', message: reply });
  } catch (error) {
    console.error('🔴 Unexpected error:', error.message);
    res.status(500).json({ risk: 'error', message: 'Failed to analyze behavior.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
