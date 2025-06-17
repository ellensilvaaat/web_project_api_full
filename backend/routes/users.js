// backend/routes/users.js

const router = require('express').Router();
const { getCurrentUser } = require('../controllers/users'); // Importa o controlador necessário

// Define a rota para obter informações do usuário logado.
// O middleware de autenticação será aplicado antes desta rota no arquivo app.js.
router.get('/me', getCurrentUser);

// Você pode adicionar outras rotas de usuário aqui no futuro, como:
// router.patch('/me', updateUserProfile);

module.exports = router;