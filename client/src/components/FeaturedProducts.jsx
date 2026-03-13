import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedMap, setAddedMap] = useState({});
  const { addToCart, cartItems, updateQty, removeFromCart } = useCart();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    await addToCart(product);
    const id = product.id || product._id;
    setAddedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [id]: false }));
    }, 1500);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-500">Loading new arrivals...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Featured Arrivals</h2>
          <Link to="/products" className="text-indigo-600 font-semibold hover:text-indigo-800 flex items-center">
            View All
            <span className="ml-2">&rarr;</span>
          </Link>
        </div>
        
        {products.length === 0 ? (
           <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const id = product.id || product._id;
              const added = addedMap[id];
              return (
                <div key={id} className="group relative flex flex-col border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <Link to={`/products/${id}`} className="block overflow-hidden aspect-square bg-gray-100">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400'}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start flex-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                          <Link to={`/products/${id}`} className="hover:text-indigo-600 transition-colors">
                            {product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">{product.category}</p>
                      </div>
                      <div className="text-right">
                        {product.discount_price ? (
                          <>
                            <p className="text-sm font-bold text-indigo-600">${product.discount_price}</p>
                            <p className="text-xs text-gray-400 line-through">${product.price}</p>
                          </>
                        ) : (
                          <p className="text-sm font-medium text-gray-900">${product.price}</p>
                        )}
                      </div>
                    </div>
                    {(() => {
                      const cartItem = cartItems.find(i => i.product_id === id);
                      if (cartItem) {
                        return (
                          <div className="mt-3 flex items-center justify-between bg-indigo-50 rounded-lg overflow-hidden border border-indigo-200">
                            <button
                              onClick={(e) => { e.preventDefault(); cartItem.quantity > 1 ? updateQty(id, cartItem.quantity - 1) : removeFromCart(id); }}
                              className="w-10 h-10 flex items-center justify-center text-indigo-700 hover:bg-indigo-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-indigo-700 text-base">{cartItem.quantity}</span>
                            <button
                              onClick={(e) => { e.preventDefault(); updateQty(id, cartItem.quantity + 1); }}
                              className="w-10 h-10 flex items-center justify-center text-indigo-700 hover:bg-indigo-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      }
                      return (
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className={`mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                            added
                              ? 'bg-green-500 text-white'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {added ? (
                            <>
                              <Check className="w-4 h-4" />
                              Added!
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </>
                          )}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
