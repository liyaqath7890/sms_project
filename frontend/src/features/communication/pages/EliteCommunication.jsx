import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Bell, 
  Users, 
  Search, 
  Star,
  Archive,
  Trash2,
  Plus,
  Mail,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

import { ElitePageHeader, EliteStatCard } from '../../../components/elite';

const EliteCommunication = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [selectedMsg, setSelectedMsg] = useState(null);

  const announcements = [
    { id: 1, title: 'Annual Day Celebrations', content: 'We are pleased to announce that the annual day celebrations will be held on...', date: '2 hours ago', sender: 'Principal', priority: 'High' },
    { id: 2, title: 'Mid-term Exam Schedule', content: 'The mid-term examination schedule for Grade 5-10 has been released...', date: 'Yesterday', sender: 'Academic Head', priority: 'Medium' },
    { id: 3, title: 'Parent-Teacher Meeting', content: 'Monthly PTM for section A is scheduled for this Saturday...', date: '2 days ago', sender: 'Section Lead', priority: 'Medium' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <ElitePageHeader 
        title="Communication Hub" 
        subtitle="Centralized messaging, announcements, and stakeholder engagement platform."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Communication' }]}
        actions={[
          { label: 'New Announcement', icon: Plus, variant: 'primary', onClick: () => {} },
          { label: 'Broadcast Message', icon: Send, variant: 'secondary', onClick: () => {} }
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <EliteStatCard title="Active Users" value="1.2k" icon={Users} sparkData={[1000, 1100, 1150, 1200, 1180, 1220, 1200]} trend="+12% activity" />
        <EliteStatCard title="Unread Notices" value="8" icon={Bell} color="warning" sparkData={[5, 8, 4, 10, 6, 9, 8]} trend="Check inbox" />
        <EliteStatCard title="Delivery Rate" value="99.8%" icon={ShieldCheck} color="success" sparkData={[99, 99.5, 99.8, 99.7, 99.9, 99.8, 99.8]} trend="System stable" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem' }}>
        {/* Sidebar Tabs */}
        <div className="card-premium" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { id: 'announcements', label: 'Announcements', icon: Bell, count: 3 },
              { id: 'messages', label: 'Direct Messages', icon: MessageSquare, count: 12 },
              { id: 'starred', label: 'Starred', icon: Star, count: 5 },
              { id: 'archived', label: 'Archived', icon: Archive, count: 0 },
              { id: 'trash', label: 'Trash', icon: Trash2, count: 2 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  fontWeight: 700,
                  fontSize: '0.875rem'
                }}
              >
                <tab.icon size={18} />
                <span style={{ flex: 1, textAlign: 'left' }}>{tab.label}</span>
                {tab.count > 0 && (
                  <span style={{ 
                    backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'var(--bg-main)', 
                    color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                    fontSize: '0.65rem',
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="card-premium" style={{ padding: 0 }}>
          <div style={{ 
            padding: '1.5rem', 
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h3>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input 
                type="text" 
                placeholder="Search..."
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem 0.5rem 2.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.75rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {announcements.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{item.date}</span>
                </div>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.content}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800 }}>
                      {item.sender.charAt(0)}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.sender}</span>
                  </div>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 800, 
                    color: item.priority === 'High' ? 'var(--danger)' : 'var(--primary)',
                    backgroundColor: item.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {item.priority} Priority
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliteCommunication;
