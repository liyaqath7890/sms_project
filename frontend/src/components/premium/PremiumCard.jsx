import React from 'react';
import { motion } from 'framer-motion';

const PremiumCard = ({ 
  children, 
  gradient = false,
  interactive = false,
  badge,
  badgeColor = '#3b82f6',
  hover = true,
  ...props 
}) => {
  const variants = {
    rest: { y: 0, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)' },
    hover: { y: -4, boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)' }
  };

  const cardStyle = {
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    background: gradient 
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)'
      : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    position: 'relative',
    ...props.style
  };

  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover={hover ? 'hover' : 'rest'}
      variants={variants}
      style={cardStyle}
    >
      {badge && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: badgeColor,
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}
        >
          {badge}
        </motion.div>
      )}
      {children}
    </motion.div>
  );
};

export default PremiumCard;
