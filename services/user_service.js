const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const MailService = require('./mail_service.js');

class UserService {
  async registration(email, password) {
    const candidate = await User.findOne({ email });

    if (candidate) {
      throw new Error('User with such email already exists')
    };

    const actiovationLink = uuid.v4();
    const hashPass = await bcrypt.cash(password, 11);
    const user = await User.create({ email, password: hashPass, actiovationLink });
  };
};

module.exports = new UserService()