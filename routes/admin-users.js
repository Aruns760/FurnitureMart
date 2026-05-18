import express from 'express';
import Admin from './models/Admin.js'; // Import Admin model
import verifyToken from '../utils/authMiddleware.js'; // JWT middleware

const router = express.Router();

/**
 * 🟩 CREATE a new admin
 */
router.post('api/users', verifyToken, async (req, res) => {
    try {
        const { username, phone, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

        const newAdmin = new Admin({ username, phone, email, password });
        await newAdmin.save();

        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error });
    }
});

/**
 * 🟨 READ all admins
 */
router.get('/users', verifyToken, async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admins', error });
    }
});

/**
 * 🟧 UPDATE an admin
 */
router.put('/users/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAdmin = await Admin.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedAdmin) return res.status(404).json({ message: 'Admin not found' });

        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin', error });
    }
});

/**
 * 🟥 DELETE an admin
 */
router.delete('/users/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAdmin = await Admin.findByIdAndDelete(id);

        if (!deletedAdmin) return res.status(404).json({ message: 'Admin not found' });

        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting admin', error });
    }
});

export default router;
