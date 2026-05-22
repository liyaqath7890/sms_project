import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, User } from 'lucide-react';
import { useAcademicSession } from '../../../services/academicSessionContext';
import { PremiumCard, PremiumButton } from '../../../components/premium';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
const PERIODS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM'];

const MOCK = {
  'Monday': [{subject:'Mathematics',teacher:'Mr. Sharma',room:'101'},{subject:'Science',teacher:'Ms. Verma',room:'102'},{subject:'English',teacher:'Mrs. Gupta',room:'103'},{subject:'Hindi',teacher:'Mr. Patel',room:'104'},{subject:'Lunch',teacher:'-',room:'Canteen'},{subject:'Social Studies',teacher:'Ms. Rao',room:'105'},{subject:'Computer Science',teacher:'Mr. Khan',room:'Lab 1'},{subject:'Physical Education',teacher:'Mr. Singh',room:'Ground'}],
  'Tuesday': [{subject:'Science',teacher:'Ms. Verma',room:'102'},{subject:'Mathematics',teacher:'Mr. Sharma',room:'101'},{subject:'Computer Science',teacher:'Mr. Khan',room:'Lab 1'},{subject:'English',teacher:'Mrs. Gupta',room:'103'},{subject:'Lunch',teacher:'-',room:'Canteen'},{subject:'Hindi',teacher:'Mr. Patel',room:'104'},{subject:'Art',teacher:'Ms. Das',room:'Art Room'},{subject:'Social Studies',teacher:'Ms. Rao',room:'105'}],
  'Wednesday': [{subject:'English',teacher:'Mrs. Gupta',room:'103'},{subject:'Hindi',teacher:'Mr. Patel',room:'104'},{subject:'Mathematics',teacher:'Mr. Sharma',room:'101'},{subject:'Science',teacher:'Ms. Verma',room:'102'},{subject:'Lunch',teacher:'-',room:'Canteen'},{subject:'Physical Education',teacher:'Mr. Singh',room:'Ground'},{subject:'Social Studies',teacher:'Ms. Rao',room:'105'},{subject:'Computer Science',teacher:'Mr. Khan',room:'Lab 1'}],
  'Thursday': [{subject:'Social Studies',teacher:'Ms. Rao',room:'105'},{subject:'Mathematics',teacher:'Mr. Sharma',room:'101'},{subject:'English',teacher:'Mrs. Gupta',room:'103'},{subject:'Science',teacher:'Ms. Verma',room:'102'},{subject:'Lunch',teacher:'-',room:'Canteen'},{subject:'Hindi',teacher:'Mr. Patel',room:'104'},{subject:'Computer Science',teacher:'Mr. Khan',room:'Lab 1'},{subject:'Art',teacher:'Ms. Das',room:'Art Room'}],
  'Friday': [{subject:'Mathematics',teacher:'Mr. Sharma',room:'101'},{subject:'Science',teacher:'Ms. Verma',room:'102'},{subject:'Social Studies',teacher:'Ms. Rao',room:'105'},{subject:'English',teacher:'Mrs. Gupta',room:'103'},{subject:'Lunch',teacher:'-',room:'Canteen'},{subject:'Hindi',teacher:'Mr. Patel',room:'104'},{subject:'Physical Education',teacher:'Mr. Singh',room:'Ground'},{subject:'Computer Science',teacher:'Mr. Khan',room:'Lab 1'}]
};

export default function Timetable() {
  const { currentStandard, currentDivision } = useAcademicSession();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [modal, setModal] = useState(null);
  const schedule = MOCK[selectedDay] || [];
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{padding:'2rem'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
        <div><h1 style={{fontSize:'2rem',fontWeight:700,color:'#1f2937',margin:0}}>Weekly Timetable</h1><p style={{color:'#6b7280',marginTop:4}}>Standard {currentStandard} - Division {currentDivision}</p></div>
      </div>
      <div style={{display:'flex',gap:'0.5rem',marginBottom:'2rem',overflowX:'auto'}}>
        {DAYS.map(day=>(<button key={day} onClick={()=>setSelectedDay(day)} style={{padding:'0.75rem 1.25rem',borderRadius:'var(--radius-md)',border:'2px solid '+(selectedDay===day?'#3b82f6':'#e5e7eb'),backgroundColor:selectedDay===day?'#eff6ff':'white',color:selectedDay===day?'#3b82f6':'#1f2937',fontWeight:selectedDay===day?700:500,cursor:'pointer',whiteSpace:'nowrap'}}>{day}</button>))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1rem'}}>
        {PERIODS.map((time,idx)=>{ const item=schedule[idx]||{subject:'Free Period',teacher:'-',room:'-'}; return (
          <motion.div key={time} whileHover={{scale:1.02}} onClick={()=>setModal(item)} style={{cursor:'pointer'}}>
            <PremiumCard style={{padding:'1.25rem',borderLeft:'4px solid '+(item.subject==='Lunch'?'#f59e0b':'#3b82f6')}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                <span style={{fontSize:'0.875rem',fontWeight:600,color:'#6b7280'}}>{time}</span>
                <span style={{fontSize:'0.75rem',padding:'0.25rem 0.5rem',backgroundColor:'#dbeafe',color:'#1e40af',borderRadius:'9999px',fontWeight:600}}>Period {idx+1}</span>
              </div>
              <h3 style={{fontSize:'1.125rem',fontWeight:700,color:'#1f2937',margin:0,marginBottom:'0.5rem'}}>{item.subject}</h3>
              <div style={{display:'flex',gap:'1rem',fontSize:'0.875rem',color:'#6b7280'}}>
                <span style={{display:'flex',alignItems:'center',gap:'0.25rem'}}><User size={14}/> {item.teacher}</span>
                <span style={{display:'flex',alignItems:'center',gap:'0.25rem'}}><MapPin size={14}/> {item.room}</span>
              </div>
            </PremiumCard>
          </motion.div>
        ); })}
      </div>
      {modal && (
        <div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setModal(null)}>
          <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} style={{background:'white',padding:'2rem',borderRadius:'var(--radius-lg)',maxWidth:400,width:'90%'}} onClick={e=>e.stopPropagation()}>
            <h2 style={{margin:0,marginBottom:'1rem',color:'#1f2937'}}>{modal.subject}</h2>
            <p style={{color:'#6b7280',marginBottom:'0.5rem'}}><strong>Teacher:</strong> {modal.teacher}</p>
            <p style={{color:'#6b7280',marginBottom:'0.5rem'}}><strong>Room:</strong> {modal.room}</p>
            <p style={{color:'#6b7280',marginBottom:'1.5rem'}}><strong>Day:</strong> {selectedDay}</p>
            <PremiumButton variant="primary" size="md" onClick={()=>setModal(null)}>Close</PremiumButton>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

