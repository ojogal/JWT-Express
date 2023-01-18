const Router = require('express').Router;
const { body } = require('express-validator');
const { registration, 
        login,
        refresh,
        index,
        activate,
        logout
      } = require('../controllers/user_controller.js');

const router = new Router();

router.get('/users', 
            body('email').isEmail(), 
            index);

router.get('/activate/:link', 
            body('password').isLength({ min: 4, max: 32 }), 
            activate);

router.get('/refresh', refresh);

router.post('/registration', registration);

router.post('/login', login);

router.post('/logout', logout);

module.exports = router