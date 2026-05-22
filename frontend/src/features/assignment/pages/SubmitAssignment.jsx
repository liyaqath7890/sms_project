import React, { useState } from 'react';
import { FileText, Book, Calendar, Upload, Save } from 'lucide-react';
import CustomInput from '../../../components/custom/CustomInput';
import CustomButton from '../../../components/custom/CustomButton';
import CustomSelect from '../../../components/custom/CustomSelect';

const SubmitAssignment = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <CustomInput label="Assignment Title" icon={FileText} placeholder="e.g. Chapter 5 Summary" required />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <CustomSelect 
          label="Course" 
          options={[
            { label: 'Adv. Mathematics', value: 'math' },
            { label: 'General Physics', value: 'phys' },
          ]} 
        />
        <CustomInput label="Due Date" type="date" icon={Calendar} required />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Instructions</label>
        <textarea 
          style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minHeight: '120px', outline: 'none' }}
          placeholder="Enter assignment instructions for students..."
        />
      </div>

      <div style={{ 
        border: '2px dashed var(--border-color)', 
        padding: '2rem', 
        textAlign: 'center', 
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-light)',
        cursor: 'pointer'
      }}>
        <Upload size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <p style={{ margin: 0, fontSize: '0.875rem' }}>Click to upload reference materials (PDF, DOCX)</p>
      </div>

      <CustomButton type="submit" variant="primary" fullWidth icon={Save} isLoading={isLoading}>
        Publish Assignment
      </CustomButton>
    </form>
  );
};

export default SubmitAssignment;
