const Card = require('../models/card');
const {
  ValidationError,
  ForbiddenError,
  NotFoundError
} = require('../errors');

// GET /cards
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

// POST /cards
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Dados inválidos ao criar o card'));
      } else {
        next(err);
      }
    });
};

// DELETE /cards/:cardId
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Card não encontrado'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Você não pode deletar este card');
      }

      return card.deleteOne().then(() => res.send({ message: 'Card deletado com sucesso' }));
    })
    .catch(next);
};

// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError('Card não encontrado'))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(next);
};

// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError('Card não encontrado'))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(next);
};

