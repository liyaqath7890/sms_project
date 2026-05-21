import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Briefcase,
  Award,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

import { ElitePageHeader } from '../../../components/elite';
import { apiService } from '../../../services/apiService';

const EliteAddTeacher = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    gender: 'Male', 
    designation: 'Senior Faculty', 
    subject: '', 
    experience: '',
    address: '', 
    joiningDate: new Date().toISOString().split('T')[0] 
  });

  const handleChange = e => { 
    setForm(p => ({ ...p, [e.target.name]: e.target.value })); 
    setError(null); 
  };

  const handleSubmit = async e => { 
    e.preventDefault(); 
    if (!form.firstName.trim() || !form.lastName.trim() || !form.subject.trim()) {
      setError('Required fields are missing.');
      return;
    }

    try { 
      setLoading(true); 
      await apiService.teachers.create({ 
        ...form, 
        name: `${form.firstName} ${form.lastName}`,
        teacherId: `TCH${Date.now().toString().slice(-4)}`
      }); 
      setSuccess(true);
      setTimeout(() => navigate('/teachers'), 1500);
    } catch (err) { 
      setError(err.message || 'Failed to register teacher.'); 
    } finally { 
      setLoading(false); 
    } 
  };

  const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
  const labelStyle = { fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.025em' };
  const inputStyle = { 
    width: '100%', 
    padding: '0.875rem 1rem', 
    borderRadius: 'var(--radius-md)', 
    border: '1px solid var(--border-color)', 
    backgroundColor: 'var(--bg-main)', 
    fontSize: '0.9375rem', 
    color: 'var(--text-main)',
    outline: 'none',
    transition: 'var(--transition)'
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1.5rem' }}
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Faculty Registered Successfully!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Updating directory...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <ElitePageHeader 
        title="Faculty Onboarding" 
        subtitle="Add a new educator to the institution and define their academic specialization."
        breadcrumbs={[{ label: 'Teachers', path: '/teachers' }, { label: 'New Faculty' }]}
        actions={[
          { label: 'Back to Directory', icon: ArrowLeft, variant: 'secondary', onClick: () => navigate('/teachers') }
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
          
          <div className="card-premium" style={{ gridColumn: 'span 8', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <User size={20} className="text-primary" />
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Basic Information</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>First Name *</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} placeholder="First name" />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Last Name *</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required style={inputStyle} placeholder="Last name" />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="teacher@school.com" />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} placeholder="+91 00000 00000" />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', marginTop: '3rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <MapPin size={20} className="text-warning" />
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Address</h3>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Current Address</label>
              <textarea 
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
                placeholder="Enter full residential address..." 
              />
            </div>
          </div>

          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card-premium" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Briefcase size={20} className="text-primary" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Professional Info</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Specialization *</label>
                  <input name="subject" value={form.subject} onChange={handleChange} required style={inputStyle} placeholder="e.g. Mathematics" />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Designation</label>
                  <input name="designation" value={form.designation} onChange={handleChange} style={inputStyle} placeholder="e.g. HOD" />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Experience (Years)</label>
                  <input name="experience" type="number" value={form.experience} onChange={handleChange} style={inputStyle} placeholder="0" />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 600, border: '1px solid rgba(239, 68, 68, 0.2)' }}
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)', 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                border: 'none', 
                fontWeight: 800, 
                fontSize: '1rem', 
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
                transition: 'var(--transition)'
              }}
            >
              {loading ? 'Processing...' : <><Save size={20} /> Register Teacher</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EliteAddTeacher;
