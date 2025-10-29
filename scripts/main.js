import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { behavior } = req.body;

  if (!behavior) {
    return res.status(400).json({
      risk: 'error',
      message: 'Missing behavior input.'
    });
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

    if (!response.ok) {
      return res.status(500).json({
        risk: 'error',
        message: data?.error?.message || 'OpenRouter API failed.'
      });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      data.choices?.[0]?.text ||
      'No response';

    res.json({
      risk: 'high',
      message: reply
    });
  } catch (error) {
    res.status(500).json({
      risk: 'error',
      message: error.message || 'Unexpected server error.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AI backend running on port ${PORT}`);
});
