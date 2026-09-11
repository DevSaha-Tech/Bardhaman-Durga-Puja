require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const pandalRoutes = require('./routes/pandalRoutes');
const trendRoutes = require('./routes/trendRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

app.use('/api/pandals', pandalRoutes);
app.use('/api/trends', trendRoutes);
app.use('/api/feedback', feedbackRoutes);

// Basic Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: Date.now() });
});

// Analytics Route (Placeholder for visits tracking)
app.post('/api/analytics/visit', (req, res) => {
  res.status(200).json({ success: true, message: 'Visit logged' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
