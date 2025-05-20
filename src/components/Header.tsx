
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MenuIcon, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-navy text-2xl font-bold tracking-tight">SNITCH</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-charcoal hover:text-burgundy font-medium">
              Home
            </Link>
            <Link to="/products" className="text-charcoal hover:text-burgundy font-medium">
              Products
            </Link>
            <Link to="/support" className="text-charcoal hover:text-burgundy font-medium">
              Support
            </Link>
            <Link to="/track" className="text-charcoal hover:text-burgundy font-medium">
              Track Order
            </Link>
          </nav>

          {/* Login Button (Desktop) */}
          <div className="hidden md:block">
            <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6 text-navy" />
            ) : (
              <MenuIcon className="h-6 w-6 text-navy" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-charcoal hover:text-burgundy font-medium">
                Home
              </Link>
              <Link to="/products" className="text-charcoal hover:text-burgundy font-medium">
                Products
              </Link>
              <Link to="/support" className="text-charcoal hover:text-burgundy font-medium">
                Support
              </Link>
              <Link to="/track" className="text-charcoal hover:text-burgundy font-medium">
                Track Order
              </Link>
              <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white w-full">
                Login
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
