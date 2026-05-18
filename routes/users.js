import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import User from './models/User.js';

const router = express.Router();

// Get all users (Protected route)
router.get('api/auth/login', verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete user
router.delete('/api/admin/:id', verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete user', error: err.message });
    }
});

export default router;
