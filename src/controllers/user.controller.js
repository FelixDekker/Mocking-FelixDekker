import DaoFactory from '../dao/daoFactory.js';
import UserDto from '../dto/userDto.js';

const userDao = DaoFactory.createDao('user');

class UserController {
  async register(req, res) {
    try {
      const { email, password } = req.body;
      const newUser = await userDao.register(email, password);
      req.session.user = { id: newUser._id, email: newUser.email, role: newUser.role };
      const userDto = new UserDto(newUser);
      return res.status(201).json({ message: 'Registration successful', user: userDto });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userDao.login(email, password);
      req.session.user = { id: user._id, email: user.email, role: user.role };
      const userDto = new UserDto(user);
      return res.status(200).json({ message: 'Login successful', user: userDto });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async logout(req, res) {
    try {
      await userDao.logout(req);
      return res.redirect('/login');
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;
