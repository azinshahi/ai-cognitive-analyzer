import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/analyze', async (req, res) => {
  const { behavior } = req.body;

  if (!behavior) {
    return res.status(400).json({ risk: 'error', message: 'No behavior provided.' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral/mixtral-8x7b',
        messages: [
          { role: 'system', content: 'You are a cybersecurity assistant. Assess risk level and explain.' },
          { role: 'user', content: behavior }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response';
    res.json({ risk: 'high', message: reply });
  } catch (error) {
    res.status(500).json({ risk: 'error', message: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
