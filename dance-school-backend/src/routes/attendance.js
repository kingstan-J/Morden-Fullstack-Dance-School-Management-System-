const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { markAttendance, getAttendanceByStudent, getAttendanceByTrainer, getAllAttendance } = require('../controllers/attendanceController');

router.post('/', protect, authorize('trainer'), markAttendance);
router.get('/my', protect, authorize('student'), getAttendanceByStudent);
router.get('/trainer', protect, authorize('trainer'), getAttendanceByTrainer);
router.get('/', protect, authorize('admin'), getAllAttendance);

module.exports = router;
