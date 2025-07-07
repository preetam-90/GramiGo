import React from 'react';
import { motion } from 'framer-motion';

const StatusBadge = ({ 
  status, 
  label, 
  variant = 'default', 
  size = 'md',
  animate = true,
  pulse = false,
  className = '',
  icon = null,
  ...props 
}) => {
  const variants = {
    success: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/40 text-green-300 shadow-green-500/20",
    warning: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/40 text-yellow-300 shadow-yellow-500/20",
    error: "bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-400/40 text-red-300 shadow-red-500/20",
    info: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/40 text-blue-300 shadow-blue-500/20",
    primary: "bg-gradient-to-r from-primary-500/20 to-primary-600/20 border-primary-400/40 text-primary-300 shadow-primary-500/20",
    neutral: "bg-gradient-to-r from-slate-500/20 to-gray-500/20 border-slate-400/40 text-slate-300 shadow-slate-500/20",
    default: "bg-white/10 border-white/30 text-white shadow-white/10"
  };

  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
    xl: "px-5 py-2.5 text-lg"
  };

  const statusIcons = {
    pending: "⏳",
    approved: "✅",
    rejected: "❌",
    in_progress: "🔄",
    completed: "🎉",
    cancelled: "🚫",
    available: "🟢",
    busy: "🟡",
    offline: "🔴",
    verified: "✅",
    premium: "⭐"
  };

  const displayIcon = icon || statusIcons[status] || null;
  const displayLabel = label || status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';

  const badgeContent = (
    <div 
      className={`
        inline-flex items-center gap-2 rounded-full backdrop-blur-md border shadow-lg
        transition-all duration-300 font-medium
        ${variants[variant]} 
        ${sizes[size]} 
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
      {...props}
    >
      {displayIcon && (
        <span className="text-current">
          {displayIcon}
        </span>
      )}
      <span>{displayLabel}</span>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {badgeContent}
      </motion.div>
    );
  }

  return badgeContent;
};

export default StatusBadge;