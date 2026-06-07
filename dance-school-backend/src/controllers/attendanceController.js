const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Trainer = require('../models/Trainer');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Recalculate and save progress for a student in a course
const updateStudentProgress = async (studentId, courseId) => {
  const course = await Course.findById(courseId);
  const totalClassDays = course?.totalClassDays || 100;

  const allAttendance = await Attendance.find({ student: studentId, course: courseId });
  const presentDays = allAttendance.filter(a => a.status === 'present' || a.status === 'late').length;

  // Progress = (days attended / total class days) * 100, capped at 99 until certificate issued
  const progress = Math.min(Math.round((presentDays / totalClassDays) * 100), 99);

  await Enrollment.findOneAndUpdate(
    { student: studentId, course: courseId },
    { progress },
    { new: true }
  );

  return progress;
};

exports.markAttendance = async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user._id });
    if (!trainer) return res.status(403).json({ success: false, message: 'Trainer not found' });

    const { attendanceData, date } = req.body;
    const results = [];

    for (const item of attendanceData) {
      const record = await Attendance.findOneAndUpdate(
        { student: item.studentId, course: trainer.assignedCourse, date: new Date(date) },
        { trainer: trainer._id, status: item.status, remarks: item.remarks || '' },
        { upsert: true, new: true }
      );
      results.push(record);

      // Update progress for each student after marking
      await updateStudentProgress(item.studentId, trainer.assignedCourse);
    }

    res.json({ success: true, data: results });
  } catch (err) { next(err); }
};

exports.getAttendanceByStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const attendance = await Attendance.find({ student: student._id })
      .populate('course', 'title totalClassDays').sort('-date');

    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    // Get current progress from enrollment
    const enrollment = await Enrollment.findOne({ student: student._id });
    const progress = enrollment?.progress || 0;

    res.json({
      success: true,
      data: attendance,
      stats: { total, present, late, absent, percentage, progress }
    });
  } catch (err) { next(err); }
};

exports.getAttendanceByTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user._id });
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

    const { date, studentId } = req.query;
    let query = { course: trainer.assignedCourse, trainer: trainer._id };
    if (date) query.date = new Date(date);
    if (studentId) query.student = studentId;

    const attendance = await Attendance.find(query)
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .sort('-date');
    res.json({ success: true, data: attendance });
  } catch (err) { next(err); }
};

exports.getAllAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find()
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .populate('course', 'title').sort('-date').limit(200);
    res.json({ success: true, data: attendance });
  } catch (err) { next(err); }
};
