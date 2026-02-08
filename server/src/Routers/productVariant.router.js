const express = require('express');
const productVariantService = require('../Services/productVariant.service');

const router = express.Router();

// Create Variant
router.post('/', async (req, res) => {
    try {
        const variant = await productVariantService.createVariant(req.body);
        res.status(201).json(variant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Variant by ID
router.get('/:id', async (req, res) => {
    try {
        const variant = await productVariantService.getVariantById(req.params.id);
        res.json(variant);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get Variants by Product ID
router.get('/product/:productId', async (req, res) => {
    try {
        const variants = await productVariantService.getVariantsByProductId(req.params.productId);
        res.json(variants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Variant
router.put('/:id', async (req, res) => {
    try {
        const variant = await productVariantService.updateVariant(req.params.id, req.body);
        res.json(variant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Variant
router.delete('/:id', async (req, res) => {
    try {
        await productVariantService.deleteVariant(req.params.id);
        res.json({ message: 'Product Variant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
