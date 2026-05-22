import React, { useState } from 'react';
import { Layers, MapPin, Users, Save } from 'lucide-react';
import CustomInput from '../../../components/custom/CustomInput';
import CustomButton from '../../../components/custom/CustomButton';
import CustomSelect from '../../../components/custom/CustomSelect';

const AddSection = ({ onSuccess }) => {
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
      <CustomInput label="Section Name" icon={Layers} placeholder="e.g. Grade 10-C" required />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <CustomSelect 
          label="Building" 
          options={[
            { label: 'Building A', value: 'a' },
            { label: 'Building B', value: 'b' },
            { label: 'Building C', value: 'c' },
          ]} 
        />
        <CustomInput label="Room Number" icon={MapPin} placeholder="B-205" required />
      </div>

      <CustomInput label="Capacity" type="number" icon={Users} placeholder="e.g. 30" required />

      <CustomButton type="submit" variant="primary" fullWidth icon={Save} isLoading={isLoading}>
        Create Section
      </CustomButton>
    </form>
  );
};

export default AddSection;
