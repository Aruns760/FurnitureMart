const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware - Fix CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

// In-memory databases
const userDB = new Map();
const otpStorage = new Map();

// Utility functions
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const isValidPhone = (phone) => {
    return /^\d{10}$/.test(phone);
};

// Debug function to log current state
const debugState = () => {
    console.log('\n=== DEBUG STATE ===');
    console.log('OTP Storage:', Array.from(otpStorage.entries()).map(([phone, data]) => ({
        phone,
        otp: data.otp,
        createdAt: new Date(data.createdAt).toLocaleTimeString()
    })));
    console.log('Users:', Array.from(userDB.keys()));
    console.log('==================\n');
};

// API Routes

// Send OTP
app.post('/send-otp', (req, res) => {
    console.log('📱 Received OTP request:', req.body);
    const { phone, name } = req.body;
    
    if (!phone || !isValidPhone(phone)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please enter a valid 10-digit phone number' 
        });
    }

    // Check if user already exists
    if (userDB.has(phone)) {
        return res.status(400).json({ 
            success: false, 
            message: 'User already exists. Please login instead.' 
        });
    }

    // Generate and store OTP
    const otp = generateOTP();
    const otpData = {
        otp: otp,
        phone: phone,
        name: name,
        createdAt: Date.now(),
        attempts: 0
    };
    
    otpStorage.set(phone, otpData);
    
    console.log(`✅ OTP for ${phone}: ${otp}`);
    debugState();
    
    res.json({ 
        success: true, 
        message: 'OTP sent successfully',
        testOtp: otp 
    });
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
    console.log('🔐 Received OTP verification:', req.body);
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
        return res.status(400).json({ 
            success: false, 
            message: 'Phone and OTP are required' 
        });
    }

    const otpData = otpStorage.get(phone);
    
    if (!otpData) {
        console.log(`❌ OTP not found for: ${phone}`);
        return res.status(400).json({ 
            success: false, 
            message: 'OTP not found. Please request a new OTP.' 
        });
    }

    // Check OTP expiration (2 minutes)
    const currentTime = Date.now();
    const otpAge = currentTime - otpData.createdAt;
    const isExpired = otpAge > 2 * 60 * 1000;
    
    if (isExpired) {
        console.log(`❌ OTP expired for: ${phone}, age: ${otpAge}ms`);
        otpStorage.delete(phone);
        debugState();
        return res.status(400).json({ 
            success: false, 
            message: 'OTP has expired. Please request a new one.' 
        });
    }

    // Check OTP attempts
    if (otpData.attempts >= 3) {
        console.log(`❌ Too many attempts for: ${phone}`);
        otpStorage.delete(phone);
        debugState();
        return res.status(400).json({ 
            success: false, 
            message: 'Too many failed attempts. Please request a new OTP.' 
        });
    }

    console.log(`🔍 Comparing OTP: Input=${otp}, Stored=${otpData.otp}`);
    
    // Verify OTP
    if (otpData.otp !== otp) {
        otpData.attempts += 1;
        console.log(`❌ Invalid OTP for: ${phone}, attempt: ${otpData.attempts}`);
        debugState();
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid OTP' 
        });
    }

    // OTP verified successfully - mark as verified
    otpData.verified = true;
    console.log(`✅ OTP verified successfully for: ${phone}`);
    debugState();
    
    res.json({ 
        success: true, 
        message: 'OTP verified successfully!',
        name: otpData.name
    });
});

// Complete Registration with Password
app.post('/complete-registration', async (req, res) => {
    console.log('✅ Received complete registration:', req.body);
    const { phone, password, name } = req.body;
    
    if (!phone || !password || !name) {
        return res.status(400).json({ 
            success: false, 
            message: 'Phone, password, and name are required' 
        });
    }

    const otpData = otpStorage.get(phone);
    
    // Check if OTP was verified
    if (!otpData || !otpData.verified) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please verify OTP first' 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        userDB.set(phone, {
            phone,
            name: name,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            profileName: name
        });
        
        // Clean up OTP
        otpStorage.delete(phone);
        
        console.log(`🎉 User registered successfully: ${phone} - ${name}`);
        debugState();
        
        res.json({ 
            success: true, 
            message: 'Registration successful! You can now login.',
            user: {
                phone: phone,
                name: name,
                profileName: name
            }
        });
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Registration failed. Please try again.' 
        });
    }
});

