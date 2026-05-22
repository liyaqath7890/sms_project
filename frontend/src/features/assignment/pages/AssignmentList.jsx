import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Book, 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import CustomTable from '../../../components/custom/CustomTable';
import CustomButton from '../../../components/custom/CustomButton';
import CustomDrawer from '../../../components/custom/CustomDrawer';
import CustomCard from '../../../components/custom/CustomCard';
import SubmitAssignment from './SubmitAssignment';

const dummyAssignments = [
  { id: '1', title: 'Calculus Problem Set 4', course: 'Adv. Mathematics', dueDate: '2026-04-12', status: 'Active', submissions: 24 },
  { id: '2', title: 'Newtonian Laws Essay', course: 'General Physics', dueDate: '2026-04-15', status: 'Draft', submissions: 0 },
  { id: '3', title: 'Shakespeare Analysis', course: 'English Lit.', dueDate: '2026-04-10', status: 'Submitted', submissions: 42 },
  { id: '4', title: 'WWII Research Paper', course: 'Modern History', dueDate: '2026-04-20', status: 'Active', submissions: 12 },
];

const AssignmentList = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Assignments</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage student tasks, deadlines, and submissions.</p>
        </div>
        <CustomButton variant="primary" icon={Plus} onClick={() => setDrawerOpen(true)}>Create Assignment</CustomButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {dummyAssignments.map(asgn => (
          <CustomCard key={asgn.id} title={asgn.title} shadow="sm">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Course:</span>
                <span style={{ fontWeight: 600 }}>{asgn.course}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Due Date:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: asgn.status === 'Active' ? 'var(--danger)' : 'inherit' }}>
                  <Clock size={14} />
                  <span>{asgn.dueDate}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <span className={`badge badge-${asgn.status === 'Active' ? 'primary' : asgn.status === 'Submitted' ? 'success' : 'secondary'}`}>
                  {asgn.status}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{asgn.submissions} Submissions</span>
              </div>
              <CustomButton variant="outline" size="sm" fullWidth>View Details</CustomButton>
            </div>
          </CustomCard>
        ))}
      </div>

      <CustomDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Create New Assignment"
        width="550px"
      >
        <SubmitAssignment onSuccess={() => setDrawerOpen(false)} />
      </CustomDrawer>
    </div>
  );
};

export default AssignmentList;
