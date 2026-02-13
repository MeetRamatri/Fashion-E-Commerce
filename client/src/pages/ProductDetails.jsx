import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Product not found');
        }
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
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            {/* Image gallery */}
            <div className="flex flex-col-reverse">
              <div className="w-full aspect-w-1 aspect-h-1">
                <img
                  src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/600'}
                  alt={product.name}
                  className="w-full h-full object-center object-cover sm:rounded-lg"
                />
              </div>
            </div>

            {/* Product info */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl text-gray-900">${product.price}</p>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <div className="text-base text-gray-700 space-y-6">
                  <p>{product.description || 'No description available.'}</p>
                </div>
              </div>

               <div className="mt-6">
                 <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-900">Brand:</h3>
                    <p className="ml-2 text-sm text-gray-500">{product.brand || 'Unknown'}</p>
                 </div>
                 <div className="flex items-center mt-2">
                    <h3 className="text-sm font-medium text-gray-900">Category:</h3>
                    <p className="ml-2 text-sm text-gray-500">{product.category || 'Uncategorized'}</p>
                 </div>
              </div>

              <div className="mt-10 flex">
                <button
                  type="button"
                  className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                >
                  Add to Cart
                </button>
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
