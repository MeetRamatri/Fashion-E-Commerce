const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    items: [cartItemSchema]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
