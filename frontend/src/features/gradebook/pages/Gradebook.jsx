import React, { useState } from 'react';
import { 
  Save, 
  Search, 
  Download, 
  Filter, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import CustomCard from '../../../components/custom/CustomCard';
import CustomButton from '../../../components/custom/CustomButton';
import CustomSelect from '../../../components/custom/CustomSelect';

const dummyGradingData = [
  { id: '1', name: 'Alice Smith', roll: '101', math: 85, science: 92, english: 88, history: 90, status: 'Draft' },
  { id: '2', name: 'Bob Johnson', roll: '102', math: 78, science: 80, english: 75, history: 82, status: 'Draft' },
  { id: '3', name: 'Charlie Brown', roll: '103', math: 92, science: 95, english: 94, history: 91, status: 'Submitted' },
  { id: '4', name: 'Diana Prince', roll: '104', math: 88, science: 89, english: 92, history: 95, status: 'Submitted' },
  { id: '5', name: 'Edward Norton', roll: '105', math: 65, science: 72, english: 68, history: 70, status: 'Draft' },
];

const Gradebook = () => {
  const [data, setData] = useState(dummyGradingData);
  const [selectedClass, setSelectedClass] = useState('10a');
  const [selectedExam, setSelectedExam] = useState('midterm');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkChange = (id, subject, value) => {
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    setData(prev => prev.map(s => s.id === id ? { ...s, [subject]: numValue } : s));
  };

  const getGrade = (mark) => {
    if (mark >= 90) return { label: 'A', color: '#059669' };
    if (mark >= 80) return { label: 'B', color: '#2563eb' };
    if (mark >= 70) return { label: 'C', color: '#d97706' };
    if (mark >= 60) return { label: 'D', color: '#9d174d' };
    return { label: 'F', color: '#ef4444' };
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Examination grades have been submitted successfully and locked for review.');
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Gradebook</h1>
          <p style={{ color: 'var(--text-muted)' }}>Enter and manage student grades for the current academic term.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <CustomButton variant="outline" icon={Download}>Export CSV</CustomButton>
          <CustomButton variant="primary" icon={Save} onClick={handleSubmit} isLoading={isSubmitting}>Submit All Grades</CustomButton>
        </div>
      </div>

      {/* Selectors */}
      <CustomCard shadow="sm" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <CustomSelect 
            label="Class"
            options={[
              { label: 'Grade 10-A', value: '10a' },
              { label: 'Grade 10-B', value: '10b' },
              { label: 'Grade 11-A', value: '11a' },
            ]}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          />
          <CustomSelect 
            label="Exam Type"
            options={[
              { label: 'Mid-Term Exam', value: 'midterm' },
              { label: 'Final Exam', value: 'final' },
              { label: 'Unit Test 1', value: 'test1' },
            ]}
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1.25rem' }}>
             <CustomButton variant="secondary" fullWidth icon={Search}>Fetch Students</CustomButton>
          </div>
        </div>
      </CustomCard>

      {/* Editable Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Roll</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Student Name</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mathematics</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Science</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>English</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>History</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>GPA</th>
              </tr>
            </thead>
            <tbody>
              {data.map((student) => {
                const avg = (student.math + student.science + student.english + student.history) / 4;
                const finalGrade = getGrade(avg);
                
                return (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-light)' }}>{student.roll}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>{student.name}</td>
                    
                    {['math', 'science', 'english', 'history'].map(sub => (
                      <td key={sub} style={{ padding: '0.75rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input 
                            type="number" 
                            value={student[sub]}
                            onChange={(e) => handleMarkChange(student.id, sub, e.target.value)}
                            style={{
                              width: '60px',
                              padding: '0.4rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.875rem',
                              textAlign: 'center',
                              outline: 'none'
                             }}
                          />
                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 700, 
                            color: getGrade(student[sub]).color,
                            width: '15px'
                          }}>
                            {getGrade(student[sub]).label}
                          </span>
                        </div>
                      </td>
                    ))}
                    
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700 }}>{avg.toFixed(1)}%</span>
                        <span className="badge" style={{ 
                          backgroundColor: finalGrade.color + '20', 
                          color: finalGrade.color,
                          border: `1px solid ${finalGrade.color}`
                        }}>
                          {finalGrade.label}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Gradebook;
