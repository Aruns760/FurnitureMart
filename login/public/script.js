class AuthSystem {
    constructor() {
        this.currentStep = 1;
        this.otpTimer = null;
        this.timeLeft = 120;
        this.currentPhone = '';
        this.currentName = '';
        this.baseURL = 'http://localhost:3001';
        
        // Forgot password state
        this.forgotStep = 1;
        this.forgotOtpTimer = null;
        this.forgotTimeLeft = 120;
        this.forgotPhone = '';
        
        this.initializeEventListeners();
        console.log('🔧 AuthSystem initialized');
    }

    initializeEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));

        // Registration forms
        document.getElementById('phoneForm').addEventListener('submit', (e) => this.handlePhoneSubmit(e));
        document.getElementById('otpForm').addEventListener('submit', (e) => this.handleOtpSubmit(e));
        document.getElementById('passwordForm').addEventListener('submit', (e) => this.handlePasswordSubmit(e));

        // OTP resend
        document.getElementById('resendOtpBtn').addEventListener('click', () => this.resendOtp());

        // Password strength checker
        document.getElementById('registerPassword').addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));

        // Forgot Password forms
        document.getElementById('forgotPhoneForm').addEventListener('submit', (e) => this.handleForgotPhoneSubmit(e));
        document.getElementById('forgotOtpForm').addEventListener('submit', (e) => this.handleForgotOtpSubmit(e));
        document.getElementById('forgotPasswordForm').addEventListener('submit', (e) => this.handleForgotPasswordSubmit(e));

        // Forgot Password OTP resend
        document.getElementById('forgotResendOtpBtn').addEventListener('click', () => this.resendForgotOtp());

        // Forgot Password strength checker
        document.getElementById('newPassword').addEventListener('input', (e) => this.checkForgotPasswordStrength(e.target.value));
        
        console.log('✅ Event listeners initialized');
    }

    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}-content`).classList.add('active');

        if (tab === 'register') {
            this.resetRegistration();
        } else if (tab === 'forgot-password') {
            this.resetForgotPassword();
        }
        
        console.log(`🔀 Switched to tab: ${tab}`);
    }

    resetRegistration() {
        this.currentStep = 1;
        this.clearOtpTimer();
        
        document.querySelectorAll('.register-step').forEach(step => step.classList.remove('active'));
        document.getElementById('step-phone').classList.add('active');
        
        document.getElementById('registerName').value = '';
        document.getElementById('registerPhone').value = '';
        document.getElementById('otpInput').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        this.clearMessages();
        console.log('🔄 Registration reset');
    }

    resetForgotPassword() {
        this.forgotStep = 1;
        this.clearForgotOtpTimer();
        
        document.querySelectorAll('.forgot-step').forEach(step => step.classList.remove('active'));
        document.getElementById('forgot-step-phone').classList.add('active');
        
        document.getElementById('forgotPhone').value = '';
        document.getElementById('forgotOtpInput').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
        
        this.clearForgotMessages();
        console.log('🔄 Forgot password reset');
    }

    async handlePhoneSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const phone = document.getElementById('registerPhone').value.trim();
        
        if (!name) {
            this.showMessage('phoneMessage', 'Please enter your name', 'error');
            return;
        }
        
        if (!this.validatePhone(phone)) {
            this.showMessage('phoneMessage', 'Please enter a valid 10-digit phone number', 'error');
            return;
        }

        this.currentPhone = phone;
        this.currentName = name;
        this.showMessage('phoneMessage', 'Sending OTP...', 'info');
        
        try {
            console.log(`📤 Sending OTP request for: ${phone} - ${name}`);
            
            const response = await fetch(`${this.baseURL}/send-otp`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone, name })
            });

            console.log('📥 Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ OTP response:', data);

            if (data.success) {
                alert(`🔐 TESTING MODE\n👤 Name: ${name}\n📱 Phone: ${phone}\n🔢 Your OTP is: ${data.testOtp}\n\nPlease enter this OTP in the next step.`);
                
                this.showMessage('phoneMessage', 'OTP sent successfully! Check the alert for OTP.', 'success');
                this.nextStep();
                this.startOtpTimer();
            } else {
                this.showMessage('phoneMessage', data.message, 'error');
            }
        } catch (error) {
            console.error('❌ Error sending OTP:', error);
            this.showMessage('phoneMessage', `Failed to send OTP: ${error.message}`, 'error');
        }
    }

    async handleOtpSubmit(e) {
        e.preventDefault();
        const otp = document.getElementById('otpInput').value.trim();

        console.log(`🔐 Verifying OTP: ${otp} for phone: ${this.currentPhone}`);

        if (!/^\d{4}$/.test(otp)) {
            this.showMessage('otpMessage', 'Please enter a valid 4-digit OTP', 'error');
            return;
        }

        this.showMessage('otpMessage', 'Verifying OTP...', 'info');

        try {
            const response = await fetch(`${this.baseURL}/verify-otp`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    phone: this.currentPhone, 
                    otp: otp
                })
            });

            console.log('📥 OTP verification response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ OTP verification response:', data);

            if (data.success) {
                this.showMessage('otpMessage', '✅ OTP verified successfully!', 'success');
                setTimeout(() => {
                    this.nextStep();
                    this.clearOtpTimer();
                }, 1000);
            } else {
                this.showMessage('otpMessage', data.message, 'error');
            }
        } catch (error) {
            console.error('❌ Error verifying OTP:', error);
            this.showMessage('otpMessage', `Failed to verify OTP: ${error.message}`, 'error');
        }
    }

    async handlePasswordSubmit(e) {
        e.preventDefault();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            this.showMessage('passwordMessage', 'Passwords do not match', 'error');
            return;
        }

        if (!this.isStrongPassword(password)) {
            this.showMessage('passwordMessage', 'Please choose a stronger password', 'error');
            return;
        }

        this.showMessage('passwordMessage', 'Completing registration...', 'info');

        try {
            const response = await fetch(`${this.baseURL}/complete-registration`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    phone: this.currentPhone, 
                    password: password,
                    name: this.currentName
                })
            });

            console.log('📥 Registration response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Registration response:', data);

            if (data.success) {
                this.showMessage('passwordMessage', '🎉 Registration successful! Redirecting...', 'success');
                
                // Store user data in localStorage for welcome page
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                
                setTimeout(() => {
                    // Use window.location.replace for proper redirect
                    window.location.replace('/welcome');
                }, 2000);
        }
         else {
                this.showMessage('passwordMessage', data.message, 'error');
            }
        } catch (error) {
            console.error('❌ Error completing registration:', error);
            this.showMessage('passwordMessage', `Registration failed: ${error.message}`, 'error');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const phone = document.getElementById('loginPhone').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!this.validatePhone(phone)) {
            this.showMessage('loginMessage', 'Please enter a valid 10-digit phone number', 'error');
            return;
        }

        this.showMessage('loginMessage', 'Logging in...', 'info');

        try {
            const response = await fetch(`${this.baseURL}/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone, password })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
           // Store user data for welcome page
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            this.showMessage('loginMessage', '✅ Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                // Use window.location.replace for proper redirect
                window.location.replace('/welcome');
            }, 1500);
        }
     else {
                this.showMessage('loginMessage', data.message, 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('loginMessage', `Login failed: ${error.message}`, 'error');
        }
    }

    async handleForgotPhoneSubmit(e) {
        e.preventDefault();
        const phone = document.getElementById('forgotPhone').value.trim();
        
        if (!this.validatePhone(phone)) {
            this.showForgotMessage('forgotPhoneMessage', 'Please enter a valid 10-digit phone number', 'error');
            return;
        }

        this.forgotPhone = phone;
        this.showForgotMessage('forgotPhoneMessage', 'Sending OTP...', 'info');
        
        try {
            console.log(`📤 Sending forgot password OTP request for: ${phone}`);
            
            const response = await fetch(`${this.baseURL}/forgot-password/send-otp`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone })
            });

            console.log('📥 Forgot password response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Forgot password OTP response:', data);

            if (data.success) {
                alert(`🔐 FORGOT PASSWORD - TESTING MODE\n📱 Phone: ${phone}\n🔢 Your OTP is: ${data.testOtp}\n\nPlease enter this OTP in the next step.`);
                
                this.showForgotMessage('forgotPhoneMessage', 'OTP sent successfully! Check the alert for OTP.', 'success');
                this.nextForgotStep();
                this.startForgotOtpTimer();
            } else {
                this.showForgotMessage('forgotPhoneMessage', data.message, 'error');
            }
        } catch (error) {
            console.error('❌ Error sending forgot password OTP:', error);
            this.showForgotMessage('forgotPhoneMessage', `Failed to send OTP: ${error.message}`, 'error');
        }
    }

    async handleForgotOtpSubmit(e) {
        e.preventDefault();
        const otp = document.getElementById('forgotOtpInput').value.trim();

        console.log(`🔐 Verifying forgot password OTP: ${otp} for phone: ${this.forgotPhone}`);

        if (!/^\d{4}$/.test(otp)) {
            this.showForgotMessage('forgotOtpMessage', 'Please enter a valid 4-digit OTP', 'error');
            return;
        }

        this.showForgotMessage('forgotOtpMessage', 'Verifying OTP...', 'info');

        try {
            const response = await fetch(`${this.baseURL}/forgot-password/verify-otp`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    phone: this.forgotPhone, 
                    otp: otp
                })
            });

            console.log('📥 Forgot password OTP verification response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Forgot password OTP verification response:', data);

            if (data.success) {
                this.showForgotMessage('forgotOtpMessage', '✅ OTP verified successfully!', 'success');
                setTimeout(() => {
                    this.nextForgotStep();
                    this.clearForgotOtpTimer();
                }, 1000);
            } else {
                this.showForgotMessage('forgotOtpMessage', data.message, 'error');
            }
        } catch (error) {
            console.error('❌ Error verifying forgot password OTP:', error);
            this.showForgotMessage('forgotOtpMessage', `Failed to verify OTP: ${error.message}`, 'error');
        }
    }

    async handleForgotPasswordSubmit(e) {
        e.preventDefault();
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;

        if (password !== confirmPassword) {
            this.showForgotMessage('forgotPasswordMessage', 'Passwords do not match', 'error');
            return;
        }

        if (!this.isStrongPassword(password)) {
            this.showForgotMessage('forgotPasswordMessage', 'Please choose a stronger password', 'error');
            return;
        }

        this.showForgotMessage('forgotPasswordMessage', 'Resetting password...', 'info');

        try {
            const response = await fetch(`${this.baseURL}/forgot-password/reset`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    phone: this.forgotPhone, 
                    password: password
                })
            });

            console.log('📥 Password reset response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Password reset response:', data);

            if (data.success) {
                this.showForgotMessage('forgotPasswordMessage', '✅ Password reset successfully! Redirecting to login...', 'success');
                
                setTimeout(() => {
                    this.switchTab('login');
                    this.resetForgotPassword();
                }, 2000);
            } else {
                this.showForgotMessage('forgotPasswordMessage', data.message, 'error');
            }
        } catch (error) {
            console.error('❌ Error resetting password:', error);
            this.showForgotMessage('forgotPasswordMessage', `Password reset failed: ${error.message}`, 'error');
        }
    }

    async resendOtp() {
        try {
            const response = await fetch(`${this.baseURL}/resend-otp`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    phone: this.currentPhone,
                    name: this.currentName 
                })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                alert(`🔐 NEW OTP\n👤 Name: ${this.currentName}\n📱 Phone: ${this.currentPhone}\n🔢 Your new OTP is: ${data.testOtp}`);
                this.showMessage('otpMessage', 'New OTP sent! Check the alert.', 'success');
                this.resetOtpTimer();
            } else {
                this.showMessage('otpMessage', data.message, 'error');
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            this.showMessage('otpMessage', `Failed to resend OTP: ${error.message}`, 'error');
        }
    }

    async resendForgotOtp() {
        try {
            const response = await fetch(`${this.baseURL}/forgot-password/resend-otp`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    phone: this.forgotPhone
                })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                alert(`🔐 FORGOT PASSWORD - NEW OTP\n📱 Phone: ${this.forgotPhone}\n🔢 Your new OTP is: ${data.testOtp}`);
                this.showForgotMessage('forgotOtpMessage', 'New OTP sent! Check the alert.', 'success');
                this.resetForgotOtpTimer();
            } else {
                this.showForgotMessage('forgotOtpMessage', data.message, 'error');
            }
        } catch (error) {
            console.error('Error resending forgot password OTP:', error);
            this.showForgotMessage('forgotOtpMessage', `Failed to resend OTP: ${error.message}`, 'error');
        }
    }

    // Step Navigation
    nextStep() {
        document.querySelectorAll('.register-step').forEach(step => step.classList.remove('active'));
        
        if (this.currentStep === 1) {
            document.getElementById('step-otp').classList.add('active');
            document.getElementById('otpPhone').textContent = this.currentPhone;
            this.currentStep = 2;
            console.log('➡️ Moved to OTP step');
        } else if (this.currentStep === 2) {
            document.getElementById('step-password').classList.add('active');
            this.currentStep = 3;
            console.log('➡️ Moved to Password step');
        }
    }

    // Forgot Password Step Navigation
    nextForgotStep() {
        document.querySelectorAll('.forgot-step').forEach(step => step.classList.remove('active'));
        
        if (this.forgotStep === 1) {
            document.getElementById('forgot-step-otp').classList.add('active');
            document.getElementById('forgotOtpPhone').textContent = this.forgotPhone;
            this.forgotStep = 2;
            console.log('➡️ Moved to Forgot Password OTP step');
        } else if (this.forgotStep === 2) {
            document.getElementById('forgot-step-password').classList.add('active');
            this.forgotStep = 3;
            console.log('➡️ Moved to Forgot Password step');
        }
    }

    // OTP Timer Functions
    startOtpTimer() {
        this.timeLeft = 120;
        this.updateTimerDisplay();
        this.otpTimer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.clearOtpTimer();
            }
        }, 1000);
    }

    resetOtpTimer() {
        this.clearOtpTimer();
        this.startOtpTimer();
    }

    clearOtpTimer() {
        if (this.otpTimer) {
            clearInterval(this.otpTimer);
            this.otpTimer = null;
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timerElement = document.getElementById('otpTimer');
        const resendBtn = document.getElementById('resendOtpBtn');

        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (this.timeLeft <= 0) {
            timerElement.textContent = 'Expired';
            timerElement.style.color = '#dc3545';
            resendBtn.disabled = false;
        } else {
            resendBtn.disabled = true;
        }
    }

    // Forgot Password Timer Functions
    startForgotOtpTimer() {
        this.forgotTimeLeft = 120;
        this.updateForgotTimerDisplay();
        this.forgotOtpTimer = setInterval(() => {
            this.forgotTimeLeft--;
            this.updateForgotTimerDisplay();
            
            if (this.forgotTimeLeft <= 0) {
                this.clearForgotOtpTimer();
            }
        }, 1000);
    }

    resetForgotOtpTimer() {
        this.clearForgotOtpTimer();
        this.startForgotOtpTimer();
    }

    clearForgotOtpTimer() {
        if (this.forgotOtpTimer) {
            clearInterval(this.forgotOtpTimer);
            this.forgotOtpTimer = null;
        }
    }

    updateForgotTimerDisplay() {
        const minutes = Math.floor(this.forgotTimeLeft / 60);
        const seconds = this.forgotTimeLeft % 60;
        const timerElement = document.getElementById('forgotOtpTimer');
        const resendBtn = document.getElementById('forgotResendOtpBtn');

        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (this.forgotTimeLeft <= 0) {
            timerElement.textContent = 'Expired';
            timerElement.style.color = '#dc3545';
            resendBtn.disabled = false;
        } else {
            resendBtn.disabled = true;
        }
    }

    // Password Strength Checker
    checkPasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        let strength = 0;

        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;

        strengthFill.style.width = `${strength}%`;
        
        if (strength <= 25) {
            strengthFill.style.background = '#dc3545';
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#dc3545';
        } else if (strength <= 75) {
            strengthFill.style.background = '#ffc107';
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#ffc107';
        } else {
            strengthFill.style.background = '#28a745';
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#28a745';
        }
    }

    // Forgot Password Strength Checker
    checkForgotPasswordStrength(password) {
        const strengthFill = document.getElementById('forgotStrengthFill');
        const strengthText = document.getElementById('forgotStrengthText');
        
        let strength = 0;

        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;

        strengthFill.style.width = `${strength}%`;
        
        if (strength <= 25) {
            strengthFill.style.background = '#dc3545';
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#dc3545';
        } else if (strength <= 75) {
            strengthFill.style.background = '#ffc107';
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#ffc107';
        } else {
            strengthFill.style.background = '#28a745';
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#28a745';
        }
    }

    isStrongPassword(password) {
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
        
        return hasMinLength && hasUpperCase && hasNumbers && hasSpecialChar;
    }

    // Utility Functions
    validatePhone(phone) {
        return /^\d{10}$/.test(phone);
    }

    showMessage(elementId, message, type) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.className = `message ${type}`;
        
        if (type === 'success') {
            setTimeout(() => {
                element.textContent = '';
                element.className = 'message';
            }, 5000);
        }
    }

    showForgotMessage(elementId, message, type) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.className = `message ${type}`;
        
        if (type === 'success') {
            setTimeout(() => {
                element.textContent = '';
                element.className = 'message';
            }, 5000);
        }
    }

    clearMessages() {
        const messageIds = ['phoneMessage', 'otpMessage', 'passwordMessage', 'loginMessage'];
        messageIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '';
                element.className = 'message';
            }
        });
    }

    clearForgotMessages() {
        const forgotMessages = ['forgotPhoneMessage', 'forgotOtpMessage', 'forgotPasswordMessage'];
        forgotMessages.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '';
                element.className = 'message';
            }
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
    console.log('🚀 Auth System Started');
});

// Global function for tab switching from HTML
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}-content`).classList.add('active');
}