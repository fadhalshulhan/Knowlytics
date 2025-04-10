const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');

const isLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        // Jika request adalah API (misalnya, Content-Type: application/json), kembalikan JSON
        if (req.headers['content-type'] === 'application/json') {
            return res.status(401).json({ error: 'Unauthorized: Please login to continue' });
        }
        // Jika bukan API (misalnya, request browser), redirect ke login
        return res.redirect('/login');
    }
    next();
};

router.get('/', Controller.landingPage);
router.get('/login', Controller.loginPage);
router.post('/login', Controller.login);
router.get('/register', Controller.registerPage);
router.post('/register', Controller.register);
router.get('/logout', Controller.logout);
router.get('/payment', isLoggedIn, Controller.paymentPage);
router.get('/invoice-view/:paymentId', Controller.invoiceView)
router.get('/courses/enroll-popup', isLoggedIn, Controller.enrollPopup);
// router.post('/complete-enrollment', isLoggedIn, Controller.completeEnrollment);
router.post('/complete-enrollment', (req, res) => {
    res.json({ success: true, message: "Test complete-enrollment" });
});
router.get('/courses/:id', isLoggedIn, Controller.courseDetail);
router.post('/courses/enroll', isLoggedIn, Controller.enrollCourse);
router.get('/edit-profile', isLoggedIn, Controller.editProfilePage);
router.post('/edit-profile', isLoggedIn, Controller.editProfile);
router.get('/delete-user', isLoggedIn, Controller.deleteUser);
router.get('/get-easyinvoice-key', isLoggedIn, Controller.getEasyInvoiceKey);
router.get('/invoices/:paymentId', Controller.getInvoice);


module.exports = router;