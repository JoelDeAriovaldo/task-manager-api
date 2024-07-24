const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { DatabaseError, AuthError } = require('../errors');
const logger = require('../logger');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');
const { validatePassword } = require('../utils/validationUtils');
const { RefreshToken } = require('../models'); // Assuming you have a RefreshToken model

exports.register = async (req, res, next) => {
    const { username, password } = req.body;

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Senha não atende aos requisitos de complexidade' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        res.json({ message: 'Usuário criado com sucesso' });
    } catch (err) {
        logger.error('Error registering user:', err);
        next(new DatabaseError('Internal server error'));
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
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save refresh token in the database
        await RefreshToken.create({ token: refreshToken, userId: user.id });

        res.json({ message: 'Logado com sucesso', accessToken, refreshToken });
    } catch (err) {
        logger.error('Error logging in user:', err);
        next(new DatabaseError('Erro do Servidor Interno'));
    }
};

exports.refreshToken = async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ message: 'Token de atualização não fornecido' });
    }
    try {
        const storedToken = await RefreshToken.findOne({ where: { token } });
        if (!storedToken) {
            return res.status(403).json({ message: 'Token de atualização inválido' });
        }
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findByPk(decoded.id);
        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    } catch (err) {
        logger.error('Erro ao atualizar o token:', err);
        next(new DatabaseError('Erro do Servidor Interno'));
    }
};
