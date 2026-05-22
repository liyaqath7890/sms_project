import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  icon: Icon,
  fullWidth = false,
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sizeStyles = {
    sm: { padding: '0.5rem 0.75rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1rem', fontSize: '0.95rem' },
    lg: { padding: '1rem 1.25rem', fontSize: '1rem' }
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div style={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--text-main)',
          textTransform: 'capitalize'
        }}>
          {label}
        </label>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...sizeStyles[size],
          width: fullWidth ? '100%' : 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'var(--bg-main)',
          border: `1px solid ${isOpen ? 'var(--primary)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          color: 'var(--text-main)',
          fontWeight: 500
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        {Icon && <Icon size={18} />}
        <span>{selectedOption?.label || 'Select...'}</span>
        <ChevronDown 
          size={18} 
          style={{
            marginLeft: 'auto',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.5rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            zIndex: 1000,
            boxShadow: 'var(--shadow-lg)',
            maxHeight: '280px',
            overflowY: 'auto',
            minWidth: '200px'
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                textAlign: 'left',
                backgroundColor: value === option.value ? 'var(--primary-light)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: value === option.value ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: value === option.value ? 600 : 400,
                transition: 'background-color 0.2s',
                borderBottom: '1px solid var(--border-color)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--bg-main)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = value === option.value ? 'var(--primary-light)' : 'transparent';
              }}
            >
              {option.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CustomDropdown;
