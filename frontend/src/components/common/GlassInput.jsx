import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GlassInput = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  success,
  className = '',
  inputClassName = '',
  icon = null,
  iconPosition = 'left',
  helperText = '',
  required = false,
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <motion.div 
      className={`mb-6 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-semibold text-slate-200 mb-3 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 z-10">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            w-full bg-white/10 backdrop-blur-md rounded-xl border-2 transition-all duration-300
            py-3 px-4 text-white placeholder-white/50 font-medium
            focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-white/15
            ${icon && iconPosition === 'left' ? 'pl-12' : ''}
            ${icon && iconPosition === 'right' || type === 'password' ? 'pr-12' : ''}
            ${error ? 'border-red-500 focus:ring-red-500/50 bg-red-500/10' : 
              success ? 'border-green-500 focus:ring-green-500/50 bg-green-500/10' :
              isFocused ? 'border-primary-500 bg-white/15' : 'border-white/20'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        
        {/* Right Icon or Password Toggle */}
        {(icon && iconPosition === 'right') || type === 'password' ? (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
            {type === 'password' ? (
              <button
                type="button"
                onClick={handleTogglePassword}
                className="text-white/60 hover:text-white/80 transition-colors duration-200"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            ) : (
              <div className="text-white/60">{icon}</div>
            )}
          </div>
        ) : null}
        
        {/* Focus ring animation */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-primary-400 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
      
      {/* Helper text, error, or success message */}
      {(error || success || helperText) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2"
        >
          {error && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </p>
          )}
          {helperText && !error && !success && (
            <p className="text-sm text-slate-400">{helperText}</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default GlassInput;