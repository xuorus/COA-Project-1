const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date()
  });
  next();
};

module.exports = requestLogger;