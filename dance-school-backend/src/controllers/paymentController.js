const Payment = require('../models/Payment');
const Student = require('../models/Student');
const { generateReceiptPDF } = require('../utils/pdfGenerator');
const path = require('path');
const fs = require('fs');
const { createNotification } = require('../utils/notificationService');

exports.createPayment = async (req, res, next) => {
  try {
    let studentId;
    if (req.user.role === 'admin') {
      // Admin provides student (Student ObjectId) directly
      studentId = req.body.student;
      if (!studentId) return res.status(400).json({ success: false, message: 'Student ID required' });
    } else {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
      studentId = student._id;
    }

    const courseId = req.body.course || (await Student.findById(studentId))?.enrolledCourse;
    const payment = await Payment.create({
      student: studentId,
      course: courseId,
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
      status: req.body.status,
      month: req.body.month,
      year: req.body.year,
      remarks: req.body.remarks,
    });

    const studentDoc = await Student.findById(studentId).populate('user');
    if (studentDoc) {
      await createNotification({
        recipient: studentDoc.user,
        title: 'Payment Recorded',
        message: `Your payment of ₹${payment.amount} for ${payment.month} ${payment.year} has been recorded.`,
        type: 'success',
        link: '/student/fees',
      });
    }

    res.status(201).json({ success: true, data: payment });
  } catch (err) { next(err); }
};

exports.getMyPayments = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const payments = await Payment.find({ student: student._id }).populate('course', 'title fee').sort('-paymentDate');
    res.json({ success: true, data: payments });
  } catch (err) { next(err); }
};

exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('course', 'title').sort('-paymentDate');
    res.json({ success: true, data: payments });
  } catch (err) { next(err); }
};

exports.getStudentPaymentsForTrainer = async (req, res, next) => {
  try {
    const Trainer = require('../models/Trainer');
    const trainer = await Trainer.findOne({ user: req.user._id });
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    const payments = await Payment.find({ course: trainer.assignedCourse })
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .sort('-paymentDate');
    res.json({ success: true, data: payments });
  } catch (err) { next(err); }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student || String(payment.student) !== String(student._id)) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this payment' });
      }
      if (payment.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'Only pending payments can be updated' });
      }
      if (req.body.status && req.body.status !== 'paid') {
        return res.status(400).json({ success: false, message: 'Students can only mark payments as paid' });
      }
      payment.status = 'paid';
      payment.paymentMethod = req.body.paymentMethod || payment.paymentMethod;
      payment.paymentDate = req.body.paymentDate ? new Date(req.body.paymentDate) : new Date();
      await payment.save();

      const studentDoc = await Student.findById(payment.student).populate('user');
      if (studentDoc) {
        await createNotification({
          recipient: studentDoc.user,
          title: 'Payment Confirmed',
          message: `Your payment of ₹${payment.amount} has been confirmed.`,
          type: 'success',
          link: '/student/fees',
        });
      }

      return res.json({ success: true, data: payment });
    }

    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

exports.downloadReceipt = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .populate('course', 'title');

    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    const { filepath, filename } = await generateReceiptPDF({
      receiptNumber: payment.receiptNumber,
      studentName: payment.student?.user?.name,
      courseName: payment.course?.title,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentDate: payment.paymentDate,
      status: payment.status,
    });

    res.download(filepath, filename, () => fs.unlink(filepath, () => {}));
  } catch (err) { next(err); }
};
