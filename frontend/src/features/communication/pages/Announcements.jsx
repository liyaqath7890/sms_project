import React, { useState } from 'react';
import { Megaphone, Calendar, User, Clock, ChevronRight, Save } from 'lucide-react';
import CustomCard from '../../../components/custom/CustomCard';
import CustomButton from '../../../components/custom/CustomButton';
import CustomDrawer from '../../../components/custom/CustomDrawer';
import CustomInput from '../../../components/custom/CustomInput';

const dummyAnnouncements = [
  { id: 1, title: 'Annual Sports Day 2026', date: 'April 15, 2026', author: 'Principal Office', category: 'Event', color: 'primary', content: 'We are excited to announce our upcoming annual sports meet. All students are required to register for their respective events by Friday.' },
  { id: 2, title: 'Mid-Term Break Announcement', date: 'April 20, 2026', author: 'Administration', category: 'Holiday', color: 'success', content: 'The school will remain closed from April 22nd to April 26th for the mid-term break. Classes will resume on Monday, April 27th.' },
  { id: 3, title: 'New Science Lab Inauguration', date: 'April 10, 2026', author: 'Science Department', category: 'Upgrade', color: 'info', content: 'Our state-of-the-art new chemistry and biology labs are now open for senior secondary students.' },
];

const Announcements = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setDrawerOpen(false);
      alert('Announcement posted successfully!');
    }, 1200);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Announcements</h1>
          <p style={{ color: 'var(--text-muted)' }}>Stay updated with the latest school news and events.</p>
        </div>
        <CustomButton 
          variant="primary" 
          icon={Megaphone} 
          onClick={() => setDrawerOpen(true)}
        >
          Post Announcement
        </CustomButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {dummyAnnouncements.map((item) => (
          <CustomCard 
            key={item.id}
            padding={false}
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              borderLeft: `6px solid var(--${item.color})` 
            }}
          >
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className={`badge badge-${item.color}`} style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  {item.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.8rem' }}>
                  <Calendar size={14} />
                  {item.date}
                </div>
              </div>
              
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {item.content}
              </p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={14} />
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.author}</span>
                </div>
                <CustomButton variant="ghost" size="sm" icon={ChevronRight}>Read More</CustomButton>
              </div>
            </div>
          </CustomCard>
        ))}
      </div>

      <CustomDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Post New Announcement"
        width="500px"
      >
        <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <CustomInput label="Title" placeholder="e.g. Workshop on AI" required />
          <CustomSelect 
            label="Category" 
            options={[
              { label: 'Event', value: 'event' },
              { label: 'Holiday', value: 'holiday' },
              { label: 'Upgrade', value: 'upgrade' },
            ]} 
          />
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Content</label>
            <textarea 
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minHeight: '150px', outline: 'none' }}
              placeholder="Enter announcement details..."
              required
            />
          </div>
          <CustomButton type="submit" variant="primary" fullWidth icon={Save} isLoading={isLoading}>
            Post Announcement
          </CustomButton>
        </form>
      </CustomDrawer>
    </div>
  );
};

export default Announcements;
