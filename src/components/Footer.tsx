
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">SNITCH</h3>
            <p className="text-gray-300 mb-4">
              Contemporary fashion for the modern individual. Quality clothing that makes a statement.
            </p>
          </div>
          
          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQs</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white">Shipping Information</Link></li>
              <li><Link to="/sizes" className="text-gray-300 hover:text-white">Size Guide</Link></li>
            </ul>
          </div>
          
          {/* Policies */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Policies</h4>
            <ul className="space-y-2">
              <li><Link to="/returns" className="text-gray-300 hover:text-white">Returns & Refunds</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/warranty" className="text-gray-300 hover:text-white">Warranty</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
            <address className="not-italic text-gray-300">
              <p className="mb-2">1234 Fashion Avenue</p>
              <p className="mb-2">Style District, ST 56789</p>
              <p className="mb-2">Email: support@snitch.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SNITCH Clothing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
