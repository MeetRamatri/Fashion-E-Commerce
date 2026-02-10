const express = require('express');
const paymentService = require('../Services/payment.service');

const router = express.Router();

// Create Payment
router.post('/', async (req, res) => {
    try {
        const payment = await paymentService.createPayment(req.body);
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Payment by ID
router.get('/:id', async (req, res) => {
    try {
        const payment = await paymentService.getPaymentById(req.params.id);
        res.json(payment);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get Payment by Order ID
router.get('/order/:orderId', async (req, res) => {
    try {
        const payment = await paymentService.getPaymentByOrderId(req.params.orderId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found for this order' });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Payment Status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const payment = await paymentService.updatePaymentStatus(req.params.id, status);
        res.json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
