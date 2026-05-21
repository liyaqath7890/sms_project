import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  BookOpen, 
  TrendingUp, 
  Download, 
  FileText, 
  Search,
  Star,
  CheckCircle,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

import { ElitePageHeader, EliteTable, EliteStatCard } from '../../../components/elite';
import AIAnalyticsCard from '../../../components/custom/AIAnalyticsCard';
import { useAcademicSession } from '../../../services/academicSessionContext';
import { dataManager } from '../../../services/dataManager';

const EliteGradebook = () => {
  const { currentStandard, currentDivision } = useAcademicSession();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const data = await dataManager.getStudents({
        standard: currentStandard,
        division: currentDivision
      });
      
      // Mocking grade data
      const gradedStudents = (data.students || []).map(s => ({
        ...s,
        grades: {
          Mathematics: Math.floor(Math.random() * 40) + 60,
          Science: Math.floor(Math.random() * 30) + 70,
          English: Math.floor(Math.random() * 20) + 80
        }
      }));
      setStudents(gradedStudents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [currentStandard, currentDivision]);

  const columns = [
    {
      key: 'name',
      label: 'Student',
      sortable: true,
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: 'var(--bg-main)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: 800,
            color: 'var(--primary)'
          }}>
            {value.charAt(0)}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700 }}>{value}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roll: {row.rollNumber}</p>
          </div>
        </div>
      )
    },
    {
      key: 'grades',
      label: 'Score',
      sortable: true,
      render: (grades) => {
        const score = grades?.[selectedSubject] || 0;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ 
              fontSize: '1rem', 
              fontWeight: 800, 
              color: score >= 90 ? 'var(--success)' : score >= 75 ? 'var(--primary)' : 'var(--warning)',
              minWidth: '35px'
            }}>
              {score}
            </span>
            <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden', minWidth: '80px' }}>
              <div style={{ 
                width: `${score}%`, 
                height: '100%', 
                backgroundColor: score >= 90 ? 'var(--success)' : score >= 75 ? 'var(--primary)' : 'var(--warning)',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        );
      }
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (_, row) => {
        const score = row.grades?.[selectedSubject] || 0;
        let g = 'F';
        let color = 'badge-danger';
        if (score >= 90) { g = 'A+'; color = 'badge-success'; }
        else if (score >= 80) { g = 'A'; color = 'badge-success'; }
        else if (score >= 70) { g = 'B'; color = 'badge-info'; }
        else if (score >= 60) { g = 'C'; color = 'badge-warning'; }
        
        return <span className={`badge ${color}`}>{g}</span>;
      }
    },
    {
      key: 'rank',
      label: 'Performance',
      render: (_, row) => {
        const score = row.grades?.[selectedSubject] || 0;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: score >= 90 ? '#f59e0b' : 'var(--text-light)' }}>
            <Star size={16} fill={score >= 90 ? '#f59e0b' : 'none'} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{score >= 90 ? 'Elite' : score >= 75 ? 'Strong' : 'Average'}</span>
          </div>
        );
      }
    }
  ];

  const avgScore = students.length ? (students.reduce((sum, s) => sum + (s.grades?.[selectedSubject] || 0), 0) / students.length).toFixed(1) : 0;
  const topScore = students.length ? Math.max(...students.map(s => s.grades?.[selectedSubject] || 0)) : 0;
  const passingCount = students.filter(s => (s.grades?.[selectedSubject] || 0) >= 60).length;

  const headerActions = [
    { label: 'Enter Marks', icon: FileText, variant: 'primary', onClick: () => console.log('Enter Marks') },
    { label: 'Bulk Report Cards', icon: Download, variant: 'secondary', onClick: () => console.log('Export') }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <ElitePageHeader 
        title="Gradebook & Results" 
        subtitle={`Managing academic performance for Grade ${currentStandard}-${currentDivision} | ${selectedSubject}`}
        breadcrumbs={[{ label: 'Academics' }, { label: 'Gradebook' }]}
        actions={headerActions}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <EliteStatCard title="Average Score" value={avgScore} icon={TrendingUp} sparkData={[68, 72, 70, 75, 73, 76, avgScore]} trend="+2.4% vs last exam" />
        <EliteStatCard title="Highest Score" value={topScore} icon={Star} color="warning" sparkData={[92, 95, 94, 98, 96, 99, topScore]} trend="New High!" />
        <EliteStatCard title="Passing Rate" value={`${((passingCount/students.length)*100).toFixed(1)}%`} icon={CheckCircle} color="success" sparkData={[85, 88, 86, 90, 89, 92, 91]} trend="Stable" />
        <EliteStatCard title="Active Courses" value="8" icon={BookOpen} color="info" sparkData={[8, 8, 8, 8, 8, 8, 8]} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        <div style={{ gridColumn: 'span 9' }}>
          <EliteTable 
            title={`Subject Grades: ${selectedSubject}`}
            columns={columns} 
            data={students} 
            itemsPerPage={15} 
          />
        </div>
        
        <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card-premium">
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 700 }}>Select Subject</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Mathematics', 'Science', 'English', 'History', 'Geography'].map(sub => (
                <button 
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid ' + (selectedSubject === sub ? 'var(--primary)' : 'var(--border-color)'),
                    backgroundColor: selectedSubject === sub ? 'var(--primary-light)' : 'white',
                    color: selectedSubject === sub ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: 700,
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'var(--transition)'
                  }}
                >
                  {sub}
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>

          <AIAnalyticsCard 
            type="class" 
            data={{ students, subject: selectedSubject }} 
            title="AI Result Prediction" 
          />
          
          <div className="card-premium" style={{ backgroundImage: 'var(--grad-info)', color: 'white', border: 'none' }}>
            <h4 style={{ margin: 0, color: 'white' }}>Academic Status</h4>
            <p style={{ fontSize: '0.8125rem', opacity: 0.9, marginTop: '0.5rem' }}>
              Final exams are approaching. Syllabus for {selectedSubject} is 92% complete.
            </p>
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              NEXT EXAM: 12th MAY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliteGradebook;
