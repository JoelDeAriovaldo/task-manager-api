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

// Set up the authentication system
const authenticate = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const users = await queryDb('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Set up the API routes
app.use(express.json());

// Import and use authRoutes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// Import and use taskRoutes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api', authenticate, taskRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
