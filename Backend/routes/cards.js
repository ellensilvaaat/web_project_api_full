const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
} = require('../controllers/cards');
const auth = require('../middlewares/auth');
const {
  validateCardCreation,
  validateIdParam
} = require('../middlewares/validators');

router.use(auth);

router.get('/', getCards);
router.post('/', validateCardCreation, createCard);
router.delete('/:cardId', validateIdParam, deleteCard);
router.put('/:cardId/likes', validateIdParam, likeCard);
router.delete('/:cardId/likes', validateIdParam, dislikeCard);

module.exports = router;


