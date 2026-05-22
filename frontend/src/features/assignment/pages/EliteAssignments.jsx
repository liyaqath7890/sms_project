import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Search,
  MoreVertical,
  ChevronRight
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { ElitePageHeader, EliteTable, EliteStatCard } from '../../../components/elite';
import { dataManager } from '../../../services/dataManager';

const EliteAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await dataManager.getAssignments();
      setAssignments(data.assignments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const columns = [
    {
      key: 'title',
      label: 'Assignment Title',
      sortable: true,
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: 'var(--primary-light)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <FileText size={20} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>{value}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.course || row.subject || 'Mathematics'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <Calendar size={14} className="text-muted" />
          <span style={{ fontWeight: 600 }}>{value || '2024-05-15'}</span>
        </div>
      )
    },
    {
      key: 'submissions',
      label: 'Submissions',
      render: (value) => {
        const rate = value || Math.floor(Math.random() * 30) + 70; // Use actual value if present
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden', minWidth: '100px' }}>
              <div style={{ width: `${rate}%`, height: '100%', backgroundColor: 'var(--success)', borderRadius: '3px' }} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{rate}%</span>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const status = value || (Math.random() > 0.5 ? 'Active' : 'Closed');
        return (
          <span className={`badge ${status === 'Active' ? 'badge-success' : 'badge-danger'}`} style={{ opacity: 0.9 }}>
            {status}
          </span>
        );
      }
    }
  ];

  const headerActions = [
    { label: 'Create Assignment', icon: Plus, variant: 'primary', onClick: () => navigate('/assignments/add') },
    { label: 'Bulk Grade', icon: ClipboardList, variant: 'secondary', onClick: () => console.log('Grade') }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <ElitePageHeader 
        title="Assignments & Tasks" 
        subtitle="Manage student submissions, track deadlines, and provide interactive feedback for all academic tasks."
        breadcrumbs={[{ label: 'Academics' }, { label: 'Assignments' }]}
        actions={headerActions}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <EliteStatCard title="Active Tasks" value={assignments.length || 18} icon={ClipboardList} sparkData={[15, 17, 16, 18, 19, 18, 18]} trend="4 due this week" />
        <EliteStatCard title="Submission Rate" value="92.4%" icon={CheckCircle2} color="success" sparkData={[88, 90, 91, 89, 93, 92, 92]} trend="+2.1% improvement" />
        <EliteStatCard title="Pending Review" value="45" icon={Clock} color="warning" sparkData={[30, 35, 40, 38, 42, 45, 45]} trend="High workload" />
        <EliteStatCard title="Overdue Items" value="8" icon={AlertCircle} color="danger" sparkData={[12, 10, 8, 9, 7, 8, 8]} trend="-15% decrease" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        <div style={{ gridColumn: 'span 8' }}>
          <EliteTable 
            title="Assignment Registry" 
            columns={columns} 
            data={assignments} 
            itemsPerPage={12} 
          />
        </div>
        
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card-premium" style={{ backgroundImage: 'var(--grad-dark)', color: 'white', border: 'none' }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.125rem' }}>AI Grading Assistant</h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>
              Our AI has analyzed 124 submissions today. Average sentiment is positive with high concept clarity across Mathematics.
            </p>
            <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                <span>AI Confidence Rate</span>
                <span>94%</span>
              </div>
              <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '94%', height: '100%', backgroundColor: 'white', borderRadius: '2px' }} />
              </div>
            </div>
          </div>

          <div className="card-premium">
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.125rem', fontWeight: 700 }}>Upcoming Deadlines</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'Calculus Quiz', date: 'Tomorrow', color: 'var(--danger)' },
                { title: 'History Essay', date: 'In 3 days', color: 'var(--warning)' },
                { title: 'Physics Lab', date: 'In 5 days', color: 'var(--info)' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-main)' }}>
                  <div style={{ width: '4px', height: '32px', backgroundColor: item.color, borderRadius: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due: {item.date}</p>
                  </div>
                  <ChevronRight size={14} className="text-muted" />
                </div>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'white' }}>
              View All Deadlines
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliteAssignments;
