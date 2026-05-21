import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { School, User, Mail, Lock, UserPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CustomInput from '../../components/custom/CustomInput';
import CustomButton from '../../components/custom/CustomButton';
import eduBg from '../../assets/edu_background_students_1775903579125.png';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(formData);
      // After registration, usually redirect to dashboard (which AuthProvider does automatically on state update)
      // or redirect to login. In our context, register sets the user state.
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.5rem', fontWeight: 700 }}>Create Account</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Join EduStream to start managing your school</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ color: 'white' }}>
            <CustomInput
              label="Full Name"
              name="name"
              icon={User}
              placeholder="Admin Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <CustomInput
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              placeholder="admin@school.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <CustomInput
                label="Password"
                name="password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <CustomInput
                label="Confirm"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
            <input type="checkbox" required id="terms" />
            <label htmlFor="terms" style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <CustomButton 
            type="submit" 
            variant="primary" 
            fullWidth 
            size="lg"
            icon={UserPlus}
            isLoading={isLoading}
          >
            Create Admin Account
          </CustomButton>

          <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', marginTop: '1rem' }}>
            Already have an account? {' '}
            <Link to="/auth/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
