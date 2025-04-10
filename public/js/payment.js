// Ambil data dari data attribute
const paymentDataElement = document.getElementById('payment-data');
if (!paymentDataElement) {
    console.error("Error: Elemen #payment-data tidak ditemukan di DOM.");
    document.getElementById('payment-message').textContent = 'Gagal memuat data pembayaran. Silakan refresh halaman.';
    throw new Error("Elemen #payment-data tidak ditemukan");
}

const paymentData = JSON.parse(paymentDataElement.dataset.payment);
const stripePublicKey = paymentDataElement.dataset.stripeKey;

console.log("Stripe Key:", stripePublicKey);
console.log("paymentData:", paymentData);

// Validasi data yang diperlukan
if (!paymentData.clientSecret || !paymentData.courseId || !paymentData.userId) {
    console.error("Error: Data pembayaran tidak lengkap:", paymentData);
    document.getElementById('payment-message').textContent = 'Data pembayaran tidak lengkap. Silakan hubungi dukungan.';
    throw new Error("Data pembayaran tidak lengkap");
}

// Inisialisasi Stripe menggunakan public key
const stripe = Stripe(stripePublicKey);
const elements = stripe.elements();
const cardElement = elements.create('card', {
    style: {
        base: {
            fontSize: '16px',
            color: '#32325d',
            '::placeholder': { color: '#a0aec0' }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    },
    hidePostalCode: true // Sembunyikan field kode pos
});
cardElement.mount('#card-element');

// Tambahkan event listener untuk tombol autofill
const autofillLink = document.getElementById('autofill-link');
if (autofillLink) {
    autofillLink.addEventListener('click', () => {
        cardElement.update({
            value: {
                cardNumber: '4242424242424242',
                cardExpiry: '12/25',
                cardCvc: '123'
            }
        });
    });
}

// Tambahkan event listener untuk tombol submit
const submitButton = document.getElementById('submit');
if (!submitButton) {
    console.error("Error: Tombol #submit tidak ditemukan di DOM.");
    document.getElementById('payment-message').textContent = 'Gagal memuat tombol pembayaran. Silakan refresh halaman.';
    throw new Error("Tombol #submit tidak ditemukan");
}

const messageElement = document.getElementById('payment-message');
const successMessage = document.getElementById('success-message');

// Pastikan success message disembunyikan pada awalnya
successMessage.style.display = 'none';

// Fungsi untuk fetch dengan retry
const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (err) {
            if (i === retries - 1) throw err; // Jika sudah mencapai batas retry, lempar error
            console.log(`Fetch gagal, mencoba lagi dalam ${delay}ms... (${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

submitButton.addEventListener('click', async (e) => {
    e.preventDefault();

    // Reset state
    messageElement.textContent = '';
    successMessage.style.display = 'none';

    // Nonaktifkan tombol dan tampilkan pesan memproses
    submitButton.disabled = true;
    submitButton.textContent = 'Memproses...';
    messageElement.textContent = 'Memproses pembayaran...';
    console.log("Mulai proses pembayaran...");

    try {
        // Konfirmasi pembayaran dengan Stripe
        console.log("Mengirimkan pembayaran ke Stripe...");
        const { error, paymentIntent } = await stripe.confirmCardPayment(paymentData.clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: 'User',
                    address: {
                        postal_code: '12345' // Kode pos default
                    }
                }
            }
        });

        if (error) {
            console.log("Error dari Stripe:", error.message);
            messageElement.textContent = error.message || 'Gagal memproses pembayaran. Silakan coba lagi.';
            submitButton.disabled = false;
            submitButton.textContent = 'Bayar Sekarang';
            return;
        }

        console.log("Pembayaran Stripe berhasil, paymentIntent:", paymentIntent);

        // Periksa status paymentIntent
        if (paymentIntent.status !== 'succeeded') {
            console.log("PaymentIntent tidak berhasil:", paymentIntent.status);
            throw new Error("Pembayaran tidak berhasil. Silakan coba lagi.");
        }

        // Kirim data ke server untuk menyimpan enrollment dan membuat invoice
        console.log("Mengirimkan data enrollment ke server...");
        const response = await fetchWithRetry('/complete-enrollment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                courseId: paymentData.courseId,
                userId: paymentData.userId,
                stripePaymentId: paymentIntent.id
            })
        }, 3, 2000); // Retry 3 kali dengan jeda 2 detik

        console.log("Invoice Response:", response);
        const result = await response.json();
        if (!response.ok) {
            console.log("Error dari server:", result.error);
            throw new Error(result.error || 'Gagal menyimpan data pendaftaran');
        }

        console.log("Enrollment berhasil disimpan:", result);

        // Sembunyikan pesan di bawah form
        messageElement.textContent = '';

        // Tampilkan notifikasi sukses di atas container
        console.log("Menampilkan notifikasi sukses...");
        successMessage.style.display = 'flex';

        // Redirect ke halaman preview invoice dengan parameter download=true
        console.log("Menunggu sebelum redirect ke halaman preview invoice...");
        setTimeout(() => {
            console.log("Redirect ke halaman invoice dengan auto-download...");
            window.location.href = `/invoice-view/${paymentIntent.id}?download=true`;
        }, 1000);

    } catch (err) {
        console.error("Error during payment processing:", err.message);
        messageElement.textContent = err.message || 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.';
        submitButton.disabled = false;
        submitButton.textContent = 'Bayar Sekarang';
    }
});