require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const requestLogger = require('./middleware/logger');
const logsRouter = require('./routes/logs');
const recordsRouter = require('./routes/records');
const scanRoutes = require('./routes/scanRoutes');
const scannerRoutes = require('./routes/scannerRoutes');
const pool = require('./config/db');

const app = express();

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:5173',  // Replace with your frontend IP
    'http://your-domain.com',   // If you have a domain
    'app://.*'
  ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(requestLogger);
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/logs', logsRouter);
app.use('/api/records', recordsRouter);
app.use('/api/scan', scanRoutes);
app.use('/api/scanner', scannerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Handle database connection on startup
pool.connect()
  .then(client => {
    console.log('Database connected successfully');
    client.release();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  try {
    await pool.end();
    console.log('Database pool closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log(app._router.stack.map(r => r.route && r.route.path).filter(Boolean));

const PORT = process.env.PORT || 5000;
module.exports = app;