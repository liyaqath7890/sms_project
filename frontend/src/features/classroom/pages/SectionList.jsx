import React, { useState } from 'react';
import { Layers, Plus, Search, MapPin, Users, MoreVertical } from 'lucide-react';
import CustomTable from '../../../components/custom/CustomTable';
import CustomButton from '../../../components/custom/CustomButton';
import CustomDrawer from '../../../components/custom/CustomDrawer';
import AddSection from './AddSection';

const dummySections = [
  { id: '1', name: 'Grade 10-A', building: 'Building B', room: 'B-201', capacity: 30, students: 28 },
  { id: '2', name: 'Grade 10-B', building: 'Building B', room: 'B-205', capacity: 30, students: 24 },
  { id: '3', name: 'Grade 11-A', building: 'Building C', room: 'C-101', capacity: 35, students: 32 },
  { id: '4', name: 'Grade 12-A', building: 'Building C', room: 'C-402', capacity: 25, students: 25 },
];

const SectionList = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const columns = [
    { title: 'Section Name', key: 'name' },
    { title: 'Building', key: 'building' },
    { title: 'Room No.', key: 'room' },
    { title: 'Capacity', key: 'capacity' },
    { 
      title: 'Students', 
      key: 'students',
      render: (val, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${(val/record.capacity)*100}%`, height: '100%', backgroundColor: (val/record.capacity) > 0.9 ? 'var(--danger)' : 'var(--primary)' }}></div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{val}/{record.capacity}</span>
        </div>
      )
    },
    { 
      title: 'Actions', 
      key: 'actions', 
      render: () => <MoreVertical size={16} /> 
    }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Sections & Classrooms</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage physical space and class-section assignments.</p>
        </div>
        <CustomButton variant="primary" icon={Plus} onClick={() => setDrawerOpen(true)}>Add New Section</CustomButton>
      </div>

      <CustomTable columns={columns} data={dummySections} />

      <CustomDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Add New Section"
        width="500px"
      >
        <AddSection onSuccess={() => setDrawerOpen(false)} />
      </CustomDrawer>
    </div>
  );
};

export default SectionList;
