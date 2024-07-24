require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./logger');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors());

// Database and ORM setup
const { sequelize } = require('./models');
sequelize.sync();

// Middlewares
const authenticate = require('./middlewares/authMiddleware');
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

const taskRoutes = require('./routes/taskRoutes');
app.use('/api', authenticate, taskRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.message, err);
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || 'Internal server error'
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
