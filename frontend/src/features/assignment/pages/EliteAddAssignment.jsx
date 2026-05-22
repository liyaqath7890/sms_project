import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Save, 
  X, 
  ClipboardList, 
  Calendar, 
  BookOpen, 
  User, 
  FileText,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { ElitePageHeader } from '../../../components/elite';
import { dataManager } from '../../../services/dataManager';

const EliteAddAssignment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [courses, setCourses] = useState([]);
  
  const [form, setForm] = useState({ 
    title: '', 
    course: '', 
    dueDate: '', 
    description: '',
    totalMarks: '100',
    status: 'Active'
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await dataManager.getCourses();
        setCourses(data.courses || []);
        if (data.courses?.length > 0) {
          setForm(p => ({ ...p, course: data.courses[0].title }));
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = e => { 
    setForm(p => ({ ...p, [e.target.name]: e.target.value })); 
    setError(null); 
  };

  const validate = () => { 
    if (!form.title.trim()) return 'Assignment title is required.'; 
    if (!form.dueDate) return 'Due date is required.'; 
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
      await dataManager.createAssignment({ 
        ...form,
        subject: form.course,
        submissions: 0
      }); 
      setSuccess(true);
      setTimeout(() => navigate('/assignments'), 1500);
    } catch (err) { 
      setError(err.message || 'Failed to create assignment. Please try again.'); 
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Assignment Created!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to task list...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <ElitePageHeader 
        title="New Assignment" 
        subtitle="Configure academic tasks, set deadlines, and define evaluation criteria for your students."
        breadcrumbs={[{ label: 'Assignments', path: '/assignments' }, { label: 'Create Task' }]}
        actions={[
          { label: 'Back to List', icon: ArrowLeft, variant: 'secondary', onClick: () => navigate('/assignments') }
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
          
          {/* Main Form Section */}
          <div className="card-premium" style={{ gridColumn: 'span 8', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <ClipboardList size={20} className="text-primary" />
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Task Configuration</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Assignment Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} placeholder="e.g. Mid-term Research Paper" />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Course / Subject</label>
                <select name="course" value={form.course} onChange={handleChange} style={inputStyle}>
                  {courses.length > 0 ? courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>) : <option value="">Select a course</option>}
                </select>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Task Description & Instructions</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }} 
                  placeholder="Outline the assignment requirements, resources, and expectations..." 
                />
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card-premium" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Calendar size={20} className="text-primary" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Deadlines</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Due Date *</label>
                  <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>
            </div>

            <div className="card-premium" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <FileText size={20} className="text-info" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Evaluation</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Total Marks</label>
                  <input name="totalMarks" type="number" value={form.totalMarks} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Initial Status</label>
                  <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                    <option value="Active">Published (Active)</option>
                    <option value="Draft">Draft</option>
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
                {loading ? 'Processing...' : <><Save size={20} /> Publish Task</>}
              </button>
              
              <button 
                type="button"
                onClick={() => navigate('/assignments')}
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

export default EliteAddAssignment;
