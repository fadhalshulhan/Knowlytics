const { User, Course, Category, UserCourse, Lesson, UserProfile, sequelize } = require('../models');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Muat dari .env
const { formatDate } = require('../helpers/helper');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs'); // Impor fs secara langsung
const fsPromises = require('fs').promises; // Impor fs.promises untuk fungsi promise-based

class Controller {
    static async landingPage(req, res) {
        try {
            const { sort, search, category, page = 1, success } = req.query;
            const limit = 6;
            let pageNum = parseInt(page, 10) || 1;

            let order = [];
            if (sort === 'asc') {
                order = [['duration', 'ASC']];
            } else if (sort === 'desc') {
                order = [['duration', 'DESC']];
            }

            let where = {};
            if (search) {
                where = {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${search}%` } },
                        { description: { [Op.iLike]: `%${search}%` } }
                    ]
                };
            }

            let include = [{ model: Category, through: { attributes: [] } }];
            if (category) {
                include[0].where = { name: category };
            }

            const { count, rows: courses } = await Course.findAndCountAll({
                where,
                include,
                order,
                limit,
                offset: (pageNum - 1) * limit,
                distinct: true
            });


            const totalPages = Math.ceil(count / limit);

            const isLoggedIn = !!req.session.userId;
            res.render('landing', {
                courses,
                formatDate,
                isLoggedIn,
                sort,
                search,
                category,
                page: pageNum,
                totalPages,
                success,
                count
            });
        } catch (error) {
            res.send(error.message);
        }
    }

    static async loginPage(req, res) {
        const isLoggedIn = !!req.session.userId;
        const errors = req.session.errors || {};
        const error = req.session.error || null;
        const success = req.session.success || null;
        const formData = req.session.formData || {};

        delete req.session.errors;
        delete req.session.error;
        delete req.session.success;
        delete req.session.formData;

        res.render('login', { error, errors, success, isLoggedIn, formData });
    }

    static async login(req, res) {
        const { email, password } = req.body;

        const result = await User.validateLogin(email, password);

        if (result.success) {
            req.session.userId = result.user.id;
            req.session.role = result.user.role;
            res.redirect('/');
        } else {
            const errors = {};

            if (result.error) {
                errors[result.error.type] = result.error.message;
            }

            req.session.errors = errors;
            req.session.formData = { email };
            res.redirect('/login');
        }
    }

    static async registerPage(req, res) {
        const isLoggedIn = !!req.session.userId;
        const error = req.session.error || req.query.error || null;
        const errors = req.session.errors || {};
        const formData = req.session.formData || {};

        delete req.session.errors;
        delete req.session.error;
        delete req.session.formData;

        res.render('register', { error, errors, isLoggedIn, formData });
    }

    static async register(req, res) {
        try {
            const { username, email, password, role, fullName, phone } = req.body;
            const errors = {};

            // Validasi manual: cek apakah email sudah terdaftar
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                errors.email = 'Email ini sudah terdaftar.';
            }

            // Validasi instance User
            try {
                const userInstance = User.build({ username, email, password, role, isVerified: false });
                await userInstance.validate();
            } catch (userError) {
                if (userError.name === 'SequelizeValidationError') {
                    userError.errors.forEach(err => {
                        const fieldName = err.path.toLowerCase();
                        errors[fieldName] = err.message;
                    });
                } else {
                    throw userError;
                }
            }

            // Validasi instance UserProfile
            try {
                const userProfileInstance = UserProfile.build({ userId: 0, fullName, phone });
                await userProfileInstance.validate();
            } catch (profileError) {
                if (profileError.name === 'SequelizeValidationError') {
                    profileError.errors.forEach(err => {
                        const fieldName = err.path.toLowerCase();
                        errors[fieldName] = err.message;
                    });
                } else {
                    throw profileError;
                }
            }

            // Jika ada error (termasuk email sudah terdaftar), hentikan proses dan redirect
            if (Object.keys(errors).length > 0) {
                req.session.errors = errors;
                req.session.formData = req.body;
                return res.redirect('/register');
            }

            // Hanya simpan user baru jika tidak ada error
            const user = await sequelize.transaction(async (t) => {
                const newUser = await User.create(
                    { username, email, password, role, isVerified: false },
                    { transaction: t }
                );
                await UserProfile.create(
                    { userId: newUser.id, fullName, phone },
                    { transaction: t }
                );
                return newUser;
            });

            // Login user
            req.session.userId = user.id;
            req.session.role = user.role;

            res.redirect('/');
        } catch (error) {
            req.session.error = error.message;
            req.session.formData = req.body;
            res.redirect('/register');
        }
    }

    static async logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
    }

    static async courseDetail(req, res) {
        try {
            const { id } = req.params;
            const course = await Course.findByPk(id, {
                include: [
                    { model: Category, through: { attributes: [] } },
                    { model: Lesson }
                ]
            });
            const lessonCount = await course.getLessonCount();
            const isLoggedIn = !!req.session.userId;
            res.render('courseDetail', { course, formatDate, isLoggedIn, lessonCount });
        } catch (error) {
            res.send(error.message);
        }
    }

    static async paymentPage(req, res) {
        try {
            const { courseId } = req.query;
            const userId = req.session.userId;

            // Ambil detail course beserta kategori dan lesson
            const course = await Course.findByPk(courseId, {
                include: [
                    { model: Category, through: { attributes: [] } },
                    { model: Lesson }
                ]
            });
            if (!course) throw new Error("Course tidak ditemukan");

            // Buat PaymentIntent di Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: 1000, // $10.00
                currency: 'usd',
                payment_method_types: ['card'],
                metadata: { userId, courseId }
            });

            // Persiapkan data untuk view pembayaran
            const paymentData = {
                clientSecret: paymentIntent.client_secret,
                courseId,
                userId,
                paymentId: paymentIntent.id
            };

            const lessonCount = await course.getLessonCount();
            const isLoggedIn = !!req.session.userId;

            // Kirim data ke view "paymentPage.ejs"
            res.render('payment', {
                STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
                paymentData,
                course,
                lessonCount,
                isLoggedIn,
                formatDate
            });
        } catch (error) {
            console.error("Error in payment page:", error);
            res.status(500).send(`<p style="color:red;">Error: ${error.message}</p>`);
        }
    }

    static async enrollPopup(req, res) {
        try {
            const { courseId } = req.query;
            const userId = req.session.userId;

            const user = await User.findByPk(userId);
            const course = await Course.findByPk(courseId, {
                include: [{ model: Category, through: { attributes: [] } }, { model: Lesson }]
            });

            // Buat PaymentIntent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: 1000,
                currency: 'usd',
                payment_method_types: ['card'],
                metadata: { userId, courseId }
            });

            // Kirim data
            const paymentData = {
                clientSecret: paymentIntent.client_secret,
                courseId,
                userId,
                paymentId: paymentIntent.id
            };

            const lessonCount = await course.getLessonCount();
            const isLoggedIn = !!req.session.userId;

            // **STRIPE_PUBLIC_KEY** WAJIB dikirim
            res.render('invoicePopupPartial', {
                STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
                paymentData,
                course,
                lessonCount,
                isLoggedIn,
                formatDate
            });
        } catch (error) {
            console.error('Error in enrollPopup:', error);
            res.status(500).send(`<p style="color:red">Terjadi error: ${error.message}</p>`);
        }
    }

    static async enrollCourse(req, res) {
        try {
            const userId = req.session.userId;
            if (!userId) {
                return res.redirect('/login?error=Please login to enroll in a course');
            }

            const { courseId } = req.body;

            // Validasi userId
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Validasi courseId
            const course = await Course.findByPk(courseId);
            if (!course) {
                throw new Error('Course not found');
            }

            // Buat PaymentIntent di Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: 1000, // $10.00
                currency: 'usd',
                payment_method_types: ['card'],
                metadata: { userId, courseId }
            });

            // Data untuk frontend
            const paymentData = {
                clientSecret: paymentIntent.client_secret,
                courseId,
                userId,
                date: new Date().toISOString().split('T')[0],
                number: `INV-${Date.now()}`,
                description: "Course Enrollment",
                price: 10,
                isLoggedIn: !!req.session.userId,
                paymentId: paymentIntent.id
            };

            // Render template dengan data pembayaran
            res.render('invoiceTemplate', { paymentData });
        } catch (error) {
            console.log('Enroll course error:', error.message);
            res.render('error', { error: error.message });
        }
    }

    static async completeEnrollment(req, res) {
        try {
            const { courseId, userId, stripePaymentId } = req.body;

            if (!courseId || !userId || !stripePaymentId) {
                throw new Error('Missing required fields: courseId, userId, and stripePaymentId are required');
            }

            console.log("Memulai completeEnrollment untuk stripePaymentId:", stripePaymentId);

            // Cari user beserta profilnya
            const user = await User.findByPk(userId, {
                include: [{ model: UserProfile }]
            });
            if (!user) throw new Error(`User with ID ${userId} not found`);

            // Cari course beserta kategori dan pelajaran
            const course = await Course.findByPk(courseId, {
                include: [
                    { model: Category, through: { attributes: [] } },
                    { model: Lesson }
                ]
            });
            if (!course) throw new Error(`Course with ID ${courseId} not found`);

            // Simpan data enrollment pada tabel UserCourse
            await UserCourse.create({
                userId,
                courseId,
                stripePaymentId,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Dapatkan jumlah pelajaran untuk invoice
            const lessonCount = await course.getLessonCount();

            // Pastikan folder invoices berada di level project root
            const invoiceDir = path.join(__dirname, '../invoices');
            console.log("Membuat folder invoices di:", invoiceDir);
            await fsPromises.mkdir(invoiceDir, { recursive: true });

            // Tentukan path untuk invoice yang akan disimpan
            const invoicePath = path.join(invoiceDir, `invoice-${stripePaymentId}-custom.pdf`);
            console.log("Menyimpan invoice di:", invoicePath);

            // Gunakan PDFKit untuk membuat invoice
            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument();
            const stream = fs.createWriteStream(invoicePath); // Gunakan fs.createWriteStream

            doc.pipe(stream);

            // Tambahkan konten ke PDF
            doc.fontSize(20).text('Invoice', { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`Course: ${course.name}`);
            doc.text(`Description: ${course.description || 'Tidak tersedia'}`);
            doc.text(`Categories: ${course.Categories.map(cat => cat.name).join(', ') || 'Tidak tersedia'}`);
            doc.text(`Lesson Count: ${lessonCount}`);
            doc.text(`Duration: ${course.duration || 'Tidak tersedia'}`);
            doc.text(`Course ID: ${courseId}`);
            doc.text(`User ID: ${userId}`);
            doc.text(`Payment ID: ${stripePaymentId}`);
            doc.moveDown();
            doc.text('Price: $10.00');
            doc.text('Tax: 21%');
            doc.text('Total: $12.10');
            doc.moveDown();
            doc.text('Kindly pay your invoice within 15 days.', { align: 'center' });

            doc.end();

            // Tunggu hingga file selesai ditulis
            await new Promise((resolve, reject) => {
                stream.on('finish', resolve);
                stream.on('error', reject);
            });

            console.log("File invoice berhasil disimpan di:", invoicePath);

            res.json({
                success: true,
                invoicePath: `/invoices/invoice-${stripePaymentId}-custom.pdf`
            });
        } catch (error) {
            console.error('Complete enrollment error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async invoiceView(req, res) {
        try {
            const { paymentId } = req.params;
            const { download } = req.query; // Ambil parameter download dari query
            const invoicePath = path.join(__dirname, '../invoices', `invoice-${paymentId}-custom.pdf`);

            // Pastikan file invoice ada menggunakan fsPromises.access
            try {
                await fsPromises.access(invoicePath, fsPromises.constants.F_OK);
            } catch (err) {
                throw new Error(`File invoice tidak ditemukan di path: ${invoicePath}`);
            }

            // Ambil data enrollment untuk mendapatkan courseId
            const enrollment = await UserCourse.findOne({
                where: { stripePaymentId: paymentId }
            });
            if (!enrollment) throw new Error('Enrollment tidak ditemukan untuk paymentId ini');

            // Ambil data course beserta kategori dan lesson
            const course = await Course.findByPk(enrollment.courseId, {
                include: [
                    { model: Category, through: { attributes: [] } },
                    { model: Lesson }
                ]
            });
            if (!course) throw new Error('Course tidak ditemukan');

            const lessonCount = await course.getLessonCount();
            const isLoggedIn = !!req.session.userId;

            // Jika ada parameter download=true, kirim file untuk di-download
            if (download === 'true') {
                res.download(invoicePath, `invoice-${paymentId}.pdf`, (err) => {
                    if (err) {
                        console.error('Error saat mengirim file untuk download:', err);
                        res.status(500).send(`<p style="color:red;">Gagal mengunduh invoice: ${err.message}</p>`);
                    }
                });
            }

            // Selalu tampilkan preview di invoiceView.ejs, bahkan saat download=true
            res.render('invoiceView', {
                invoicePath: `/invoices/invoice-${paymentId}-custom.pdf`,
                paymentId,
                isLoggedIn,
                course,
                lessonCount,
                formatDate
            });

        } catch (error) {
            console.error('Invoice view error:', error);
            res.status(404).send(`<p style="color:red;">Invoice tidak ditemukan: ${error.message}</p>`);
        }
    }

    static async getEasyInvoiceKey(req, res) {
        try {
            if (!req.session.userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const apiKey = process.env.EASYINVOICE_API_KEY;
            if (!apiKey) {
                return res.status(500).json({ error: 'EasyInvoice API key not configured' });
            }

            res.json({ apiKey });
        } catch (error) {
            console.log('Get EasyInvoice key error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getInvoice(req, res) {
        try {
            const { paymentId } = req.params;
            const invoicePath = path.join(__dirname, '../invoices', `invoice-${paymentId}-custom.pdf`);

            // Periksa apakah file ada
            await fsPromises.access(invoicePath);

            // Kirim file ke klien
            res.sendFile(invoicePath);
        } catch (error) {
            console.error('Get invoice error:', error.message);
            res.status(404).json({ error: 'Invoice not found' });
        }
    }

    static async editProfilePage(req, res) {
        try {
            const userId = req.session.userId;
            const user = await User.findByPk(userId);
            const profile = await UserProfile.findOne({ where: { userId } });
            const isLoggedIn = !!req.session.userId;

            const error = req.session.error || null;
            const errors = req.session.errors || {};

            delete req.session.error;
            delete req.session.errors;

            res.render('editProfile', { user, profile, isLoggedIn, error, errors });
        } catch (error) {
            res.send(error.message);
        }
    }

    static async editProfile(req, res) {
        try {
            const userId = req.session.userId;
            const { username, email, fullName, phone } = req.body;

            await User.update({ username, email }, { where: { id: userId } });
            await UserProfile.update({ fullName, phone }, { where: { userId } });

            res.redirect('/');
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errors = {};
                error.errors.forEach(err => {
                    errors[err.path] = err.message;
                });
                req.session.errors = errors;
                res.redirect('/edit-profile');
            } else {
                req.session.error = error.message;
                res.redirect('/edit-profile');
            }
        }
    }

    static async deleteUser(req, res) {
        try {
            const userId = req.session.userId;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.redirect('/login');
            }

            const userName = user.username;
            await user.destroy();

            const successMessage = `User ${userName} deleted successfully.`;

            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.redirect('/login');
                }
                res.render('login', {
                    error: null,
                    errors: {},
                    success: successMessage,
                    isLoggedIn: false,
                    formData: {}
                });
            });
        } catch (error) {
            req.session.destroy(() => {
                res.render('login', {
                    error: error.message,
                    errors: {},
                    success: null,
                    isLoggedIn: false,
                    formData: {}
                });
            });
        }
    }
}

module.exports = Controller;