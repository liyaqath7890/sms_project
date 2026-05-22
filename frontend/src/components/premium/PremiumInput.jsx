import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PremiumInput = ({ 
  label, 
  placeholder,
  icon: Icon,
  error,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {label && (
        <motion.label
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: error ? '#ef4444' : '#1f2937',
            cursor: 'pointer'
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
        </motion.label>
      )}

      <motion.div
        animate={{
          borderColor: error 
            ? '#ef4444' 
            : isFocused 
            ? '#3b82f6' 
            : '#e5e7eb',
          boxShadow: error
            ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
            : isFocused
            ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
            : 'none'
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: 'var(--radius-md)',
          border: '2px solid #e5e7eb',
          paddingLeft: Icon ? '0.75rem' : '1rem',
          backgroundColor: disabled ? '#f3f4f6' : 'white',
          transition: 'all 0.3s ease'
        }}
      >
        {Icon && (
          <motion.div
            animate={{ color: isFocused ? '#3b82f6' : '#9ca3af' }}
            style={{ marginRight: '0.5rem' }}
          >
            <Icon size={20} />
          </motion.div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: 'none',
            outline: 'none',
            fontSize: '1rem',
            backgroundColor: 'transparent',
            color: '#1f2937',
            fontFamily: 'inherit'
          }}
          {...props}
        />
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: '#ef4444'
          }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default PremiumInput;
