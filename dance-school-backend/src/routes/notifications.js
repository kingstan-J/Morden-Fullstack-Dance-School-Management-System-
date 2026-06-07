const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMyNotifications, markAsRead, markAllRead } = require('../controllers/notificationController');

router.get('/', protect, getMyNotifications);
router.put('/mark-all-read', protect, markAllRead);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
