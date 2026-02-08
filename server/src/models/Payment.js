const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    order_id: {
        type: String,
        required: true,
        ref: 'Order'
    },
    provider: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    transaction_reference: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
