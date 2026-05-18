import express from 'express';
const router = express.Router();
// Basic route for testing
router.get('/', (_req, res) => {
    res.json([
        {
            order_id: '12345',
            customer_name: 'John Doe',
            product_name: 'Chair',
            quantity: 2,
            total_price: 100,
            status: 'Pending',
            created_at: new Date(),
            updated_at: new Date()
        }
    ]);
});

export default router;
