import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  Users, 
  UserSquare2, 
  MapPin, 
  Settings, 
  ChevronRight,
  Layout,
  Grid,
  Plus
} from 'lucide-react';

import { ElitePageHeader, EliteStatCard } from '../../../components/elite';

const EliteClassroom = () => {
  const sections = [
    { name: 'Grade 5-A', students: 32, teacher: 'Dr. Sarah Wilson', room: '302', performance: 'Excellent' },
    { name: 'Grade 5-B', students: 28, teacher: 'Prof. John Doe', room: '102', performance: 'Good' },
    { name: 'Grade 6-A', students: 35, teacher: 'Ms. Emily Blunt', room: '205', performance: 'Excellent' },
    { name: 'Grade 6-B', students: 30, teacher: 'Mr. David Miller', room: '206', performance: 'Average' },
    { name: 'Grade 7-A', students: 31, teacher: 'Dr. Robert Brown', room: 'Lab 1', performance: 'Good' },
    { name: 'Grade 7-B', students: 29, teacher: 'Ms. Clara Oswald', room: 'Lab 2', performance: 'Good' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <ElitePageHeader 
        title="Classroom Management" 
        subtitle="Organize sections, allocate physical spaces, and manage class-wise academic performance."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Classroom' }]}
        actions={[
          { label: 'Add New Section', icon: Plus, variant: 'primary', onClick: () => {} },
          { label: 'Manage Rooms', icon: Settings, variant: 'secondary', onClick: () => {} }
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <EliteStatCard title="Total Sections" value={sections.length} icon={Layers} sparkData={[6, 6, 6, 6, 6, 6, 6]} />
        <EliteStatCard title="Avg Class Size" value="31" icon={Users} color="info" sparkData={[28, 30, 32, 29, 31, 31, 31]} trend="Optimal" />
        <EliteStatCard title="Occupancy Rate" value="92%" icon={Layout} color="success" sparkData={[85, 88, 90, 89, 91, 92, 92]} trend="+4% vs last year" />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
        gap: '2rem' 
      }}>
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="card-premium"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem',
              borderLeft: `4px solid ${idx % 3 === 0 ? 'var(--primary)' : idx % 3 === 1 ? 'var(--info)' : 'var(--success)'}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{section.name}</h4>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Room {section.room}</p>
              </div>
              <span style={{ 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                padding: '4px 8px', 
                borderRadius: '4px', 
                backgroundColor: 'var(--bg-main)', 
                color: section.performance === 'Excellent' ? 'var(--success)' : 'var(--primary)',
                textTransform: 'uppercase'
              }}>
                {section.performance}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Students</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.125rem', fontWeight: 800 }}>{section.students}</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Session</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.125rem', fontWeight: 800 }}>2024-25</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem' }}>
                {section.teacher.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 700 }}>{section.teacher}</p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)' }}>Class Teacher</p>
              </div>
              <button style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: 'none', backgroundColor: 'var(--bg-main)', cursor: 'pointer' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}

        {/* Add New Section Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '2rem', 
            borderRadius: 'var(--radius-lg)', 
            border: '2px dashed var(--border-color)', 
            backgroundColor: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            minHeight: '280px'
          }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', marginBottom: '1rem' }}>
            <Plus size={24} />
          </div>
          <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--text-muted)' }}>Create New Section</h4>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8125rem', color: 'var(--text-light)', textAlign: 'center' }}>Define a new grade and section for the upcoming session.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default EliteClassroom;
