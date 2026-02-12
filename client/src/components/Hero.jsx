import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Discover Your Style <br /> 
          <span className="text-indigo-600">Shop Smart, Look Sharp</span>
        </h1>
        <p className="max-w-xl text-lg sm:text-xl text-gray-600 mb-8">
          Explore our latest collection of premium fashion essentials. From timeless classics to modern trends, we have everything you need to elevate your wardrobe.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/products" 
            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
          >
            Shop Now
          </Link>
          <Link 
            to="/about" 
            className="bg-white text-gray-800 font-bold py-3 px-8 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
