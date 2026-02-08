const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        ref: 'User'
    },
    items: [{
        product_variant_id: {
            type: String,
            required: true,
            ref: 'ProductVariant'
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
    }]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
