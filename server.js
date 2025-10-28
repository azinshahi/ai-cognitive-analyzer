import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.post('/analyze', async (req, res) => {
  const { behavior } = req.body;

  if (!behavior) {
    return res.status(400).json({ risk: 'error', message: 'No behavior provided.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-2.1',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `You are a cybersecurity assistant. Assess the risk level of this behavior and explain why: ${behavior}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('🔴 Anthropic error:', data);
      return res.status(500).json({ risk: 'error', message: data.error?.message || 'Anthropic API failed.' });
    }

    const reply = data.content?.[0]?.text || 'No response from Claude.';
    res.json({ risk: 'high', message: reply });
  } catch (error) {
    console.error('🔴 Unexpected error:', error.message);
    res.status(500).json({ risk: 'error', message: 'Failed to analyze behavior.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
