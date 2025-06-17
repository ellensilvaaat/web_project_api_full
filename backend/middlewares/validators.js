// backend/middlewares/validators.js

const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// Função de validação de URL personalizada
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

// Validação para rotas de autenticação (signup e signin)
const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Validação para criação de cartão
const validateCardCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
});

// Validação para IDs de cartão nos parâmetros
const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateAuth,
  validateCardCreation,
  validateCardId,
};