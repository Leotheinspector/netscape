const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express(); // ← This line must come BEFORE any app.get or app.post
const PORT = process.env.PORT || 2000;

const upload = multer(); // For handling multipart/form-data

// Middleware
app.use(express.json());

// Static route to serve frontend under /netscape
app.use('/netscape', express.static(path.join(__dirname, 'public')));

app.get('/netscape', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ API Route - must come AFTER app is defined
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
        model: model,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'OpenAI error');
    }

    res.json({ response: data.choices[0].message.content });
  } catch (err) {
    console.error('Error in /netscape/api/chat:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
