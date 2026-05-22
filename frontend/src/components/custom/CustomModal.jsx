import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import CustomButton from './CustomButton';

const CustomModal = ({
  isOpen,
  title,
  onClose,
  onSave,
  children,
  size = 'md',
  fullWidth = false
}) => {
  const sizeMap = {
    sm: '400px',
    md: '500px',
    lg: '700px',
    xl: '900px'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 999
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: fullWidth ? 'calc(100% - 2rem)' : sizeMap[size],
              maxWidth: 'calc(100vw - 2rem)',
              maxHeight: 'calc(100vh - 4rem)',
              overflowY: 'auto',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              zIndex: 1000
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                margin: 0
              }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{
              padding: '1.5rem'
            }}>
              {children}
            </div>

            {/* Footer */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--border-color)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-main)';
                }}
              >
                Cancel
              </button>
              <CustomButton
                onClick={onSave}
              >
                Save Changes
              </CustomButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;
