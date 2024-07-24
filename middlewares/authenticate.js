const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors');
const logger = require('../logger');
const secretKey = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        logger.warn('Token not provided');
        return next(new AuthError('Token não fornecido'));
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            logger.warn('Invalid token');
            return next(new AuthError('Token inválido'));
        }
        req.user = decoded;
        next();
    });
};

module.exports = authenticate;
