import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const COHERE_API_KEY = process.env.COHERE_API_KEY;

app.post('/analyze', async (req, res) => {
  const { behavior } = req.body;

  if (!behavior) {
    return res.status(400).json({ risk: 'error', message: 'No behavior provided.' });
  }

  try {
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'command-r-plus',
        message: `You are a cybersecurity assistant. Assess the risk level of this behavior and explain why: ${behavior}`,
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('🔴 Cohere error:', data);
      return res.status(500).json({
        risk: 'error',
        message: data.message || 'Cohere API failed.'
      });
    }

    const reply = data.text || 'No response from Cohere.';
    res.json({ risk: 'high', message: reply });
  } catch (error) {
    console.error('🔴 Unexpected error:', error.message);
    res.status(500).json({ risk: 'error', message: 'Failed to analyze behavior.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
