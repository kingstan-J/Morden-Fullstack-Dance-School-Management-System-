const Notification = require('../models/Notification');

const createNotification = async ({ recipient, title, message, type = 'info', link = '' }) => {
  return Notification.create({ recipient, title, message, type, link });
};

module.exports = { createNotification };