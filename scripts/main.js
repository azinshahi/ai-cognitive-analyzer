import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json());

/**
 * Analyze risky behavior using OpenRouter AI
 */
app.post('/analyze', async (req, res) => {
  const { behavior } = req.body;

  if (!behavior) {
    return res.status(400).json({
      risk: 'error',
      message: 'Missing behavior input.'
    });
  }

  try {
    const response = await fetch('https://openrouter.ai
