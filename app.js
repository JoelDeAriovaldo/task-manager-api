const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = 'your_secret_key'; // Use uma chave secreta forte

// Set up the database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'task_manager',
    port: 3308
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Database connected!');
});

// Middleware to handle database queries with Promises
const queryDb = (query, values) => {
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Middleware to verify JWT
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        req.user = decoded;
        next();
    });
};

// Set up the API routes
app.use(express.json());

// Import and use authRoutes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// Import and use taskRoutes, ensuring authenticate is called correctly
const taskRoutes = require('./routes/taskRoutes');
app.use('/api', authenticate, taskRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
