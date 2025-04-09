const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');

// Register
router.get('/register', Controller.showRegister);
router.post('/register', Controller.register);

// Login
router.get('/login', Controller.showLogin);
router.post('/login', Controller.login);

// Logout
router.get('/logout', Controller.logout);

// Other routes (e.g., courses)
router.get('/courses', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.render('courses');
});

module.exports = router;