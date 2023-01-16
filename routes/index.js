const Router = require('express').Router;
const { registration, 
        login,
        refresh,
        index,
        activate,
        logout
      } = require('../controllers/user_controller.js');

const router = new Router();

router.get('/users', index);
router.get('/activate/:link', activate);
router.get('/refresh', refresh);
router.post('/registration', registration);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router