import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  CalendarCheck,
  Download,
  Mail,
  Phone,
  Save,
  Trash2,
  UserPen,
  X
} from 'lucide-react';
import { apiService } from '../../../services/apiService';
import { useAuth } from '../../../authentication/context/AuthContext';
import AIAnalyticsCard from '../../../components/custom/AIAnalyticsCard';
import { StatCard, PremiumCard } from '../../../components/premium';

const emptyStudentForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: '',
  address: '',
  parentName: '',
  parentPhone: ''
};

export default function StudentProfile({ id: studentId }) {
  const params = useParams();
  const id = studentId || params.id;
  const nav = useNavigate();
  const { hasPermission } = useAuth();
  const canWriteStudents = hasPermission('students:write');

  const [student, setStudent] = useState(null);
  const [form, setForm] = useState(emptyStudentForm);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const loadStudent = async () => {
    if (!id) {
      setError('Student id is missing');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const emptyOnFail = (promise, fallback) => promise.catch(() => fallback);

    try {
      const [studentData, gradeData, attendanceData] = await Promise.all([
        apiService.students.getById(id),
        emptyOnFail(apiService.grades.getByStudent(id), { grades: [] }),
        emptyOnFail(apiService.attendance.getByStudent(id), { attendance: [] })
      ]);

      setStudent(studentData);
      setGrades(gradeData.grades || []);
      setAttendance(attendanceData.attendance || []);
      setForm({
        firstName: studentData.first_name || '',
        lastName: studentData.last_name || '',
        email: studentData.email || '',
        phone: studentData.phone || '',
        gender: studentData.gender || '',
        address: studentData.address || '',
        parentName: studentData.parent_name || '',
        parentPhone: studentData.parent_phone || ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudent();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!canWriteStudents) return;
    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const updated = await apiService.students.update(id, form);
      setStudent(updated);
      setIsEditing(false);
      setNotice('Student details updated successfully.');
      await loadStudent();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!canWriteStudents) return;
    const confirmed = window.confirm('Delete this student permanently?');
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      await apiService.students.delete(id);
      nav('/students');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete student');
      setSaving(false);
    }
  };

  const exportProfile = () => {
    if (!student) return;
    const rows = [
      ['Name', `${student.first_name || ''} ${student.last_name || ''}`.trim()],
      ['Admission Number', student.admission_number || ''],
      ['Email', student.email || ''],
      ['Phone', student.phone || ''],
      ['Parent Name', student.parent_name || ''],
      ['Parent Phone', student.parent_phone || ''],
      ['Class', [student.standard_name, student.division_name].filter(Boolean).join(' ')],
      ['Attendance Rate', `${attendanceRate}%`],
      ['Average Grade', `${avg}%`]
    ];

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${student.admission_number || 'student'}-profile.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading profile...</div>;
  if (error && !student) return <div style={{ padding: '2rem', color: '#ef4444' }}>{error}</div>;
  if (!student) return <div style={{ padding: '2rem' }}>Student not found</div>;

  const avg = grades.length > 0
    ? (grades.reduce((sum, grade) => sum + Number(grade.marks_obtained || grade.marks || 0), 0) / grades.length).toFixed(1)
    : '0.0';
  const presentDays = attendance.filter((item) => item.status === 'present').length;
  const attendanceRate = attendance.length > 0 ? ((presentDays / attendance.length) * 100).toFixed(1) : '0.0';
  const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim();

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 0.875rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-main)',
    outline: 'none',
    fontSize: '0.875rem'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => nav('/students')} style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back
        </button>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={exportProfile} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'white', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <Download size={16} /> Export
          </button>
          {canWriteStudents && !isEditing && (
            <button onClick={() => setIsEditing(true)} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <UserPen size={16} /> Edit
            </button>
          )}
          {canWriteStudents && isEditing && (
            <>
              <button onClick={handleSave} disabled={saving} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setIsEditing(false)} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'white', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <X size={16} /> Cancel
              </button>
            </>
          )}
          {canWriteStudents && (
            <button onClick={handleDelete} disabled={saving} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <Trash2 size={16} /> Delete
            </button>
          )}
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', borderRadius: 16, padding: '2rem', color: 'white', margin: '1.5rem 0' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{fullName}</h1>
        <p style={{ margin: '0.5rem 0 0' }}>Roll: {student.admission_number}</p>
      </div>

      {notice && <div style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: '#ecfdf5', color: '#047857', marginBottom: '1rem', fontWeight: 700 }}>{notice}</div>}
      {error && <div style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: '#fef2f2', color: '#dc2626', marginBottom: '1rem', fontWeight: 700 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Avg Grade" value={`${avg}%`} icon={BookOpen} color="#3b82f6" />
        <StatCard label="Subjects" value={grades.length} icon={BookOpen} color="#10b981" />
        <StatCard label="Attendance" value={`${attendanceRate}%`} icon={CalendarCheck} color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        <PremiumCard style={{ gridColumn: 'span 8' }}>
          <h3 style={{ margin: 0, marginBottom: '1rem', color: '#1f2937' }}>Student Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
            {[
              ['firstName', 'First Name'],
              ['lastName', 'Last Name'],
              ['email', 'Email'],
              ['phone', 'Phone'],
              ['gender', 'Gender'],
              ['parentName', 'Parent Name'],
              ['parentPhone', 'Parent Phone'],
              ['address', 'Address']
            ].map(([name, label]) => (
              <div key={name}>
                <p style={{ margin: '0 0 0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{label}</p>
                {isEditing ? (
                  <input name={name} value={form[name]} onChange={handleChange} style={inputStyle} />
                ) : (
                  <p style={{ margin: 0, fontWeight: 600 }}>{form[name] || 'N/A'}</p>
                )}
              </div>
            ))}
          </div>
        </PremiumCard>

        <PremiumCard style={{ gridColumn: 'span 4' }}>
          <h3 style={{ margin: 0, marginBottom: '1rem', color: '#1f2937' }}>Parent Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href={form.parentPhone ? `tel:${form.parentPhone}` : undefined} style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontWeight: 700 }}>
              <Phone size={18} /> {form.parentPhone || 'No phone added'}
            </a>
            <a href={form.email ? `mailto:${form.email}` : undefined} style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontWeight: 700 }}>
              <Mail size={18} /> {form.email || 'No email added'}
            </a>
          </div>
        </PremiumCard>
      </div>

      <div style={{ marginTop: 24 }}>
        <AIAnalyticsCard type="student" data={{ studentId: id, grades }} title="AI Insights" />
      </div>

      <PremiumCard style={{ marginTop: 24 }}>
        <h3 style={{ margin: 0, marginBottom: '1rem', color: '#1f2937' }}>Grade History</h3>
        {grades.length === 0 ? <p style={{ color: '#6b7280' }}>No grades yet</p> : (
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
              {grades.map((grade, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">{grade.course_name || grade.subject_name || 'Subject'}</td>
                  <td className="py-3 px-4 font-medium">{grade.marks_obtained || grade.marks || 'N/A'}</td>
                  <td className="py-3 px-4">{grade.grade || 'N/A'}</td>
                  <td className="py-3 px-4">{grade.term || grade.exam_type || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </PremiumCard>
    </motion.div>
  );
}
