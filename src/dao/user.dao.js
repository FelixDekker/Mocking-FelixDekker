import bcrypt from 'bcrypt';
import User from '../dao/models/user.model.js';

class UserDao {
  async register(email, password) {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const newUser = new User({ email, password });
      await newUser.save();
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Invalid credentials');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async logout(req) {
    try {
      req.session.destroy();
    } catch (error) {
      throw error;
    }
  }
}

export default UserDao;
