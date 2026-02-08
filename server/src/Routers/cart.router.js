const express = require('express');
const cartService = require('../Services/cart.service');

const router = express.Router();

// Get Cart
router.get('/:userId', async (req, res) => {
    try {
        const cart = await cartService.getCart(req.params.userId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add to Cart
router.post('/:userId/add', async (req, res) => {
    try {
        const cart = await cartService.addToCart(req.params.userId, req.body);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Item Quantity
router.put('/:userId/update', async (req, res) => {
    try {
        const { variantId, quantity } = req.body;
        const cart = await cartService.updateItemQuantity(req.params.userId, variantId, quantity);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove Item
router.delete('/:userId/remove/:variantId', async (req, res) => {
    try {
        const cart = await cartService.removeItem(req.params.userId, req.params.variantId);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Clear Cart
router.delete('/:userId/clear', async (req, res) => {
    try {
        const cart = await cartService.clearCart(req.params.userId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
