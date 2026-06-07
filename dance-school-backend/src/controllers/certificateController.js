const Certificate = require('../models/Certificate');
const Student = require('../models/Student');
const Trainer = require('../models/Trainer');
const Enrollment = require('../models/Enrollment');
const { generateCertificatePDF } = require('../utils/pdfGenerator');
const fs = require('fs');
const { createNotification } = require('../utils/notificationService');

exports.generateCertificate = async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user._id }).populate('assignedCourse');
    if (!trainer) return res.status(403).json({ success: false, message: 'Trainer not found' });

    const { studentId } = req.body;
    const student = await Student.findById(studentId).populate('user', 'name');

    const existing = await Certificate.findOne({ student: studentId, course: trainer.assignedCourse._id });
    if (existing) return res.status(400).json({ success: false, message: 'Certificate already issued' });

    const certificate = await Certificate.create({
      student: studentId,
      course: trainer.assignedCourse._id,
      trainer: trainer._id,
    });

    await Enrollment.findOneAndUpdate(
      { student: studentId, course: trainer.assignedCourse._id },
      { status: 'completed', completionDate: new Date(), progress: 100 }
    );

    await createNotification({
      recipient: student.user,
      title: 'Certificate Issued',
      message: `Your certificate for ${trainer.assignedCourse.title} is ready to download.`,
      type: 'success',
      link: '/student/certificates',
    });

    res.status(201).json({ success: true, data: certificate });
  } catch (err) { next(err); }
};

exports.getMyCertificates = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    const certificates = await Certificate.find({ student: student._id })
      .populate('course', 'title danceStyle').populate({ path: 'trainer', populate: { path: 'user', select: 'name' } });
    res.json({ success: true, data: certificates });
  } catch (err) { next(err); }
};

exports.getAllCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find()
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .populate('course', 'title').sort('-createdAt');
    res.json({ success: true, data: certificates });
  } catch (err) { next(err); }
};

exports.downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .populate('course', 'title')
      .populate({ path: 'trainer', populate: { path: 'user', select: 'name' } });

    if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });

    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student || String(certificate.student._id) !== String(student._id)) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    const { filepath, filename } = await generateCertificatePDF({
      certificateNumber: certificate.certificateNumber,
      studentName: certificate.student?.user?.name,
      courseName: certificate.course?.title,
      trainerName: certificate.trainer?.user?.name,
      issueDate: certificate.issueDate,
    });

    res.download(filepath, filename, () => fs.unlink(filepath, () => {}));
  } catch (err) { next(err); }
};
