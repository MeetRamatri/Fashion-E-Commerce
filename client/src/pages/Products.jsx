import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedMap, setAddedMap] = useState({});
  const { addToCart, cartItems, updateQty, removeFromCart } = useCart();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (product) => {
    await addToCart(product);
    const id = product.id || product._id;
    setAddedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [id]: false }));
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => {
                const id = product.id || product._id;
                const added = addedMap[id];
                return (
                  <div key={id} className="group relative border border-gray-200 rounded-xl p-4 hover:shadow-lg transition duration-300 flex flex-col">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                      <Link to={`/products/${id}`}>
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400'}
                          alt={product.name}
                          className="h-48 w-full object-cover object-center group-hover:opacity-90 transition duration-300"
                        />
                      </Link>
                    </div>
                    <div className="flex justify-between items-start flex-1">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link to={`/products/${id}`} className="hover:text-indigo-600 transition-colors">
                            {product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                      </div>
                      <div className="text-right">
                        {product.discount_price ? (
                          <>
                            <p className="text-lg font-bold text-indigo-600">${product.discount_price}</p>
                            <p className="text-xs text-gray-400 line-through">${product.price}</p>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-indigo-600">${product.price}</p>
                        )}
                      </div>
                    </div>
                    {(() => {
                      const cartItem = cartItems.find(i => i.product_id === id);
                      if (cartItem) {
                        return (
                          <div className="mt-4 flex items-center justify-between bg-indigo-50 rounded-lg overflow-hidden border border-indigo-200">
                            <button
                              onClick={() => cartItem.quantity > 1 ? updateQty(id, cartItem.quantity - 1) : removeFromCart(id)}
                              className="w-10 h-10 flex items-center justify-center text-indigo-700 hover:bg-indigo-100 transition-colors font-bold text-lg"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-indigo-700 text-base px-2">{cartItem.quantity}</span>
                            <button
                              onClick={() => updateQty(id, cartItem.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center text-indigo-700 hover:bg-indigo-100 transition-colors font-bold text-lg"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      }
                      return (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`mt-4 w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all duration-300 ${
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
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
