import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const attendanceData = [
  { name: 'Mon', value: 94 },
  { name: 'Tue', value: 92 },
  { name: 'Wed', value: 98 },
  { name: 'Thu', value: 95 },
  { name: 'Fri', value: 96 },
  { name: 'Sat', value: 85 },
];

const enrollmentData = [
  { name: 'Math', value: 120, color: '#4f46e5' },
  { name: 'Science', value: 98, color: '#10b981' },
  { name: 'History', value: 45, color: '#f59e0b' },
  { name: 'English', value: 110, color: '#0ea5e9' },
  { name: 'Arts', value: 65, color: '#ef4444' },
];

const ChartCard = ({ title, children }) => (
  <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
    <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>{title}</h3>
    <div style={{ flex: 1, width: '100%' }}>
      {children}
    </div>
  </div>
);

const DashboardCharts = () => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
      gap: '2rem',
      marginBottom: '2rem'
    }}>
      {/* Attendance Trend */}
      <ChartCard title="Attendance Trends (Weekly %)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="var(--primary)" 
              strokeWidth={3} 
              dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Course Enrollment */}
      <ChartCard title="Course Enrollments">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {enrollmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default DashboardCharts;
