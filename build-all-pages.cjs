const fs = require('fs');
const path = require('path');

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log('Written ' + file);
}

// 1. PremiumGradebook with AI
write('src/features/gradebook/pages/PremiumGradebook.jsx', `import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, TrendingUp, Award } from 'lucide-react';
import { useAcademicSession } from '../../../services/academicSessionContext';
import { PremiumButton, PremiumCard, PremiumInput, PremiumTable, StatCard, SessionSwitcher, BarChart, LineChart } from '../../../components/premium';
import AIAnalyticsCard from '../../../components/custom/AIAnalyticsCard';

export default function PremiumGradebook() {
  const { currentStandard, currentDivision, getSubjectsForStandard, getClassStudents } = useAcademicSession();
  const [students] = useState(getClassStudents());
  const [selectedSubject, setSelectedSubject] = useState(getSubjectsForStandard(currentStandard)[0]);
  const subjects = getSubjectsForStandard(currentStandard);
  const mockGrades = students.map(s => ({ ...s, grades: subjects.reduce((a,sub)=>{ a[sub]=Math.floor(Math.random()*30)+70; return a; },{}) }));
  const classAverage = (mockGrades.reduce((sum,s)=>sum+(s.grades[selectedSubject]||0),0)/students.length).toFixed(2);
  const toppers = [...mockGrades].sort((a,b)=>(b.grades[selectedSubject]||0)-(a.grades[selectedSubject]||0)).slice(0,5);
  const gradeDistribution = [
    { label:'A+ (90-100)', value: mockGrades.filter(s=>s.grades[selectedSubject]>=90).length },
    { label:'A (80-89)', value: mockGrades.filter(s=>s.grades[selectedSubject]>=80&&s.grades[selectedSubject]<90).length },
    { label:'B (70-79)', value: mockGrades.filter(s=>s.grades[selectedSubject]>=70&&s.grades[selectedSubject]<80).length },
    { label:'C (60-69)', value: mockGrades.filter(s=>s.grades[selectedSubject]>=60&&s.grades[selectedSubject]<70).length },
    { label:'Below 60', value: mockGrades.filter(s=>s.grades[selectedSubject]<60).length }
  ];
  const performanceTrend = [{label:'Unit 1',value:72},{label:'Unit 2',value:75},{label:'Unit 3',value:78},{label:'Unit 4',value:81},{label:'Mid Term',value:79}];

  const tableColumns = [
    { key:'rollNumber', label:'Roll No', sortable:true, align:'center' },
    { key:'name', label:'Name', sortable:true, align:'left' },
    { key:'grade', label:selectedSubject, sortable:true, align:'center', render:(_,row)=>{ const g=row.grades[selectedSubject]; let c='#10b981'; if(g<60)c='#ef4444'; else if(g<70)c='#f59e0b'; else if(g<80)c='#3b82f6'; return <span style={{padding:'0.25rem 0.75rem',borderRadius:'9999px',backgroundColor:c+'15',color:c,fontWeight:700,fontSize:'0.875rem'}}>{g}</span>; }},
    { key:'avgGrade', label:'Avg Grade', sortable:true, align:'center', render:(_,row)=>{ const avg=(Object.values(row.grades).reduce((a,b)=>a+b,0)/subjects.length).toFixed(1); return <span style={{fontWeight:700,color:'#3b82f6'}}>{avg}</span>; }}
  ];

  const containerVariants = { hidden:{opacity:0}, visible:{opacity:1,transition:{staggerChildren:0.1,delayChildren:0.2}} };
  const itemVariants = { hidden:{opacity:0,y:20}, visible:{opacity:1,y:0} };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{padding:'2rem'}}>
      <motion.div variants={itemVariants} style={{marginBottom:'2rem'}}>
        <h1 style={{fontSize:'2rem',fontWeight:700,color:'#1f2937',margin:0,marginBottom:'0.5rem'}}>Gradebook</h1>
        <p style={{color:'#6b7280',margin:0}}>Manage and analyze grades for Standard {currentStandard} - Division {currentDivision}</p>
      </motion.div>
      <SessionSwitcher />
      <motion.div variants={itemVariants} style={{marginBottom:'2rem'}}>
        <PremiumCard gradient>
          <h3 style={{fontSize:'1rem',fontWeight:700,color:'#1f2937',margin:0,marginBottom:'1rem'}}>Select Subject</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(120px, 1fr))',gap:'0.75rem'}}>
            {subjects.map(sub=>(
              <motion.button key={sub} whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>setSelectedSubject(sub)} style={{padding:'0.75rem 1rem',borderRadius:'var(--radius-md)',border:selectedSubject===sub?'2px solid #3b82f6':'2px solid #e5e7eb',backgroundColor:selectedSubject===sub?'#eff6ff':'white',color:selectedSubject===sub?'#3b82f6':'#1f2937',fontWeight:selectedSubject===sub?700:500,cursor:'pointer',transition:'all 0.3s ease'}}>{sub}</motion.button>
            ))}
          </div>
        </PremiumCard>
      </motion.div>
      <motion.div variants={itemVariants} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'1.5rem',marginBottom:'2rem'}}>
        <StatCard label="Class Average" value={classAverage} icon={TrendingUp} color="#3b82f6" />
        <StatCard label="Highest Score" value={Math.max(...mockGrades.map(s=>s.grades[selectedSubject]||0))} icon={Award} color="#10b981" />
        <StatCard label="Lowest Score" value={Math.min(...mockGrades.map(s=>s.grades[selectedSubject]||0))} icon={Award} color="#ef4444" />
        <StatCard label="Pass Rate" value={((mockGrades.filter(s=>s.grades[selectedSubject]>=60).length/students.length)*100).toFixed(1)+'%'} icon={TrendingUp} color="#f59e0b" />
      </motion.div>
      <motion.div variants={itemVariants} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',gap:'1.5rem',marginBottom:'2rem'}}>
        <PremiumCard gradient><BarChart data={gradeDistribution} label="Grade Distribution" color="#3b82f6"/></PremiumCard>
        <PremiumCard gradient><LineChart data={performanceTrend} label="Class Performance Trend" color="#10b981"/></PremiumCard>
        <PremiumCard gradient><AIAnalyticsCard type="class" data={{classId:'gradebook-'+currentStandard, grades: mockGrades.map(s=>({marks:s.grades[selectedSubject]}))}} title="AI Gradebook Insights"/></PremiumCard>
      </motion.div>
      <motion.div variants={itemVariants}>
        <PremiumCard>
          <div style={{marginBottom:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{fontSize:'1rem',fontWeight:700,color:'#1f2937',margin:0}}>{selectedSubject} - Grades</h3>
            <PremiumButton variant="secondary" size="sm" icon={Download}>Export</PremiumButton>
          </div>
          <PremiumTable columns={tableColumns} data={mockGrades} pagination={true} itemsPerPage={10} />
        </PremiumCard>
      </motion.div>
      <motion.div variants={itemVariants} style={{marginTop:'2rem'}}>
        <PremiumCard gradient>
          <h3 style={{fontSize:'1rem',fontWeight:700,color:'#1f2937',margin:0,marginBottom:'1.5rem'}}>Top Performers in {selectedSubject}</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'1rem'}}>
            {toppers.map((student,idx)=>(
              <motion.div key={student.id} whileHover={{y:-4}} style={{padding:'1rem',borderRadius:'var(--radius-md)',backgroundColor:'white',border:'2px solid #e5e7eb',textAlign:'center'}}>
                <div style={{fontSize:'2rem',fontWeight:700,color:['#fbbf24','#c0c0c0','#cd7f32'][idx]||'#6b7280',marginBottom:'0.5rem'}}>{['🥇','🥈','🥉'][idx]||'⭐'}</div>
                <p style={{fontWeight:700,color:'#1f2937',margin:'0.5rem 0 0 0'}}>{student.name}</p>
                <p style={{fontSize:'2rem',fontWeight:700,color:'#3b82f6',margin:'0.5rem 0'}}>{student.grades[selectedSubject]}</p>
              </motion.div>
            ))}
          </div>
        </PremiumCard>
      </motion.div>
    </motion.div>
  );
}
`);

