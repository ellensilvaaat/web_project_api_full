const errorHandler = (err, req, res, next) => {
    // Se o erro tiver um statusCode, use-o, senão, use 500 (Erro Interno do Servidor)
    const { statusCode = 500, message } = err;
  
    res.status(statusCode).send({
      // Verifica se o status é 500 para enviar uma mensagem genérica
      message: statusCode === 500 ? 'Ocorreu um erro no servidor' : message,
    });
  };
  
  module.exports = errorHandler;