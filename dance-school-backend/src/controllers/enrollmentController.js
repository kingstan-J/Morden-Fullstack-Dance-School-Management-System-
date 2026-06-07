const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Trainer = require('../models/Trainer');
const { createNotification } = require('../utils/notificationService');

exports.enroll = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    if (student.enrolledCourse) return res.status(400).json({ success: false, message: 'Already enrolled in a course' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (!course.trainer) return res.status(400).json({ success: false, message: 'Course does not have an assigned trainer' });

    const enrollment = await Enrollment.create({
      student: student._id,
      course: courseId,
      trainer: course.trainer,
    });

    await Student.findByIdAndUpdate(student._id, { enrolledCourse: courseId, enrollmentDate: new Date() });

    const studentProfile = await Student.findById(student._id).populate('user');
    const trainer = await Trainer.findById(course.trainer).populate('user');
    await createNotification({ recipient: studentProfile.user, title: 'Course Enrolled', message: `You are successfully enrolled in ${course.title}.`, type: 'success', link: '/student/courses' });
    if (trainer) {
      await createNotification({ recipient: trainer.user, title: 'New Enrollment', message: `${studentProfile.user.name} enrolled in ${course.title}.`, type: 'info', link: '/trainer/students' });
    }

    res.status(201).json({ success: true, data: enrollment });
  } catch (err) { next(err); }
};

exports.getMyEnrollment = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    const enrollment = await Enrollment.findOne({ student: student._id })
      .populate('course')
      .populate({ path: 'trainer', populate: { path: 'user', select: 'name email avatar' } });
    res.json({ success: true, data: enrollment });
  } catch (err) { next(err); }
};

exports.getAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('course', 'title danceStyle')
      .sort('-createdAt');
    res.json({ success: true, data: enrollments });
  } catch (err) { next(err); }
};

exports.getTrainerStudents = async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user._id });
    if (!trainer || !trainer.assignedCourse) return res.json({ success: true, data: [] });

    const { search } = req.query;
    let query = { course: trainer.assignedCourse, status: 'active' };

    const enrollments = await Enrollment.find(query)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email phone avatar' } });

    let filtered = enrollments;
    if (search) {
      filtered = enrollments.filter(e => e.student?.user?.name?.toLowerCase().includes(search.toLowerCase()));
    }

    res.json({ success: true, data: filtered });
  } catch (err) { next(err); }
};

exports.updateEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
    res.json({ success: true, data: enrollment });
  } catch (err) { next(err); }
};
