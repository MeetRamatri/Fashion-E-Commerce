const express = require('express');
const router = express.Router();
const authService = require('../Services/auth.service');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const result = await authService.registerUser({ name, email, password, phone, role });
        res.status(201).json(result);
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const result = await authService.loginUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
