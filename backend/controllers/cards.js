// backend/controllers/cards.js

const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then(cards => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Dados inválidos.' });
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: 'Cartão não encontrado.' });
      }
      if (card.owner.toString() !== req.user._id) {
        return res.status(403).send({ message: 'Acesso negado.' });
      }
      return Card.findByIdAndDelete(req.params.cardId)
        .then(() => res.send({ message: 'Cartão deletado.' }));
    })
    .catch(next);
};

module.exports = { getCards, createCard, deleteCard };