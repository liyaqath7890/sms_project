import React, { useState } from 'react';
import { Save, BookOpen, User, Hash } from 'lucide-react';
import CustomInput from '../../../components/custom/CustomInput';
import CustomButton from '../../../components/custom/CustomButton';
import CustomSelect from '../../../components/custom/CustomSelect';

const CreateCourse = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    teacher: '',
    description: ''
  });
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
      <CustomInput
        label="Course Name"
        icon={BookOpen}
        placeholder="e.g. Advanced Chemistry"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <CustomInput
        label="Course Code"
        icon={Hash}
        placeholder="e.g. CHEM402"
        value={formData.code}
        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        required
      />
      <CustomSelect
        label="Assign Instructor"
        options={[
          { label: 'Dr. Sarah Wilson', value: '1' },
          { label: 'Prof. James Brown', value: '2' },
        ]}
        value={formData.teacher}
        onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
      />
      
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <CustomButton type="submit" variant="primary" fullWidth icon={Save} isLoading={isLoading}>
          Create Course
        </CustomButton>
      </div>
    </form>
  );
};

export default CreateCourse;
