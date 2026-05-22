import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomDrawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width = '500px' 
}) => {
  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              cursor: 'pointer'
            }}
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: width,
              maxWidth: '100vw', // Allow full width on mobile
              backgroundColor: 'white',
              boxShadow: '-10px 0 25px rgba(0, 0, 0, 0.1)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                style={{
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-light)',
                  cursor: 'pointer',
                  display: 'flex',
                  transition: 'var(--transition)'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '2rem',
              backgroundColor: 'var(--bg-main)'
            }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomDrawer;
