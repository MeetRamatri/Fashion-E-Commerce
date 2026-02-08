const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    product_id: {
        type: String,
        required: true,
        ref: 'Product'
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L', 'XL'],
        required: true
    },
    color: {
        type: String
    },
    stock_quantity: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);

module.exports = ProductVariant;
