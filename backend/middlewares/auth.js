// backend/middlewares/auth.js

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Autorização necessária' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // Usa a mesma lógica para obter a chave secreta
    const { NODE_ENV, JWT_SECRET } = process.env;
    const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'ellinhalaio2001@';

    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return res.status(401).send({ message: 'Token inválido' });
  }

  req.user = payload;
  next();
};

module.exports = auth;
