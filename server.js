const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/chat', upload.single('file'), async (req, res) => {
  const { model, prompt } = req.body;

  if (!prompt || !model) {
    return res.status(400).json({ error: 'Model and prompt are required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4"
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content;
    res.json({ response: reply });
  } catch (err) {
    console.error("Error from OpenAI:", err);
    res.status(500).json({ error: 'Failed to connect to OpenAI' });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
