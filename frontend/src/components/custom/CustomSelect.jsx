import React from 'react';

const CustomSelect = ({ 
  label, 
  options, 
  value, 
  onChange, 
  error, 
  required = false,
  name
}) => {
  return (
    <div className="custom-select-group" style={{ marginBottom: '1.25rem', width: '100%' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          fontSize: '0.875rem', 
          fontWeight: 600, 
          color: 'var(--text-main)', 
          marginBottom: '0.5rem',
          textAlign: 'left'
        }}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`,
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'var(--transition)',
            backgroundColor: 'white',
            appearance: 'none',
            cursor: 'pointer'
          }}
          className="custom-select"
        >
          <option value="" disabled>Select option...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Custom Arrow */}
        <div style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: 'var(--text-light)',
          display: 'flex'
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 4L6 8L10 4" />
          </svg>
        </div>
      </div>

      {error && (
        <p style={{ 
          color: 'var(--danger)', 
          fontSize: '0.75rem', 
          marginTop: '0.25rem',
          textAlign: 'left',
          fontWeight: 500
        }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomSelect;
