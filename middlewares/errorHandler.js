const logger = require('../logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.message, err);
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || 'Erro do Servidor Interno'
    });
};

module.exports = errorHandler;
