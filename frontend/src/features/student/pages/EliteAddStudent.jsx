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
  Calendar, 
  Hash, 
  Users,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

import { ElitePageHeader } from '../../../components/elite';
import { dataManager } from '../../../services/dataManager';

const EliteAddStudent = () => {
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
    rollNumber: '', 
    dateOfBirth: '', 
    address: '', 
    parentName: '', 
    parentPhone: '', 
    admissionDate: new Date().toISOString().split('T')[0] 
  });

  const handleChange = e => { 
    setForm(p => ({ ...p, [e.target.name]: e.target.value })); 
    setError(null); 
  };

  const validate = () => { 
    if (!form.firstName.trim() || !form.lastName.trim()) return 'First and last names are required.'; 
    if (!form.rollNumber.trim()) return 'Roll number is required.'; 
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email address.'; 
    return null; 
  };

  const handleSubmit = async e => { 
    e.preventDefault(); 
    const err = validate(); 
    if (err) { 
      setError(err); 
      return; 
    } 

    try { 
      setLoading(true); 
      await dataManager.createStudent({ 
        ...form, 
        name: `${form.firstName} ${form.lastName}`, 
        admissionNumber: `ADM${Date.now().toString().slice(-6)}` 
      }); 
      setSuccess(true);
      setTimeout(() => navigate('/students'), 1500);
    } catch (err) { 
      const isNetworkError = !err.response && (err.message === 'Network Error' || err.code === 'ERR_NETWORK');
      setError(isNetworkError 
        ? 'Network Error: Please ensure the mock server is running (npm run mock-server)' 
        : (err.response?.data?.message || err.message || 'Failed to create student. Please try again.'));
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Student Added Successfully!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to directory...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <ElitePageHeader 
        title="Student Registration" 
        subtitle="Onboard a new student into the academic system with full profile details."
        breadcrumbs={[{ label: 'Students', path: '/students' }, { label: 'New Registration' }]}
        actions={[
          { label: 'Back to List', icon: ArrowLeft, variant: 'secondary', onClick: () => navigate('/students') }
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
          
          {/* Main Form Section */}
          <div className="card-premium" style={{ gridColumn: 'span 8', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <User size={20} className="text-primary" />
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Personal Information</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>First Name *</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} placeholder="e.g. Aarav" />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Last Name *</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required style={inputStyle} placeholder="e.g. Sharma" />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Date of Birth</label>
                <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', marginTop: '3rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <Users size={20} className="text-info" />
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Guardian Details</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Parent/Guardian Name</label>
                <input name="parentName" value={form.parentName} onChange={handleChange} style={inputStyle} placeholder="Full name" />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Guardian Phone</label>
                <input name="parentPhone" value={form.parentPhone} onChange={handleChange} style={inputStyle} placeholder="+91 00000 00000" />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', marginTop: '3rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <MapPin size={20} className="text-warning" />
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Address</h3>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Residential Address</label>
              <textarea 
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
                placeholder="Enter full residential address..." 
              />
            </div>
          </div>

          {/* Sidebar Section */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card-premium" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Hash size={20} className="text-primary" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Academic Info</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Roll Number *</label>
                  <input name="rollNumber" value={form.rollNumber} onChange={handleChange} required style={inputStyle} placeholder="e.g. 101" />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Admission Date</label>
                  <input name="admissionDate" type="date" value={form.admissionDate} onChange={handleChange} style={inputStyle} />
                </div>
              </div>
            </div>

            <div className="card-premium" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Mail size={20} className="text-info" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Contact Settings</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Student Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="student@school.com" />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Student Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} placeholder="+91 00000 00000" />
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
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
                onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {loading ? 'Processing...' : <><Save size={20} /> Register Student</>}
              </button>
              
              <button 
                type="button"
                onClick={() => navigate('/students')}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  backgroundColor: 'white', 
                  color: 'var(--text-muted)', 
                  border: '1px solid var(--border-color)', 
                  fontWeight: 700, 
                  fontSize: '0.9375rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EliteAddStudent;
