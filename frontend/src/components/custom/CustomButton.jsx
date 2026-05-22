import React from 'react';

const CustomButton = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon
}) => {
  const getStyles = () => {
    let baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      borderRadius: 'var(--radius-md)',
      fontWeight: 600,
      transition: 'var(--transition)',
      width: fullWidth ? '100%' : 'auto',
      opacity: (disabled || isLoading) ? 0.6 : 1,
      cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
      fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem',
      padding: size === 'sm' ? '0.4rem 0.8rem' : size === 'lg' ? '0.8rem 1.5rem' : '0.6rem 1.2rem',
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyles, backgroundColor: 'var(--primary)', color: 'white' };
      case 'secondary':
        return { ...baseStyles, backgroundColor: 'var(--primary-light)', color: 'var(--primary)' };
      case 'outline':
        return { ...baseStyles, backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)' };
      case 'danger':
        return { ...baseStyles, backgroundColor: '#fee2e2', color: '#ef4444' };
      case 'ghost':
        return { ...baseStyles, backgroundColor: 'transparent', color: 'var(--text-muted)' };
      default:
        return baseStyles;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={getStyles()}
      onMouseOver={(e) => {
        if (!disabled && !isLoading) {
          if (variant === 'primary') e.target.style.backgroundColor = 'var(--primary-hover)';
          if (variant === 'outline') e.target.style.borderColor = 'var(--primary)';
        }
      }}
      onMouseOut={(e) => {
        if (!disabled && !isLoading) {
          if (variant === 'primary') e.target.style.backgroundColor = 'var(--primary)';
          if (variant === 'outline') e.target.style.borderColor = 'var(--border-color)';
        }
      }}
    >
      {isLoading ? (
        <span className="loader" style={{ 
          width: '16px', 
          height: '16px', 
          border: '2px solid currentColor', 
          borderBottomColor: 'transparent', 
          borderRadius: '50%', 
          display: 'inline-block',
          animation: 'rotate 1s linear infinite'
        }}></span>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : 18} />}
          {children}
        </>
      )}
    </button>
  );
};

export default CustomButton;