// Login
app.post('/login', async (req, res) => {
    console.log('👤 Received login request:', req.body);
    const { phone, password } = req.body;
    
    if (!phone || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Phone number and password are required' 
        });
    }

    const user = userDB.get(phone);
    
    if (!user) {
        return res.status(400).json({ 
            success: false, 
            message: 'User not found. Please register first.' 
        });
    }

    try {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid password' 
            });
        }
        
        console.log(`✅ Login successful for: ${phone} - ${user.name}`);
        res.json({ 
            success: true, 
            message: 'Login successful!',
            user: {
                phone: user.phone,
                name: user.name,
                profileName: user.profileName
            }
        });
        
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Login failed. Please try again.' 
        });
    }
});

// Forgot Password - Send OTP
app.post('/forgot-password/send-otp', (req, res) => {
    console.log('📱 Received forgot password OTP request:', req.body);
    const { phone } = req.body;
    
    if (!phone || !isValidPhone(phone)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please enter a valid 10-digit phone number' 
        });
    }

    // Check if user exists
    const user = userDB.get(phone);
    if (!user) {
        return res.status(400).json({ 
            success: false, 
            message: 'No account found with this phone number' 
        });
    }

    // Generate and store OTP for password reset
    const otp = generateOTP();
    const otpData = {
        otp: otp,
        phone: phone,
        purpose: 'password_reset',
        createdAt: Date.now(),
        attempts: 0
    };
    
    otpStorage.set(`reset_${phone}`, otpData);
    
    console.log(`✅ Forgot Password OTP for ${phone}: ${otp}`);
    debugState();
    
    res.json({ 
        success: true, 
        message: 'OTP sent successfully for password reset',
        testOtp: otp 
    });
});

// Forgot Password - Verify OTP
app.post('/forgot-password/verify-otp', (req, res) => {
    console.log('🔐 Received forgot password OTP verification:', req.body);
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
        return res.status(400).json({ 
            success: false, 
            message: 'Phone and OTP are required' 
        });
    }

    const otpData = otpStorage.get(`reset_${phone}`);
    
    if (!otpData) {
        console.log(`❌ Forgot password OTP not found for: ${phone}`);
        return res.status(400).json({ 
            success: false, 
            message: 'OTP not found. Please request a new OTP.' 
        });
    }

    // Check OTP expiration (2 minutes)
    const currentTime = Date.now();
    const otpAge = currentTime - otpData.createdAt;
    const isExpired = otpAge > 2 * 60 * 1000;
    
    if (isExpired) {
        console.log(`❌ Forgot password OTP expired for: ${phone}`);
        otpStorage.delete(`reset_${phone}`);
        debugState();
        return res.status(400).json({ 
            success: false, 
            message: 'OTP has expired. Please request a new one.' 
        });
    }

    // Check OTP attempts
    if (otpData.attempts >= 3) {
        console.log(`❌ Too many forgot password attempts for: ${phone}`);
        otpStorage.delete(`reset_${phone}`);
        debugState();
        return res.status(400).json({ 
            success: false, 
            message: 'Too many failed attempts. Please request a new OTP.' 
        });
    }

    console.log(`🔍 Comparing forgot password OTP: Input=${otp}, Stored=${otpData.otp}`);
    
    // Verify OTP
    if (otpData.otp !== otp) {
        otpData.attempts += 1;
        console.log(`❌ Invalid forgot password OTP for: ${phone}, attempt: ${otpData.attempts}`);
        debugState();
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid OTP' 
        });
    }

    // OTP verified successfully - mark as verified
    otpData.verified = true;
    console.log(`✅ Forgot password OTP verified for: ${phone}`);
    debugState();
    
    res.json({ 
        success: true, 
        message: 'OTP verified successfully! You can now reset your password.' 
    });
});

