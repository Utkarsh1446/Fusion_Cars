import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

/**
 * Hero Component - IMPROVED VERSION
 *
 * Enhanced hero section with:
 * - Stronger value proposition (6-10 word headline)
 * - Integrated search functionality
 * - Primary CTA above fold
 * - Trust indicators with metrics
 * - Better visual hierarchy
 * - Optimized for conversion
 */
export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section
      className="relative w-full min-h-screen bg-gradient-to-br from-primary-black via-primary-dark to-primary-charcoal flex items-center overflow-hidden"
      aria-label="Hero section - Find your perfect car"
      role="region"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 right-20 w-80 h-80 bg-accent-silver rounded-full mix-blend-screen filter blur-3xl opacity-5"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 40, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-20 left-20 w-72 h-72 bg-accent-platinum rounded-full mix-blend-screen filter blur-3xl opacity-3"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -40, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Main Headline - Value Proposition */}
            <div>
              <motion.span
                className="text-accent-blue font-semibold text-sm uppercase tracking-wider"
                variants={itemVariants}
              >
                Welcome to Fusion Cars
              </motion.span>
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mt-3 leading-tight"
                variants={itemVariants}
              >
                Find Your Perfect Car Today
              </motion.h1>
              <motion.p
                className="text-xl text-gray-300 mt-6 leading-relaxed max-w-lg"
                variants={itemVariants}
              >
                Discover premium vehicles handpicked for quality, performance, and value. Drive your dream car with confidence.
              </motion.p>
            </div>

            {/* Search Component */}
            <motion.div
              className="bg-neutral-white rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-xl"
              variants={itemVariants}
            >
              <input
                type="text"
                placeholder="Search by brand, model, or price..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-6 py-3 rounded-lg bg-neutral-white text-primary-black placeholder-accent-stone focus:outline-none focus:ring-2 focus:ring-accent-silver"
                aria-label="Search cars"
              />
              <Link href="/inventory">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-accent-silver hover:bg-neutral-light text-primary-black px-8 py-3 rounded-lg font-bold transition-colors duration-300 flex items-center gap-2 whitespace-nowrap"
                  aria-label="Search inventory"
                >
                  <Search className="w-5 h-5" />
                  Search
                </motion.button>
              </Link>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Link href="/inventory">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(209, 213, 219, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-accent-silver hover:bg-neutral-light text-primary-black px-10 py-4 rounded-lg font-bold text-lg transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg"
                  aria-label="Browse our inventory of premium vehicles"
                >
                  Browse Inventory
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-accent-silver text-accent-silver px-10 py-4 rounded-lg font-bold text-lg hover:bg-accent-silver hover:text-primary-black transition-all duration-300"
                aria-label="Schedule a test drive"
              >
                Book Test Drive
              </motion.button>
            </motion.div>

            {/* Trust Indicators - Key Metrics */}
            <motion.div
              className="grid grid-cols-3 gap-6 pt-8 border-t border-accent-charcoal"
              variants={itemVariants}
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-accent-silver">500+</p>
                <p className="text-sm text-accent-stone mt-2">Premium Vehicles</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent-platinum">10K+</p>
                <p className="text-sm text-accent-stone mt-2">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent-silver">25+</p>
                <p className="text-sm text-accent-stone mt-2">Years Experience</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Hero Image */}
          <motion.div
            className="relative hidden lg:block"
            variants={itemVariants}
          >
            <motion.div
              className="relative h-full min-h-screen flex items-center"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <img
                src="https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=600&h=700&fit=crop"
                alt="Premium luxury vehicle showcase - Fusion Cars inventory"
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-navy via-transparent rounded-2xl"></div>

              {/* Floating Card - Trust Signal */}
              <motion.div
                className="absolute bottom-10 left-8 right-8 bg-white bg-opacity-95 rounded-xl p-6 shadow-xl"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <p className="text-sm text-gray-600 font-semibold">⭐ 4.8/5 Rating from 2000+ Reviews</p>
                <p className="text-gray-800 font-bold mt-2">Trusted by car buyers across the country</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
