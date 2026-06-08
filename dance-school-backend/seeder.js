require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Student = require('./src/models/Student');
const Trainer = require('./src/models/Trainer');
const Course = require('./src/models/Course');
const Enrollment = require('./src/models/Enrollment');
const Payment = require('./src/models/Payment');
const Salary = require('./src/models/Salary');
const Attendance = require('./src/models/Attendance');
const Certificate = require('./src/models/Certificate');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany(),
    Student.deleteMany(),
    Trainer.deleteMany(),
    Course.deleteMany(),
    Enrollment.deleteMany(),
    Payment.deleteMany(),
    Salary.deleteMany(),
    Attendance.deleteMany(),
    Certificate.deleteMany(),
  ]);
  console.log('Cleared all data');

  await User.create({ name: 'Admin User', email: 'admin@drizzledance.com', password: 'Admin@1234', role: 'admin', phone: '9999999999' });

  console.log('\n✅ Clean database initialized with Admin account only');
  console.log('Admin: admin@drizzledance.com / Admin@1234');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