// 2. AddStudent full form
write('src/features/student/pages/AddStudent.jsx', `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Phone, Calendar, BookOpen, Users, Home, Save, X } from 'lucide-react';
import { useAcademicSession } from '../../../services/academicSessionContext';
import { PremiumButton, PremiumCard, PremiumInput } from '../../../components/premium';
import { apiService } from '../../../services/apiService';

export default function AddStudent() {
  const nav = useNavigate();
  const { currentStandard, currentDivision } = useAcademicSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'', gender:'Male', rollNumber:'',
    dateOfBirth:'', address:'', parentName:'', parentPhone:'', admissionDate:''
  });

  const handleChange = e => {
    setForm(p => ({...p, [e.target.name]: e.target.value}));
    setError(null);
  };

  const validate = () => {
    if(!form.firstName.trim() || !form.lastName.trim()) return 'First and last name are required';
    if(!form.rollNumber.trim()) return 'Roll number is required';
    if(form.email && !/\\S+@\\S+\\.\\S+/.test(form.email)) return 'Invalid email format';
    return null;
  };

  const submit = async e => {
    e.preventDefault();
    const err = validate();
    if(err){ setError(err); return; }
    try {
      setLoading(true);
      await apiService.students.create({
        ...form,
        name: form.firstName+' '+form.lastName,
        admissionNumber: 'ADM'+Date.now(),
        standard: currentStandard,
        division: currentDivision
      });
      nav('/students');
    } catch(err) {
      setError(err.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width:'100%', padding:'0.75rem', border:'1px solid #e5e7eb', borderRadius:8, fontSize:15, outline:'none' };

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{padding:'2rem',maxWidth:900,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <div>
          <h1 style={{fontSize:28,fontWeight:700,color:'#1f2937',margin:0}}>Add New Student</h1>
          <p style={{color:'#6b7280',marginTop:4}}>Standard {currentStandard} - Division {currentDivision}</p>
        </div>
        <PremiumButton variant="secondary" size="md" icon={X} onClick={()=>nav('/students')}>Cancel</PremiumButton>
      </div>
      {error && <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{padding:'1rem',backgroundColor:'#fee2e2',color:'#991b1b',borderRadius:8,marginBottom:'1rem',fontWeight:500}}>{error}</motion.div>}
      <form onSubmit={submit}>
        <PremiumCard style={{padding:'2rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1.5rem'}}>
            <div>
              <label style={{fontSize:'0.875rem',fontWeight:600,color:'#374151',marginBottom:'0.5rem',display:'block'}}>First Name *</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} placeholder="Enter first name" />
            </div>
            <div>
              <label style={{fontSize:'0.875rem',fontWeight:600,color:'#374151',marginBottom:'0.5rem',display:'block'}}>Last Name *</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required style={inputStyle} placeholder="Enter last name" />
            </div>
            <div>
              <label style={{fontSize:'0.875rem',fontWeight:600,color:'#374151',marginBottom:'0.5rem',display:'block'}}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="student@example.com" />
            </div>
            <div>
              <label style={{fontSize:'0.875rem',fontWeight:600,color:'#374151',marginBottom:'0.5rem',display:'block'}}>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label style={{fontSize:'0.875rem',fontWeight:600,color:'#374151',marginBottom:'0.5rem',display:'block'}}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{fontSize:'0.875rem',fontWeight:600,color:'#374151',marginBottom:'0.5rem',display:'block'}}>Roll Number *</label>
              <input name="rollNumber" value={form.rollNumber} onChange={handleChange} required style={inputStyle} placeholder="e.g. 101" />
            </div>
            <div>
              <label style={{fontSize:'0.875rem',fontWeight:600,color:'#374151',marginBottom:'0.5rem',display:'block'}}>Date of Birth</label>
              <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{fontSize:'0.875rem',fontWeight:600,color:'#374151',marginBottom:'0.5rem',display:'block'}}>Admission Date</label>
              <input name="admissionDate" type="date" value={form.admissionDate} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{fontSize:'0.875rem',fontWeight:600,color:'#374151',marginBottom:'0.5rem',display:'block'}}>Parent/Guardian Name</label>
              <input name="parentName" value={form.parentName} onChange={handleChange} style={inputStyle} placeholder="Parent name" />
            </div>
            <div>
              <label style={{fontSize:'0.875rem',fontWeight:600,color:'#374151',marginBottom:'0.5rem',display:'block'}}>Parent Phone</label>
              <input name="parentPhone" value={form.parentPhone} onChange={handleChange} style={inputStyle} placeholder="+91 98765 43210" />
            </div>
            <div style={{gridColumn:'1 / -1'}}>
              <label style={{fontSize:'0.875rem',fontWeight:600,color:'#374151',marginBottom:'0.5rem',display:'block'}}>Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} style={{...inputStyle,minHeight:80,resize:'vertical'}} placeholder="Full address..." />
            </div>
          <div style={{display:'flex',justifyContent:'flex-end',gap:'1rem',marginTop:'2rem'}}>
            <PremiumButton variant="secondary" size="md" onClick={()=>nav('/students')} disabled={loading}>Cancel</PremiumButton>
            <PremiumButton variant="primary" size="md" icon={Save} isLoading={loading} disabled={loading} type="submit">Save Student</PremiumButton>
          </div>
        </PremiumCard>
      </form>
    </motion.div>
  );
}
`);

