const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  danceStyle: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  duration: String,
  fee: { type: Number, required: true },
  schedule: String,
  maxStudents: { type: Number, default: 30 },
  totalClassDays: { type: Number, default: 100 },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', default: null },
  image: { type: String, default: '' },
  materials: [{
    title: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
