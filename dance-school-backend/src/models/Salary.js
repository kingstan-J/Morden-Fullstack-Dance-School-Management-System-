const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  paymentDate: Date,
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  remarks: String,
}, { timestamps: true });

module.exports = mongoose.model('Salary', salarySchema);
