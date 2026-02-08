const express = require('express');
const productService = require('../Services/product.service');

const router = express.Router();

// Create Product
router.post('/', async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get All Products
router.get('/', async (req, res) => {
    try {
        const products = await productService.getAllProducts(req.query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Update Product
router.put('/:id', async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Product
router.delete('/:id', async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
