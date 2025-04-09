const express = require('express');
const session = require('express-session');
const router = require('./routes/index');
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Set to true if using HTTPS
}));

// Routes
app.use('/', router);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});