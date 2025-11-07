import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Navbar Component - IMPROVED VERSION
 *
 * Enhanced navigation with:
 * - Sticky positioning for easy access
 * - Contact info in header
 * - Search functionality
 * - Improved mobile experience
 * - Trust signals and call buttons
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Inventory', href: '/inventory' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary-black text-white shadow-xl" role="navigation" aria-label="Main navigation">
      {/* Top Bar - Contact Info */}
      <div className="bg-primary-dark hidden sm:block border-b border-accent-silver/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center text-sm">
          <div className="flex gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent-silver" />
              <span>+91 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-silver" />
              <span>123 Motors Avenue, Tech City</span>
            </div>
          </div>
          <div className="text-accent-silver font-semibold">Open: Mon-Sat 9AM-6PM</div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="font-bold text-2xl flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-accent-silver rounded-lg flex items-center justify-center">
                <span className="text-primary-black font-bold">FC</span>
              </div>
              <span className="hidden sm:inline text-white">Fusion Cars</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white hover:text-accent-silver transition-colors duration-300 font-medium text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section - CTA Button */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block bg-accent-silver hover:bg-neutral-light text-primary-black px-6 py-2 rounded-lg font-bold text-sm transition-colors duration-300 shadow-lg"
              aria-label="Book a test drive"
            >
              Book Test Drive
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            id="mobile-menu"
            className="md:hidden pb-6 border-t border-accent-charcoal space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-2 text-white hover:text-accent-silver transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-accent-silver text-primary-black px-6 py-3 rounded-lg font-semibold hover:bg-neutral-light transition-colors mt-4"
              aria-label="Book a test drive from mobile menu"
            >
              Book Test Drive
            </motion.button>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
