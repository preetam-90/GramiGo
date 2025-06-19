import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true,
  animate = true,
  onClick = null,
  ...props 
}) => {
  const baseClasses = "bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20";
  const hoverClasses = hover ? "transition-all duration-300 hover:bg-white/15 hover:shadow-xl" : "";
  
  const cardContent = (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
  
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {cardContent}
      </motion.div>
    );
  }
  
  return cardContent;
};

export default GlassCard; 