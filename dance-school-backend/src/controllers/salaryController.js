const Salary = require('../models/Salary');
const Trainer = require('../models/Trainer');
const { generateSalarySlipPDF } = require('../utils/pdfGenerator');
const fs = require('fs');
const { createNotification } = require('../utils/notificationService');

exports.getMySalaries = async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user._id });
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    const salaries = await Salary.find({ trainer: trainer._id }).sort('-year -month');
    res.json({ success: true, data: salaries });
  } catch (err) { next(err); }
};

exports.getAllSalaries = async (req, res, next) => {
  try {
    const salaries = await Salary.find()
      .populate({ path: 'trainer', populate: { path: 'user', select: 'name email' } })
      .sort('-year -month');
    res.json({ success: true, data: salaries });
  } catch (err) { next(err); }
};

exports.createSalary = async (req, res, next) => {
  try {
    const salary = await Salary.create(req.body);
    const trainer = await Trainer.findById(salary.trainer).populate('user');
    if (trainer) {
      await createNotification({
        recipient: trainer.user,
        title: 'Salary Record Added',
        message: `Your salary for ${salary.month} ${salary.year} has been created.`,
        type: 'info',
        link: '/trainer/salary',
      });
    }
    res.status(201).json({ success: true, data: salary });
  } catch (err) { next(err); }
};

exports.updateSalary = async (req, res, next) => {
  try {
    const salary = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!salary) return res.status(404).json({ success: false, message: 'Salary record not found' });
    res.json({ success: true, data: salary });
  } catch (err) { next(err); }
};

exports.downloadSalarySlip = async (req, res, next) => {
  try {
    const salary = await Salary.findById(req.params.id)
      .populate({ path: 'trainer', populate: [{ path: 'user', select: 'name' }, { path: 'assignedCourse', select: 'title' }] });
    if (!salary) return res.status(404).json({ success: false, message: 'Salary not found' });

    const { filepath, filename } = await generateSalarySlipPDF({
      trainerName: salary.trainer?.user?.name,
      trainerId: salary.trainer?.trainerId,
      courseName: salary.trainer?.assignedCourse?.title,
      amount: salary.amount,
      month: salary.month,
      year: salary.year,
      status: salary.status,
      paymentDate: salary.paymentDate,
    });

    res.download(filepath, filename, () => fs.unlink(filepath, () => {}));
  } catch (err) { next(err); }
};
