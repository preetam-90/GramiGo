import React from 'react';
import { motion } from 'framer-motion';
import GlassButton from './GlassButton';

const HeroSection = ({ 
  title = "Book Agricultural Equipment & Transportation", 
  subtitle = "Connect with verified operators for tractors, harvesters, and transportation services in your area",
  backgroundImage = null,
  primaryAction = { label: "Book Now", onClick: () => {} },
  secondaryAction = { label: "Learn More", onClick: () => {} },
  features = [],
  stats = [],
  className = '',
  ...props 
}) => {
  const defaultFeatures = [
    { icon: "🚜", text: "Verified Equipment" },
    { icon: "📍", text: "Local Operators" },
    { icon: "💰", text: "Best Prices" },
    { icon: "⚡", text: "Instant Booking" }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <section 
      className={`
        relative min-h-screen flex items-center justify-center overflow-hidden
        ${className}
      `}
      {...props}
    >
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <img 
            src={backgroundImage} 
            alt="Agriculture Background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-emerald-900/80" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary-500/10 backdrop-blur-3xl"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 rounded-full bg-emerald-500/10 backdrop-blur-3xl"
          animate={{ 
            y: [0, 30, 0],
            scale: [1, 0.9, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-40 h-40 rounded-full bg-blue-500/10 backdrop-blur-3xl"
          animate={{ 
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block">
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent"
              >
                {title.split(' ').slice(0, 2).join(' ')}
              </motion.span>
            </span>
            <span className="block mt-2">
              <motion.span
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-white"
              >
                {title.split(' ').slice(2).join(' ')}
              </motion.span>
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <GlassButton
              variant="primary"
              size="lg"
              onClick={primaryAction.onClick}
              className="min-w-[200px] text-lg font-semibold"
              animate={true}
            >
              {primaryAction.label}
            </GlassButton>
            
            <GlassButton
              variant="outline"
              size="lg"
              onClick={secondaryAction.onClick}
              className="min-w-[200px] text-lg"
              animate={true}
            >
              {secondaryAction.label}
            </GlassButton>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {displayFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 text-center hover:bg-white/15 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.05 }}
            >
              <div className="text-2xl md:text-3xl mb-2">{feature.icon}</div>
              <p className="text-white font-medium text-sm md:text-base">{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        {stats.length > 0 && (
          <motion.div 
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + index * 0.1, duration: 0.5 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-300 text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;