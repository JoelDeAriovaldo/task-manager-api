const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('./logger'); // Import the logger

const secretKey = 'your_secret_key';

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
        logger.error('Error connecting to the database:', err);
        return;
    }
    logger.info('Database connected!');
});

// Middleware to handle database queries with Promises
const queryDb = (query, values) => {
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, results) => {
            if (err) {
                logger.error('Database query error:', err);
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

// Global error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.message, err);
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || 'Internal server error'
    });
});


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
    logger.info(`Server running on port ${PORT}`);
});
