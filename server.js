// server.js 
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 2000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files under /netscape from the public folder
app.use('/netscape', express.static(path.join(__dirname, 'public')));

// Handle GET /netscape to serve index.html (if needed for SPA or home screen)
app.get('/netscape', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error talking to OpenAI:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
