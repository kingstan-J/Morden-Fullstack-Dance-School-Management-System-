const Enrollment = require('../models/Enrollment');
const Trainer = require('../models/Trainer');
const Course = require('../models/Course');
const Student = require('../models/Student');
const FeePermission = require('../models/FeePermission');
const Payment = require('../models/Payment');
const { getWeekKey } = require('../utils/weekKey');
const { createNotification } = require('../utils/notificationService');

// Determine current week for a date and ensure FeePermission exists.
const ensureFeePermission = async ({ enrollmentId, trainerId, weekKey, dueAt }) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) throw new Error('Enrollment not found');

  const course = await Course.findById(enrollment.course);
  const student = await Student.findById(enrollment.student).populate('user');
  const trainer = await Trainer.findById(trainerId).populate('user');

  if (!course) throw new Error('Course not found');
  if (!student) throw new Error('Student not found');
  if (!trainer) throw new Error('Trainer not found');

  let perm = await FeePermission.findOne({ enrollment: enrollmentId, weekKey });
  if (!perm) {
    perm = await FeePermission.create({
      enrollment: enrollmentId,
      student: enrollment.student,
      trainer: trainerId,
      course: course._id,
      weekKey,
      dueAt: dueAt || null,
      isAllowed: false,
      status: 'pending',
    });
  }
  return perm;
};

exports.getMyFeePermission = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const enrollment = await Enrollment.findOne({ student: student._id });
    if (!enrollment) return res.status(404).json({ success: false, message: 'No enrollment found' });

    // current week
    const weekKey = getWeekKey(new Date());
    const perm = await FeePermission.findOne({ enrollment: enrollment._id, weekKey });

    res.json({ success: true, data: perm || null });
  } catch (err) { next(err); }
};

exports.getTrainerFeePermissions = async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user._id });
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    if (!trainer.assignedCourse) return res.json({ success: true, data: [] });

    const weekKey = getWeekKey(new Date());

    // Fetch enrollments for trainer's assigned course
    const enrollments = await Enrollment.find({ course: trainer.assignedCourse, status: 'active' });

    const perms = await FeePermission.find({ enrollment: { $in: enrollments.map(e => e._id) }, weekKey })
      .populate('student', 'user')
      .populate('enrollment')
      .populate('course', 'title fee');

    res.json({ success: true, data: perms.sort((a,b) => String(a.student?._id || '') > String(b.student?._id || '') ? 1 : -1) });
  } catch (err) { next(err); }
};

exports.allowFeeForCurrentWeek = async (req, res, next) => {
  try {
    const { enrollmentId, dueAt } = req.body;
    if (!enrollmentId) return res.status(400).json({ success: false, message: 'enrollmentId is required' });

    const trainer = await Trainer.findOne({ user: req.user._id });
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });

    // Only allow for trainer's assigned course
    if (!trainer.assignedCourse || String(enrollment.course) !== String(trainer.assignedCourse)) {
      return res.status(403).json({ success: false, message: 'Not authorized for this enrollment' });
    }

    const weekKey = getWeekKey(new Date());
    const due = dueAt ? new Date(dueAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const perm = await ensureFeePermission({ enrollmentId: enrollment._id, trainerId: trainer._id, weekKey, dueAt: due });

    perm.isAllowed = true;
    perm.permittedBy = trainer._id;
    perm.allowedAt = new Date();
    perm.dueAt = due;
    perm.status = 'pending';

    await perm.save();

    // Notify student
    const studentProfile = await Student.findById(enrollment.student).populate('user');
    if (studentProfile?.user) {
      await createNotification({
        recipient: studentProfile.user,
        title: 'Fee Permission Granted',
        message: `You can pay this week fee. Due date: ${due.toDateString()}.`,
        type: 'success',
        link: '/student/fees',
      });
    }

    res.json({ success: true, data: perm });
  } catch (err) { next(err); }
};

exports.checkPayAllowedForCurrentWeek = async (req, res, next) => {
  // Used by payment controller to block pay when not allowed / overdue.
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const enrollment = await Enrollment.findOne({ student: student._id });
    if (!enrollment) return res.status(400).json({ success: false, message: 'Not enrolled' });

    const weekKey = getWeekKey(new Date());
    let perm = await FeePermission.findOne({ enrollment: enrollment._id, weekKey });

    // If no record, it means not allowed.
    if (!perm || !perm.isAllowed) {
      return res.status(403).json({
        success: false,
        message: 'Fee payment not allowed yet. Ask your trainer for permission.',
      });
    }

    // Overdue handling
    if (perm.dueAt && new Date() > perm.dueAt) {
      return res.status(403).json({
        success: false,
        message: 'Due date passed. Ask your trainer for a new due date.',
      });
    }

    res.json({ success: true, data: perm });
  } catch (err) { next(err); }
};

exports.getDueSummaryForStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    const enrollment = await Enrollment.findOne({ student: student._id });
    if (!enrollment) return res.status(404).json({ success: false, message: 'No enrollment found' });

    const weekKey = getWeekKey(new Date());
    const perm = await FeePermission.findOne({ enrollment: enrollment._id, weekKey })
      .populate('course', 'title fee');

    const payment = await Payment.findOne({
      student: student._id,
      course: enrollment.course,
      month: new Date().toLocaleString('default', { month: 'long' }),
    }).sort('-paymentDate');

    res.json({ success: true, data: { perm } });
  } catch (err) { next(err); }
};

module.exports = {
  getMyFeePermission: exports.getMyFeePermission,
  getTrainerFeePermissions: exports.getTrainerFeePermissions,
  allowFeeForCurrentWeek: exports.allowFeeForCurrentWeek,
  checkPayAllowedForCurrentWeek: exports.checkPayAllowedForCurrentWeek,
};



