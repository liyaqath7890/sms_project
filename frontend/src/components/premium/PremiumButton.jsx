import React from 'react';
import { motion } from 'framer-motion';

const PremiumButton = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: {
      bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      text: 'white',
      hover: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      shadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
    },
    secondary: {
      bg: 'rgba(255, 255, 255, 0.1)',
      text: 'white',
      hover: 'rgba(255, 255, 255, 0.2)',
      shadow: '0 4px 15px rgba(255, 255, 255, 0.1)'
    },
    success: {
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      text: 'white',
      hover: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      shadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
    },
    danger: {
      bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      text: 'white',
      hover: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      shadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
    }
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' }
  };

  const style = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{
        ...sizeStyle,
        background: style.bg,
        color: style.text,
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        boxShadow: style.shadow,
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.target.style.background = style.hover;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.target.style.background = style.bg;
      }}
      {...props}
    >
      {isLoading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '1rem',
            height: '1rem',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%'
          }}
        />
      )}
      {!isLoading && Icon && <Icon size={20} />}
      <span>{children}</span>
    </motion.button>
  );
};

export default PremiumButton;
