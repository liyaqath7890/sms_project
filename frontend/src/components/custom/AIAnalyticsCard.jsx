import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Loader2
} from 'lucide-react';
import { analyzeStudentPerformance, analyzeAttendancePattern, analyzeClassPerformance } from '../../services/aiService';

const AIAnalyticsCard = ({ 
  type = 'student', 
  data, 
  title = 'AI Analysis',
  icon: Icon = Brain 
}) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const runAnalysis = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let result;
        switch (type) {
          case 'student':
            result = await analyzeStudentPerformance(data.studentId, data.grades);
            break;
          case 'attendance':
            result = await analyzeAttendancePattern(data.studentId, data.attendance);
            break;
          case 'class':
            result = await analyzeClassPerformance(data.classId, data.grades);
            break;
          default:
            result = null;
        }
        setAnalysis(result);
      } catch (err) {
        setError('Analysis failed');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (data) {
      runAnalysis();
    }
  }, [type, data]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
      case 'improving':
        return '#10b981';
      case 'good':
      case 'stable':
        return '#3b82f6';
      case 'concerning':
      case 'declining':
        return '#f59e0b';
      case 'high risk':
      case 'at risk':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
      case 'improving':
        return <CheckCircle size={16} />;
      case 'good':
      case 'stable':
        return <Info size={16} />;
      case 'concerning':
      case 'declining':
        return <AlertTriangle size={16} />;
      case 'high risk':
      case 'at risk':
        return <AlertTriangle size={16} />;
      default:
        return <Brain size={16} />;
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ 
            padding: '10px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            borderRadius: '10px' 
          }}>
            <Icon size={20} color="white" />
          </div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{title}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
          <Loader2 size={24} className="spin" style={{ color: '#667eea' }} />
          <span style={{ marginLeft: '10px', color: '#666' }}>Analyzing data...</span>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div style={{
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ 
            padding: '10px', 
            background: '#f3f4f6', 
            borderRadius: '10px' 
          }}>
            <Icon size={20} color="#666" />
          </div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{title}</h3>
        </div>
        <p style={{ color: '#666', textAlign: 'center' }}>No analysis data available</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ 
          padding: '10px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          borderRadius: '10px' 
        }}>
          <Icon size={20} color="white" />
        </div>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{title}</h3>
      </div>

      {/* Main Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {analysis.averageScore && (
          <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>Average Score</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#333' }}>
              {analysis.averageScore}%
            </p>
          </div>
        )}
        {analysis.attendanceRate && (
          <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>Attendance Rate</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#333' }}>
              {analysis.attendanceRate}
            </p>
          </div>
        )}
        {analysis.classAverage && (
          <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>Class Average</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#333' }}>
              {analysis.classAverage}%
            </p>
          </div>
        )}
        {analysis.gpa && (
          <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>GPA</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#333' }}>
              {analysis.gpa}
            </p>
          </div>
        )}
      </div>

      {/* Status Badge */}
      {(analysis.trend || analysis.status || analysis.riskLevel) && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: `${getStatusColor(analysis.trend || analysis.status || analysis.riskLevel)}15`,
          color: getStatusColor(analysis.trend || analysis.status || analysis.riskLevel),
          marginBottom: '16px'
        }}>
          {getStatusIcon(analysis.trend || analysis.status || analysis.riskLevel)}
          <span style={{ fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>
            {analysis.trend || analysis.status || analysis.riskLevel}
          </span>
        </div>
      )}

      {/* Recommendations */}
      {(analysis.recommendations?.length > 0 || analysis.suggestions?.length > 0 || analysis.recommendedActions?.length > 0) && (
        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 600, color: '#333' }}>
            AI Recommendations
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {(analysis.recommendations || analysis.suggestions || analysis.recommendedActions || []).map((item, idx) => (
              <li key={idx} style={{ marginBottom: '6px', fontSize: '13px', color: '#666' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Stats */}
      {analysis.topPerformers !== undefined && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #eee'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>Top Performers</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#10b981' }}>
              {analysis.topPerformers}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>Need Support</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#ef4444' }}>
              {analysis.needsSupport}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalyticsCard;