import jwt from 'jsonwebtoken';
import Admin from './models/Admin.js'; 
import verifyToken from './auth.js';
// Register Admin
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Create new admin
        const newAdmin = new Admin({ username, email, password, phone });
        await newAdmin.save();

        // Generate JWT token
        const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email }, 'your_secret_key', { expiresIn: '1h' });

        // Return success message with token
        res.status(201).json({ 
            message: "Admin registered successfully",
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default verifyToken;