import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  PlayCircle, 
  Clock, 
  Users, 
  Star, 
  Filter, 
  Search, 
  ChevronRight,
  Layout,
  Layers,
  GraduationCap,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ElitePageHeader, EliteStatCard } from '../../../components/elite';
import { dataManager } from '../../../services/dataManager';

const EliteCourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await dataManager.getCourses();
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const categories = ['All', 'Mathematics', 'Science', 'Languages', 'Arts', 'Computer Science'];

  const filteredCourses = activeCategory === 'All' 
    ? courses 
    : courses.filter(c => (c.category === activeCategory || c.subject === activeCategory));

  return (
    <div style={{ padding: '2rem' }}>
      <ElitePageHeader 
        title="Learning Management" 
        subtitle="Explore and manage the academic curriculum with Khan Academy-style interactive course tracking."
        breadcrumbs={[{ label: 'Academics' }, { label: 'Courses' }]}
        actions={[
          { label: 'Add Course', icon: Plus, variant: 'primary', onClick: () => navigate('/courses/add') }
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <EliteStatCard title="Active Courses" value={courses.length || 24} icon={BookOpen} sparkData={[20, 22, 24, 23, 24, 25, 24]} trend="+2 this month" />
        <EliteStatCard title="Total Lessons" value="384" icon={PlayCircle} color="info" sparkData={[350, 360, 370, 375, 380, 384, 384]} trend="8 new modules" />
        <EliteStatCard title="Avg Engagement" value="88%" icon={Users} color="success" sparkData={[82, 85, 84, 86, 87, 89, 88]} trend="+4% increase" />
        <EliteStatCard title="Syllabus Progress" value="64%" icon={Layers} color="warning" sparkData={[40, 45, 50, 55, 60, 64, 64]} trend="On track" />
      </div>

      {/* Category Filter & Search */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeCategory === cat ? 'var(--primary)' : 'white',
                color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                border: '1px solid ' + (activeCategory === cat ? 'var(--primary)' : 'var(--border-color)'),
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            placeholder="Search courses or lessons..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'white',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Course Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '2rem' 
      }}>
        {filteredCourses.length > 0 ? filteredCourses.map((course, idx) => (
          <motion.div
            key={course.id || idx}
            whileHover={{ y: -8 }}
            className="card-premium"
            style={{ padding: 0, overflow: 'hidden' }}
          >
            <div style={{ 
              height: '180px', 
              backgroundColor: 'var(--bg-main)', 
              position: 'relative',
              backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80\u0026w=800)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '12px', 
                right: '12px', 
                backgroundColor: 'rgba(255,255,255,0.9)', 
                padding: '4px 8px', 
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--primary)'
              }}>
                {course.category || 'General'}
              </div>
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', gap: '4px' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600 }}>
                  <Clock size={10} style={{ marginRight: '4px' }} /> 12h 45m
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)' }}>{course.title || 'Advanced Mathematics'}</h4>
              <p style={{ margin: '0.5rem 0 1.25rem 0', fontSize: '0.875rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {course.description || 'Master the concepts of calculus, algebra and statistics with interactive problem-solving modules.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {course.instructor?.charAt(0) || 'P'}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{course.instructor || 'Dr. Sarah Wilson'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>4.9</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Class Progress</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{Math.floor(Math.random() * 40) + 50}%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', backgroundColor: 'var(--primary)', borderRadius: '3px' }} />
                </div>
              </div>

              <button style={{ 
                width: '100%', 
                padding: '0.875rem', 
                borderRadius: 'var(--radius-md)', 
                backgroundColor: 'var(--bg-main)', 
                color: 'var(--text-main)', 
                fontWeight: 700, 
                fontSize: '0.875rem', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-main)'; e.currentTarget.style.color = 'var(--text-main)'; }}
              >
                Continue Learning <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )) : (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', backgroundColor: 'white', borderRadius: 'var(--radius-lg)' }}>
            <BookOpen size={48} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
            <h3 style={{ margin: 0 }}>No courses found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EliteCourseList;
