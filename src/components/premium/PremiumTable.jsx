import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

const PremiumTable = ({ 
  columns, 
  data, 
  rowActions,
  pagination = true,
  itemsPerPage = 10
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : sortedData;

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={tableVariants}
      initial="hidden"
      animate="visible"
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'white'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{
                    padding: '1rem',
                    textAlign: col.align || 'left',
                    fontWeight: 700,
                    color: '#1f2937',
                    fontSize: '0.875rem',
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (col.sortable) e.target.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {col.label}
                    {col.sortable && sortConfig.key === col.key && (
                      <motion.div
                        animate={{ rotate: sortConfig.direction === 'asc' ? 0 : 180 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronUp size={16} />
                      </motion.div>
                    )}
                  </div>
                </th>
              ))}
              {rowActions && <th style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: 700 }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <motion.tr
                key={idx}
                variants={rowVariants}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '1rem',
                      textAlign: col.align || 'left',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {rowActions && (
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {rowActions.map((action, actionIdx) => (
                        <motion.button
                          key={actionIdx}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => action.onClick(row)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            backgroundColor: action.color + '15',
                            color: action.color,
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = action.color + '25';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = action.color + '15';
                          }}
                        >
                          {action.label}
                        </motion.button>
                      ))}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#f9fafb',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: currentPage === page ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                backgroundColor: currentPage === page ? '#3b82f6' : 'white',
                color: currentPage === page ? 'white' : '#1f2937',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'all 0.3s ease'
              }}
            >
              {page}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PremiumTable;
