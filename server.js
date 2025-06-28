const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = './data/users.json';
const MOVIES_FILE = './data/movies.json';
const JWT_SECRET = 'your_jwt_secret';

// Ensure data directories and files
fs.ensureFileSync(USERS_FILE);
fs.ensureFileSync(MOVIES_FILE);
fs.writeJsonSync(USERS_FILE, fs.readJsonSync(USERS_FILE, {throws: false}) || []);
fs.writeJsonSync(MOVIES_FILE, fs.readJsonSync(MOVIES_FILE, {throws: false}) || []);

// Middleware to verify token
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token invalid' });
  }
}

// Register
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  const users = fs.readJsonSync(USERS_FILE);
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Usuário já existe' });
  }
  const hash = await bcrypt.hash(password, 10);
  users.push({ username, password: hash, role });
  fs.writeJsonSync(USERS_FILE, users);
  res.json({ message: 'Usuário registrado' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const users = fs.readJsonSync(USERS_FILE);
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// Add movie (creator only)
app.post('/api/movies', authMiddleware, (req, res) => {
  if (req.user.role !== 'creator') return res.status(403).json({ error: 'Acesso negado' });
  const { title, image, description } = req.body;
  const movies = fs.readJsonSync(MOVIES_FILE);
  movies.push({ title, image, description });
  fs.writeJsonSync(MOVIES_FILE, movies);
  res.json({ message: 'Filme adicionado' });
});

// Get movies
app.get('/api/movies', (req, res) => {
  const movies = fs.readJsonSync(MOVIES_FILE);
  res.json(movies);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`MozengoFlix backend running on port ${PORT}`));