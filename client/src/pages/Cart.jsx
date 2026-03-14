import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, cartTotal, cartCount, updateQty, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="w-28 h-28 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-14 h-14 text-indigo-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything yet. Discover our collection!</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Shop Now
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-500 mt-1">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
            </div>
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null;
                const price = product.discount_price || product.price;
                const originalPrice = product.discount_price ? product.price : null;

                return (
                  <div
                    key={item.product_id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex gap-5 hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Image */}
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/200'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate pr-4">
                            {product.name}
                          </h3>
                          {product.brand && (
                            <p className="text-sm text-gray-400 mt-0.5">{product.brand}</p>
                          )}
                          {product.category && (
                            <span className="inline-block text-xs bg-indigo-50 text-indigo-600 font-medium px-2 py-0.5 rounded-full mt-1">
                              {product.category}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-gray-300 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Qty Controls */}
                        <div className="flex items-center bg-gray-100 rounded-full">
                          <button
                            onClick={() => updateQty(item.product_id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.product_id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ${(price * item.quantity).toFixed(2)}
                          </p>
                          {originalPrice && (
                            <p className="text-xs text-gray-400 line-through">${(originalPrice * item.quantity).toFixed(2)}</p>
                          )}
                          <p className="text-xs text-gray-400">${price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between text-gray-900 font-bold text-lg">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-indigo-600 text-white py-3.5 px-6 rounded-xl font-semibold text-base hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="flex items-center justify-center gap-2 mt-4 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
