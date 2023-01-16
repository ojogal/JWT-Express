const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token.js');

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(
      payload, 
      process.env.JWT_ACCESS_KEY, 
      { expiresIn: '1h' });
    const refreshToken = jwt.sign(
      payload, 
      process.env.JWT_REFRESH_KEY, 
      { expiresIn: '10d' });
    return {
      accessToken,
      refreshToken
    }
  };
};

module.exports = new TokenService()