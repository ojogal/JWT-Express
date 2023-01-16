const User = require('../models/user.js');

class UserService {
  async registration(email, password) {
    const candidate = await User.findOne({ email });

    if (candidate) {
      throw new Error('User with such email already exists')
    };

    const user = await User.create({ email, password });
  };
};

module.exports = new UserService()