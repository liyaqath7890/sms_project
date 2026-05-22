import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AIAnalyticsCard from '../../components/custom/AIAnalyticsCard';
import { PremiumCard, StatCard } from '../../components/premium';
import { Users, TrendingUp, CalendarCheck, BookOpen } from 'lucide-react';

const data = [{name:'G1',val:85},{name:'G2',val:78},{name:'G3',val:92},{name:'G4',val:88},{name:'G5',val:76}];
const pie = [{name:'A',v:30},{name:'B',v:45},{name:'C',v:20},{name:'D',v:5}];
const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444'];
const trend = [{m:'Jan',students:2500},{m:'Feb',students:2650},{m:'Mar',students:2800},{m:'Apr',students:2950},{m:'May',students:3100},{m:'Jun',students:3200}];

export default function GlobalAnalytics() {
  const [range, setRange] = useState('month');
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{padding:'2rem'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
        <div><h1 style={{fontSize:'2rem',fontWeight:700,color:'#1f2937',margin:0}}>Global Analytics</h1><p style={{color:'#6b7280',marginTop:4}}>School-wide performance and insights</p></div>
        <select value={range} onChange={e=>setRange(e.target.value)} style={{padding:'0.75rem 1rem',borderRadius:'var(--radius-md)',border:'1px solid #e5e7eb',fontSize:'0.95rem'}}>
          <option value="week">This Week</option><option value="month">This Month</option><option value="quarter">This Quarter</option><option value="year">This Year</option>
        </select>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1.5rem',marginBottom:'2rem'}}>
        <StatCard label="Total Students" value="3,200" icon={Users} color="#3b82f6" trend="+5%" />
        <StatCard label="Avg Attendance" value="94.2%" icon={CalendarCheck} color="#10b981" trend="+1.2%" />
        <StatCard label="Active Courses" value="42" icon={BookOpen} color="#f59e0b" />
        <StatCard label="Avg Performance" value="82.5%" icon={TrendingUp} color="#8b5cf6" trend="+3.4%" />
      </div>
      <div style={{marginBottom:'2rem'}}>
        <AIAnalyticsCard type="class" data={{classId:'global', grades:data.map(d=>({marks:d.val}))}} title="AI Global Performance Insights" />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'2rem',marginBottom:'2rem'}}>
        <PremiumCard><h3 style={{marginBottom:'1.5rem',color:'#1f2937',fontWeight:700}}>Performance by Grade</h3><ResponsiveContainer width="100%" height={250}><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="val" fill="#3b82f6" /></BarChart></ResponsiveContainer></PremiumCard>
        <PremiumCard><h3 style={{marginBottom:'1.5rem',color:'#1f2937',fontWeight:700}}>Grade Distribution</h3><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={pie} dataKey="v" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{pie.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></PremiumCard>
        <PremiumCard><h3 style={{marginBottom:'1.5rem',color:'#1f2937',fontWeight:700}}>Enrollment Trend</h3><ResponsiveContainer width="100%" height={250}><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Line type="monotone" dataKey="students" stroke="#10b981" strokeWidth={2} dot={{fill:'#10b981'}} /></LineChart></ResponsiveContainer></PremiumCard>
        <PremiumCard><h3 style={{marginBottom:'1.5rem',color:'#1f2937',fontWeight:700}}>Attendance Overview</h3><ResponsiveContainer width="100%" height={250}><BarChart data={[{name:'Present',v:94},{name:'Absent',v:4},{name:'Late',v:2}]}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="v" fill="#3b82f6" /></BarChart></ResponsiveContainer></PremiumCard>
      </div>
    </motion.div>
  );
}

