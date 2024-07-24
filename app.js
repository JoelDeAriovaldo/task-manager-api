require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/database');
const logger = require('./logger');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { authenticate } = require('./middlewares/authMiddleware');

// Database synchronization
sequelize.sync()
    .then(() => logger.info('Database synchronized'))
    .catch(err => logger.error('Database synchronization error:', err));

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors());

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', authenticate, taskRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.message, err);
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || 'Internal server error'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
