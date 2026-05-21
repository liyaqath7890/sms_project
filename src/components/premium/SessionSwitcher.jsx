import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, BookOpen } from 'lucide-react';
import { useAcademicSession } from '../../services/academicSessionContext';
import PremiumCard from './PremiumCard';

const SessionSwitcher = () => {
  const {
    sessions,
    currentSession,
    currentStandard,
    currentDivision,
    switchSession,
    switchStandard,
    switchDivision,
    getStandards,
    getDivisionsForStandard,
    getSessionStatusColor
  } = useAcademicSession();

  const [openDropdown, setOpenDropdown] = useState(null);

  const standards = getStandards();
  const divisions = getDivisionsForStandard(currentStandard);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  const DropdownMenu = ({ title, items, value, onSelect, type }) => (
    <motion.div
      variants={itemVariants}
      style={{ position: 'relative' }}
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpenDropdown(openDropdown === type ? null : type)}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '2px solid #e5e7eb',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontWeight: 600,
          color: '#1f2937',
          fontSize: '0.875rem',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = '#3b82f6';
          e.target.style.backgroundColor = '#f0f9ff';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = '#e5e7eb';
          e.target.style.backgroundColor = 'white';
        }}
      >
        <span>{title}: <span style={{ color: '#3b82f6' }}>{value}</span></span>
        <motion.div
          animate={{ rotate: openDropdown === type ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {openDropdown === type && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderRadius: 'var(--radius-md)',
              border: '2px solid #e5e7eb',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 50,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }}
          >
            {items.map((item, idx) => (
              <motion.button
                key={idx}
                whileHover={{ backgroundColor: '#f0f9ff' }}
                onClick={() => {
                  onSelect(item);
                  setOpenDropdown(null);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: value === item ? '#3b82f6' : '#1f2937',
                  fontWeight: value === item ? 700 : 500,
                  fontSize: '0.875rem',
                  borderLeft: value === item ? '4px solid #3b82f6' : '4px solid transparent'
                }}
              >
                {item}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PremiumCard
        gradient
        style={{ marginBottom: '1.5rem' }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Calendar size={20} style={{ color: '#3b82f6' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
              Academic Session & Class
            </h3>
          </div>

          {/* Session Selector */}
          <motion.div variants={itemVariants} style={{ marginBottom: '1rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', margin: 0, marginBottom: '0.5rem' }}>
                Session
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
              {sessions.map((session) => (
                <motion.button
                  key={session.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => switchSession(session.id)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: currentSession.id === session.id ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    backgroundColor: currentSession.id === session.id ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    fontWeight: currentSession.id === session.id ? 700 : 500,
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: getSessionStatusColor(session.status) }}>
                    ●
                  </span>
                  <span>{session.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Standard Selector */}
          <motion.div variants={itemVariants} style={{ marginBottom: '1rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', margin: 0, marginBottom: '0.5rem' }}>
                Standard
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              {standards.map((std) => (
                <motion.button
                  key={std.number}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => switchStandard(std.number)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: currentStandard === std.number ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    backgroundColor: currentStandard === std.number 
                      ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                      : 'white',
                    color: currentStandard === std.number ? 'white' : '#1f2937',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {std.number}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Division Selector */}
          <motion.div variants={itemVariants}>
            <div style={{ marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', margin: 0, marginBottom: '0.5rem' }}>
                Division
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${divisions.length}, 1fr)`, gap: '0.75rem' }}>
              {divisions.map((div) => (
                <motion.button
                  key={div}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => switchDivision(div)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: currentDivision === div ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    backgroundColor: currentDivision === div ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    fontWeight: currentDivision === div ? 700 : 500,
                    fontSize: '1rem',
                    color: '#1f2937',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {div}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Info Bar */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e5e7eb'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Status</p>
            <p style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: getSessionStatusColor(currentSession.status),
              margin: '0.25rem 0 0 0',
              textTransform: 'capitalize'
            }}>
              {currentSession.status}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Year</p>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', margin: '0.25rem 0 0 0' }}>
              {currentSession.year}
            </p>
          </div>
        </motion.div>
      </PremiumCard>
    </motion.div>
  );
};

export default SessionSwitcher;
