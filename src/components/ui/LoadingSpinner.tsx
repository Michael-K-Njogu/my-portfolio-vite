import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  messages?: string[];
  minHeight?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...',
  messages,
  minHeight = '60vh',
  size = 'md'
}) => {
  const sizeMap = {
    sm: 40,
    md: 60,
    lg: 80
  };
  
  const spinnerSize = sizeMap[size];
  const dotSize = size === 'sm' ? 8 : size === 'md' ? 12 : 16;
  
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // Randomize message when multiple values are provided
  const [selectedMessage, setSelectedMessage] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (Array.isArray(messages) && messages.length > 0) {
      const idx = Math.floor(Math.random() * messages.length);
      setSelectedMessage(messages[idx]);
    } else {
      setSelectedMessage(message);
    }
  }, [messages, message]);

  return (
    <motion.div
      className="loading-spinner-wrapper"
      style={{
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem'
      }}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Animated spinner circle */}
      <motion.div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          position: 'relative'
        }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
      >
        {/* Outer ring */}
        <svg
          width={spinnerSize}
          height={spinnerSize}
          viewBox={`0 0 ${spinnerSize} ${spinnerSize}`}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <circle
            cx={spinnerSize / 2}
            cy={spinnerSize / 2}
            r={spinnerSize / 2 - 2}
            fill="none"
            stroke="var(--bs-primary)"
            strokeWidth="3"
            strokeDasharray={`${Math.PI * (spinnerSize - 4) * 0.75} ${Math.PI * (spinnerSize - 4)}`}
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>

        {/* Inner dots */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            gap: dotSize / 2
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: 'var(--bs-primary)'
              }}
              animate={{
                scale: [0.8, 1, 0.8],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Loading message */}
      {(selectedMessage ?? message) && (
        <motion.p
          style={{
            margin: 0,
            color: 'var(--bs-secondary)',
            fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
            fontWeight: 500
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: [0.5, 1, 0.5],
            y: 0,
            transition: {
              opacity: {
                duration: 2,
                repeat: Infinity,
                // omit ease for TS compatibility
              },
              y: {
                duration: 0.4
              }
            }
          }}
        >
          {selectedMessage ?? message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;
