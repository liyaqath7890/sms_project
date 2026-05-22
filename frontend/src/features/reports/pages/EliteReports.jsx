import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  FileText, 
  Filter,
  Calendar,
  Layers,
  Award,
  ChevronRight
} from 'lucide-react';

import { ElitePageHeader, EliteStatCard } from '../../../components/elite';

const EliteReports = () => {
  const reportCategories = [
    { title: 'Academic Performance', desc: 'Detailed analysis of student grades, pass rates, and subject-wise performance.', icon: Award, color: 'var(--primary)' },
    { title: 'Attendance Analytics', desc: 'Track daily, weekly and monthly attendance trends across sections.', icon: Calendar, color: 'var(--info)' },
    { title: 'Financial Reports', desc: 'Fee collections, pending dues, and revenue projections for the session.', icon: TrendingUp, color: 'var(--success)' },
    { title: 'Staff Efficiency', desc: 'Faculty workload, subject coverage, and teaching performance metrics.', icon: BarChart3, color: 'var(--warning)' },
    { title: 'Enrollment Funnel', desc: 'Admission statistics, lead conversions, and demographic distributions.', icon: Layers, color: 'var(--danger)' },
    { title: 'Custom Export', desc: 'Generate custom data exports using advanced filters and field selections.', icon: Download, color: 'var(--text-muted)' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <ElitePageHeader 
        title="Intelligence & Reports" 
        subtitle="Comprehensive data analytics and enterprise-grade reporting for data-driven school management."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Reports' }]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <EliteStatCard title="Reports Generated" value="1,428" icon={FileText} sparkData={[1200, 1300, 1250, 1400, 1380, 1450, 1428]} trend="+8% vs last month" />
        <EliteStatCard title="Data Accuracy" value="99.9%" icon={PieChart} color="success" sparkData={[99, 99.5, 99.8, 99.7, 99.9, 99.9, 99.9]} trend="Verified" />
        <EliteStatCard title="Insights Shared" value="84" icon={TrendingUp} color="info" sparkData={[60, 65, 70, 75, 80, 84, 84]} trend="Actionable" />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '2rem' 
      }}>
        {reportCategories.map((cat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -8 }}
            className="card-premium"
            style={{ 
              display: 'flex', 
              gap: '1.5rem',
              cursor: 'pointer'
            }}
          >
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: cat.color + '15', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: cat.color,
              flexShrink: 0
            }}>
              <cat.icon size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)' }}>{cat.title}</h4>
              <p style={{ margin: '0.5rem 0 1.25rem 0', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{cat.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: 700 }}>
                Generate Report <ChevronRight size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Analytics Preview */}
      <div className="card-premium" style={{ marginTop: '3rem', padding: '2rem', backgroundImage: 'var(--grad-dark)', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>Automated Insights</h3>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8, fontSize: '0.9375rem', maxWidth: '600px' }}>
              Schedule automated PDF reports to be sent to stakeholders via email. Configure triggers based on academic milestones or financial targets.
            </p>
          </div>
          <button style={{ 
            padding: '1rem 2rem', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: 'white', 
            color: 'var(--primary)', 
            fontWeight: 800, 
            border: 'none',
            fontSize: '0.9375rem'
          }}>
            Configure Automation
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliteReports;
