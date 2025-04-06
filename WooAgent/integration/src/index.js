/**
 * WooAgent Integration Layer
 * 
 * This is the main entry point for the integration layer that connects
 * the frontend application to the Python agent.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const winston = require('winston');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Import routes
const chatRoutes = require('./routes/chat');
const configRoutes = require('./routes/config');
const logsRoutes = require('./routes/logs');

// Create Express app
const app = express();

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'integration.log' })
  ]
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*'
}));
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Add logger to request object
app.use((req, res, next) => {
  req.logger = logger;
  next();
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/config', configRoutes);
app.use('/api/logs', logsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  req.logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
