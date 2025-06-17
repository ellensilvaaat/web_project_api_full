// backend/app.js

require('dotenv').config(); // Carrega as variáveis do ficheiro .env

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { errors } = require('celebrate');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { validateAuth } = require('./middlewares/validators');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();
const PORT = 3001;

mongoose.connect('mongodb://127.0.0.1:27017/aroundb');

app.use(requestLogger);
app.use(express.json());

app.use(cors());
app.options('*', cors());

// Rota para teste de falha
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('O servidor vai crashar agora');
  }, 0);
});

// Rotas Públicas da API
app.post('/signup', validateAuth, createUser);
app.post('/signin', validateAuth, login);

app.use(auth);

// Rotas Protegidas da API
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Servindo o Frontend
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// Manipuladores de Erros
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

