// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword };
    await db.query('INSERT INTO users SET?', user);
    res.json({ message: 'User created successfully' });
});

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.query(`SELECT * FROM users WHERE username =?`, username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    res.json({ message: 'Logged in successfully' });
});

module.exports = router;