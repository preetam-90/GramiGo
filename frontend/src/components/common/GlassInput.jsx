import React from 'react';

const GlassInput = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  className = '',
  inputClassName = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-slate-200 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full bg-white/10 backdrop-blur-md rounded-xl border border-white/20
          py-2.5 px-4 text-white placeholder-white/50
          focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-white/15
          transition-all duration-300
          ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
          ${inputClassName}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default GlassInput; 