const fs = require('fs');
const path = require('path');

function write(f, c) {
  fs.mkdirSync(path.dirname(f), {recursive:true});
  fs.writeFileSync(f, c);
  console.log('Wrote', f);
}

// 1. StudentProfile
write('src/features/student/pages/StudentProfile.jsx', `import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/apiService';
import AIAnalyticsCard from '../../../components/custom/AIAnalyticsCard';

export default function StudentProfile() {
  const { id } = useParams();
  const nav = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiService.students.getById(id), apiService.grades.getByStudent(id)])
      .then(([s, g]) => { setStudent(s); setGrades(g.grades||[]); })
      .finally(()=>setLoading(false));
  }, [id]);

  if (loading) return <div style={{padding:'2rem'}}>Loading...</div>;
  if (!student) return <div style={{padding:'2rem'}}>Student not found</div>;

  const avg = grades.length>0 ? (grades.reduce((a,g)=>a+(g.marks||0),0)/grades.length).toFixed(1):0;

  return (
    <div style={{padding:'2rem'}}>
      <button onClick={()=>nav('/students')} style={{color:'#3b82f6',border:'none',background:'none',cursor:'pointer'}}>Back</button>
      <div style={{background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',borderRadius:16,padding:'2rem',color:'white',margin:'1.5rem 0'}}>
        <h1 style={{margin:0,fontSize:24,fontWeight:700}}>{student.first_name} {student.last_name}</h1>
        <p>Roll: {student.admission_number}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:24}}>
        {[
          {l:'Avg Grade',v:avg+'%',c:'#3b82f6'},
          {l:'Subjects',v:grades.length,c:'#10b981'},
          {l:'Email',v:student.email||'N/A',c:'#f59e0b'}
        ].map(x=><div key={x.l} style={{background:'white',padding:'1rem',borderRadius:12,border:'1px solid #e5e7eb'}}>
          <p style={{color:'#6b7280',fontSize:12}}>{x.l}</p>
          <p style={{fontSize:20,fontWeight:700,color:x.c}}>{x.v}</p>
        </div>)}
      </div>
      <AIAnalyticsCard type="student" data={{studentId:id,grades}} title="AI Insights" />
      <div style={{background:'white',padding:'1.5rem',borderRadius:12,border:'1px solid #e5e7eb',marginTop:24}}>
        <h3>Grade History</h3>
        {grades.length===0 ? <p>No grades yet</p> : (
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'2px solid #e5e7eb'}}>
              <th style={th}>Subject</th><th style={th}>Marks</th><th style={th}>Grade</th><th style={th}>Term</th>
            </tr></thead>
            <tbody>{grades.map((g,i)=><tr key={i} style={{borderBottom:'1px solid #f3f4f6'}}>
              <td style={td}>{g.course_name}</td><td style={td}>{g.marks}</td><td style={td}>{g.grade}</td><td style={td}>{g.term}</td>
            </tr>)}</tbody>
          </table>
        )}
      </div>
  );
}
const th={textAlign:'left',padding:'0.75rem',color:'#6b7280',fontSize:14};
const td={padding:'0.75rem'};
`);

// 2. AddTeacher
write('src/features/teacher/pages/AddTeacher.jsx', `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/apiService';

export default function AddTeacher() {
  const nav = useNavigate();
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', subject:'', qualification:'', experienceYears:'' });
  const handle = e => setForm(p => ({...p, [e.target.name]: e.target.value }));
  const submit = async e => {
    e.preventDefault();
    await apiService.teachers.create({ ...form, name: form.firstName+' '+form.lastName, employeeId: 'EMP'+Date.now() });
    nav('/teachers');
  };
  return (
    <div style={{padding:'2rem',maxWidth:800,margin:'0 auto'}}>
      <h1 style={{fontSize:28,fontWeight:700}}>Add New Teacher</h1>
      <form onSubmit={submit} style={{display:'grid',gap:'1rem',marginTop:'1.5rem'}}>
        <input name="firstName" placeholder="First Name" onChange={handle} required style={in} />
        <input name="lastName" placeholder="Last Name" onChange={handle} required style={in} />
        <input name="email" type="email" placeholder="Email" onChange={handle} style={in} />
        <input name="phone" placeholder="Phone" onChange={handle} style={in} />
        <input name="subject" placeholder="Subject" onChange={handle} required style={in} />
        <input name="qualification" placeholder="Qualification" onChange={handle} style={in} />
        <input name="experienceYears" type="number" placeholder="Experience (Years)" onChange={handle} style={in} />
        <button type="submit" style={{...in,background:'#3b82f6',color:'white',cursor:'pointer',fontWeight:600}}>Save Teacher</button>
      </form>
    </div>
  );
}
const in = {width:'100%',padding:'0.75rem',border:'1px solid #e5e7eb',borderRadius:8,fontSize:15,outline:'none'};
`);

