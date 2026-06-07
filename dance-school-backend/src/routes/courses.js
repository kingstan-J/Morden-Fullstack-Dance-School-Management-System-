const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getCourses, getAllCourses, getCourse, createCourse, updateCourse, deleteCourse, uploadMaterial } = require('../controllers/courseController');

router.get('/', getCourses);
router.get('/all', protect, authorize('admin'), getAllCourses);
router.get('/:id', getCourse);
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);
router.post('/:id/materials', protect, authorize('trainer', 'admin'), upload.single('file'), uploadMaterial);

module.exports = router;
