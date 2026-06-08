require('dotenv').config();
const mongoose = require('mongoose');

// Import Models
const User = require('./src/models/User');
const Student = require('./src/models/Student');
const Trainer = require('./src/models/Trainer');
const Course = require('./src/models/Course');
const Enrollment = require('./src/models/Enrollment');
const Payment = require('./src/models/Payment');
const Salary = require('./src/models/Salary');
const Attendance = require('./src/models/Attendance');
const Certificate = require('./src/models/Certificate');
const FeePermission = require('./src/models/FeePermission');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // 1. Clean existing collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  if (collections?.length) {
    console.log('Clearing existing collections...');
    await Promise.all(collections.map(c => mongoose.connection.db.collection(c.name).deleteMany({})));
  }

  console.log('Database cleared. Starting seeding process...');

  // 2. Seed Admin User
  const adminUser = await User.create({
    name: 'System Admin',
    email: 'admin@drizzle.com',
    password: 'admin123', // Automatically hashed by User pre-save hook
    role: 'admin',
    phone: '+919876543210',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
  });
  console.log('Seeded Admin User');

  // 3. Seed Trainers (Users + Trainer Profiles)
  const trainerData = [
    {
      name: 'Elena Rostova',
      email: 'elena@drizzle.com',
      password: 'trainer123',
      role: 'trainer',
      phone: '+919876543211',
      specialization: 'Contemporary',
      experience: 8,
      bio: 'Elena is a contemporary dancer with over 8 years of international teaching experience.',
      qualifications: ['BFA in Dance Performance', 'Contemporary Master Certification'],
      salary: 45000,
    },
    {
      name: 'Marcus Chen',
      email: 'marcus@drizzle.com',
      password: 'trainer123',
      role: 'trainer',
      phone: '+919876543212',
      specialization: 'Hip Hop',
      experience: 6,
      bio: 'Marcus has won multiple street dance titles and specializes in urban styles and hip hop choreography.',
      qualifications: ['Hip Hop Fundamentals Instructor', 'Street Dance Championship Winner'],
      salary: 40000,
    },
    {
      name: 'Sofia Rodriguez',
      email: 'sofia@drizzle.com',
      password: 'trainer123',
      role: 'trainer',
      phone: '+919876543213',
      specialization: 'Salsa',
      experience: 10,
      bio: 'Sofia is a Latin dance specialist who brings passion, technique, and high energy to every class.',
      qualifications: ['Latin Dance Federation Member', 'World Salsa Finalist'],
      salary: 50000,
    }
  ];

  const trainers = [];
  for (const t of trainerData) {
    const user = await User.create({
      name: t.name,
      email: t.email,
      password: t.password,
      role: t.role,
      phone: t.phone,
    });
    const trainer = await Trainer.create({
      user: user._id,
      specialization: t.specialization,
      experience: t.experience,
      bio: t.bio,
      qualifications: t.qualifications,
      salary: t.salary,
      joiningDate: new Date('2025-01-10'),
    });
    trainers.push(trainer);
  }
  console.log('Seeded 3 Trainers');

  // 4. Seed Courses (and associate with Trainers)
  const courseData = [
    {
      title: 'Contemporary Dance Expression',
      description: 'Explore creative movement, weight-shifting, and emotional expression through contemporary techniques.',
      danceStyle: 'Contemporary',
      level: 'intermediate',
      duration: '6 months',
      fee: 3500,
      schedule: 'Tue, Thu - 6:30 PM',
      maxStudents: 25,
      totalClassDays: 100,
      trainer: trainers[0]._id,
    },
    {
      title: 'Hip Hop Fundamentals & Style',
      description: 'Learn urban street style, grooves, locking, popping, and high-energy routine choreography.',
      danceStyle: 'Hip Hop',
      level: 'beginner',
      duration: '4 months',
      fee: 2500,
      schedule: 'Sat, Sun - 4:00 PM',
      maxStudents: 30,
      totalClassDays: 80,
      trainer: trainers[1]._id,
    },
    {
      title: 'Salsa & Latin Rhythms',
      description: 'Master salsa footwork, partner holds, styling, and coordination to fast-paced Latin beats.',
      danceStyle: 'Salsa',
      level: 'advanced',
      duration: '3 months',
      fee: 2800,
      schedule: 'Mon, Wed - 7:00 PM',
      maxStudents: 20,
      totalClassDays: 60,
      trainer: trainers[2]._id,
    }
  ];

  const courses = [];
  for (const c of courseData) {
    const course = await Course.create(c);
    courses.push(course);

    // Update the Trainer's assignedCourse
    await Trainer.findByIdAndUpdate(c.trainer, { assignedCourse: course._id });
  }
  console.log('Seeded 3 Courses and linked to Trainers');

  // 5. Seed Students
  const studentData = [
    { name: 'Aria Thorne', email: 'aria@student.com', phone: '+919988776655', gender: 'female', address: '12 Park Street, Kolkata', guardianName: 'Sarah Thorne', guardianPhone: '+919988776601', course: courses[0] },
    { name: 'Dev Patel', email: 'dev@student.com', phone: '+919988776656', gender: 'male', address: '45 Gandhi Marg, Ahmedabad', guardianName: 'Ramesh Patel', guardianPhone: '+919988776602', course: courses[0] },
    { name: 'Chloe Dubois', email: 'chloe@student.com', phone: '+919988776657', gender: 'female', address: '88 MG Road, Bangalore', guardianName: 'Jean Dubois', guardianPhone: '+919988776603', course: courses[1] },
    { name: 'Liam O\'Connor', email: 'liam@student.com', phone: '+919988776658', gender: 'male', address: '3 Sector 4, Dwarka, Delhi', guardianName: 'Patrick O\'Connor', guardianPhone: '+919988776604', course: courses[1] },
    { name: 'Maya Lin', email: 'maya@student.com', phone: '+919988776659', gender: 'female', address: '17 Marine Drive, Mumbai', guardianName: 'Grace Lin', guardianPhone: '+919988776605', course: courses[2] }
  ];

  const students = [];
  for (const s of studentData) {
    const user = await User.create({
      name: s.name,
      email: s.email,
      password: 'student123',
      role: 'student',
      phone: s.phone,
    });
    const student = await Student.create({
      user: user._id,
      dateOfBirth: new Date('2005-05-15'),
      gender: s.gender,
      address: s.address,
      guardianName: s.guardianName,
      guardianPhone: s.guardianPhone,
      enrolledCourse: s.course._id,
      enrollmentDate: new Date('2026-01-05'),
    });
    students.push(student);
  }
  console.log('Seeded 5 Students and linked their courses');

  // 6. Seed Enrollments
  const enrollments = [];
  const enrollmentMeta = [
    { student: students[0], course: courses[0], trainer: trainers[0], progress: 60, status: 'active' },
    { student: students[1], course: courses[0], trainer: trainers[0], progress: 45, status: 'active' },
    { student: students[2], course: courses[1], trainer: trainers[1], progress: 80, status: 'active' },
    { student: students[3], course: courses[1], trainer: trainers[1], progress: 90, status: 'active' },
    { student: students[4], course: courses[2], trainer: trainers[2], progress: 100, status: 'completed', completionDate: new Date('2026-05-30') }
  ];

  for (const em of enrollmentMeta) {
    const enrollment = await Enrollment.create({
      student: em.student._id,
      course: em.course._id,
      trainer: em.trainer._id,
      progress: em.progress,
      status: em.status,
      enrollmentDate: new Date('2026-01-05'),
      completionDate: em.completionDate,
    });
    enrollments.push(enrollment);
  }
  console.log('Seeded 5 Enrollments');

  // 7. Seed Payments
  // Aria: Jan, Feb, Mar, Apr paid
  // Dev: Jan, Feb paid, Mar pending
  // Chloe: Jan, Feb, Mar, Apr paid
  // Liam: March paid, April pending
  // Maya: Jan, Feb, Mar paid
  const paymentRecords = [
    { student: students[0], course: courses[0], amount: 3500, month: 'January', year: 2026, status: 'paid', paymentMethod: 'online', date: new Date('2026-01-08') },
    { student: students[0], course: courses[0], amount: 3500, month: 'February', year: 2026, status: 'paid', paymentMethod: 'online', date: new Date('2026-02-07') },
    { student: students[0], course: courses[0], amount: 3500, month: 'March', year: 2026, status: 'paid', paymentMethod: 'card', date: new Date('2026-03-05') },
    { student: students[0], course: courses[0], amount: 3500, month: 'April', year: 2026, status: 'paid', paymentMethod: 'online', date: new Date('2026-04-09') },

    { student: students[1], course: courses[0], amount: 3500, month: 'January', year: 2026, status: 'paid', paymentMethod: 'cash', date: new Date('2026-01-12') },
    { student: students[1], course: courses[0], amount: 3500, month: 'February', year: 2026, status: 'paid', paymentMethod: 'bank_transfer', date: new Date('2026-02-10') },
    { student: students[1], course: courses[0], amount: 3500, month: 'March', year: 2026, status: 'pending', paymentMethod: 'cash', date: new Date('2026-03-01') },

    { student: students[2], course: courses[1], amount: 2500, month: 'January', year: 2026, status: 'paid', paymentMethod: 'online', date: new Date('2026-01-09') },
    { student: students[2], course: courses[1], amount: 2500, month: 'February', year: 2026, status: 'paid', paymentMethod: 'online', date: new Date('2026-02-08') },
    { student: students[2], course: courses[1], amount: 2500, month: 'March', year: 2026, status: 'paid', paymentMethod: 'card', date: new Date('2026-03-06') },
    { student: students[2], course: courses[1], amount: 2500, month: 'April', year: 2026, status: 'paid', paymentMethod: 'online', date: new Date('2026-04-09') },

    { student: students[3], course: courses[1], amount: 2500, month: 'March', year: 2026, status: 'paid', paymentMethod: 'bank_transfer', date: new Date('2026-03-12') },
    { student: students[3], course: courses[1], amount: 2500, month: 'April', year: 2026, status: 'pending', paymentMethod: 'cash', date: new Date('2026-04-01') },

    { student: students[4], course: courses[2], amount: 2800, month: 'January', year: 2026, status: 'paid', paymentMethod: 'online', date: new Date('2026-01-10') },
    { student: students[4], course: courses[2], amount: 2800, month: 'February', year: 2026, status: 'paid', paymentMethod: 'online', date: new Date('2026-02-09') },
    { student: students[4], course: courses[2], amount: 2800, month: 'March', year: 2026, status: 'paid', paymentMethod: 'card', date: new Date('2026-03-07') },
  ];

  for (const pr of paymentRecords) {
    await Payment.create({
      student: pr.student._id,
      course: pr.course._id,
      amount: pr.amount,
      month: pr.month,
      year: pr.year,
      status: pr.status,
      paymentMethod: pr.paymentMethod,
      paymentDate: pr.date,
      remarks: `${pr.month} fee payment`,
    });
  }
  console.log(`Seeded ${paymentRecords.length} Payment records`);

  // 8. Seed Salaries
  // Trainers 1, 2, 3: Jan/Feb paid, Mar pending
  const salaryRecords = [
    { trainer: trainers[0], amount: 45000, month: 'January', year: 2026, status: 'paid', date: new Date('2026-01-31') },
    { trainer: trainers[0], amount: 45000, month: 'February', year: 2026, status: 'paid', date: new Date('2026-02-28') },
    { trainer: trainers[0], amount: 45000, month: 'March', year: 2026, status: 'pending', date: null },

    { trainer: trainers[1], amount: 40000, month: 'January', year: 2026, status: 'paid', date: new Date('2026-01-31') },
    { trainer: trainers[1], amount: 40000, month: 'February', year: 2026, status: 'paid', date: new Date('2026-02-28') },
    { trainer: trainers[1], amount: 40000, month: 'March', year: 2026, status: 'pending', date: null },

    { trainer: trainers[2], amount: 50000, month: 'January', year: 2026, status: 'paid', date: new Date('2026-01-31') },
    { trainer: trainers[2], amount: 50000, month: 'February', year: 2026, status: 'paid', date: new Date('2026-02-28') },
    { trainer: trainers[2], amount: 50000, month: 'March', year: 2026, status: 'pending', date: null },
  ];

  for (const sr of salaryRecords) {
    await Salary.create({
      trainer: sr.trainer._id,
      amount: sr.amount,
      month: sr.month,
      year: sr.year,
      status: sr.status,
      paymentDate: sr.date,
      remarks: `Monthly salary for ${sr.month}`,
    });
  }
  console.log('Seeded Salary records');

  // 9. Seed Attendance (Recent records)
  const today = new Date();
  const date1 = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const date2 = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);

  const attendanceRecords = [
    { student: students[0], course: courses[0], trainer: trainers[0], date: date1, status: 'present', remarks: 'Good energy' },
    { student: students[1], course: courses[0], trainer: trainers[0], date: date1, status: 'late', remarks: '10 min late' },
    { student: students[2], course: courses[1], trainer: trainers[1], date: date1, status: 'present', remarks: '' },
    { student: students[3], course: courses[1], trainer: trainers[1], date: date1, status: 'absent', remarks: 'Informed beforehand' },

    { student: students[0], course: courses[0], trainer: trainers[0], date: date2, status: 'present', remarks: '' },
    { student: students[1], course: courses[0], trainer: trainers[0], date: date2, status: 'present', remarks: '' },
    { student: students[2], course: courses[1], trainer: trainers[1], date: date2, status: 'present', remarks: '' },
    { student: students[3], course: courses[1], trainer: trainers[1], date: date2, status: 'present', remarks: '' },
  ];

  for (const ar of attendanceRecords) {
    await Attendance.create(ar);
  }
  console.log('Seeded Attendance records');

  // 10. Seed Certificate (for Maya, who completed the course)
  await Certificate.create({
    student: students[4]._id,
    course: courses[2]._id,
    trainer: trainers[2]._id,
    issueDate: new Date('2026-05-30'),
  });
  console.log('Seeded Completion Certificate');

  // 11. Seed FeePermissions for week gate testing
  // Use a week key like "2026-W23"
  const { getWeekKey } = require('./src/utils/weekKey');
  const weekKey = getWeekKey(new Date());

  await FeePermission.create({
    enrollment: enrollments[0]._id,
    student: students[0]._id,
    trainer: trainers[0]._id,
    course: courses[0]._id,
    weekKey,
    isAllowed: true,
    permittedBy: trainers[0]._id,
    allowedAt: new Date(),
    dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'paid',
  });

  console.log('\n✅ Database seeding completed successfully!');
  console.log('Use admin credentials to test the Admin Panel:');
  console.log('   Email: admin@drizzle.com');
  console.log('   Password: admin123');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

