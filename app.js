const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./logger');
const errorHandler = require('./middlewares/errorHandler');
const authenticate = require('./middlewares/authenticate');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors());

// Middleware for parsing JSON requests
app.use(express.json());

// Import and use routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api', authRoutes);
app.use('/api', authenticate, taskRoutes);

// Global error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
