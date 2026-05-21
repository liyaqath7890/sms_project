const fs = require('fs');

const files = {
  'src/features/student/pages/StudentProfile.jsx': `import React, { useState, useEffect } from 'react';
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
      .catch(() => {})
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
const td={padding:'0.75rem'};`,

  'src/features/teacher/pages/AddTeacher.jsx': `import React, { useState } from 'react';
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
        <input name="firstName" placeholder="First Name" onChange={handle} required style={s.in} />
        <input name="lastName" placeholder="Last Name" onChange={handle} required style={s.in} />
        <input name="email" type="email" placeholder="Email" onChange={handle} style={s.in} />
        <input name="phone" placeholder="Phone" onChange={handle} style={s.in} />
        <input name="subject" placeholder="Subject" onChange={handle} required style={s.in} />
        <input name="qualification" placeholder="Qualification" onChange={handle} style={s.in} />
        <input name="experienceYears" type="number" placeholder="Experience (Years)" onChange={handle} style={s.in} />
        <button type="submit" style={{...s.in,background:'#3b82f6',color:'white',cursor:'pointer',fontWeight:600}}>Save Teacher</button>
      </form>
    </div>
  );
}
const s = { in: {width:'100%',padding:'0.75rem',border:'1px solid #e5e7eb',borderRadius:8,fontSize:15,outline:'none'} };`,

  'src/features/schedule/pages/Timetable.jsx': `import React, { useState } from 'react';
const periods = ['8:00-8:45','8:45-9:30','9:30-10:15','10:15-10:30','10:30-11:15','11:15-12:00','12:00-12:45','12:45-1:30','1:30-2:15'];
const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const colors = ['#dbeafe','#d1fae5','#fce7f3','#fef3c7','#e0e7ff','#f3e8ff'];

const sampleSchedule = {
  'Monday': ['Math','English','Science','Break','Hindi','Social','Lunch','Computer','PE'],
  'Tuesday': ['English','Math','Hindi','Break','Science','Computer','Lunch','Art','Social'],
  'Wednesday': ['Science','Hindi','Math','Break','English','PE','Lunch','Social','Computer'],
  'Thursday': ['Math','Science','English','Break','Computer','Hindi','Lunch','PE','Art'],
  'Friday': ['Hindi','English','Social','Break','Math','Science','Lunch','Computer','Music'],
  'Saturday': ['PE','Art','Music','Break','Math','English','Lunch','-','-']
};

export default function Timetable() {
  const [selectedClass, setSelectedClass] = useState('5A');
  return (
    <div style={{padding:'2rem'}}>
      <h1 style={{fontSize:28,fontWeight:700}}>Class Timetable</h1>
      <select value={selectedClass} onChange={e=>setSelectedClass(e.target.value)} style={{marginTop:16,padding:8,borderRadius:8,border:'1px solid #e5e7eb'}}>
        {[5,6,7,8,9,10].map(g=>['A','B','C'].map(d=><option key={g+d} value={g+d}>Grade {g}-{d}</option>))}
      </select>
      <div style={{overflowX:'auto',marginTop:24}}>
