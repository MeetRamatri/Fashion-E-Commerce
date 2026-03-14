const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product_id: { type: String, required: true },
    name:       { type: String },
    price:      { type: Number },
    image:      { type: String },
    quantity:   { type: Number, default: 1 }
}, { _id: false });

const addressSnapshotSchema = new mongoose.Schema({
    name:    { type: String },
    phone:   { type: String },
    pincode: { type: String },
    city:    { type: String },
    state:   { type: String }
}, { _id: false });

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
    items: [orderItemSchema],
    address: addressSnapshotSchema,
    payment_method: {
        type: String,
        default: 'CARD'
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