// Forgot Password - Reset Password
app.post('/forgot-password/reset', async (req, res) => {
    console.log('🔄 Received password reset request:', req.body);
    const { phone, password } = req.body;
    
    if (!phone || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Phone and password are required' 
        });
    }

    const otpData = otpStorage.get(`reset_${phone}`);
    
    // Check if OTP was verified
    if (!otpData || !otpData.verified) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please verify OTP first' 
        });
    }

    // Check if user exists
    const user = userDB.get(phone);
    if (!user) {
        return res.status(400).json({ 
            success: false, 
            message: 'User not found' 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Update user's password
        user.password = hashedPassword;
        user.updatedAt = new Date().toISOString();
        
        // Clean up OTP
        otpStorage.delete(`reset_${phone}`);
        
        console.log(`✅ Password reset successfully for: ${phone}`);
        debugState();
        
        res.json({ 
            success: true, 
            message: 'Password reset successfully! You can now login with your new password.' 
        });
        
    } catch (error) {
        console.error('❌ Password reset error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Password reset failed. Please try again.' 
        });
    }
});

// Forgot Password - Resend OTP
app.post('/forgot-password/resend-otp', (req, res) => {
    console.log('🔄 Received forgot password resend OTP request:', req.body);
    const { phone } = req.body;
    
    if (!phone || !isValidPhone(phone)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please enter a valid 10-digit phone number' 
        });
    }

    // Check if user exists
    const user = userDB.get(phone);
    if (!user) {
        return res.status(400).json({ 
            success: false, 
            message: 'No account found with this phone number' 
        });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpData = {
        otp,
        phone,
        purpose: 'password_reset',
        createdAt: Date.now(),
        attempts: 0,
        verified: false
    };
    
    otpStorage.set(`reset_${phone}`, otpData);
    
    console.log(`✅ New forgot password OTP for ${phone}: ${otp}`);
    debugState();
    
    res.json({ 
        success: true, 
        message: 'New OTP sent successfully',
        testOtp: otp 
    });
});

// Resend OTP
app.post('/resend-otp', (req, res) => {
    console.log('🔄 Received resend OTP request:', req.body);
    const { phone, name } = req.body;
    
    if (!phone || !isValidPhone(phone)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please enter a valid 10-digit phone number' 
        });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpData = {
        otp,
        phone,
        name: name,
        createdAt: Date.now(),
        attempts: 0,
        verified: false
    };
    
    otpStorage.set(phone, otpData);
    
    console.log(`✅ New OTP for ${phone}: ${otp}`);
    debugState();
    
    res.json({ 
        success: true, 
        message: 'New OTP sent successfully',
        testOtp: otp 
    });
});

// Debug endpoint
app.get('/debug', (req, res) => {
    const debugInfo = {
        otpStorage: Array.from(otpStorage.entries()).map(([phone, data]) => ({
            phone,
            name: data.name,
            otp: data.otp,
            attempts: data.attempts,
            verified: data.verified || false,
            createdAt: new Date(data.createdAt).toLocaleTimeString(),
            age: Date.now() - data.createdAt
        })),
        users: Array.from(userDB.entries()).map(([phone, data]) => ({
            phone,
            name: data.name,
            profileName: data.profileName,
            createdAt: data.createdAt
        })),
        timestamp: new Date().toISOString()
    };
    
    res.json(debugInfo);
});

// Serve welcome page
app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle all other routes - serve index.html for SPA behavior
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📧 OTPs will be shown in console for testing');
    console.log('🐛 Debug endpoint: http://localhost:3001/debug');
    console.log('✅ CORS enabled for all origins');
    console.log('🏠 Home: http://localhost:3001');
    console.log('👋 Welcome: http://localhost:3001/welcome');
});