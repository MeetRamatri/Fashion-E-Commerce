import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Check, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex justify-center items-center">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{error || 'Product not found'}</p>
            <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:underline">← Back to Products</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayPrice = product.discount_price || product.price;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <Link to="/products" className="inline-flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
              <img
                src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/600'}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            </div>

            {/* Info */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              {product.category && (
                <span className="inline-block text-xs bg-indigo-50 text-indigo-600 font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                  {product.category}
                </span>
              )}
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-indigo-600">${displayPrice}</span>
                {product.discount_price && (
                  <span className="text-lg text-gray-400 line-through">${product.price}</span>
                )}
              </div>

              <div className="mt-6 text-base text-gray-700 leading-relaxed">
                <p>{product.description || 'No description available.'}</p>
              </div>

              <div className="mt-6 space-y-2">
                {product.brand && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Brand:</span>
                    <span className="text-sm text-gray-500">{product.brand}</span>
                  </div>
                )}
              </div>

              <div className="mt-10">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center gap-3 rounded-xl py-4 px-8 text-base font-semibold transition-all duration-300 shadow-md ${
                    added
                      ? 'bg-green-500 text-white shadow-green-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <Link
                  to="/cart"
                  className="mt-3 w-full flex items-center justify-center border border-indigo-300 text-indigo-600 rounded-xl py-3 px-8 text-base font-medium hover:bg-indigo-50 transition-colors"
                >
                  View Cart
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

export default ProductDetails;
