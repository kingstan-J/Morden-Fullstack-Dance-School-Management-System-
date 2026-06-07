const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  certificateNumber: { type: String, unique: true },
  issueDate: { type: Date, default: Date.now },
  fileUrl: String,
}, { timestamps: true });

certificateSchema.pre('save', async function () {
  if (!this.certificateNumber) {
    const count = await mongoose.model('Certificate').countDocuments();
    this.certificateNumber = `CERT-DD-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('Certificate', certificateSchema);
