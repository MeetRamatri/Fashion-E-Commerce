import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div>
            <h3 className="text-xl font-bold mb-4">ShopSmart</h3>
            <p className="text-gray-400">
              Your one-stop destination for trendy and affordable fashion. We believe in quality, style, and sustainability.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition duration-300">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition duration-300">Shop</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition duration-300">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition duration-300">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition duration-300">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white transition duration-300">Shipping & Returns</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300"><Linkedin className="w-5 h-5" /></a>
            </div>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-4 focus:outline-none focus:border-indigo-500"
              />
              <button className="absolute right-0 top-0 bottom-0 bg-indigo-600 px-4 rounded-r hover:bg-indigo-700 transition duration-300">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} ShopSmart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
