const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    name: user.name
  };
  return jwt.sign(
    payload,
    process.env.SECRET_KEY,
    { expiresIn: '1h' }
  );
};

const authMiddleware = (req, res, next) => {
  console.log('==============================');
  console.log('Cookies recebidos na requisição:', req.cookies);


  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect('/api/user/login');
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.redirect('/api/user/login');
    }
    req.user = decoded;
    next();
  });
};

module.exports = {
  generateToken,
  authMiddleware
}