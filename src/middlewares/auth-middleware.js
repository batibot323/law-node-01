const jwt = require('jsonwebtoken');

// Keep this secret key in a .env file
const SECRET_KEY = 'super-secret-key';

// This middleware verifies the access token and extract user_id from there.
module.exports = function checkAuthHeader(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    const accessToken = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(accessToken, SECRET_KEY);
      req.user_id = decoded.id;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid access token' });
    }
  }