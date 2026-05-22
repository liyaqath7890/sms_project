import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, XCircle, Clock, Download, Users, AlertCircle } from 'lucide-react';
import { ElitePageHeader, EliteTable, EliteStatCard } from '../../../components/elite';
import { useAcademicSession } from '../../../services/academicSessionContext';
import { apiService } from '../../../services/apiService';
import { dataManager } from '../../../services/dataManager';

const EliteAttendance = () => {
  const { currentStandard, currentDivision } = useAcademicSession();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsData, subjectsData] = await Promise.all([
          dataManager.getStudents({ standard: currentStandard, division: currentDivision, limit: 100 }),
          apiService.subjects?.getAll().catch(() => ({ subjects: [] }))
        ]);

        const studentList = studentsData.students || [];
        setStudents(studentList);

        const subjectList = subjectsData?.subjects || subjectsData || [];
        setSubjects(Array.isArray(subjectList) ? subjectList : []);
        if (Array.isArray(subjectList) && subjectList.length > 0 && !selectedSubject) {
          setSelectedSubject(subjectList[0].id);
        }

        // Load existing attendance for this date
        try {
          const existing = await apiService.attendance.getAll({ date: selectedDate });
          const existingMap = {};
          const records = existing?.attendance || existing || [];
          if (Array.isArray(records)) {
            records.forEach(r => { existingMap[r.student_id] = r.status; });
          }
          const initialAttendance = {};
          studentList.forEach(s => {
            initialAttendance[s.id] = existingMap[s.id] || 'present';
          });
          setAttendance(initialAttendance);
        } catch {
          const initialAttendance = {};
          studentList.forEach(s => { initialAttendance[s.id] = 'present'; });
          setAttendance(initialAttendance);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentStandard, currentDivision, selectedDate]);

  const handleSave = async () => {
    if (!selectedSubject) {
      setSaveMsg({ type: 'error', text: 'Please select a subject before saving.' });
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      const attendance_records = students.map(s => ({
        student_id: s.id,
        status: attendance[s.id] || 'present',
        remarks: ''
      }));

      await apiService.attendance.markAttendance({
        division_id: students[0]?.division_id || null,
        subject_id: selectedSubject,
        date: selectedDate,
        attendance_records
      });

      setSaveMsg({ type: 'success', text: `Attendance saved for ${selectedDate}!` });
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (err) {
      setSaveMsg({ type: 'error', text: err.response?.data?.error || 'Failed to save attendance.' });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Student Name',
      sortable: true,
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            {(value || '?').charAt(0)}
          </div>
          <span style={{ fontWeight: 600 }}>{value}</span>
        </div>
      )
    },
    { key: 'rollNumber', label: 'Roll No', sortable: true },
    {
      key: 'status',
      label: 'Attendance Status',
      render: (_, row) => {
        const status = attendance[row.id];
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['present', 'absent', 'late'].map(s => (
              <button
                key={s}
                onClick={(e) => { e.stopPropagation(); setAttendance(prev => ({ ...prev, [row.id]: s })); }}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${status === s ? (s === 'present' ? 'var(--success)' : s === 'absent' ? 'var(--danger)' : 'var(--warning)') : 'var(--border-color)'}`,
                  backgroundColor: status === s ? (s === 'present' ? 'rgba(16,185,129,0.1)' : s === 'absent' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)') : 'white',
                  color: status === s ? (s === 'present' ? 'var(--success)' : s === 'absent' ? 'var(--danger)' : 'var(--warning)') : 'var(--text-light)',
                  fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        );
      }
    }
  ];

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;
  const lateCount = Object.values(attendance).filter(v => v === 'late').length;
  const attendanceRate = students.length ? (((presentCount + lateCount * 0.5) / students.length) * 100).toFixed(1) : 0;

  return (
    <div style={{ padding: '2rem' }}>
      <ElitePageHeader
        title="Daily Attendance"
        subtitle={`Marking attendance for Grade ${currentStandard}-${currentDivision} on ${selectedDate}`}
        breadcrumbs={[{ label: 'Attendance' }, { label: 'Mark Attendance' }]}
        actions={[
          { label: saving ? 'Saving...' : 'Save Attendance', icon: CheckCircle2, variant: 'primary', onClick: handleSave },
          { label: 'Download Report', icon: Download, variant: 'secondary', onClick: () => {} }
        ]}
      />

      {saveMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem',
            backgroundColor: saveMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: saveMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
            border: `1px solid ${saveMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            fontWeight: 600 }}>
          {saveMsg.text}
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <EliteStatCard title="Total Enrolled" value={students.length} icon={Users} sparkData={[30,30,30,30,30,30,30]} />
        <EliteStatCard title="Present" value={presentCount} icon={CheckCircle2} color="success" sparkData={[25,28,24,27,26,28,presentCount]} />
        <EliteStatCard title="Absent" value={absentCount} icon={XCircle} color="danger" sparkData={[5,2,6,3,4,2,absentCount]} />
        <EliteStatCard title="Attendance Rate" value={`${attendanceRate}%`} icon={Clock} color="info" sparkData={[85,92,88,90,89,94,parseFloat(attendanceRate)]} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        <div style={{ gridColumn: 'span 8' }}>
          <EliteTable title="Student Roster" columns={columns} data={students} itemsPerPage={50} pagination={false} />
        </div>

        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card-premium">
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 700 }}>Attendance Settings</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Date</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '1rem', outline: 'none', backgroundColor: 'var(--bg-main)' }} />
              </div>

              {subjects.length > 0 && (
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Subject</label>
                  <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '1rem', outline: 'none', backgroundColor: 'var(--bg-main)' }}>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', gap: '0.75rem' }}>
                <AlertCircle size={20} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#92400e', lineHeight: 1.5 }}>
                  Saving will overwrite any existing attendance records for this date and subject.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliteAttendance;
