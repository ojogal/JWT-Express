const Router = require('express').Router;
const { body } = require('express-validator');
const authMiddle = require('./middlewares/auth_middleware.js');
const { registration, 
        login,
        refresh,
        index,
        activate,
        logout
      } = require('../controllers/user_controller.js');

const router = new Router();

router.get('/users', authMiddle, index);

router.get('/activate/:link', activate);

router.get('/refresh', refresh);

router.post('/registration', 
              body('password').isLength({ min: 4, max: 32 }),
              body('email').isEmail(), 
              registration);

router.post('/login', login);

router.post('/logout', logout);

module.exports = router