import express from "express";
import Customer from "./models/Customer.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const FIXED_TOKEN = process.env.FIXED_ACCESS_TOKEN;

// 🟢 Register Customer (No Hashing)
router.post("/customer-register", async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) return res.status(400).json({ message: "Customer already exists" });

        const newCustomer = new Customer({ fullName, email, phone, password });
        await newCustomer.save();

        res.status(201).json({
            message: "Registration successful",
            token: FIXED_TOKEN,
            customer: { id: newCustomer._id, fullName, email }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Login Route
router.post("/customer-login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find customer by email
        const customer = await Customer.findOne({ email });

        if (!customer || customer.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({
            message: "Login successful",
            customer: { id: customer._id, name: customer.name, email: customer.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// 🟢 Get Customers (Protected)
router.get("/customer", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token || token !== FIXED_TOKEN) {
            return res.status(401).json({ message: "Invalid Token" });
        }

        const customers = await Customer.find({}, { password: 0 });
        res.status(200).json({ customers });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

export default router;
