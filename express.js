const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'img', 'IndexPage'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не передан' });
  }

  res.json({
    message: 'Файл загружен успешно',
    filename: req.file.originalname,
    url: `/img/IndexPage/${req.file.originalname}`
  });
});

app.listen(PORT, () => {
  console.log(`Upload-сервер запущен на http://localhost:${PORT}`);
});
