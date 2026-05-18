import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import cors from 'cors';
import adminDashboardRoutes from './routes/admin-dashboard.js';
import adminUsersRoutes from './routes/admin-users.js';
import userRoutes from './routes/users.js';
import ordersRouter from './routes/orders.js'; // 🟢 Import Orders Router
import Admin from './routes/models/Admin.js';
import Product from './routes/models/Product.js';
import Order from './routes/models/Order.js';
import verifyToken from './utils/authMiddleware.js';
import { connectDB } from './db.js';
import Customer from './routes/models/Customer.js';
import User from './routes/models/User.js'; // ✅ Correct way to import

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
connectDB();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

  
// Root Route (for testing)
app.get('/', (req, res) => {
    res.send('Welcome to FurnitureMart!');
});

// 🟢 Admin Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, phone, email, password } = req.body;
        if (!username || !phone || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ username, phone, email, password: hashedPassword });

        await newAdmin.save();
        const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({ message: 'Admin registered successfully', token });
    } catch (err) {
        console.error('Error registering admin:', err);
        res.status(500).json({ message: 'Error registering admin', error: err.message });
    }
});
// 🟢 Admin Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '30d' });
        console.log('Generated Token:', token);
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});

// 🟢 Dashboard stats route
app.get('/api/dashboard-stats', verifyToken, async (req, res) => {
    try {
        console.log('Dashboard stats requested by Admin ID:', req.userId);
        const usersCount = await Admin.countDocuments();
        const productsCount = await Product.countDocuments();
        const ordersCount = await Order.countDocuments();
        res.status(200).json({ users: usersCount, products: productsCount, orders: ordersCount });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ message: 'Error fetching dashboard stats', error: err.message });
    }
});

// 🟢 CRUD for Admin
app.delete('/api/admin/:id', verifyToken, async (req, res) => {
    try {
        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) return res.status(404).json({ message: 'Admin not found' });
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting admin', error: err.message });
    }
});

app.put('/api/admin/:id', verifyToken, async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        Object.assign(admin, req.body);
        if (req.body.password) admin.password = await bcrypt.hash(req.body.password, 10);
        await admin.save();

        res.status(200).json({ message: 'Admin updated successfully', admin });
    } catch (err) {
        res.status(500).json({ message: 'Error updating admin', error: err.message });
    }
});

// 🟢 Product CRUD Routes
app.post('/api/products', verifyToken, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json(err);
    }
});

app.get('/api/products', verifyToken, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});
app.get('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.put('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(400).json(err);
    }
});

app.delete('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});
// 🟢 Order CRUD Routes (Newly Added)

// Get all orders
app.get('/api/orders', verifyToken, async (req, res) => {
    try {
        // Fetch orders and populate product details
        const orders = await Order.find().populate('product');
        
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ 
            message: 'Error fetching orders', 
            error: err.message 
        });
    }
});



app.post('/api/orders', verifyToken, async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: 'Error creating order', error: err.message });
    }
});

app.put('/api/orders/:id', verifyToken, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: 'Error updating order', error: err.message });
    }
});

app.delete('/api/orders/:id', verifyToken, async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting order', error: err.message });
    }
});

//
app.post("/api/customer-register", async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phone, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "Registration successful" });
});

// ** LOGIN API **
app.post('/api/customer-login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await Customer.findOne({ email }); // ✅ Use the imported Customer model
  
      if (!user) return res.status(400).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

// ** FETCH USER API (Protected) **
app.get("/api/customer", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        res.json(user);
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
});

// ** LOGOUT API (Mock) **
app.post("/api/customer-logout", (req, res) => {
    res.json({ message: "Logout successful" });
});

// Admin & User Routes
app.use('/api', adminDashboardRoutes);
app.use('/api/admin', adminUsersRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', ordersRouter);
// Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
