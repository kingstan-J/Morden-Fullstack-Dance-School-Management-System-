const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getMySalaries, getAllSalaries, createSalary, updateSalary, downloadSalarySlip } = require('../controllers/salaryController');

router.get('/my', protect, authorize('trainer'), getMySalaries);
router.get('/', protect, authorize('admin'), getAllSalaries);
router.post('/', protect, authorize('admin'), createSalary);
router.put('/:id', protect, authorize('admin'), updateSalary);
router.get('/:id/slip', protect, authorize('trainer', 'admin'), downloadSalarySlip);

module.exports = router;
