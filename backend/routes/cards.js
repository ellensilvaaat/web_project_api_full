// backend/routes/cards.js
const express = require('express');
const router = express.Router();

const { createCard, deleteCard } = require('../controllers/cards');
console.log({ createCard, deleteCard });
const { validateCardCreation, validateCardId } = require('../middlewares/validators');

// Rota para criar um card (com validação do corpo)
router.post('/', validateCardCreation, createCard);

// Rota para deletar um card (com validação do parâmetro de rota)
router.delete('/:cardId', validateCardId, deleteCard);

module.exports = router;
