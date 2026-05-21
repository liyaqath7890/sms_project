import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Download, 
  Filter,
  Users,
  AlertCircle
} from 'lucide-react';

import { ElitePageHeader, EliteTable, EliteStatCard } from '../../../components/elite';
import { useAcademicSession } from '../../../services/academicSessionContext';
import { dataManager } from '../../../services/dataManager';

const EliteAttendance = () => {
  const { currentStandard, currentDivision } = useAcademicSession();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await dataManager.getStudents({
        standard: currentStandard,
        division: currentDivision
      });
      setStudents(data.students || []);
      
      // Initialize attendance state (mocking existing data)
      const initialAttendance = {};
      if (data.students && Array.isArray(data.students)) {
        data.students.forEach(s => {
          initialAttendance[s.id] = Math.random() > 0.1 ? 'present' : 'absent';
        });
      }
      setAttendance(initialAttendance);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentStandard, currentDivision, selectedDate]);

  const toggleAttendance = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present'
    }));
  };

  const columns = [
    {
      key: 'name',
      label: 'Student Name',
      sortable: true,
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--bg-main)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-muted)'
          }}>
            {value.charAt(0)}
          </div>
          <span style={{ fontWeight: 600 }}>{value}</span>
        </div>
      )
    },
    {
      key: 'rollNumber',
      label: 'Roll No',
      sortable: true
    },
    {
      key: 'status',
      label: 'Attendance Status',
      render: (_, row) => {
        const status = attendance[row.id];
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setAttendance(prev => ({ ...prev, [row.id]: 'present' })); }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid ' + (status === 'present' ? 'var(--success)' : 'var(--border-color)'),
                backgroundColor: status === 'present' ? 'rgba(16, 185, 129, 0.1)' : 'white',
                color: status === 'present' ? 'var(--success)' : 'var(--text-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                transition: 'var(--transition)'
              }}
            >
              <CheckCircle2 size={14} /> Present
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setAttendance(prev => ({ ...prev, [row.id]: 'absent' })); }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid ' + (status === 'absent' ? 'var(--danger)' : 'var(--border-color)'),
                backgroundColor: status === 'absent' ? 'rgba(239, 68, 68, 0.1)' : 'white',
                color: status === 'absent' ? 'var(--danger)' : 'var(--text-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                transition: 'var(--transition)'
              }}
            >
              <XCircle size={14} /> Absent
            </button>
          </div>
        );
      }
    }
  ];

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = students.length - presentCount;
  const attendanceRate = students.length ? ((presentCount / students.length) * 100).toFixed(1) : 0;

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
    alert('Attendance saved successfully!');
  };

  const headerActions = [
    { 
      label: saving ? 'Saving...' : 'Save Attendance', 
      icon: CheckCircle2, 
      variant: 'primary', 
      onClick: handleSave 
    },
    { 
      label: 'Download Report', 
      icon: Download, 
      variant: 'secondary', 
      onClick: () => console.log('Export') 
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <ElitePageHeader 
        title="Daily Attendance" 
        subtitle={`Marking attendance for Grade ${currentStandard}-${currentDivision} on ${selectedDate}`}
        breadcrumbs={[{ label: 'Attendance' }, { label: 'Mark Attendance' }]}
        actions={headerActions}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <EliteStatCard title="Total Enrolled" value={students.length} icon={Users} sparkData={[30, 30, 30, 30, 30, 30, 30]} />
        <EliteStatCard title="Present Today" value={presentCount} icon={CheckCircle2} color="success" sparkData={[25, 28, 24, 27, 26, 28, presentCount]} />
        <EliteStatCard title="Absent Today" value={absentCount} icon={XCircle} color="danger" sparkData={[5, 2, 6, 3, 4, 2, absentCount]} />
        <EliteStatCard title="Attendance Rate" value={`${attendanceRate}%`} icon={Clock} color="info" sparkData={[85, 92, 88, 90, 89, 94, attendanceRate]} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        <div style={{ gridColumn: 'span 8' }}>
          <EliteTable 
            title="Student Roster" 
            columns={columns} 
            data={students} 
            itemsPerPage={50} 
            pagination={false}
          />
        </div>
        
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card-premium">
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 700 }}>Select Date</h3>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '1rem',
                outline: 'none',
                backgroundColor: 'var(--bg-main)'
              }}
            />
            <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', gap: '0.75rem' }}>
              <AlertCircle size={20} className="text-warning" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#92400e', lineHeight: 1.5 }}>
                Attendance for this date has already been marked. Any changes will overwrite the existing records.
              </p>
            </div>
          </div>

          <div className="card-premium" style={{ backgroundImage: 'var(--grad-dark)', color: 'white', border: 'none' }}>
            <h3 style={{ color: 'white', fontSize: '1.125rem' }}>Attendance Trend</h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>
              Grade {currentStandard} attendance is up 2.4% compared to the same period last month.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                <div style={{ width: '94%', height: '100%', backgroundColor: 'white', borderRadius: '2px' }} />
              </div>
              <span style={{ fontWeight: 800 }}>94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliteAttendance;
