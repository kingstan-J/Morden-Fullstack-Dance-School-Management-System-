const User = require('../models/User');
const Student = require('../models/Student');
const Trainer = require('../models/Trainer');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const Salary = require('../models/Salary');
const Attendance = require('../models/Attendance');
const Certificate = require('../models/Certificate');
const { createNotification } = require('../utils/notificationService');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [students, trainers, courses, enrollments, payments, pendingSalaries] = await Promise.all([
      Student.countDocuments(),
      Trainer.countDocuments(),
      Course.countDocuments({ isActive: true }),
      Enrollment.countDocuments({ status: 'active' }),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Salary.countDocuments({ status: 'pending' }),
    ]);
    res.json({
      success: true,
      data: {
        totalStudents: students,
        totalTrainers: trainers,
        activeCourses: courses,
        activeEnrollments: enrollments,
        totalRevenue: payments[0]?.total || 0,
        pendingSalaries,
      }
    });
  } catch (err) { next(err); }
};

// Students
exports.getStudents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    let query = {};
    if (search) {
      const users = await User.find({ name: { $regex: search, $options: 'i' }, role: 'student' }).select('_id');
      query.user = { $in: users.map(u => u._id) };
    }
    const students = await Student.find(query)
      .populate('user', 'name email phone avatar isActive')
      .populate('enrolledCourse', 'title danceStyle')
      .skip((page - 1) * limit).limit(Number(limit)).sort('-createdAt');
    const total = await Student.countDocuments(query);
    res.json({ success: true, data: students, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', '-password')
      .populate('enrolledCourse');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) { next(err); }
};

exports.createStudent = async (req, res, next) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, address, guardianName, guardianPhone } = req.body;
    if (!password) return res.status(400).json({ success: false, message: 'Password is required' });
    const user = await User.create({ name, email, password, phone, role: 'student' });
    const student = await Student.create({ user: user._id, dateOfBirth, gender, address, guardianName, guardianPhone });
    res.status(201).json({ success: true, data: student });
  } catch (err) { next(err); }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const { name, phone, dateOfBirth, gender, address, guardianName, guardianPhone, status } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    await User.findByIdAndUpdate(student.user, { name, phone });
    const updated = await Student.findByIdAndUpdate(req.params.id, { dateOfBirth, gender, address, guardianName, guardianPhone, status }, { new: true }).populate('user', '-password');
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) { next(err); }
};

// Trainers
exports.getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find()
      .populate('user', 'name email phone avatar isActive')
      .populate('assignedCourse', 'title danceStyle');
    res.json({ success: true, data: trainers });
  } catch (err) { next(err); }
};

exports.getTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
      .populate('user', '-password')
      .populate('assignedCourse');
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    res.json({ success: true, data: trainer });
  } catch (err) { next(err); }
};

exports.createTrainer = async (req, res, next) => {
  try {
    const { name, email, password, phone, specialization, experience, bio, salary, qualifications, joiningDate } = req.body;
    if (!password) return res.status(400).json({ success: false, message: 'Password is required' });
    const user = await User.create({ name, email, password, phone, role: 'trainer' });
    const trainer = await Trainer.create({ user: user._id, specialization, experience, bio, salary, qualifications, joiningDate });
    res.status(201).json({ success: true, data: trainer });
  } catch (err) { next(err); }
};

exports.updateTrainer = async (req, res, next) => {
  try {
    const { name, phone, specialization, experience, bio, salary, qualifications, status } = req.body;
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    await User.findByIdAndUpdate(trainer.user, { name, phone });
    const updated = await Trainer.findByIdAndUpdate(req.params.id, { specialization, experience, bio, salary, qualifications, status }, { new: true }).populate('user', '-password');
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

exports.deleteTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    await User.findByIdAndDelete(trainer.user);
    await Trainer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Trainer deleted' });
  } catch (err) { next(err); }
};

exports.assignTrainerToCourse = async (req, res, next) => {
  try {
    const { trainerId, courseId } = req.body;
    const trainer = await Trainer.findById(trainerId);
    const course = await Course.findById(courseId);
    if (!trainer || !course) return res.status(404).json({ success: false, message: 'Trainer or course not found' });

    // Unassign previous course from this trainer
    if (trainer.assignedCourse && String(trainer.assignedCourse) !== String(courseId)) {
      await Course.findByIdAndUpdate(trainer.assignedCourse, { trainer: null });
    }

    // Unassign existing trainer from this course
    if (course.trainer && String(course.trainer) !== String(trainerId)) {
      await Trainer.findByIdAndUpdate(course.trainer, { assignedCourse: null });
    }

    trainer.assignedCourse = courseId;
    await trainer.save();
    course.trainer = trainerId;
    await course.save();

    await createNotification({
      recipient: trainer.user,
      title: 'New Course Assignment',
      message: `You have been assigned to teach ${course.title}.`,
      type: 'success',
      link: '/trainer',
    });

    res.json({ success: true, data: trainer });
  } catch (err) { next(err); }
};
