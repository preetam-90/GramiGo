import React from 'react';
import { motion } from 'framer-motion';
import GlassButton from './GlassButton';

const BookingCard = ({ 
  title, 
  image, 
  price, 
  rating, 
  location, 
  availability, 
  features = [], 
  onBook,
  className = '',
  variant = 'default',
  ...props 
}) => {
  const variants = {
    default: "bg-white/10 backdrop-blur-md border border-white/20",
    featured: "bg-gradient-to-br from-primary-500/20 to-primary-600/10 backdrop-blur-lg border border-primary-400/30 shadow-2xl shadow-primary-500/10",
    premium: "bg-gradient-to-br from-yellow-500/20 to-amber-600/10 backdrop-blur-lg border border-yellow-400/30 shadow-2xl shadow-yellow-500/10"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`${className}`}
      {...props}
    >
      <div className={`${variants[variant]} rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 relative`}>
        {/* Featured Badge */}
        {variant === 'featured' && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
              Featured
            </div>
          </div>
        )}
        
        {/* Premium Badge */}
        {variant === 'premium' && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
              Premium
            </div>
          </div>
        )}

        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image || '/api/placeholder/400/300'} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          
          {/* Availability Indicator */}
          <div className="absolute bottom-4 left-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md ${
              availability === 'available' ? 'bg-green-500/20 border border-green-400/30' :
              availability === 'busy' ? 'bg-yellow-500/20 border border-yellow-400/30' :
              'bg-red-500/20 border border-red-400/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                availability === 'available' ? 'bg-green-400 animate-pulse' :
                availability === 'busy' ? 'bg-yellow-400 animate-pulse' :
                'bg-red-400'
              }`} />
              <span className="text-xs font-medium capitalize text-white">
                {availability}
              </span>
            </div>
          </div>

          {/* Rating */}
          {rating && (
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-md">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm font-semibold text-white">{rating}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors duration-300">
            {title}
          </h3>
          
          {location && (
            <div className="flex items-center gap-2 text-slate-300 mb-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className="text-sm">{location}</span>
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-slate-300"
                >
                  {feature}
                </span>
              ))}
              {features.length > 3 && (
                <span className="px-2 py-1 text-xs bg-primary-500/20 backdrop-blur-sm border border-primary-400/30 rounded-lg text-primary-300">
                  +{features.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Price and Book Button */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-white">${price}</span>
              <span className="text-slate-400 text-sm ml-1">/day</span>
            </div>
            
            <GlassButton
              variant={availability === 'available' ? 'primary' : 'outline'}
              size="sm"
              onClick={onBook}
              disabled={availability !== 'available'}
              className="min-w-[80px]"
            >
              {availability === 'available' ? 'Book Now' : 'Unavailable'}
            </GlassButton>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default BookingCard;