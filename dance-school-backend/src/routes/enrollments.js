const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { enroll, getMyEnrollment, getAllEnrollments, getTrainerStudents, updateEnrollment } = require('../controllers/enrollmentController');

router.post('/', protect, authorize('student'), enroll);
router.get('/my', protect, authorize('student'), getMyEnrollment);
router.get('/trainer-students', protect, authorize('trainer'), getTrainerStudents);
router.get('/', protect, authorize('admin'), getAllEnrollments);
router.put('/:id', protect, authorize('admin'), updateEnrollment);

module.exports = router;
