const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const queryDb = require('../db'); // Certifique-se de que a função queryDb esteja exportada em um arquivo separado

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { username, password: hashedPassword };
        await queryDb('INSERT INTO users SET ?', user);
        res.json({ message: 'Usuário criado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro do Servidor Interno' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const users = await queryDb('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'nome de usuário ou senha inválidos' });
        }
        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'nome de usuário ou senha inválidos' });
        }
        res.json({ message: 'Conectado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro do Servidor Interno' });
    }
});

module.exports = router;
