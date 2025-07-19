const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const errorHandler = require('./middlewares/error.middleware');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Default health check
app.get('/', (req, res) => {
  res.send('E-commerce API is running...');
});

module.exports = app;
