const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { sendEmail } = require('./mail_service.js');
const { generateToken, 
        saveToken,
        validateAccessToken,
        validateRefreshToken,
        findToken
      } = require('./token_service.js');
const UserDto = require('../dtos/user_dto.js');
const ApiError = require('../exceptions/error.js');

class UserService {
  async registration(email, password) {
    const candidate = await User.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest('User with such email already exists')
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
      throw ApiError.BadRequest('Incorrect activation link')
    };

    user.isActivated = true;
    user.save();
    
  };

  async login(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest('Brukker ikke funnet');
    };

    const passCompare = await bcrypt.compare(password, user.password);

    if (!passCompare) {
      throw ApiError.BadRequest('Passordet er feil');
    };
    
    const userDto = new UserDto(user);
    const tokens = generateToken({ ...userDto });
    await saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  };

  async logout(refreshToken) {
    const token = await removeToken(refreshToken);

    return token
  };

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedErorr()
    };

    const userData = validateRefreshToken(refreshToken);
    const tokenInDB = await findToken(refreshToken);

    if (!userData || !tokenInDB) {
      throw ApiError.UnauthorizedErorr()
    };

    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = generateToken({ ...UserDto });
    await saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }
};

module.exports = new UserService()