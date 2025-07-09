const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const seedPlans = require('./seeds/planSeeder');
const path = require('path'); // Add this line

const app = express();

app.use(cors());
app.use(express.json());

// --- API Routes (Keep these at the top) ---
const memberRoutes = require('./routes/memberRoutes');
const planRoutes = require('./routes/planRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
app.use('/api/members', memberRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionsRoutes);

// === NEW: Serve React App in Production ===
// This serves the built static files from the 'client/dist' directory
app.use(express.static(path.join(__dirname, 'client/dist')));

// This wildcard route ensures that any request not handled by the API
// gets redirected to the React app's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});
// =======================================

// --- Database Connection ---
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/gym_management';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected successfully');
    seedPlans();
  })
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});