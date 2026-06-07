const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createPayment, getMyPayments, getAllPayments, getStudentPaymentsForTrainer, updatePayment, downloadReceipt } = require('../controllers/paymentController');

router.post('/', protect, authorize('student', 'admin'), createPayment);
router.get('/my', protect, authorize('student'), getMyPayments);
router.get('/trainer-view', protect, authorize('trainer'), getStudentPaymentsForTrainer);
router.get('/', protect, authorize('admin'), getAllPayments);
router.put('/:id', protect, authorize('admin', 'student'), updatePayment);
router.get('/:id/receipt', protect, downloadReceipt);

module.exports = router;
