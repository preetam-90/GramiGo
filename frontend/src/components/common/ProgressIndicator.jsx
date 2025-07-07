import React from 'react';
import { motion } from 'framer-motion';

const ProgressIndicator = ({ 
  steps = [], 
  currentStep = 0, 
  variant = 'default',
  orientation = 'horizontal',
  showLabels = true,
  showStepNumbers = true,
  className = '',
  ...props 
}) => {
  const variants = {
    default: {
      container: "bg-white/5 backdrop-blur-md border border-white/10",
      completed: "bg-primary-500 border-primary-400 text-white shadow-lg shadow-primary-500/30",
      current: "bg-primary-500/20 border-primary-400 text-primary-300 animate-pulse",
      pending: "bg-white/10 border-white/20 text-slate-400",
      line: "bg-white/20"
    },
    glass: {
      container: "bg-white/10 backdrop-blur-lg border border-white/20",
      completed: "bg-gradient-to-br from-primary-500 to-primary-600 border-primary-400/50 text-white shadow-xl shadow-primary-500/20",
      current: "bg-gradient-to-br from-primary-500/30 to-primary-600/20 border-primary-400/50 text-primary-200 ring-2 ring-primary-400/30",
      pending: "bg-white/5 border-white/20 text-slate-500",
      line: "bg-gradient-to-r from-white/10 to-white/30"
    },
    minimal: {
      container: "",
      completed: "bg-primary-500 border-primary-400 text-white",
      current: "bg-primary-500/20 border-primary-400 text-primary-300 ring-2 ring-primary-400/50",
      pending: "bg-slate-700 border-slate-600 text-slate-400",
      line: "bg-slate-600"
    }
  };

  const isHorizontal = orientation === 'horizontal';
  const containerClasses = isHorizontal 
    ? "flex items-center" 
    : "flex flex-col";

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (step, status, index) => {
    if (step.icon) return step.icon;
    if (status === 'completed') return '✓';
    if (showStepNumbers) return index + 1;
    return null;
  };

  return (
    <div 
      className={`
        ${variants[variant].container} 
        ${containerClasses} 
        p-4 rounded-2xl shadow-lg 
        ${className}
      `}
      {...props}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isLast = index === steps.length - 1;

        return (
          <div 
            key={step.id || index}
            className={`
              flex items-center relative
              ${isHorizontal ? (isLast ? '' : 'flex-1') : 'w-full mb-4 last:mb-0'}
            `}
          >
            {/* Step Circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="relative"
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                backdrop-blur-md border-2 transition-all duration-500
                ${variants[variant][status]}
                relative z-10 font-semibold text-sm
              `}>
                {getStepIcon(step, status, index)}
                
                {/* Glow Effect for Current Step */}
                {status === 'current' && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary-400/30"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>

            {/* Step Label */}
            {showLabels && (
              <div className={`
                ${isHorizontal ? 'ml-3' : 'ml-4 flex-1'}
                transition-all duration-300
              `}>
                <motion.p 
                  className={`
                    font-medium text-sm
                    ${status === 'completed' ? 'text-white' : 
                      status === 'current' ? 'text-primary-300' : 
                      'text-slate-400'}
                  `}
                  initial={{ opacity: 0, x: isHorizontal ? -10 : 0, y: isHorizontal ? 0 : -10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                >
                  {step.label || step.title || step.name}
                </motion.p>
                
                {step.description && (
                  <motion.p 
                    className="text-xs text-slate-500 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                  >
                    {step.description}
                  </motion.p>
                )}
              </div>
            )}

            {/* Connecting Line */}
            {!isLast && (
              <motion.div
                className={`
                  ${isHorizontal 
                    ? 'flex-1 h-0.5 mx-4' 
                    : 'w-0.5 h-8 ml-5 mt-2'
                  }
                  ${variants[variant].line}
                  relative overflow-hidden
                `}
                initial={{ scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }}
                animate={{ scaleX: 1, scaleY: 1 }}
                transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
              >
                {/* Progress fill */}
                {index < currentStep && (
                  <motion.div
                    className={`
                      absolute inset-0 bg-primary-400
                      ${isHorizontal ? 'origin-left' : 'origin-top'}
                    `}
                    initial={{ scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }}
                    animate={{ scaleX: 1, scaleY: 1 }}
                    transition={{ delay: index * 0.1 + 0.6, duration: 0.5 }}
                  />
                )}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressIndicator;