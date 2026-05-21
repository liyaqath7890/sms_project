import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, School, FileText, Save } from 'lucide-react';
import CustomInput from '../../../components/custom/CustomInput';
import CustomButton from '../../../components/custom/CustomButton';
import CustomCard from '../../../components/custom/CustomCard';
import CustomSelect from '../../../components/custom/CustomSelect';

const NewAdmission = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    grade: '',
    prevSchool: '',
    address: ''
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
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <CustomCard title="Student Information" shadow="sm">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <CustomInput label="First Name" placeholder="John" required />
            <CustomInput label="Last Name" placeholder="Doe" required />
          </div>
          <CustomInput label="Email" icon={Mail} type="email" placeholder="john@example.com" required />
          <CustomInput label="Phone" icon={Phone} placeholder="+1 234 567 890" />
        </CustomCard>

        <CustomCard title="Academic History" shadow="sm">
          <CustomSelect 
            label="Target Grade" 
            options={[
              { label: 'Grade 9', value: '9' },
              { label: 'Grade 10', value: '10' },
              { label: 'Grade 11', value: '11' },
            ]} 
            required
          />
          <CustomInput label="Previous School" icon={School} placeholder="City Middle School" />
          <CustomInput label="Residential Address" icon={FileText} placeholder="St 10, New York" />
        </CustomCard>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <CustomButton type="submit" variant="primary" icon={Save} isLoading={isLoading}>
          Submit Admission Application
        </CustomButton>
      </div>
    </form>
  );
};

export default NewAdmission;
