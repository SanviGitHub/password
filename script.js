document.addEventListener('DOMContentLoaded', () => {
    const lengthInput = document.getElementById('length');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const encryptCheckbox = document.getElementById('encrypt');
    const encryptionOptions = document.getElementById('encryption-options');
    const encryptionType = document.getElementById('encryption-type');
    const generateButton = document.getElementById('generate');
    const passwordInput = document.getElementById('password');
    const copyButton = document.getElementById('copy');
    const strengthMeter = document.getElementById('strength-meter');

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+{}[]|:;<>,.?/~`';

    generateButton.addEventListener('click', generatePassword);
    copyButton.addEventListener('click', copyPassword);
    encryptCheckbox.addEventListener('change', toggleEncryptionOptions);

    // Corregir el bug de las casillas
    [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (![uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].some(cb => cb.checked)) {
                checkbox.checked = true;
                alert('Debes seleccionar al menos un tipo de carácter.');
            }
        });
    });

    function toggleEncryptionOptions() {
        if (encryptCheckbox.checked) {
            encryptionOptions.classList.add('show');
            setTimeout(() => {
                encryptionOptions.style.maxHeight = encryptionOptions.scrollHeight + 'px';
            }, 10);
        } else {
            encryptionOptions.classList.remove('show');
            encryptionOptions.style.maxHeight = '0';
        }
    }

    async function generatePassword() {
        const length = parseInt(lengthInput.value);
        let charset = '';

        if (uppercaseCheckbox.checked) charset += uppercaseChars;
        if (lowercaseCheckbox.checked) charset += lowercaseChars;
        if (numbersCheckbox.checked) charset += numberChars;
        if (symbolsCheckbox.checked) charset += symbolChars;

        if (charset === '') {
            alert('Por favor, selecciona al menos un tipo de carácter.');
            return;
        }

        let password = '';
        const randomValues = new Uint32Array(length);
        crypto.getRandomValues(randomValues);
        
        for (let i = 0; i < length; i++) {
            password += charset[randomValues[i] % charset.length];
        }

        if (encryptCheckbox.checked) {
            password = await encryptPassword(password);
        }

        passwordInput.value = password;
        updateStrengthMeter(password);
        animateGenerateButton();
    }

    async function encryptPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        let encryptedPassword = '';

        switch (encryptionType.value) {
            case 'sha256':
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                encryptedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                break;
            case 'aes':
                // Implementación simplificada de AES (en la práctica, se necesitaría una clave y un IV)
                encryptedPassword = btoa(password);
                break;
            case 'rsa':
                // Implementación simplificada de RSA (en la práctica, se necesitaría un par de claves pública/privada)
                encryptedPassword = btoa(password.split('').reverse().join(''));
                break;
        }

        return encryptedPassword.slice(0, lengthInput.value);
    }

    function copyPassword() {
        passwordInput.select();
        document.execCommand('copy');
        animateCopyButton();
    }

    function updateStrengthMeter(password) {
        const strength = calculatePasswordStrength(password);
        strengthMeter.style.width = `${strength}%`;
        strengthMeter.style.backgroundColor = getStrengthColor(strength);
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 12) strength += 25;
        if (password.match(/[A-Z]/)) strength += 25;
        if (password.match(/[a-z]/)) strength += 25;
        if (password.match(/[0-9]/)) strength += 25;
        if (password.match(/[^A-Za-z0-9]/)) strength += 25;
        return Math.min(100, strength);
    }

    function getStrengthColor(strength) {
        if (strength < 30) return '#ff4d4d';
        if (strength < 60) return '#ffa64d';
        if (strength < 80) return '#ffff4d';
        return '#4dff4d';
    }

    function animateGenerateButton() {
        generateButton.classList.add('pulse');
        setTimeout(() => {
            generateButton.classList.remove('pulse');
        }, 500);
    }

    function animateCopyButton() {
        copyButton.textContent = '¡Copiado!';
        copyButton.classList.add('pulse');
        setTimeout(() => {
            copyButton.textContent = 'Copiar';
            copyButton.classList.remove('pulse');
        }, 1500);
    }

    // Inicializar efectos visuales
    initVisualEffects();
});

function initVisualEffects() {
    // Configuración de partículas
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });

    // Efecto de hover 3D en el contenedor
    const container = document.querySelector('.glass-effect');
    container.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    // Efecto de salida del hover
    container.addEventListener('mouseleave', () => {
        container.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
}

