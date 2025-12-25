const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const upload = multer();

// Middleware
app.use(express.json());

// Serve Netscape frontend ONLY under /netscape
app.use('/netscape', express.static(path.join(__dirname, 'public')));

// API route
app.post('/netscape/api/chat', upload.none(), async (req, res) => {
  try {
    const model = req.body.model || 'gpt-4';
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    res.json({ response: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ REQUIRED for Vercel
module.exports = app;
