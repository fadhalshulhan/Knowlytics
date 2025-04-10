require('dotenv').config();
const express = require('express');
const session = require('express-session');
const routes = require('./routes');
const flash = require('connect-flash')
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/helpers', express.static('helpers'));
app.use('/invoices', express.static('invoices'));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 hari
    }
}));
app.use(routes);

// Error handling global
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan di server: ' + err.message });
});

// Tangani uncaught exceptions untuk mencegah server crash
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});