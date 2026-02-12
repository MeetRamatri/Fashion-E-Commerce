import React from 'react';
import { ShoppingCart, LogIn, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        <Link to="/" className="text-2xl font-bold text-gray-800">
          ShopSmart
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-600 hover:text-black transition duration-300">Home</Link>
          <Link to="/products" className="text-gray-600 hover:text-black transition duration-300">Shop</Link>
          <Link to="/about" className="text-gray-600 hover:text-black transition duration-300">About</Link>
          <Link to="/contact" className="text-gray-600 hover:text-black transition duration-300">Contact</Link>
        </nav>

        <div className="flex items-center space-x-6">
          <div className="relative hidden sm:block">
            <input 
              type="text" 
              placeholder="Search..." 
              className="border border-gray-300 rounded-full py-1 px-4 pl-10 focus:outline-none focus:border-black transition duration-300"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          <Link to="/cart" className="relative text-gray-600 hover:text-black transition duration-300">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">0</span>
          </Link>

          <Link to="/login" className="flex items-center space-x-1 text-gray-600 hover:text-black transition duration-300">
            <LogIn className="w-6 h-6" />
            <span className="hidden sm:inline">Login</span>
          </Link>
          
          <button className="md:hidden text-gray-600 focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
