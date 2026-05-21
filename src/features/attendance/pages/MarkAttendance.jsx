import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  Calendar,
  Save,
  CheckSquare
} from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CustomCard from '../../../components/custom/CustomCard';
import CustomSelect from '../../../components/custom/CustomSelect';

const dummyStudents = [
  { id: '1', name: 'Alice Smith', roll: '101', status: 'present' },
  { id: '2', name: 'Bob Johnson', roll: '102', status: 'present' },
  { id: '3', name: 'Charlie Brown', roll: '103', status: 'present' },
  { id: '4', name: 'Diana Prince', roll: '104', status: 'present' },
  { id: '5', name: 'Edward Norton', roll: '105', status: 'present' },
  { id: '6', name: 'Fiona Gallagher', roll: '106', status: 'present' },
  { id: '7', name: 'George Miller', roll: '107', status: 'present' },
  { id: '8', name: 'Hannah Baker', roll: '108', status: 'present' },
];

const MarkAttendance = () => {
  const [students, setStudents] = useState(dummyStudents);
  const [selectedClass, setSelectedClass] = useState('10a');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [isSaving, setIsSaving] = useState(false);

  const toggleStatus = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const markAll = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Attendance for Grade 10-A has been saved successfully!');
    }, 1200);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'var(--success)';
      case 'absent': return 'var(--danger)';
      case 'late': return 'var(--warning)';
      default: return 'var(--text-light)';
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Mark Attendance</h1>
          <p style={{ color: 'var(--text-muted)' }}>Daily attendance tracking for your assigned classes.</p>
        </div>
        <CustomButton variant="primary" icon={Save} onClick={handleSave} isLoading={isSaving}>Save Attendance</CustomButton>
      </div>

      {/* Filters */}
      <CustomCard shadow="sm" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
          <CustomSelect 
            label="Select Class"
            options={[
              { label: 'Grade 10-A', value: '10a' },
              { label: 'Grade 10-B', value: '10b' },
              { label: 'Grade 11-A', value: '11a' },
            ]}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          />
          <div style={{ marginBottom: '1.25rem' }}>
             <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Attendance Date</label>
             <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-color)', outline: 'none'
              }}
             />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <CustomButton variant="secondary" size="sm" onClick={() => markAll('present')}>Mark All Present</CustomButton>
            <CustomButton variant="outline" size="sm" onClick={() => markAll('absent')}>Mark All Absent</CustomButton>
          </div>
        </div>
      </CustomCard>

      {/* Attendance Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
        {students.map((student) => (
          <div key={student.id} 
            className="card" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              borderLeft: `4px solid ${getStatusColor(student.status)}`
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', width: '30px' }}>
                {student.roll}
              </div>
              <p style={{ fontWeight: 600, margin: 0 }}>{student.name}</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => toggleStatus(student.id, 'present')}
                style={{ 
                  color: student.status === 'present' ? 'var(--success)' : 'var(--text-light)',
                  transition: 'var(--transition)'
                }}
              >
                <CheckCircle2 size={24} fill={student.status === 'present' ? '#d1fae5' : 'transparent'} />
              </button>
              <button 
                onClick={() => toggleStatus(student.id, 'late')}
                style={{ 
                  color: student.status === 'late' ? 'var(--warning)' : 'var(--text-light)',
                  transition: 'var(--transition)'
                }}
              >
                <Clock size={24} fill={student.status === 'late' ? '#fef3c7' : 'transparent'} />
              </button>
              <button 
                onClick={() => toggleStatus(student.id, 'absent')}
                style={{ 
                  color: student.status === 'absent' ? 'var(--danger)' : 'var(--text-light)',
                  transition: 'var(--transition)'
                }}
              >
                <XCircle size={24} fill={student.status === 'absent' ? '#fee2e2' : 'transparent'} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarkAttendance;
