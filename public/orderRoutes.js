const express = require('express');
const pool = require('../db');
const router = express.Router();

// 🟩 Get all customers
router.get('/users/customers', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, username, email FROM users');
        if (users.length === 0) {
            return res.status(404).json({ message: 'No customers found' });
        }
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// 🟩 Add a new order
router.post('/orders', async (req, res) => {
    const { user_id, product_id, quantity, status } = req.body;

    if (!user_id || !product_id || !quantity || !status) {
        return res.status(400).json({ message: 'All fields are required: user_id, product_id, quantity, status' });
    }

    try {
        // Check if the user exists
        const [[user]] = await pool.query('SELECT id FROM users WHERE id = ?', [user_id]);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the product exists and has enough stock
        const [[product]] = await pool.query('SELECT id, price, stock FROM products WHERE id = ?', [product_id]);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock available' });
        }

        // Calculate total price
        const total_price = product.price * quantity;

        // Use a transaction to place the order and update stock
        await pool.query('START TRANSACTION');
        await pool.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, product_id]);

        const [result] = await pool.query(
            'INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)',
            [user_id, product_id, quantity, total_price, status]
        );

        await pool.query('COMMIT');

        res.status(201).json({ message: 'Order added successfully', order_id: result.insertId });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error adding order:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
