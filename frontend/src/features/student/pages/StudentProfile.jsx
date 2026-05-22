import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CalendarCheck } from 'lucide-react';
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
    Promise.all([apiService.students.getById(id), apiService.grades.getByStudent(id), apiService.attendance.getByStudent(id)])
      .then(([s,g,a]) => { if(cancelled) return; setStudent(s); setGrades(g.grades||[]); setAttendance(a.attendance||[]); })
      .catch(() => { if(!cancelled) setError('Failed to load student data'); })
      .finally(() => { if(!cancelled) setLoading(false); });
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
      <button onClick={()=>nav('/students')} style={{color:'#3b82f6',border:'none',background:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.5rem',fontWeight:600}}><ArrowLeft size={18}/> Back</button>
      <div style={{background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',borderRadius:16,padding:'2rem',color:'white',margin:'1.5rem 0'}}>
        <h1 style={{margin:0,fontSize:24,fontWeight:700}}>{student.first_name} {student.last_name}</h1>
        <p>Roll: {student.admission_number}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:24}}>
        <StatCard label="Avg Grade" value={avg+'%'} icon={BookOpen} color="#3b82f6" />
        <StatCard label="Subjects" value={grades.length} icon={BookOpen} color="#10b981" />
        <StatCard label="Attendance" value={attendanceRate+'%'} icon={CalendarCheck} color="#f59e0b" />
      </div>
      <AIAnalyticsCard type="student" data={{studentId:id,grades}} title="AI Insights" />
      <PremiumCard style={{marginTop:24}}>
        <h3 style={{margin:0,marginBottom:'1rem',color:'#1f2937'}}>Grade History</h3>
        {grades.length===0 ? <p style={{color:'#6b7280'}}>No grades yet</p> : (
<table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-500 font-medium">Subject</th>
                <th className="text-left py-3 px-4 text-sm text-gray-500 font-medium">Marks</th>
                <th className="text-left py-3 px-4 text-sm text-gray-500 font-medium">Grade</th>
                <th className="text-left py-3 px-4 text-sm text-gray-500 font-medium">Term</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g,i)=>(
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4">{g.course_name}</td>
                  <td className="py-3 px-4 font-medium">{g.marks}</td>
                  <td className="py-3 px-4">{g.grade}</td>
                  <td className="py-3 px-4">{g.term}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </PremiumCard>
    </motion.div>
  );
}


