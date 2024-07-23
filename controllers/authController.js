const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AuthError } = require('../errors');
const logger = require('../logger');
const secretKey = process.env.SECRET_KEY;

exports.register = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        res.json({ message: 'Usuário criado com sucesso' });
    } catch (err) {
        logger.error('Error registering user:', err);
        next(new AuthError('Erro do Servidor Interno'));
    }
};

exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            logger.warn('Invalid username or password');
            return next(new AuthError('Nome de usuário ou senha inválidos'));
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            logger.warn('Invalid username or password');
            return next(new AuthError('Nome de usuário ou senha inválidos'));
        }
        const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
        res.json({ message: 'Logado com sucesso', token });
    } catch (err) {
        logger.error('Error logging in user:', err);
        next(new AuthError('Erro do Servidor Interno'));
    }
};
