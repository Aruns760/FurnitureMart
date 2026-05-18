// 📂 utils/authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const verifyToken = (req, res, next) => {
    console.log('🔑 verifyToken middleware triggered');

    // Log the incoming headers
    console.log('Request Headers:', req.headers);

    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
        console.log('❌ No token provided');
        return res.status(403).json({ message: 'No token provided' });
    }

    const tokenParts = authHeader.split(' ');
    console.log('Token Parts:', tokenParts);

    if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
        console.log('❌ Invalid token format');
        return res.status(403).json({ message: 'Invalid token format. Use Bearer <token>' });
    }

    const token = tokenParts[1].trim();
    console.log('Extracted Token:', token);

    if (!token) {
        console.log('❌ Empty token string');
        return res.status(403).json({ message: 'Token is empty' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('❌ JWT Verification Error:', err.message);
            return res.status(401).json({ message: 'Unauthorized or token expired' });
        }

        console.log('✅ Token successfully verified');
        console.log('Decoded Token:', decoded);

        req.userId = decoded.id;
        req.userEmail = decoded.email; // Add email if needed
        next();
    });
};

export default verifyToken;
