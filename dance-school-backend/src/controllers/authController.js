const User = require('../models/User');
const Student = require('../models/Student');
const Trainer = require('../models/Trainer');
const Course = require('../models/Course');
const { sendTokenResponse } = require('../utils/token');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, specialization } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    const normalizedRole = role === 'trainer' ? 'trainer' : role === 'admin' ? 'admin' : 'student';
    const user = await User.create({ name, email, password, phone, role: normalizedRole });


    if (user.role === 'student') {
      await Student.create({ user: user._id });
    } else if (user.role === 'trainer') {
      const trainer = await Trainer.create({ user: user._id, specialization: specialization || '' });

      if (specialization) {
        const courseInfo = {
          Bharatanatyam: { title: 'Classical Bharatanatyam', fee: 3000, duration: '6 months', schedule: 'Mon, Wed, Fri - 6:00 PM', description: 'Learn the classical Indian dance form with rich expressions and graceful movements.' },
          Contemporary:  { title: 'Contemporary Dance',      fee: 3500, duration: '6 months', schedule: 'Tue, Thu, Sat - 5:00 PM', description: 'Explore creative movement through contemporary dance techniques.' },
          'Hip Hop':     { title: 'Hip Hop Fundamentals',    fee: 2500, duration: '4 months', schedule: 'Sat, Sun - 4:00 PM',      description: 'Master the basics of hip hop dance with urban street style.' },
          Salsa:         { title: 'Salsa & Latin Dance',      fee: 2800, duration: '3 months', schedule: 'Mon, Wed - 7:00 PM',      description: 'Dance to the rhythm of Latin music with passion and energy.' },
          Jazz:          { title: 'Jazz Dance Fusion',        fee: 3200, duration: '5 months', schedule: 'Tue, Thu - 6:30 PM',      description: 'Blend jazz technique with contemporary rhythms for a dynamic experience.' },
          Kathak:        { title: 'Kathak Rhythm & Grace',    fee: 3000, duration: '6 months', schedule: 'Wed, Fri - 5:30 PM',      description: 'Learn traditional Kathak footwork, storytelling, and rhythmic patterns.' },
          Ballet:        { title: 'Ballet Basics',            fee: 3200, duration: '5 months', schedule: 'Mon, Thu - 4:30 PM',      description: 'Build strength and poise with foundational ballet technique.' },
          Bollywood:     { title: 'Bollywood Fusion',         fee: 2900, duration: '4 months', schedule: 'Fri, Sat - 5:30 PM',      description: 'Enjoy high-energy Bollywood choreography with modern fusion moves.' },
        };
        const info = courseInfo[specialization];
        if (info) {
          let course = await Course.findOne({ danceStyle: specialization });
          if (!course) {
            course = await Course.create({ ...info, danceStyle: specialization, level: 'beginner', maxStudents: 20, trainer: trainer._id, isActive: true });
          } else if (!course.trainer) {
            course.trainer = trainer._id;
            await course.save();
          }
          trainer.assignedCourse = course._id;
          await trainer.save();
        }
      }
    }

    sendTokenResponse(user, 201, res);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Account deactivated' });

    sendTokenResponse(user, 200, res);
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ user: user._id }).populate('enrolledCourse');
    } else if (user.role === 'trainer') {
      profile = await Trainer.findOne({ user: user._id }).populate('assignedCourse');
    }
    res.json({ success: true, user, profile });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar, dateOfBirth, gender, address, guardianName, guardianPhone } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, avatar }, { new: true, runValidators: true });
    // Update student/trainer profile fields if applicable
    if (req.user.role === 'student') {
      await Student.findOneAndUpdate({ user: req.user.id }, { dateOfBirth, gender, address, guardianName, guardianPhone }, { new: true });
    }
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'No user with that email' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Drizzle Dance - Password Reset',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Expires in 10 minutes.</p>`,
    });

    res.json({ success: true, message: 'Reset email sent' });
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password incorrect' });
    }
    user.password = req.body.newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (err) { next(err); }
};
