require('dotenv').config();

const express = require('express');
const app = express();
const mysql = require('mysql');
const rateLimit = require('express-rate-limit'); // Import rate limiting
const cors = require('cors'); // Import CORS
const logger = require('./logger'); // Import the logger
const errorHandler = require('./middleware/errorHandler');
const { AppError } = require('./errors');

const secretKey = process.env.SECRET_KEY; // Use the secret key from environment variables

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

// Set up CORS configuration
app.use(cors({
    origin: 'http://your-allowed-origin.com', // Adjust the origin as needed
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Set up rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Set up the API routes
app.use(express.json());

// Import and use authRoutes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// Import and use taskRoutes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api', taskRoutes);

// Global error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
