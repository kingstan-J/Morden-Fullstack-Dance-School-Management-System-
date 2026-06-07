const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { generateCertificate, getMyCertificates, getAllCertificates, downloadCertificate } = require('../controllers/certificateController');

router.post('/generate', protect, authorize('trainer'), generateCertificate);
router.get('/my', protect, authorize('student'), getMyCertificates);
router.get('/', protect, authorize('admin'), getAllCertificates);
router.get('/:id/download', protect, downloadCertificate);

module.exports = router;
