const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const seedPlans = require('./seeds/planSeeder');
const path = require('path');

const app = express();

// CORS Configuration using Environment Variables
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173').split(',');

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) and from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Reject requests from other origins without crashing the server
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200
};

// Handle CORS
app.use(cors(corsOptions));

// Add a global error handler to prevent crashes from CORS errors
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ error: 'CORS Error: This origin is not authorized.' });
  } else {
    next(err);
  }
});
app.use(express.json());

// This route will be used by Render to confirm the server is live.
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});
// =======================================

// --- API Routes ---
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const planRoutes = require('./routes/planRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
const foodRoutes = require('./routes/foodRoutes');
const saleRoutes = require('./routes/saleRoutes');
const { protect, authorize } = require('./middleware/authMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/members', protect, memberRoutes);
app.use('/api/plans', protect, planRoutes);
app.use('/api/checkins', protect, checkinRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);
app.use('/api/transactions', protect, transactionsRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/sales', saleRoutes);

// --- Serve React App in Production ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
}

// --- Database Connection ---
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/gym_management';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected successfully');
    if (process.env.NODE_ENV !== 'production') {
        seedPlans();
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful Shutdown
const gracefulShutdown = () => {
  console.log('Received kill signal, shutting down gracefully.');
  server.close(() => {
    console.log('Closed out remaining connections.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });

  // Force shutdown after 10s
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);


module.exports = app;