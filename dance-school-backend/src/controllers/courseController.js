const Course = require('../models/Course');

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isActive: true }).populate('trainer').populate({ path: 'trainer', populate: { path: 'user', select: 'name avatar' } });
    res.json({ success: true, data: courses });
  } catch (err) { next(err); }
};

exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate({ path: 'trainer', populate: { path: 'user', select: 'name email' } });
    res.json({ success: true, data: courses });
  } catch (err) { next(err); }
};

exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate({ path: 'trainer', populate: { path: 'user', select: 'name email avatar phone' } });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (err) { next(err); }
};

exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (err) { next(err); }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (err) { next(err); }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) { next(err); }
};

exports.uploadMaterial = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $push: { materials: { title: req.body.title || req.file.originalname, fileUrl: req.file.path } } },
      { new: true }
    );
    res.json({ success: true, data: course });
  } catch (err) { next(err); }
};
