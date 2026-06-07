const User = require('../models/User');

/**
 * No demo/default accounts.
 * Admin must be created manually via scripts/DB or deployment process.
 */
const ensureAdminAccount = async () => {
  // Intentionally do nothing.
};

module.exports = { ensureAdminAccount };



