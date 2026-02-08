const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');

const createProduct = async (data) => {
    try {
        const product = new Product(data);
        return await product.save();
    } catch (error) {
        throw error;
    }
};

const getAllProducts = async (query = {}) => {
    try {
        // Basic filtering can be added here based on query params
        return await Product.find(query);
    } catch (error) {
        throw error;
    }
};

const getProductById = async (id) => {
    try {
        const product = await Product.findOne({ id });
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    } catch (error) {
        throw error;
    }
};

const updateProduct = async (id, data) => {
    try {
        const product = await Product.findOneAndUpdate({ id }, data, { new: true });
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    } catch (error) {
        throw error;
    }
};

const deleteProduct = async (id) => {
    try {
        const product = await Product.findOneAndDelete({ id });
        if (!product) {
            throw new Error('Product not found');
        }
        // Optionally delete variants
        await ProductVariant.deleteMany({ product_id: id });
        return product;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
