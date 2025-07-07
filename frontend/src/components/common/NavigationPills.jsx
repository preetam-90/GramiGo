import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NavigationPills = ({ 
  items = [], 
  activeItem = null, 
  onItemChange = null,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  className = '',
  ...props 
}) => {
  const [activeIndex, setActiveIndex] = useState(
    activeItem ? items.findIndex(item => item.id === activeItem || item.value === activeItem) : 0
  );

  const variants = {
    default: {
      container: "bg-white/10 backdrop-blur-md border border-white/20",
      active: "bg-primary-500 text-white shadow-lg shadow-primary-500/30",
      inactive: "text-slate-300 hover:text-white hover:bg-white/10"
    },
    glass: {
      container: "bg-white/5 backdrop-blur-lg border border-white/10",
      active: "bg-white/20 text-white shadow-lg backdrop-blur-md",
      inactive: "text-slate-400 hover:text-white hover:bg-white/10"
    },
    solid: {
      container: "bg-slate-800/50 backdrop-blur-md border border-slate-700/50",
      active: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25",
      inactive: "text-slate-300 hover:text-white hover:bg-slate-700/50"
    }
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-base rounded-xl",
    lg: "px-6 py-3 text-lg rounded-2xl"
  };

  const containerClasses = orientation === 'horizontal' 
    ? "flex items-center gap-1" 
    : "flex flex-col gap-1";

  const handleItemClick = (item, index) => {
    setActiveIndex(index);
    if (onItemChange) {
      onItemChange(item, index);
    }
  };

  return (
    <div 
      className={`
        ${variants[variant].container} 
        ${containerClasses} 
        ${sizes[size].includes('rounded-') ? 'p-1' : 'p-1.5'} 
        transition-all duration-300 
        ${className}
      `}
      {...props}
    >
      {items.map((item, index) => (
        <motion.button
          key={item.id || item.value || index}
          onClick={() => handleItemClick(item, index)}
          className={`
            ${sizes[size]} 
            relative font-medium transition-all duration-300 
            ${index === activeIndex 
              ? variants[variant].active 
              : variants[variant].inactive
            }
            ${orientation === 'horizontal' ? 'min-w-0' : 'w-full text-left'}
            flex items-center justify-center gap-2
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Background highlight for active item */}
          {index === activeIndex && (
            <motion.div
              layoutId="activeBackground"
              className={`
                absolute inset-0 
                ${index === activeIndex ? variants[variant].active : ''}
                rounded-[inherit]
              `}
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          
          {/* Content */}
          <span className="relative z-10 flex items-center gap-2">
            {item.icon && (
              <span className={`${sizes[size].includes('text-sm') ? 'text-base' : 'text-lg'}`}>
                {item.icon}
              </span>
            )}
            {item.label || item.name || item.value}
            {item.badge && (
              <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                {item.badge}
              </span>
            )}
          </span>

          {/* Hover effect */}
          <motion.div
            className="absolute inset-0 bg-white/5 rounded-[inherit] opacity-0"
            whileHover={{ opacity: index !== activeIndex ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
      ))}
    </div>
  );
};

export default NavigationPills;