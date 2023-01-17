const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { sendEmail } = require('./mail_service.js');
const { generateToken, saveToken } = require('./token_service.js');
const UserDto = require('../dtos/user_dto.js');

class UserService {
  async registration(email, password) {
    const candidate = await User.findOne({ email });

    if (candidate) {
      throw new Error('User with such email already exists')
    };

    const activationLink = uuid.v4();
    const hashPass = await bcrypt.hash(password, 11);
    const user = await User.create({ email, password: hashPass, activationLink });
    await sendEmail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
    const userDto = new UserDto(user); // id, email, isActivated
    const tokens = generateToken({ ...userDto });
    await saveToken(userDto.id, tokens.refreshToken);
    
    return {
      ...tokens,
      user: userDto
    }
  };

  async activate(link) {
    const user = await User.findOne({ link });

    if (!user) {
      throw new Error('Incorrect activation link')
    };

    user.isActivated = true;
    user.save();
    
  };
};

module.exports = new UserService()