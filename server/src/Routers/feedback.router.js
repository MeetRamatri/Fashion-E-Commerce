const express = require('express');
const feedbackService = require('../Services/feedback.service');

const router = express.Router();

// Create Feedback
router.post('/', async (req, res) => {
    try {
        const feedback = await feedbackService.createFeedback(req.body);
        res.status(201).json(feedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get All Feedbacks
router.get('/', async (req, res) => {
    try {
        const feedbacks = await feedbackService.getAllFeedbacks();
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
