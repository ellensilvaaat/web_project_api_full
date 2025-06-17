// backend/controllers/users.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({ name, about, avatar, email, password: hashedPassword })
        .then((user) => {
          const userResponse = user.toObject();
          delete userResponse.password;
          res.status(201).send(userResponse);
        })
        .catch((err) => {
          if (err.code === 11000) {
            return res.status(409).send({ message: 'Este e-mail já está em uso.' });
          }
          if (err.name === 'ValidationError') {
            return res.status(400).send({ message: 'Dados inválidos fornecidos.' });
          }
          return next(err);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'E-mail ou senha incorretos.' });
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(401).send({ message: 'E-mail ou senha incorretos.' });
          }
          // Define a chave secreta. Usa a do .env em produção, ou uma padrão em desenvolvimento.
          const { NODE_ENV, JWT_SECRET } = process.env;
          const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'ellinhalaio2001@';

          const token = jwt.sign(
            { _id: user._id },
            secretKey, // Usa a nova variável
            { expiresIn: '7d' }
          );

          res.send({ token });
        });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Utilizador não encontrado.' });
      }
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
};

