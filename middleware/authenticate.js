const jwt = require('jsonwebtoken');
const logger = require('../logger');
const secretKey = process.env.SECRET_KEY; // Use the secret key from environment variables

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        logger.warn('Token not provided');
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            logger.warn('Invalid token');
            return res.status(401).json({ message: 'Token inválido' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = authenticate;
