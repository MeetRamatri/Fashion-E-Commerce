const express = require('express');
const orderService = require('../Services/order.service');

const router = express.Router();

// Create Order
router.post('/', async (req, res) => {
    try {
        const order = await orderService.createOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get Orders by User
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await orderService.getOrdersByUser(req.params.userId);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Order Status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await orderService.updateOrderStatus(req.params.id, status);
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
