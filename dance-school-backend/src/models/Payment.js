const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['cash', 'card', 'online', 'bank_transfer'], default: 'cash' },
  status: { type: String, enum: ['pending', 'paid', 'overdue', 'refunded'], default: 'pending' },
  receiptNumber: { type: String, unique: true },
  month: String,
  year: Number,
  remarks: String,
}, { timestamps: true });

paymentSchema.pre('save', async function () {
  if (!this.receiptNumber) {
    const count = await mongoose.model('Payment').countDocuments();
    this.receiptNumber = `REC${Date.now()}${String(count + 1).padStart(3, '0')}`;
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
