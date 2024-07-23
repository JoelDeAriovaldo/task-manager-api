const logger = require('../logger');
const { AppError } = require('../errors');

const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        logger.error(err.message, err);
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    logger.error('Unexpected error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};

module.exports = errorHandler;
