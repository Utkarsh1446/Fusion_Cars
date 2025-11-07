import { motion } from 'framer-motion';
import { Heart, MapPin, Zap, Settings } from 'lucide-react';
import { useState } from 'react';

/**
 * CarCard Component - Dark Luxury Theme
 *
 * Premium car card with dark background and red accents:
 * - Dark gray card background
 * - Car image with hover effects
 * - Red featured badge
 * - Red price badge
 * - Rating and reviews
 * - Wishlist functionality
 * - Accessible labels and ARIA attributes
 */
export default function CarCard({ car }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.article
      className="bg-primary-charcoal rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-accent-charcoal"
      whileHover={{ y: -8 }}
      layout
      aria-label={`${car.brand} ${car.model} - ${car.priceInWords}`}
    >
      {/* Image Container with Badge */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-primary-dark to-primary-black group">
        <motion.img
          src={car.image}
          alt={`${car.brand} ${car.model} front view`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Featured Badge - Silver Luxury Style */}
        {car.featured && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 bg-accent-silver text-primary-black px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg"
          >
            ⭐ Featured
          </motion.div>
        )}

        {/* Wishlist Button */}
        <motion.button
          onClick={toggleFavorite}
          className="absolute top-4 left-4 bg-primary-charcoal p-3 rounded-full shadow-lg hover:shadow-2xl transition-shadow border border-accent-silver/30"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isFavorite ? `Remove ${car.brand} ${car.model} from favorites` : `Add ${car.brand} ${car.model} to favorites`}
          aria-pressed={isFavorite}
        >
          <Heart
            className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-accent-silver text-accent-silver' : 'text-accent-platinum'}`}
          />
        </motion.button>

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 bg-primary-charcoal/95 text-accent-silver px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-accent-silver/50">
          <span className="font-bold text-sm">⭐ {car.rating}</span>
          <span className="text-xs text-accent-stone">({car.reviews})</span>
        </div>

        {/* Price Badge Floating - Silver Accent */}
        <motion.div
          className="absolute bottom-4 right-4 bg-accent-silver text-primary-black px-4 py-2 rounded-full font-bold shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          ₹{car.priceInWords}
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow bg-primary-charcoal">
        {/* Brand and Model */}
        <div className="mb-4">
          <p className="text-accent-silver font-bold text-xs uppercase tracking-wider mb-2">{car.brand}</p>
          <h3 className="text-2xl font-bold text-white mb-1">
            {car.model}
          </h3>
          <p className="text-accent-stone text-sm">{car.year} Model Year</p>
        </div>

        {/* Key Specifications - Dark Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-accent-charcoal">
          {/* Fuel Type */}
          <div className="bg-primary-dark/50 rounded-lg p-3 text-center border border-accent-charcoal">
            <Zap className="w-5 h-5 text-accent-silver mx-auto mb-2" />
            <p className="text-xs font-semibold text-white">{car.fuelType}</p>
            <p className="text-xs text-accent-stone">Fuel</p>
          </div>

          {/* Transmission */}
          <div className="bg-primary-dark/50 rounded-lg p-3 text-center border border-accent-charcoal">
            <Settings className="w-5 h-5 text-accent-platinum mx-auto mb-2" />
            <p className="text-xs font-semibold text-white">{car.transmission}</p>
            <p className="text-xs text-accent-stone">Trans.</p>
          </div>

          {/* Mileage */}
          <div className="bg-primary-dark/50 rounded-lg p-3 text-center border border-accent-charcoal">
            <MapPin className="w-5 h-5 text-accent-charcoal mx-auto mb-2" />
            <p className="text-xs font-semibold text-white">{car.mileage}</p>
            <p className="text-xs text-accent-stone">Mileage</p>
          </div>
        </div>

        {/* Features Tags */}
        <div className="mb-6">
          <p className="text-xs font-bold text-accent-silver mb-3 uppercase tracking-wider">Features</p>
          <div className="flex flex-wrap gap-2">
            {car.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="bg-primary-dark text-accent-silver px-3 py-1 rounded-full text-xs font-medium border border-accent-silver/30"
              >
                ✓ {feature}
              </span>
            ))}
            {car.features.length > 2 && (
              <span className="text-xs text-accent-platinum font-bold px-3 py-1">
                +{car.features.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-accent-silver text-primary-black py-3 rounded-lg font-bold hover:bg-neutral-light shadow-md transition-all duration-300"
            aria-label={`View details for ${car.brand} ${car.model}`}
          >
            View Details
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 border-2 border-accent-silver text-accent-silver py-3 rounded-lg font-bold hover:bg-accent-silver hover:text-primary-black transition-all duration-300"
            aria-label={`Schedule test drive for ${car.brand} ${car.model}`}
          >
            Test Drive
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
