require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { NotFoundError } = require('./errors');
const {
  validateUserCreation,
  validateLogin
} = require('./middlewares/validators');
const {
  logRequests,
  logErrors
} = require('./middlewares/logger');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/webprojectdb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(express.json());

// Logger manual de requisições
app.use(logRequests);

// Rotas públicas com validação
app.post('/signup', validateUserCreation, createUser);
app.post('/signin', validateLogin, login);

// Rotas privadas com autenticação
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

// Rota para endpoints inexistentes
app.use('*', (req, res, next) => {
  next(new NotFoundError('Endpoint não encontrado'));
});

// Logger manual de erros
app.use(logErrors);

// Erros do celebrate
app.use(errors());

// Middleware de tratamento de erros centralizado
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Ocorreu um erro no servidor'
      : message
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



