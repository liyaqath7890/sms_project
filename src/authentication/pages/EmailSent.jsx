import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MailCheck, ArrowRight } from 'lucide-react';
import CustomButton from '../../components/custom/CustomButton';
import eduBg from '../../assets/edu_background_books_1775903560130.png';

const EmailSent = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${eduBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '2rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: '450px',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#10b981',
            borderRadius: 'var(--radius-md)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}
        >
          <MailCheck size={32} />
        </motion.div>

        <h1 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.5rem', fontWeight: 700 }}>
          Check your email
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem' }}>
          We've sent a password reset link to your email address. Please follow the instructions to reset your password.
        </p>

        <CustomButton
          onClick={() => window.open('https://gmail.com', '_blank')}
          fullWidth
          size="lg"
        >
          Open Email App
        </CustomButton>

        <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          Didn't receive the email?{' '}
          <Link to="/auth/forgot-password" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>
            Click to resend
          </Link>
        </p>

        <Link 
          to="/auth/login" 
          style={{ 
            marginTop: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'white'}
          onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
        >
          Back to Login
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
};

export default EmailSent;
