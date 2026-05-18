const express = require('express');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Dashboard stats (protected)
router.get('/dashboard-stats', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to the Admin Dashboard', user: req.user });
});

module.exports = router;
