const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ValidationError,
  UnauthorizedError,
  NotFoundError
} = require('../errors');

// POST /signup
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash
    }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).send(userObj);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Dados inválidos ao criar usuário'));
      } else if (err.code === 11000) {
        next(new ValidationError('E-mail já cadastrado'));
      } else {
        next(err);
      }
    });
};

// POST /signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('E-mail ou senha incorretos');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('E-mail ou senha incorretos');
          }

          const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
          );

          res.send({ token });
        });
    })
    .catch(next);
};

// GET /users/me
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }
      res.send(user);
    })
    .catch(next);
};