// 3. StudentProfile enhanced
write('src/features/student/pages/StudentProfile.jsx', `import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, BookOpen, BarChart3, Calendar, User } from 'lucide-react';
import { apiService } from '../../../services/apiService';
import AIAnalyticsCard from '../../../components/custom/AIAnalyticsCard';
import { StatCard, PremiumCard } from '../../../components/premium';

export default function StudentProfile() {
  const { id } = useParams();
  const nav = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiService.students.getById(id),
      apiService.grades.getByStudent(id),
      apiService.attendance.getByStudent(id)
    ]).then(([s, g, a]) => {
      if(cancelled) return;
      setStudent(s);
      setGrades(g.grades || []);
      setAttendance(a.attendance || []);
    }).catch(() => {
      if(cancelled) return;
      setError('Failed to load student data');
    }).finally(() => {
      if(!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  if(loading) return <div style={{padding:'2rem'}}>Loading profile...</div>;
  if(error) return <div style={{padding:'2rem',color:'#ef4444'}}>{error}</div>;
  if(!student) return <div style={{padding:'2rem'}}>Student not found</div>;

  const avg = grades.length>0 ? (grades.reduce((a,g)=>a+(g.marks||0),0)/grades.length).toFixed(1) : '0.0';
  const presentDays = attendance.filter(x=>x.status==='present').length;
  const attendanceRate = attendance.length>0 ? ((presentDays/attendance.length)*100).toFixed(1) : '0.0';

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{padding:'2rem'}}>
      <button onClick={()=>nav('/students')} style={{color:'#3b82f6',border:'none',background:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.5rem',fontWeight:600}}><ArrowLeft size={18}/> Back to Students</button>
      <div style={{background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',bor
