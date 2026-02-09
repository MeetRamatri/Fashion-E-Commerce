const express = require('express');
const addressService = require('../Services/address.service');

const router = express.Router();

// Add Address
router.post('/', async (req, res) => {
    try {
        const address = await addressService.addAddress(req.body);
        res.status(201).json(address);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Address by ID
router.get('/:id', async (req, res) => {
    try {
        const address = await addressService.getAddressById(req.params.id);
        res.json(address);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get Addresses by User
router.get('/user/:userId', async (req, res) => {
    try {
        const addresses = await addressService.getAddressesByUser(req.params.userId);
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Address
router.put('/:id', async (req, res) => {
    try {
        const address = await addressService.updateAddress(req.params.id, req.body);
        res.json(address);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Address
router.delete('/:id', async (req, res) => {
    try {
        await addressService.deleteAddress(req.params.id);
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
