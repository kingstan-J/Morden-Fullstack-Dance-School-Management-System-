const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats, getStudents, getStudent, createStudent, updateStudent, deleteStudent,
  getTrainers, getTrainer, createTrainer, updateTrainer, deleteTrainer, assignTrainerToCourse
} = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/students', getStudents);
router.get('/students/:id', getStudent);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.get('/trainers', getTrainers);
router.get('/trainers/:id', getTrainer);
router.post('/trainers', createTrainer);
router.put('/trainers/:id', updateTrainer);
router.delete('/trainers/:id', deleteTrainer);
router.post('/assign-trainer', assignTrainerToCourse);

module.exports = router;
