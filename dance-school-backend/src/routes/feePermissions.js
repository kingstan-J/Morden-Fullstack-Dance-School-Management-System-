const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMyFeePermission,
  getTrainerFeePermissions,
  allowFeeForCurrentWeek,
  checkPayAllowedForCurrentWeek,
} = require('../controllers/feePermissionController');

router.get('/my', protect, authorize('student'), getMyFeePermission);
router.get('/trainer', protect, authorize('trainer'), getTrainerFeePermissions);
router.post('/trainer/allow', protect, authorize('trainer'), allowFeeForCurrentWeek);

// Payment blocking check
router.get('/check-pay', protect, authorize('student', 'admin'), checkPayAllowedForCurrentWeek);

module.exports = router;

