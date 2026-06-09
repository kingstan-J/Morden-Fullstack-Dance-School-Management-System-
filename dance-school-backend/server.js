const path = require('path');
const dotenvPath = path.resolve(__dirname, '.env');
require('dotenv').config({ path: dotenvPath, override: true });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const { ensureAdminAccount } = require('./src/utils/initialData');

const errorHandler = require('./src/middleware/error');

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Allowed Frontend Origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://morden-fullstack-dance-school-manag.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Drizzle Dance School Backend Running',
    status: 'OK',
  });
});

// Health Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Drizzle Dance API',
  });
});

app.get('/api/version', (req, res) => {
  res.json({
    version: 'CORS-FIX-V1'
  });
});

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/courses', require('./src/routes/courses'));
app.use('/api/enrollments', require('./src/routes/enrollments'));
app.use('/api/attendance', require('./src/routes/attendance'));
app.use('/api/payments', require('./src/routes/payments'));
app.use('/api/salaries', require('./src/routes/salaries'));
app.use('/api/certificates', require('./src/routes/certificates'));
app.use('/api/fee-permissions', require('./src/routes/feePermissions'));
app.use('/api/notifications', require('./src/routes/notifications'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    await ensureAdminAccount();

    app.listen(PORT, () => {
      console.log(`🎵 Drizzle Dance Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();