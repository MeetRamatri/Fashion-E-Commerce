const Feedback = require('../models/Feedback');

const createFeedback = async (feedbackData) => {
    const feedback = new Feedback(feedbackData);
    return await feedback.save();
};

const getAllFeedbacks = async () => {
    return await Feedback.find().sort({ createdAt: -1 });
};

module.exports = {
    createFeedback,
    getAllFeedbacks
};
