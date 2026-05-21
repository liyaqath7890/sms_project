import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { PremiumButton, PremiumCard } from '../../../components/premium';
import { apiService } from '../../../services/apiService';

export default function AddTeacher() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', subject:'Mathematics', designation:'Teacher', experience:'', qualification:'', joinDate:'', address:'' });
  const handleChange = e => { setForm(p => ({...p, [e.target.name]: e.target.value})); setError(null); };
  const validate = () => { if(!form.firstName.trim() || !form.lastName.trim()) return 'Names required'; if(form.email && !/\S+@\S+\.\S+/.test(form.email)) return 'Invalid email'; return null; };
  const submit = async e => { e.preventDefault(); const err = validate(); if(err){ setError(err); return; } try { setLoading(true); await apiService.teachers.create({ ...form, name: form.firstName+' '+form.lastName, status: 'Active' }); nav('/teachers'); } catch(err) { setError(err.message || 'Failed'); } finally { setLoading(false); } };
  const inputStyle = { width:'100%', padding:'0.75rem', border:'1px solid #e5e7eb', borderRadius:8, fontSize:15, outline:'none' };
  const lb = { fontSize:'0.875rem', fontWeight:600, color:'#374151', marginBottom:'0.5rem', display:'block' };
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{padding:'2rem',maxWidth:900,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <div><h1 style={{fontSize:28,fontWeight:700,color:'#1f2937',margin:0}}>Add New Teacher</h1><p style={{color:'#6b7280',marginTop:4}}>Register a new teaching staff member</p></div>
        <PremiumButton variant="secondary" size="md" icon={X} onClick={()=>nav('/teachers')}>Cancel</PremiumButton>
      </div>
      {error && <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{padding:'1rem',backgroundColor:'#fee2e2',color:'#991b1b',borderRadius:8,marginBottom:'1rem',fontWeight:500}}>{error}</motion.div>}
      <form onSubmit={submit}>
        <PremiumCard style={{padding:'2rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1.5rem'}}>
            <div><label style={lb}>First Name *</label><input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} placeholder="Enter first name" /></div>
            <div><label style={lb}>Last Name *</label><input name="lastName" value={form.lastName} onChange={handleChange} required style={inputStyle} placeholder="Enter last name" /></div>
            <div><label style={lb}>Email</label><input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="teacher@school.edu" /></div>
            <div><label style={lb}>Phone</label><input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} placeholder="+91 98765 43210" /></div>
            <div><label style={lb}>Subject</label><select name="subject" value={form.subject} onChange={handleChange} style={inputStyle}>{['Mathematics','Science','English','Hindi','Social Studies','Physics','Chemistry','Biology','Computer Science','Physical Education','Art'].map(s=><option key={s} value={s}>{s}</option>)}</select></div>
            <div><label style={lb}>Designation</label><select name="designation" value={form.designation} onChange={handleChange} style={inputStyle}>{['Teacher','Senior Teacher','Head of Department','Vice Principal','Principal'].map(d=><option key={d} value={d}>{d}</option>)}</select></div>
            <div><label style={lb}>Experience (years)</label><input name="experience" type="number" value={form.experience} onChange={handleChange} style={inputStyle} placeholder="e.g. 5" /></div>
            <div><label style={lb}>Qualification</label><input name="qualification" value={form.qualification} onChange={handleChange} style={inputStyle} placeholder="e.g. M.Sc., B.Ed." /></div>
            <div><label style={lb}>Join Date</label><input name="joinDate" type="date" value={form.joinDate} onChange={handleChange} style={inputStyle} /></div>
            <div style={{gridColumn:'1 / -1'}}><label style={lb}>Address</label><textarea name="address" value={form.address} onChange={handleChange} style={{...inputStyle,minHeight:80,resize:'vertical'}} placeholder="Full address..." /></div>
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',gap:'1rem',marginTop:'2rem'}}>
            <PremiumButton variant="secondary" size="md" onClick={()=>nav('/teachers')} disabled={loading}>Cancel</PremiumButton>
            <PremiumButton variant="primary" size="md" icon={Save} isLoading={loading} disabled={loading} type="submit">Save Teacher</PremiumButton>
          </div>
        </PremiumCard>
      </form>
    </motion.div>
  );
}

