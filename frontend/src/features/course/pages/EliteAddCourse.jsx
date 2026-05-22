import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Save, 
  X, 
  BookOpen, 
  Layers, 
  Clock, 
  User, 
  FileText,
  ArrowLeft,
  CheckCircle2,
  Globe,
  Award
} from 'lucide-react';

import { ElitePageHeader } from '../../../components/elite';
import { dataManager } from '../../../services/dataManager';

const EliteAddCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({ 
    title: '', 
    subject: '', 
    category: 'Mathematics', 
    instructor: '', 
    duration: '', 
    description: '',
    syllabus: '',
    status: 'Active'
  });

  const categories = ['Mathematics', 'Science', 'Languages', 'Arts', 'Computer Science'];

  const handleChange = e => { 
    setForm(p => ({ ...p, [e.target.name]: e.target.value })); 
    setError(null); 
  };

  const validate = () => { 
    if (!form.title.trim()) return 'Course title is required.'; 
    if (!form.instructor.trim()) return 'Instructor name is required.'; 
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
      await dataManager.createCourse({ 
        ...form, 
        name: form.title, // Map title to name for consistency
        academicYear: '2024-25'
      }); 
      setSuccess(true);
      setTimeout(() => navigate('/courses'), 1500);
    } catch (err) { 
      setError(err.message || 'Failed to create course. Please try again.'); 
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Course Created Successfully!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to curriculum...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <ElitePageHeader 
        title="Course Creation" 
        subtitle="Design and launch a new academic course with structured modules and instructor assignment."
        breadcrumbs={[{ label: 'Courses', path: '/courses' }, { label: 'New Course' }]}
        actions={[
          { label: 'Back to List', icon: ArrowLeft, variant: 'secondary', onClick: () => navigate('/courses') }
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
          
          {/* Main Form Section */}
          <div className="card-premium" style={{ gridColumn: 'span 8', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <BookOpen size={20} className="text-primary" />
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Course Details</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Course Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} placeholder="e.g. Advanced Quantum Physics" />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange} style={inputStyle} placeholder="e.g. Physics" />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} 
                  placeholder="Provide a comprehensive overview of what students will learn..." 
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', marginTop: '3rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <Layers size={20} className="text-info" />
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Syllabus & Modules</h3>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Syllabus Outline</label>
              <textarea 
                name="syllabus" 
                value={form.syllabus} 
                onChange={handleChange} 
                style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }} 
                placeholder="List the key modules and learning objectives..." 
              />
            </div>
          </div>

          {/* Sidebar Section */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card-premium" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <User size={20} className="text-primary" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Faculty Assignment</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Lead Instructor *</label>
                  <input name="instructor" value={form.instructor} onChange={handleChange} required style={inputStyle} placeholder="e.g. Dr. Jane Smith" />
                </div>
              </div>
            </div>

            <div className="card-premium" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Clock size={20} className="text-info" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Parameters</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Duration (Hours)</label>
                  <input name="duration" value={form.duration} onChange={handleChange} style={inputStyle} placeholder="e.g. 120" />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Status</label>
                  <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
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
                {loading ? 'Processing...' : <><Save size={20} /> Create Course</>}
              </button>
              
              <button 
                type="button"
                onClick={() => navigate('/courses')}
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

export default EliteAddCourse;
