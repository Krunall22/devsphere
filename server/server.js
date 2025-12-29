const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- 1. Import CORS

dotenv.config();
const app = express();

// Middleware
app.use(cors()); // <--- 2. Use CORS (Allows frontend to talk to backend)
app.use(express.json({ limit: '50mb' })); // Increased limit for images

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`MongoDB Connected: ${mongoose.connection.host}`))
  .catch((err) => console.error(`Error: ${err.message}`));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));