const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// 🛡️ SECURITY IMPORTS
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

dotenv.config();
const app = express();

// --- 🔒 SECURITY MIDDLEWARE START ---

// 1. Set Security Headers (The "Helmet")
// Hides that you are using Express and blocks cross-site scripts
app.use(helmet());

// 2. Rate Limiting (The "Bouncer")
// Limits requests from the SAME IP address.
// If a hacker tries to login 100 times in 10 mins, they get blocked.
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 10 minutes"
});
app.use('/api', limiter); // Apply to all API routes

// 3. Data Sanitization against NoSQL Injection
// Stops hackers from sending { "$gt": "" } to login without password
app.use(mongoSanitize());

// 4. Data Sanitization against XSS
// Stops hackers from putting HTML code like <script>alert('hacked')</script> in inputs
app.use(xss());

// 5. Prevent Parameter Pollution
app.use(hpp());

app.use('/api/admin', require('./routes/adminRoutes'));

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