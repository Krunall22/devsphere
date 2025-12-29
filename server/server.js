const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allows large JSON payloads (images)
app.use(express.urlencoded({ limit: '50mb', extended: true })); // <--- ADDED THIS (Vital for large uploads)

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`MongoDB Connected: ${mongoose.connection.host}`))
  .catch((err) => console.error(`Error: ${err.message}`));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));