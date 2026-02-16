import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Award, Users, TrendingUp, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div className="bg-gray-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">About ShopSmart</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We are redefining the way you shop online with curated fashion, seamless experiences, and a commitment to quality.
            </p>
          </div>
        </div>

        {/* Our Story & Mission */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Our Team" 
                  className="rounded-lg shadow-lg w-full h-auto object-cover"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                   We noticed a gap in the market for a platform that combines trendsetting styles with affordable prices, without compromising on sustainability or ethics.
                </p>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our mission is to empower individuals to express themselves through fashion. We believe that style should be personal, accessible, and fun. by leveraging technology and data, we curate collections that resonate with our diverse community of shoppers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Assurance</h3>
                <p className="text-gray-600">Every item is handpicked and quality checked to ensure the best for our customers.</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition duration-300">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer First</h3>
                <p className="text-gray-600">Our support team is available 24/7 to assist you with any queries or concerns.</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition duration-300">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Latest Trends</h3>
                <p className="text-gray-600">Stay ahead of the curve with our constantly updated collection of trendy outfits.</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition duration-300">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Payment</h3>
                <p className="text-gray-600">Shop with confidence using our encrypted and secure payment gateways.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
