import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const CustomInput = React.forwardRef(({ 
  label, 
  type = 'text', 
  placeholder, 
  error, 
  required = false,
  icon: Icon,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="custom-input-group" style={{ marginBottom: '1.25rem', width: '100%' }}>
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
        {Icon && (
          <div style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-light)',
            display: 'flex'
          }}>
            <Icon size={18} />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          {...props}
          style={{
            width: '100%',
            padding: `0.75rem ${isPassword ? '2.5rem' : '1rem'} 0.75rem ${Icon ? '2.75rem' : '1rem'}`,
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`,
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'var(--transition)',
            backgroundColor: 'white'
          }}
          className="custom-input"
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary)';
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border-color)';
            if (props.onBlur) props.onBlur(e);
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-light)',
              display: 'flex',
              padding: 0
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
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
});

export default CustomInput;
