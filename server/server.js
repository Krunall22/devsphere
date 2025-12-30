const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

dotenv.config();
const app = express();

// 1. HEALTH CHECK ROUTE (Must be at the very top to fix 404/Cannot GET /)
app.get('/', (req, res) => {
  res.status(200).send('DevSphere API is Live and Secure 🛡️');
});

// 2. MIDDLEWARE
app.use(helmet()); // Basic security headers
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks

// 3. DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 4. ROUTES (Order matters!)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));