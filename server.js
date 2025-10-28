import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Endpoint
app.post('/analyze', async (req, res) => {
  const { behavior } = req.body;

  if (!behavior) {
    return res.status(400).json({ risk: 'error', message: 'No behavior provided.' });
  }

  try {
    const completion = await openai.chat.completions.create({
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
    });

    const reply = completion.choices[0].message.content;

    res.json({ risk: 'high', message: reply });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ risk: 'error', message: 'Failed to analyze behavior.' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
