const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors');
const logger = require('../logger');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        logger.warn('Token not provided');
        return next(new AuthError('Token não fornecido'));
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            logger.warn('Invalid token');
            return next(new AuthError('Token inválido'));
        }
        req.user = decoded;
        next();
    });
};