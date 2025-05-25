const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.static('public'));

app.post('/api/chat', upload.single('file'), (req, res) => {
  const { model, prompt } = req.body;
  const file = req.file;
  const reply = `✅ LLM [${model}] received your prompt:\n"${prompt}"\n` +
    (file ? `📎 Attached file: ${file.originalname}` : '📎 No file uploaded.');
  res.json({ response: reply });
});

app.listen(PORT, () => console.log(`🔥 Server running at http://localhost:${PORT}`));
