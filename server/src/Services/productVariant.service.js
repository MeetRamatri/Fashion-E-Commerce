const ProductVariant = require('../models/ProductVariant');

const createVariant = async (data) => {
    try {
        const variant = new ProductVariant(data);
        return await variant.save();
    } catch (error) {
        throw error;
    }
};

const getVariantById = async (id) => {
    try {
        const variant = await ProductVariant.findOne({ id });
        if (!variant) {
            throw new Error('Product Variant not found');
        }
        return variant;
    } catch (error) {
        throw error;
    }
};

const getVariantsByProductId = async (productId) => {
    try {
        return await ProductVariant.find({ product_id: productId });
    } catch (error) {
        throw error;
    }
};

const updateVariant = async (id, data) => {
    try {
        const variant = await ProductVariant.findOneAndUpdate(
            { id },
            data,
            { new: true }
        );
        if (!variant) {
            throw new Error('Product Variant not found');
        }
        return variant;
    } catch (error) {
        throw error;
    }
};

const deleteVariant = async (id) => {
    try {
        const variant = await ProductVariant.findOneAndDelete({ id });
        if (!variant) {
            throw new Error('Product Variant not found');
        }
        return variant;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createVariant,
    getVariantById,
    getVariantsByProductId,
    updateVariant,
    deleteVariant
};
