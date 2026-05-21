import React from 'react';
import { Search, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import CustomButton from './CustomButton';

const CustomTable = ({ 
  columns, 
  data, 
  isLoading, 
  searchPlaceholder = 'Search...',
  onSearch,
  onRowClick
}) => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Table Header / Toolbar */}
      <div style={{ 
        padding: '1.25rem 1.5rem', 
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{
          position: 'relative',
          width: '300px'
        }}>
          <div style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-light)',
            display: 'flex'
          }}>
            <Search size={16} />
          </div>
          <input 
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem 0.6rem 2.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.875rem',
              outline: 'none',
              backgroundColor: 'var(--bg-main)'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <CustomButton variant="outline" size="sm" icon={ChevronLeft} disabled />
          <CustomButton variant="outline" size="sm" icon={ChevronRight} disabled />
        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  style={{ 
                    padding: '1rem 1.5rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  {col.title}
                </th>
              ))}
              <th style={{ padding: '1rem 1.5rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((row, index) => (
              <tr 
                key={index}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ 
                  borderBottom: '1px solid var(--border-color)',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'var(--transition)'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <button style={{ color: 'var(--text-light)', padding: '0.25rem' }}>
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td 
                  colSpan={columns.length + 1} 
                  style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ 
        padding: '1rem 1.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.875rem',
        color: 'var(--text-muted)'
      }}>
        <span>Showing {data.length} entries</span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <CustomButton variant="outline" size="sm">1</CustomButton>
          <CustomButton variant="ghost" size="sm">2</CustomButton>
          <CustomButton variant="ghost" size="sm">3</CustomButton>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
