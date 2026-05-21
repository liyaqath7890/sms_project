import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, BookOpen, User, Users, ClipboardList, CheckCircle } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CustomCard from '../../../components/custom/CustomCard';
import CustomTable from '../../../components/custom/CustomTable';

const CourseDetails = ({ id: internalId, isInternal = false }) => {
  const { id: paramId } = useParams();
  const id = internalId || paramId;
  const navigate = useNavigate();

  // Simulated data
  const course = {
    id,
    name: 'Advanced Mathematics',
    code: 'MATH401',
    teacher: 'Dr. Sarah Wilson',
    description: 'This course covers advanced calculus, linear algebra, and complex numbers.',
    status: 'Active',
    year: '2026',
    semester: 'Spring',
  };

  const sectionColumns = [
    { title: 'Section Name', key: 'name' },
    { title: 'Classroom', key: 'room' },
    { title: 'Students', key: 'count' },
    { title: 'Schedule', key: 'time' },
    { 
      title: 'Status', 
      key: 'status',
      render: (val) => <span className="badge badge-success">{val}</span>
    }
  ];

  const sections = [
    { name: 'Grade 10-A', room: 'B-204', count: 28, time: 'Mon, Wed (09:00 - 10:30)', status: 'Full' },
    { name: 'Grade 10-B', room: 'B-205', count: 24, time: 'Mon, Wed (11:00 - 12:30)', status: 'Open' },
    { name: 'Grade 11-A', room: 'C-101', count: 32, time: 'Tue, Thu (14:00 - 15:30)', status: 'Full' },
  ];

  return (
    <div className="animate-fade-in">
      {!isInternal && (
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CustomButton variant="outline" size="sm" icon={ArrowLeft} onClick={() => navigate('/courses')} />
            <div>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{course.name}</h1>
              <p style={{ color: 'var(--text-muted)' }}>Course Code: {course.code}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <CustomButton variant="outline" icon={Edit} onClick={() => alert('Editing course detail mode enabled')}>Edit Course</CustomButton>
            <CustomButton variant="primary" icon={Users} onClick={() => alert('Student enrollment view opened')}>Enroll Students</CustomButton>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isInternal ? '1fr' : '1fr 350px', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Overview */}
          <CustomCard title="Course Overview" shadow="sm">
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
              {course.description}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0 }}>Term</p>
                <p style={{ fontWeight: 600 }}>{course.semester} {course.year}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0 }}>Status</p>
                <p style={{ fontWeight: 600, color: 'var(--success)' }}>{course.status}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0 }}>Total Sections</p>
                <p style={{ fontWeight: 600 }}>{sections.length}</p>
              </div>
            </div>
          </CustomCard>

          {/* Sections Table */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem' }}>Active Sections</h3>
              <CustomButton variant="secondary" size="sm" icon={ClipboardList} onClick={() => alert('Opening section management panel')}>Manage Sections</CustomButton>
            </div>
            <CustomTable columns={sectionColumns} data={sections} />
          </div>
        </div>

        {/* Sidebar Info - only show if not internal or handle differently */}
        {!isInternal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <CustomCard title="Course Instructor" shadow="sm">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700
                }}>
                  SW
                </div>
                <div>
                  <p style={{ fontWeight: 600, margin: 0 }}>{course.teacher}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Head of Mathematics</p>
                </div>
              </div>
              <CustomButton variant="outline" fullWidth size="sm" onClick={() => navigate('/teachers')}>View Instructor Profile</CustomButton>
            </CustomCard>

            <CustomCard title="Prerequisites" shadow="sm">
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Basic Algebra (MATH201)', 'Geometry Foundations (MATH301)'].map((p, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <CheckCircle size={14} color="var(--success)" />
                    {p}
                  </li>
                ))}
              </ul>
            </CustomCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
