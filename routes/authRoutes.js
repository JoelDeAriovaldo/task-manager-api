const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const queryDb = require('../db');
const logger = require('../logger'); // Import the logger
const secretKey = 'your_secret_key'; // Use uma chave secreta forte

// Register a new user
router.post('/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = { username, password: hashedPassword };
            await queryDb('INSERT INTO users SET ?', user);
            res.json({ message: 'Usuário criado com sucesso' });
        } catch (err) {
            logger.error('Error registering user:', err);
            res.status(500).json({ message: 'Erro do Servidor Interno' });
        }
    });

// Login a user
router.post('/login',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        try {
            const users = await queryDb('SELECT * FROM users WHERE username = ?', [username]);
            if (users.length === 0) {
                logger.warn('Invalid username or password');
                return res.status(401).json({ message: 'Nome de usuário ou senha inválidos' });
            }
            const user = users[0];
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                logger.warn('Invalid username or password');
                return res.status(401).json({ message: 'Nome de usuário ou senha inválidos' });
            }
            const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
            res.json({ message: 'Logado com sucesso', token });
        } catch (err) {
            logger.error('Error logging in user:', err);
            res.status(500).json({ message: 'Erro do Servidor Interno' });
        }
    });

module.exports = router;
