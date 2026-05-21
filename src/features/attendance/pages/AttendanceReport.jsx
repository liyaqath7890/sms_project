import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Filter, Download, Calendar } from 'lucide-react';
import CustomCard from '../../../components/custom/CustomCard';
import CustomButton from '../../../components/custom/CustomButton';

const summaryData = [
  { name: '10-A', present: 95 },
  { name: '10-B', present: 88 },
  { name: '11-A', present: 92 },
  { name: '11-B', present: 94 },
  { name: '12-A', present: 97 },
];

const pieData = [
  { name: 'Present', value: 92, color: 'var(--success)' },
  { name: 'Absent', value: 5, color: 'var(--danger)' },
  { name: 'Late', value: 3, color: 'var(--warning)' },
];

const trendData = [
  { day: 'Mon', percentage: 94 },
  { day: 'Tue', percentage: 92 },
  { day: 'Wed', percentage: 98 },
  { day: 'Thu', percentage: 95 },
  { day: 'Fri', percentage: 96 },
];

const AttendanceReport = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Attendance Report</h1>
          <p style={{ color: 'var(--text-muted)' }}>Comprehensive overview of student attendance across all classes.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <CustomButton variant="outline" icon={Download}>Export Report</CustomButton>
          <CustomButton variant="outline" icon={Calendar}>Today</CustomButton>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Pie Summary */}
        <CustomCard title="Today's Summary" shadow="sm" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
            {pieData.map(d => (
              <div key={d.name} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{d.name}</p>
                <p style={{ fontWeight: 700, margin: 0 }}>{d.value}%</p>
              </div>
            ))}
          </div>
        </CustomCard>

        {/* Weekly Trend */}
        <CustomCard title="Weekly Trend (%)" shadow="sm" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[80, 100]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
              />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="var(--primary)" 
                strokeWidth={3} 
                dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CustomCard>
      </div>

      {/* Class Comparison */}
      <CustomCard title="Attendance by Class (%)" shadow="sm" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={summaryData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 100]} />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
            />
            <Bar dataKey="present" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CustomCard>
    </div>
  );
};

export default AttendanceReport;
