const router = require('express').Router();
const { getCurrentUser } = require('../controllers/users');

// Rota para buscar os dados do usuário atual
router.get('/me', getCurrentUser);

module.exports = router;
