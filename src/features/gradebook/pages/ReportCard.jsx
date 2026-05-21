import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Printer, ArrowLeft } from 'lucide-react';
import { apiService } from '../../../services/apiService';
import { PremiumCard, PremiumButton } from '../../../components/premium';

export default function ReportCard() {
  const { id } = useParams();
  const nav = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiService.students.getById(id), apiService.grades.getByStudent(id), apiService.attendance.getByStudent(id)])
      .then(([s,g,a]) => { setStudent(s); setGrades(g.grades||[]); setAttendance(a.attendance||[]); })
      .finally(()=>setLoading(false));
  }, [id]);

  if(loading) return <div style={{padding:'2rem'}}>Loading report card...</div>;
  if(!student) return <div style={{padding:'2rem'}}>Student not found</div>;

  const avg = grades.length>0 ? (grades.reduce((a,g)=>a+(g.marks||0),0)/grades.length).toFixed(1) : '0.0';
  const presentDays = attendance.filter(x=>x.status==='present').length;
  const attendanceRate = attendance.length>0 ? ((presentDays/attendance.length)*100).toFixed(1) : '0.0';
  const handlePrint = () => window.print();

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{padding:'2rem',maxWidth:800,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}} className="no-print">
        <button onClick={()=>nav('/gradebook')} style={{color:'#3b82f6',border:'none',background:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.5rem',fontWeight:600}}><ArrowLeft size={18}/> Back</button>
        <PremiumButton variant="primary" size="md" icon={Printer} onClick={handlePrint}>Print Report Card</PremiumButton>
      </div>
      <PremiumCard style={{padding:'2rem',border:'2px solid #e5e7eb'}}>
        <div style={{textAlign:'center',marginBottom:'2rem',borderBottom:'2px solid #1f2937',paddingBottom:'1.5rem'}}>
          <h1 style={{fontSize:'1.75rem',fontWeight:800,color:'#1f2937',margin:0}}>Edustrem School</h1>
          <p style={{color:'#6b7280',margin:'0.5rem 0 0 0'}}>Annual Academic Report Card - 2024-25</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
          <div><p style={{color:'#6b7280',margin:0,fontSize:'0.875rem'}}>Student Name</p><p style={{fontWeight:700,color:'#1f2937',margin:0}}>{student.first_name} {student.last_name}</p></div>
          <div><p style={{color:'#6b7280',margin:0,fontSize:'0.875rem'}}>Admission No</p><p style={{fontWeight:700,color:'#1f2937',margin:0}}>{student.admission_number}</p></div>
          <div><p style={{color:'#6b7280',margin:0,fontSize:'0.875rem'}}>Class</p><p style={{fontWeight:700,color:'#1f2937',margin:0}}>Grade {student.standard || 'N/A'} - Div {student.division || 'A'}</p></div>
          <div><p style={{color:'#6b7280',margin:0,fontSize:'0.875rem'}}>Roll Number</p><p style={{fontWeight:700,color:'#1f2937',margin:0}}>{student.roll_number || 'N/A'}</p></div>
        </div>
        <h3 style={{fontSize:'1.125rem',fontWeight:700,color:'#1f2937',marginBottom:'1rem'}}>Academic Performance</h3>
        <table style={{width:'100%',borderCollapse:'collapse',marginBottom:'2rem'}}>
          <thead><tr style={{borderBottom:'2px solid #1f2937'}}>
            <th style={{textAlign:'left',padding:'0.75rem',fontSize:'0.875rem',color:'#6b7280'}}>Subject</th>
            <th style={{textAlign:'center',padding:'0.75rem',fontSize:'0.875rem',color:'#6b7280'}}>Marks</th>
            <th style={{textAlign:'center',padding:'0.75rem',fontSize:'0.875rem',color:'#6b7280'}}>Grade</th>
            <th style={{textAlign:'left',padding:'0.75rem',fontSize:'0.875rem',color:'#6b7280'}}>Remarks</th>
          </tr></thead>
          <tbody>{grades.map((g,i)=>(<tr key={i} style={{borderBottom:'1px solid #e5e7eb'}}>
            <td style={{padding:'0.75rem',fontWeight:600,color:'#1f2937'}}>{g.course_name}</td>
            <td style={{padding:'0.75rem',textAlign:'center',fontWeight:700,color:'#3b82f6'}}>{g.marks}</td>
            <td style={{padding:'0.75rem',textAlign:'center'}}><span style={{padding:'0.25rem 0.75rem',borderRadius:'9999px',backgroundColor:g.grade==='A'?'#d1fae5':g.grade==='B'?'#dbeafe':'#fef3c7',color:g.grade==='A'?'#065f46':g.grade==='B'?'#1e40af':'#92400e',fontWeight:600,fontSize:'0.875rem'}}>{g.grade}</span></td>
            <td style={{padding:'0.75rem',color:'#6b7280',fontSize:'0.875rem'}}>{g.remarks || 'Good effort'}</td>
          </tr>))}</tbody>
        </table>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1.5rem',marginBottom:'2rem'}}>
          <div style={{background:'#eff6ff',padding:'1.25rem',borderRadius:'var(--radius-md)',textAlign:'center'}}><p style={{color:'#6b7280',margin:0,fontSize:'0.875rem'}}>Average Score</p><p style={{fontSize:'1.75rem',fontWeight:800,color:'#3b82f6',margin:'0.5rem 0 0 0'}}>{avg}%</p></div>
          <div style={{background:'#ecfdf5',padding:'1.25rem',borderRadius:'var(--radius-md)',textAlign:'center'}}><p style={{color:'#6b7280',margin:0,fontSize:'0.875rem'}}>Attendance</p><p style={{fontSize:'1.75rem',fontWeight:800,color:'#10b981',margin:'0.5rem 0 0 0'}}>{attendanceRate}%</p></div>
        </div>
        <div style={{borderTop:'2px solid #e5e7eb',paddingTop:'1.5rem'}}>
          <p style={{color:'#6b7280',fontStyle:'italic',margin:0}}>Teacher's Remarks: {student.remarks || 'Keep up the good work. Shows consistent improvement in academics.'}</p>
        </div>
        <div style={{marginTop:'3rem',display:'flex',justifyContent:'space-between'}}>
          <div style={{textAlign:'center'}}><div style={{borderTop:'1px solid #1f2937',paddingTop:'0.5rem',width:150}}><p style={{fontWeight:600,color:'#1f2937',margin:0}}>Class Teacher</p></div></div>
          <div style={{textAlign:'center'}}><div style={{borderTop:'1px solid #1f2937',paddingTop:'0.5rem',width:150}}><p style={{fontWeight:600,color:'#1f2937',margin:0}}>Principal</p></div></div>
        </div>
      </PremiumCard>
      <style>{`@media print { .no-print { display: none !important; } body { background: white; } }`}</style>
    </motion.div>
  );
}

