// 📂 routes/admin-dashboard.js

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import verifyToken from '../utils/authMiddleware.js'; // JWT middleware

const router = express.Router();

// 🟩 Get live dashboard stats
router.get('/dashboard-stats', verifyToken, async (req, res) => {
    try {
        // Fetch counts from MongoDB collections
        const userCount = await Admin.countDocuments();
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();

        // Construct the stats response
        const stats = {
            users: userCount,
            products: productCount,
            orders: orderCount,
        };

        res.status(200).json(stats);
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ message: 'Error fetching dashboard stats', error: err.message });
    }
});

// 🟩 Register Admin
router.post('/register', async (req, res) => {
    const { username, email, password, phone } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return res.status(409).json({ 
                message: "Admin already registered. Please login instead."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin user
        const newAdmin = new Admin({
            username,
            email,
            password: hashedPassword,
            phone
        });

        await newAdmin.save();

        // Generate a JWT token for the new admin
        const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email }, 'your_secret_key', { expiresIn: '1h' });

        // Save the token in the response (or you can save it to DB if needed)
        res.status(201).json({ 
            message: 'Admin registered successfully', 
            token 
        });
    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 🟩 Get all users (Admins)
router.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await Admin.find().select('-password'); // Exclude passwords for security
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

export default router;
