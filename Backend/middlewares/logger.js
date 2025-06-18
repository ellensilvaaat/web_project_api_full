const winston = require('winston');

const requestLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
});

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
});

// Middleware para registrar cada request
const logRequests = (req, res, next) => {
  requestLogger.info({
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
  });
  next();
};

// Middleware para registrar erros
const logErrors = (err, req, res, next) => {
  errorLogger.error({
    message: err.message,
    status: err.statusCode || 500,
    stack: err.stack,
  });
  next(err);
};

module.exports = {
  logRequests,
  logErrors,
};


