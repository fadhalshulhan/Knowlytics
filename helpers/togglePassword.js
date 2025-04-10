// togglePassword.js
const initializePasswordToggle = () => {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach((button) => {
        const passwordInput = button.closest('.relative').querySelector('input');
        const icon = button.querySelector('.material-symbols-outlined');

        if (passwordInput && icon) { // Pastikan elemen ada
            button.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                icon.textContent = type === 'password' ? 'visibility_off' : 'visibility';
            });
        }
    });
};

document.addEventListener('DOMContentLoaded', initializePasswordToggle);