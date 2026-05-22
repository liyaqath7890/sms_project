import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Download, 
  MoreVertical,
  ArrowUpDown
} from 'lucide-react';

const Table = ({ 
  title, 
  columns, 
  data, 
  searchable = true, 
  exportable = true,
  pagination = true,
  itemsPerPage = 10,
  onRowClick,
  rowActions = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter and Search
  const filteredData = data.filter(row => 
    Object.values(row).some(val => 
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="card-premium" style={{ padding: 0 }}>
      {/* Table Toolbar */}
      <div style={{ 
        padding: '1.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {title} <span style={{ color: 'var(--text-light)', fontWeight: 500, fontSize: '0.875rem' }}>({filteredData.length})</span>
        </h3>
        
        <div style={{ display: 'flex', gap: '1rem', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
          {searchable && (
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={16} />
              <input 
                type="text" 
                placeholder="Quick search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 1rem 0.625rem 2.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'var(--transition)',
                  backgroundColor: 'var(--bg-main)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
          )}
          {exportable && (
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: 'white',
              color: 'var(--text-muted)'
            }}>
              <Download size={16} /> Export
            </button>
          )}
        </div>
      </div>

      {/* Table Body */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-main)' }}>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ 
                    padding: '1rem 1.5rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    color: 'var(--text-muted)', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: col.sortable ? 'pointer' : 'default',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {col.label}
                    {col.sortable && <ArrowUpDown size={14} style={{ opacity: 0.5 }} />}
                  </div>
                </th>
              ))}
              {rowActions.length > 0 && <th style={{ padding: '1rem 1.5rem' }}></th>}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='wait'>
              {paginatedData.map((row, idx) => (
                <motion.tr 
                  key={row.id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => onRowClick?.(row)}
                  style={{ 
                    borderBottom: '1px solid var(--border-color)',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {columns.map((col) => (
                    <td key={col.key} style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {rowActions.length > 0 && (
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                      <button style={{ color: 'var(--text-light)' }}>
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)} style={{ padding: '4rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No records found matching your search.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && totalPages > 1 && (
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: '1px solid var(--border-color)'
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            Showing <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{(currentPage - 1) * itemsPerPage + 1}</span> to <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{filteredData.length}</span> results
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'white',
                color: currentPage === 1 ? 'var(--text-light)' : 'var(--text-main)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'white',
                color: currentPage === totalPages ? 'var(--text-light)' : 'var(--text-main)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
