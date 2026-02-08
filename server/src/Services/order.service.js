const Order = require('../models/Order');
const crypto = require('crypto');

const createOrder = async (data) => {
    try {
        if (!data.id) {
            data.id = crypto.randomUUID();
        }
        const order = new Order(data);
        return await order.save();
    } catch (error) {
        throw error;
    }
};

const getOrderById = async (id) => {
    try {
        const order = await Order.findOne({ id });
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    } catch (error) {
        throw error;
    }
};

const getOrdersByUser = async (userId) => {
    try {
        return await Order.find({ user_id: userId });
    } catch (error) {
        throw error;
    }
};

const updateOrderStatus = async (id, status) => {
    try {
        const order = await Order.findOneAndUpdate(
            { id },
            { status },
            { new: true }
        );
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getOrdersByUser,
    updateOrderStatus
};
