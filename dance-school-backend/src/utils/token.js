const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: Number(process.env.JWT_EXPIRE) || process.env.JWT_EXPIRE || '1h' });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const userObj = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
  };
  res.status(statusCode).json({ success: true, token, user: userObj });
};

module.exports = { generateToken, sendTokenResponse };
