import React from 'react';
import { motion } from 'framer-motion';

const GlassButton = ({ 
  children, 
  className = '', 
  variant = 'default',
  size = 'md',
  animate = true,
  disabled = false,
  onClick = null,
  ...props 
}) => {
  const baseClasses = "bg-white/10 backdrop-blur-md rounded-xl border border-white/20 font-medium transition-all duration-300 flex items-center justify-center";
  
  const variantClasses = {
    default: "hover:bg-white/20 active:scale-95",
    primary: "bg-primary-600/80 hover:bg-primary-600/90 active:scale-95 border-primary-500/50",
    danger: "bg-red-600/80 hover:bg-red-600/90 active:scale-95 border-red-500/50",
    outline: "bg-transparent border-white/40 hover:bg-white/10 active:scale-95",
  };
  
  const sizeClasses = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2",
    lg: "px-8 py-3 text-lg",
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  const buttonContent = (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
  
  if (animate && !disabled) {
    return (
      <motion.div whileTap={{ scale: 0.97 }}>
        {buttonContent}
      </motion.div>
    );
  }
  
  return buttonContent;
};

export default GlassButton; 