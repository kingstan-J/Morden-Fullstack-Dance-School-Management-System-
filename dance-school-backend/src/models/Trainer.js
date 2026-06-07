const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  trainerId: { type: String, unique: true },
  specialization: String,
  experience: Number,
  bio: String,
  assignedCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
  qualifications: [String],
  salary: { type: Number, default: 0 },
  joiningDate: Date,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

trainerSchema.pre('save', async function () {
  if (!this.trainerId) {
    const count = await mongoose.model('Trainer').countDocuments();
    this.trainerId = `TRN${String(count + 1).padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('Trainer', trainerSchema);
