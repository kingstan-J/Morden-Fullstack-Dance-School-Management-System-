require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./src/config/db');

const errorHandler = require('./src/middleware/error');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Drizzle Dance API'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🎵 Drizzle Dance Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();