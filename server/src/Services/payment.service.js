const Payment = require('../models/Payment');
const crypto = require('crypto');

const createPayment = async (data) => {
    try {
        if (!data.id) {
            data.id = crypto.randomUUID();
        }
        const payment = new Payment(data);
        return await payment.save();
    } catch (error) {
        throw error;
    }
};

const getPaymentById = async (id) => {
    try {
        const payment = await Payment.findOne({ id });
        if (!payment) {
            throw new Error('Payment not found');
        }
        return payment;
    } catch (error) {
        throw error;
    }
};

const getPaymentByOrderId = async (orderId) => {
    try {
        const payment = await Payment.findOne({ order_id: orderId });
        // It's possible an order doesn't have a payment yet, so returning null might be valid, 
        // but for consistency with other services, let's return null or throw if strict.
        // Let's return the payment or null.
        return payment;
    } catch (error) {
        throw error;
    }
};

const updatePaymentStatus = async (id, status) => {
    try {
        const payment = await Payment.findOneAndUpdate(
            { id },
            { status },
            { new: true }
        );
        if (!payment) {
            throw new Error('Payment not found');
        }
        return payment;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createPayment,
    getPaymentById,
    getPaymentByOrderId,
    updatePaymentStatus
};
