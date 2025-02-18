require('dotenv').config();
const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/logger');
const scanRoutes = require('./routes/scanRoutes');
const logsRouter = require('./routes/logs');
const recordsRouter = require('./routes/records');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api', scanRoutes);
app.use('/api/logs', logsRouter);
app.use('/api/records', recordsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: err.message 
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));

module.exports = app;
