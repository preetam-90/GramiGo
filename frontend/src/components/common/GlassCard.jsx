import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true,
  animate = true,
  onClick = null,
  variant = 'default',
  ...props 
}) => {
  const variants = {
    default: "bg-white/10 backdrop-blur-md border border-white/20",
    elevated: "bg-white/15 backdrop-blur-lg border border-white/30 shadow-2xl",
    subtle: "bg-white/5 backdrop-blur-sm border border-white/10",
    solid: "bg-white/20 backdrop-blur-xl border border-white/40"
  };

  const baseClasses = "rounded-2xl p-6 shadow-lg transition-all duration-300";
  const hoverClasses = hover ? "hover:bg-white/20 hover:shadow-xl hover:scale-[1.02] hover:border-white/30" : "";
  const clickableClasses = onClick ? "cursor-pointer" : "";
  
  const cardContent = (
    <div 
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${clickableClasses} ${className}`}
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
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={hover ? { y: -2 } : {}}
      >
        {cardContent}
      </motion.div>
    );
  }
  
  return cardContent;
};

export default GlassCard;