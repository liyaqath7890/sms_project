import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import CustomInput from '../../components/custom/CustomInput';
import CustomButton from '../../components/custom/CustomButton';
import eduBg from '../../assets/edu_background_books_1775903560130.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/email-sent');
    }, 1500);
  };

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
            backgroundColor: 'var(--primary)',
            borderRadius: 'var(--radius-md)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}
        >
          <KeyRound size={32} />
        </motion.div>

        <h1 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.5rem', fontWeight: 700 }}>
          Forgot Password?
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem' }}>
          No worries, we'll send you reset instructions.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ color: 'white' }}>
            <CustomInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <CustomButton
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
          >
            Reset Password
          </CustomButton>
        </form>

        <Link 
          to="/auth/login" 
          style={{ 
            marginTop: '2rem', 
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
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
