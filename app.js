// app.js
const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

// Set up the database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'task_manager',
    port: 3308
});

// Set up the authentication system
const authenticate = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await db.query(`SELECT * FROM users WHERE username =?`, username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    req.user = user;
    next();
};

// Set up the API routes
app.use(express.json());
app.use('/api', authenticate, require('./routes/taskRoutes'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});