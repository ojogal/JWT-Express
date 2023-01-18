const ApiError = require("../exceptions/error");
const { validateAccessToken } = require('../services/token_service.js');

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(ApiError.UnauthorizedErorr())
    };

    const token = authHeader.split(' '); // type Bearer

    if (!token) {
      return next(ApiError.UnauthorizedErorr())
    };

    const userData = validateAccessToken(token);

    if (!userData) {
      return next(ApiError.UnauthorizedErorr())
    };

    req.user = userData;
    
    next()
  } catch (e) {
    return next(ApiError.UnauthorizedErorr())
  }
}