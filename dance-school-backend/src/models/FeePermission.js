const mongoose = require('mongoose');

// Fee permission per enrollment + week key.
// Drives:
// - whether trainer can allow attendance/payment for that week
// - due date within that week
const feePermissionSchema = new mongoose.Schema({
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

  // Week label, e.g. "2026-W23"
  weekKey: { type: String, required: true },

  // granted by trainer
  isAllowed: { type: Boolean, default: false },
  permittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', default: null },
  allowedAt: { type: Date, default: null },

  dueAt: { type: Date, default: null },

  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
}, { timestamps: true });

feePermissionSchema.index({ enrollment: 1, weekKey: 1 }, { unique: true });

module.exports = mongoose.model('FeePermission', feePermissionSchema);

