const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const seedPlans = require('./seeds/planSeeder');
const path = require('path');

const app = express();

// CORS Configuration
if (process.env.NODE_ENV === 'production') {
  // Production CORS: only allow the frontend URL
  const allowedOrigins = ['https://gym-apps-itej.onrender.com'];
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
} else {
  // Development CORS: allow any origin
  app.use(cors({
    origin: '*', // Or specify your local dev URL e.g., 'http://localhost:5173'
    credentials: true,
  }));
}
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
const { protect, authorize } = require('./middleware/authMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/members', protect, memberRoutes);
app.use('/api/plans', protect, planRoutes);
app.use('/api/checkins', protect, checkinRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);
app.use('/api/transactions', protect, transactionsRoutes);

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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});