// 3. Timetable
write('src/features/schedule/pages/Timetable.jsx', `import React, { useState } from 'react';
const days = ['Mon','Tue','Wed','Thu','Fri','Sat'];
const times = ['8:00','8:45','9:30','10:30','11:15','12:00','1:30'];
const subs = ['Math','Eng','Sci','Hin','Soc','Comp','PE','Art'];
const schedule = days.map(d => times.map((t,i) => subs[(i+days.indexOf(d))%subs.length]));

export default function Timetable() {
  const [cls, setCls] = useState('5A');
  return (
    <div style={{padding:'2rem'}}>
      <h1 style={{fontSize:28,fontWeight:700}}>Timetable</h1>
      <select value={cls} onChange={e=>setCls(e.target.value)} style={{marginTop:16,padding:8,borderRadius:8}}>
        {[5,6,7,8,9,10].map(g=>['A','B','C'].map(d=><option key={g+d} value={g+d}>Grade {g}-{d}</option>))}
      </select>
      <div style={{overflowX:'auto',marginTop:24}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
          <thead>
            <tr style={{background:'#f3f4f6'}}>
              <th style={th2}>Day/Time</th>
              {times.map(t=><th key={t} style={th2}>{t}</th>)}
            </tr>
          </thead>
          <tbody>
            {days.map((d,i)=><tr key={d} style={{borderBottom:'1px solid #e5e7eb'}}>
              <td style={{...td2,fontWeight:700,background:'#f9fafb'}}>{d}</td>
              {schedule[i].map((s,j)=><td key={j} style={{...td2,background:'#'+['dbeafe','d1fae5','fce7f3','fef3c7','e0e7ff'][j%5]}}>{s}</td>)}
            </tr>)}
          </tbody>
        </table>
      </div>
  );
}
const th2={padding:'0.75rem',textAlign:'left',fontSize:12,color:'#6b7280',borderBottom:'2px solid #e5e7eb'};
const td2={padding:'0.75rem',fontSize:13};
`);

// 4. ReportCard
write('src/features/gradebook/pages/ReportCard.jsx', `import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../../../services/apiService';

export default function ReportCard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    apiService.grades.getByStudent(id).then(d => setData(d)).catch(()=>{});
  }, [id]);
  if (!data) return <div style={{padding:'2rem'}}>Loading...</div>;
  const gpa = data.gpa || 0;
  return (
    <div style={{padding:'2rem',maxWidth:700,margin:'0 auto'}}>
      <div style={{border:'2px solid #1f2937',borderRadius:16,padding:'2rem'}}>
        <h1 style={{textAlign:'center',fontSize:28,fontWeight:800,margin:0}}>REPORT CARD</h1>
        <p style={{textAlign:'center',color:'#6b7280'}}>Academic Year 2024-2025</p>
        <div style={{marginTop:'1.5rem',display:'grid',gap:'0.5rem'}}>
          <p><strong>Student:</strong> {data.studentName||'Student'}</p>
          <p><strong>GPA:</strong> {gpa}</p>
        </div>
        <table style={{width:'100%',borderCollapse:'collapse',marginTop:'1.5rem'}}>
          <thead>
            <tr style={{borderBottom:'2px solid #1f2937'}}>
              <th style={th3}>Subject</th>
              <th style={th3}>Marks</th>
              <th style={th3}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {data.grades.map((g,i)=><tr key={i} style={{borderBottom:'1px solid #e5e7eb'}}>
              <td style={td3}>{g.course_name}</td>
              <td style={td3}>{g.marks_obtained}</td>
              <td style={td3}><span style={{
                padding:'0.25rem 0.5rem',borderRadius:4,fontSize:12,fontWeight:700,
                background:g.grade_point>=8?'#d1fae5':g.grade_point>=6?'#dbeafe':'#fee2e2',
                color:g.grade_point>=8?'#065f46':g.grade_point>=6?'#1e40af':'#991b1b'
              }}>{g.grade}</span></td>
            </tr>)}
          </tbody>
        </table>
        <div style={{marginTop:'2rem',padding:'1rem',background:'#f3f4f6',borderRadius:8}}>
          <p style={{fontSize:13,color:'#6b7280',margin:0}}>This is a computer-generated report card.</p>
        </div>
    </div>
  );
}
const th3={padding:'0.75rem',textAlign:'left',fontSize:14};
const td3={padding:'0.75rem'};
`);

// 5. GlobalAnalytics
write('src/features/reports/pages/GlobalAnalytics.jsx', `import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  {name:'G1',val:85},{name:'G2',val:78},{name:'G3',val:92},{name:'G4',val:88},{name:'G5',val:76}
];
const pie = [{name:'A',v:30},{name:'B',v:45},{name:'C',v:20},{name:'D',v:5}];
const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444'];

export default function GlobalAnalytics() {
  return (
    <div style={{padding:'2rem'}}>
      <h1 style={{fontSize:28,fontWeight:700}}>Global Analytics</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:24,marginTop:24}}>
        <div style={{background:'white',padding:'1.5rem',borderRadius:12,border:'1px solid #e5e7eb'}}>
          <h3>Performance by Grade</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="val" fill="#3b82f6"/></BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:'white',padding:'1.5rem',borderRadius:12,border:'1px solid #e5e7eb'}}>
          <h3>Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart><Pie data={pie} dataKey="v" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {pie.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
            </Pie><Tooltip/></PieChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
}
`);

// 6. ReportsRoutes update
write('src/features/reports/routes/ReportsRoutes.jsx', `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdvancedReports from '../pages/AdvancedReports';

export default function ReportsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdvancedReports />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
`);

// 7. GradebookRoutes check - already exists
// 8. ScheduleRoutes check
write('src/features/schedule/routes/ScheduleRoutes.jsx', `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Timetable from '../pages/Timetable';

export default function ScheduleRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Timetable />} />
      <Route path="*" element={<Navigate to="/schedule" replace />} />
    </Routes>
  );
}
`);

// 9. GradebookRoutes 
write('src/features/gradebook/routes/GradebookRoutes.jsx', `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PremiumGradebook from '../pages/PremiumGradebook';
import Gradebook from '../pages/Gradebook';
import ReportCard from '../pages/ReportCard';

export default function GradebookRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PremiumGradebook />} />
      <Route path="entry" element={<Gradebook />} />
      <Route path="report-card/:id" element={<ReportCard />} />
      <Route path="*" element={<Navigate to="/gradebook" replace />} />
    </Routes>
  );
}
`);

console.log('All pages written successfully!');
