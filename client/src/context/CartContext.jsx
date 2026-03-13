import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

// Generate or retrieve a persistent guest user ID
const getGuestUserId = () => {
  let id = localStorage.getItem('guestUserId');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2) + Date.now();
    localStorage.setItem('guestUserId', id);
  }
  return id;
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], loading: true });
  const userId = getGuestUserId();

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(`/api/cart/${userId}`);
      const data = await res.json();
      dispatch({ type: 'SET_CART', payload: data.items || [] });
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    const productId = product.id || product._id;
    try {
      const res = await fetch(`/api/cart/${userId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity })
      });
      const data = await res.json();
      dispatch({ type: 'SET_CART', payload: data.items || [] });
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const updateQty = async (productId, quantity) => {
    try {
      const res = await fetch(`/api/cart/${userId}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity })
      });
      const data = await res.json();
      dispatch({ type: 'SET_CART', payload: data.items || [] });
    } catch (err) {
      console.error('Failed to update qty:', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`/api/cart/${userId}/remove/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      dispatch({ type: 'SET_CART', payload: data.items || [] });
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch(`/api/cart/${userId}/clear`, { method: 'DELETE' });
      const data = await res.json();
      dispatch({ type: 'SET_CART', payload: data.items || [] });
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = state.items.reduce((sum, item) => {
    const price = item.product?.discount_price || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        cartCount,
        cartTotal,
        loading: state.loading,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

export default CartContext;
