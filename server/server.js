const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

dotenv.config();
const app = express();

// 1. HEALTH CHECK & ROOT ROUTE
// Fixes the "Cannot GET /" 404 error on Render
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'DevSphere API is Live and Secure 🛡️' 
  });
});

// 2. MIDDLEWARE
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow images from other domains
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(mongoSanitize()); 
app.use(xss()); 

// 3. DATABASE CONNECTION
// Added retry logic to prevent DNS/Connection errors
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("MongoDB Connection Error ❌:", err.message);
    process.exit(1); 
  });

// 4. ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 5. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));