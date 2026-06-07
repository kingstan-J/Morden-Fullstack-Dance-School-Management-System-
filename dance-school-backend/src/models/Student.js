const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  studentId: { type: String, unique: true },
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: String,
  guardianName: String,
  guardianPhone: String,
  enrolledCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
  enrollmentDate: Date,
  status: { type: String, enum: ['active', 'inactive', 'completed'], default: 'active' },
}, { timestamps: true });

studentSchema.pre('save', async function () {
  if (!this.studentId) {
    const count = await mongoose.model('Student').countDocuments();
    this.studentId = `STU${String(count + 1).padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('Student', studentSchema);
