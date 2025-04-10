require('dotenv').config();
const express = require('express');
const session = require('express-session');
const routes = require('./routes');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/helpers', express.static('helpers'));
app.use('/invoices', express.static('invoices'));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));
app.use(routes);

app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan di server' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Nomor: 4242 4242 4242 4242
// Tanggal Kadaluarsa: 12/25
// CVC: 123