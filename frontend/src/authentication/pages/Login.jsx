import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { School, Mail, Lock, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import CustomInput from '../../components/custom/CustomInput';
import CustomButton from '../../components/custom/CustomButton';
import eduBg from '../../assets/edu_background_books_1775903560130.png';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'ifra@gmail.com',
      password: 'Ifra@123'
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
      setIsLoading(false);
    }
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
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
            style={{
              width: '64px', height: '64px',
              backgroundColor: 'var(--primary)',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            <School size={32} />
          </motion.div>
          <h1 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.5rem', fontWeight: 700 }}>Welcome Back</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Sign in to access your administrative panel</p>
        </div>

        {error && (
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: 'rgba(239, 68, 68, 0.2)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#fca5a5',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ color: 'white' }}>
            <CustomInput
              label="Email Address"
              type="email"
              icon={Mail}
placeholder="ifra@gmail.com"
              {...register('email')}
              error={errors.email?.message}
              autoComplete="email"
            />
            <CustomInput
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
              autoComplete="current-password"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/auth/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary-light)', fontWeight: 500 }}>
              Forgot Password?
            </Link>
          </div>

          <CustomButton 
            type="submit" 
            variant="primary" 
            fullWidth 
            size="lg"
            icon={LogIn}
            isLoading={isLoading}
          >
            Sign In
          </CustomButton>

          <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', marginTop: '1rem' }}>
            Don't have an account? {' '}
            <Link to="/auth/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
              Create Account
            </Link>
          </p>
          <div style={{ 
            backgroundColor: 'rgba(34, 197, 94, 0.2)', 
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#10b981',
            fontSize: '0.875rem',
            marginTop: '1rem',
            padding: '0.75rem',
            textAlign: 'center'
          }}>
            💡 <strong>Default Login:</strong> ifra@gmail.com / Ifra@123
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
