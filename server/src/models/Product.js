const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    brand: {
        type: String
    },
    category: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    discount_price: {
        type: Number
    },
    images: {
        type: [String],
        default: []
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
