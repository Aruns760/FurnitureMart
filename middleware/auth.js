// 📂 middleware/auth.js

import jwt from 'jsonwebtoken';

const secretKey = 'your_secret_key'; // Use your actual secret key

// Verify Token Middleware
export function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }

        req.adminId = decoded.id; // Set admin ID for the request
        next();
    });
}
