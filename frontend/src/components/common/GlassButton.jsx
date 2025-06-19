import React from 'react';
import { motion } from 'framer-motion';

const GlassButton = ({ 
  children, 
  className = '', 
  variant = 'default',
  size = 'md',
  animate = true,
  disabled = false,
  loading = false,
  onClick = null,
  icon = null,
  iconPosition = 'left',
  ...props 
}) => {
  const baseClasses = "backdrop-blur-md rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group";
  
  const variantClasses = {
    default: "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 active:scale-95",
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border border-primary-400/50 shadow-lg hover:shadow-primary-500/25 active:scale-95",
    secondary: "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border border-slate-500/50 active:scale-95",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border border-red-400/50 shadow-lg hover:shadow-red-500/25 active:scale-95",
    outline: "bg-transparent border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 active:scale-95",
    ghost: "bg-transparent text-white hover:bg-white/10 active:scale-95",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border border-green-400/50 shadow-lg hover:shadow-green-500/25 active:scale-95"
  };
  
  const sizeClasses = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
    xl: "px-10 py-4 text-xl"
  };
  
  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer";
  
  const buttonContent = (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect for primary buttons */}
      {variant === 'primary' && (
        <div className="absolute inset-0 -top-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
      )}
      
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="text-lg">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="text-lg">{icon}</span>}
        </>
      )}
    </button>
  );
  
  if (animate && !disabled && !loading) {
    return (
      <motion.div 
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {buttonContent}
      </motion.div>
    );
  }
  
  return buttonContent;
};

export default GlassButton;