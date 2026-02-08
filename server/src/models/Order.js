const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: String,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['PLACED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PLACED'
    },
    total_amount: {
        type: Number,
        required: true
    },
    payment_id: {
        type: String
    },
    address_id: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
