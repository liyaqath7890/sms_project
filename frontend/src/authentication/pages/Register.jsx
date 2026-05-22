import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
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
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildRegisterPayload = () => {
    const [firstName, ...restName] = formData.name.trim().split(/\s+/);

    return {
      firstName: firstName || 'Admin',
      lastName: restName.join(' ') || 'User',
      email: formData.email.trim(),
      password: formData.password,
      role: 'admin'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await register(buildRegisterPayload());
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.request) {
        setError('Cannot reach backend API. Make sure the backend server is running on http://localhost:3001.');
      } else {
        setError('Account creation failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#fca5a5',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

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
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <CustomInput
                label="Confirm"
                name="confirmPassword"
                type="password"
                icon={Lock}
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
            Already have an account?{' '}
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
