const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

dotenv.config();
const app = express();

// 1. Root Route - Essential for Render health checks
app.get('/', (req, res) => {
  res.status(200).send('DevSphere API is Live and Secure 🛡️');
});

// 2. Middleware
app.use(helmet()); 
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(mongoSanitize()); 
app.use(xss()); 

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("DB Connection Error ❌:", err));

// 4. Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));