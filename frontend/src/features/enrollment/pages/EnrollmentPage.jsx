import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Eye, Download, Mail, Phone, MapPin, Calendar, IndianRupee } from 'lucide-react';
import '../../components/premium/premium.css';

const EnrollmentPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const enrollments = [
    {
      id: 1,
      name: 'Arjun Sharma',
      grade: '5',
      section: 'A',
      parent: 'Mr. Rajesh Sharma',
      phone: '+91 98765 43210',
      email: 'rajesh.sharma@email.com',
      address: '123 Main Street, Mumbai',
      enrollmentDate: '2024-06-15',
      fees: 45000,
      status: 'confirmed',
      documents: ['Aadhar', 'Birth Certificate', 'Previous School Transfer'],
      admission_number: 'SMS/2024/001'
    },
    {
      id: 2,
      name: 'Priya Verma',
      grade: '5',
      section: 'B',
      parent: 'Mrs. Anjali Verma',
      phone: '+91 98765 43211',
      email: 'anjali.verma@email.com',
      address: '456 Park Lane, Delhi',
      enrollmentDate: '2024-06-18',
      fees: 45000,
      status: 'confirmed',
      documents: ['Aadhar', 'Birth Certificate'],
      admission_number: 'SMS/2024/002'
    },
    {
      id: 3,
      name: 'Aditya Kumar',
      grade: '4',
      section: 'C',
      parent: 'Mr. Vikram Kumar',
      phone: '+91 98765 43212',
      email: 'vikram.kumar@email.com',
      address: '789 Garden Road, Bangalore',
      enrollmentDate: '2024-07-10',
      fees: 42000,
      status: 'pending',
      documents: ['Aadhar'],
      admission_number: 'SMS/2024/003'
    },
    {
      id: 4,
      name: 'Neha Singh',
      grade: '6',
      section: 'A',
      parent: 'Mrs. Kavya Singh',
      phone: '+91 98765 43213',
      email: 'kavya.singh@email.com',
      address: '321 River View, Pune',
      enrollmentDate: '2024-07-15',
      fees: 48000,
      status: 'confirmed',
      documents: ['Aadhar', 'Birth Certificate', 'Previous School Transfer', 'Medical Certificate'],
      admission_number: 'SMS/2024/004'
    },
    {
      id: 5,
      name: 'Rohan Gupta',
      grade: '3',
      section: 'B',
      parent: 'Mr. Sandeep Gupta',
      phone: '+91 98765 43214',
      email: 'sandeep.gupta@email.com',
      address: '654 Sunset Boulevard, Chennai',
      enrollmentDate: '2024-07-20',
      fees: 38000,
      status: 'rejected',
      documents: [],
      admission_number: 'SMS/2024/005'
    }
  ];

  const filteredEnrollments = enrollments.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         e.parent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      confirmed: { bg: '#d1fae5', text: '#065f46', icon: '✓' },
      pending: { bg: '#fef3c7', text: '#92400e', icon: '⏳' },
      rejected: { bg: '#fee2e2', text: '#991b1b', icon: '✗' }
    };
    return colors[status] || colors.pending;
  };

  return (
    <div style={{ padding: '2rem', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1f2937', marginBottom: '0.5rem' }}>
          Enrollment Management
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Manage student admissions and enrollment requests</p>
      </motion.div>

      {/* Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        {/* Search */}
        <div style={{
          flex: 1,
          minWidth: '200px',
          display: 'flex',
          alignItems: 'center',
          background: '#f3f4f6',
          borderRadius: '8px',
          padding: '0 1rem'
        }}>
          <Search size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search by name, email, or parent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              marginLeft: '0.5rem',
              flex: 1,
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Status Filter */}
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '0.95rem',
            color: '#1f2937',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Action Buttons */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease'
          }}
        >
          <Plus size={18} />
          New Enrollment
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          style={{
            background: '#f3f4f6',
            color: '#1f2937',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease'
          }}
        >
          <Download size={18} />
          Export
        </motion.button>
      </motion.div>

      {/* Enrollment List */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1rem'
        }}
      >
        {filteredEnrollments.map((enrollment, idx) => {
          const statusInfo = getStatusColor(enrollment.status);
          return (
            <motion.div
              key={enrollment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              onClick={() => setSelectedEnrollment(selectedEnrollment?.id === enrollment.id ? null : enrollment)}
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
            >
              {/* Main Row */}
              <div style={{
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto auto auto auto',
                gap: '1rem',
                alignItems: 'center'
              }}>
                {/* Avatar */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '1.2rem'
                }}>
                  {enrollment.name.charAt(0)}
                </div>

                {/* Student Info */}
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {enrollment.name}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Grade {enrollment.grade} - Section {enrollment.section} | Admission ID: {enrollment.admission_number}
                  </p>
                </div>

                {/* Parent Info */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.25rem' }}>Parent</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937' }}>{enrollment.parent}</p>
                </div>

                {/* Fees */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.25rem' }}>Fees</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end', color: '#3b82f6', fontWeight: '600' }}>
                    <IndianRupee size={16} />
                    {enrollment.fees.toLocaleString()}
                  </div>
                </div>

                {/* Status */}
                <div style={{
                  background: statusInfo.bg,
                  color: statusInfo.text,
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textTransform: 'capitalize',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {statusInfo.icon} {enrollment.status}
                </div>

                {/* View Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  style={{
                    background: '#f3f4f6',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3b82f6',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Eye size={18} />
                </motion.button>
              </div>

              {/* Expandable Details */}
              {selectedEnrollment?.id === enrollment.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  style={{
                    background: '#f9fafb',
                    borderTop: '1px solid #e5e7eb',
                    padding: '1.5rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem'
                  }}
                >
                  {/* Contact Info */}
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem', textTransform: 'uppercase' }}>
                      Contact Information
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <Phone size={16} color="#3b82f6" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Phone</p>
                          <p style={{ fontWeight: '600', color: '#1f2937' }}>{enrollment.phone}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <Mail size={16} color="#3b82f6" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Email</p>
                          <p style={{ fontWeight: '600', color: '#1f2937' }}>{enrollment.email}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <MapPin size={16} color="#3b82f6" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Address</p>
                          <p style={{ fontWeight: '600', color: '#1f2937' }}>{enrollment.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enrollment Info */}
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem', textTransform: 'uppercase' }}>
                      Enrollment Details
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Enrollment Date</p>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#1f2937', fontWeight: '600' }}>
                          <Calendar size={16} />
                          {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Admission Number</p>
                        <p style={{ fontWeight: '600', color: '#1f2937' }}>{enrollment.admission_number}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Annual Fees</p>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#3b82f6', fontWeight: '700' }}>
                          <IndianRupee size={16} />
                          {enrollment.fees.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem', textTransform: 'uppercase' }}>
                      Documents Submitted
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {enrollment.documents.length > 0 ? (
                        enrollment.documents.map((doc, idx) => (
                          <div key={idx} style={{
                            background: '#d1fae5',
                            color: '#065f46',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            ✓ {doc}
                          </div>
                        ))
                      ) : (
                        <p style={{ color: '#ef4444', fontWeight: '600' }}>No documents submitted yet</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredEnrollments.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'white',
          borderRadius: '12px',
          color: '#9ca3af'
        }}>
          <p style={{ fontSize: '1.1rem' }}>No enrollments found</p>
        </div>
      )}
    </div>
  );
};

export default EnrollmentPage;
