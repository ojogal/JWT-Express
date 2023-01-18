const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/error.js');
const { registration, 
        activate,
        login,
        logout
      } = require('../services/user_service.js');

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      };

      const { email, password } = req.body;
      const userData = await registration(email, password);
      res.cookie(
        'RefreshToken', 
        userData.refreshToken, 
        { maxAge: 30*24*60*60*1000,
          httpOnly: true
        });

      return res.json(userData)
    } catch (e) {
      next(e)
    }
  };

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await login(email, password);
      res.cookie(
        'RefreshToken', 
        userData.refreshToken, 
        { maxAge: 30,
          httpOnly: true
        });

      return res.json(userData)
    } catch (e) {
      next(e)
    }
  };

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await logout(refreshToken);
      res.clearCookie('refreshToken');

      return res.status(200).json(token)
    } catch (e) {
      next(e)
    }
  };

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await activate(activationLink);

      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e)
    }
  };

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await refresh(refreshToken);
      res.cookie(
        'RefreshToken',
        userData.refreshToken,
        { maxAge: 30*24*60*60*1000,
          httpOnly: true
        });
    } catch (e) {
      next(e)
    }
  };
  
  async index(req, res, next) {
    try {

    } catch (e) {
      next(e)
    }
  };
};

module.exports = new UserController()