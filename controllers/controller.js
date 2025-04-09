const { User, UserProfile } = require('../models');


class Controller {
  // Register: GET
  static showRegister(req, res) {
    res.render('register', { error: null });
  }

  // Register: POST
  static async register(req, res) {
    try {
      const { username, email, password, role, fullname, phone } = req.body;

      // Create user
      const user = await User.create({
        username,
        email,
        password,
        role,
        isVerified: false,
      });

      // Create user profile
      await UserProfile.create({
        userid: user.id,
        fullname,
        phone,
      });

      res.redirect('/login');
    } catch (error) {
      res.render('register', { error: error.message });
    }
  }

  // Login: GET
  static showLogin(req, res) {
    res.render('login', { error: null });
  }

  // Login: POST
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      // Set session
      req.session.userId = user.id;
      req.session.role = user.role;

      res.redirect('/courses');
    } catch (error) {
      res.render('login', { error: error.message });
    }
  }

  // Logout
  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect('/courses');
      }
      res.redirect('/login');
    });
  }
}

module.exports = Controller;