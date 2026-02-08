const Cart = require('../models/Cart');

const getCart = async (userId) => {
    try {
        let cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            cart = new Cart({ user_id: userId, items: [] });
            await cart.save();
        }
        return cart;
    } catch (error) {
        throw error;
    }
};

const addToCart = async (userId, item) => {
    try {
        let cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            cart = new Cart({ user_id: userId, items: [] });
        }

        const { product_variant_id, quantity } = item;
        const existingItemIndex = cart.items.findIndex(
            (i) => i.product_variant_id.toString() === product_variant_id
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ product_variant_id, quantity });
        }

        await cart.save();
        return await getCart(userId);
    } catch (error) {
        throw error;
    }
};

const updateItemQuantity = async (userId, variantId, quantity) => {
    try {
        const cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            throw new Error('Cart not found');
        }

        const itemIndex = cart.items.findIndex(
            (i) => i.product_variant_id.toString() === variantId
        );

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            return await getCart(userId);
        } else {
            throw new Error('Item not found in cart');
        }
    } catch (error) {
        throw error;
    }
};

const removeItem = async (userId, variantId) => {
    try {
        const cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.items = cart.items.filter(
            (i) => i.product_variant_id.toString() !== variantId
        );

        await cart.save();
        return await getCart(userId);
    } catch (error) {
        throw error;
    }
};

const clearCart = async (userId) => {
    try {
        const cart = await Cart.findOne({ user_id: userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        return cart;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getCart,
    addToCart,
    updateItemQuantity,
    removeItem,
    clearCart
};
