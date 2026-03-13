const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to get cart with populated product details
const getCartWithProducts = async (userId) => {
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) return { user_id: userId, items: [] };

    // Populate product info for each item
    const populatedItems = await Promise.all(
        cart.items.map(async (item) => {
            const product = await Product.findOne({ id: item.product_id });
            return {
                product_id: item.product_id,
                quantity: item.quantity,
                product: product
                    ? {
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          discount_price: product.discount_price,
                          images: product.images,
                          brand: product.brand,
                          category: product.category
                      }
                    : null
            };
        })
    );

    return {
        _id: cart._id,
        user_id: cart.user_id,
        items: populatedItems,
        updatedAt: cart.updatedAt
    };
};

const getCart = async (userId) => {
    try {
        // Ensure cart exists
        let cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            cart = new Cart({ user_id: userId, items: [] });
            await cart.save();
        }
        return await getCartWithProducts(userId);
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

        const { product_id, quantity = 1 } = item;

        const existingIndex = cart.items.findIndex(
            (i) => i.product_id === product_id
        );

        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += quantity;
        } else {
            cart.items.push({ product_id, quantity });
        }

        await cart.save();
        return await getCartWithProducts(userId);
    } catch (error) {
        throw error;
    }
};

const updateItemQuantity = async (userId, productId, quantity) => {
    try {
        const cart = await Cart.findOne({ user_id: userId });
        if (!cart) throw new Error('Cart not found');

        const itemIndex = cart.items.findIndex((i) => i.product_id === productId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            return await getCartWithProducts(userId);
        } else {
            throw new Error('Item not found in cart');
        }
    } catch (error) {
        throw error;
    }
};

const removeItem = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({ user_id: userId });
        if (!cart) throw new Error('Cart not found');

        cart.items = cart.items.filter((i) => i.product_id !== productId);
        await cart.save();
        return await getCartWithProducts(userId);
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
        return await getCartWithProducts(userId);
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
