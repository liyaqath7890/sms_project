import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  CalendarCheck, 
  FileCheck, 
  MessageSquare, 
  CreditCard, 
  Settings,
  PlusCircle,
  Users,
  BookOpen
} from 'lucide-react';

const actions = [
  { id: 1, label: 'Add Student', icon: UserPlus, color: '#4f46e5', bg: 'rgba(79, 70, 229, 0.1)', path: '/students/add' },
  { id: 2, label: 'Attendance', icon: CalendarCheck, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', path: '/attendance' },
  { id: 3, label: 'Mark Grades', icon: FileCheck, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', path: '/gradebook' },
  { id: 4, label: 'Send Notice', icon: MessageSquare, color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.1)', path: '/communication' },
  { id: 5, label: 'Collect Fee', icon: CreditCard, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)', path: '/enrollment' },
  { id: 6, label: 'Setup Class', icon: BookOpen, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', path: '/classroom' },
];

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="card-premium">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Quick Actions</h3>
        <button style={{ 
          fontSize: '0.875rem', 
          fontWeight: 600, 
          color: 'var(--primary)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.25rem' 
        }}>
          <Settings size={16} /> Manage
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {actions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.03, backgroundColor: 'var(--bg-main)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(action.path)}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'var(--transition)',
              backgroundColor: 'white'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: action.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: action.color
            }}>
              <action.icon size={22} />
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>

      <button style={{
        marginTop: '1.5rem',
        width: '100%',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--grad-primary)',
        color: 'white',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
      }}>
        <PlusCircle size={20} /> Create New Report
      </button>
    </div>
  );
};

export default QuickActions;
