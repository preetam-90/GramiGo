import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  variant = 'default',
  size = 'md',
  animate = true,
  className = '',
  onClick = null,
  ...props 
}) => {
  const variants = {
    default: "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30",
    primary: "bg-gradient-to-br from-primary-500/20 to-primary-600/10 backdrop-blur-lg border border-primary-400/30 hover:from-primary-500/30 hover:to-primary-600/20",
    secondary: "bg-gradient-to-br from-slate-600/20 to-slate-700/10 backdrop-blur-lg border border-slate-500/30 hover:from-slate-600/30 hover:to-slate-700/20",
    accent: "bg-gradient-to-br from-emerald-500/20 to-green-600/10 backdrop-blur-lg border border-emerald-400/30 hover:from-emerald-500/30 hover:to-green-600/20"
  };

  const sizes = {
    sm: "p-4 rounded-xl",
    md: "p-6 rounded-2xl",
    lg: "p-8 rounded-3xl"
  };

  const iconSizes = {
    sm: "w-8 h-8 text-2xl",
    md: "w-12 h-12 text-3xl",
    lg: "w-16 h-16 text-4xl"
  };

  const titleSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl"
  };

  const cardContent = (
    <div 
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        transition-all duration-500 shadow-lg hover:shadow-2xl
        ${onClick ? 'cursor-pointer' : ''}
        group relative overflow-hidden
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className={`
          ${iconSizes[size]} 
          flex items-center justify-center rounded-2xl mb-4
          bg-gradient-to-br from-primary-400/20 to-primary-600/20 
          backdrop-blur-sm border border-primary-400/30
          group-hover:scale-110 group-hover:rotate-3 
          transition-all duration-300
        `}>
          {typeof icon === 'string' ? (
            <span className="text-primary-300">{icon}</span>
          ) : (
            <div className="text-primary-300">{icon}</div>
          )}
        </div>

        {/* Title */}
        <h3 className={`
          ${titleSizes[size]} 
          font-bold text-white mb-2 
          group-hover:text-primary-300 
          transition-colors duration-300
        `}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
          {description}
        </p>

        {/* Hover Indicator */}
        {onClick && (
          <div className="mt-4 flex items-center text-primary-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
            <span className="text-sm font-medium">Learn more</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform scale-0 group-hover:scale-100" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary-600/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform scale-0 group-hover:scale-100" />
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -4 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default FeatureCard;