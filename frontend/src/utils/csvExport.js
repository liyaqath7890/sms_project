/**
 * Converts an array of objects to a CSV string and triggers a download.
 * @param {Array} data - The array of objects to export.
 * @param {string} filename - The desired filename for the download.
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) {
    console.error('No data provided for export');
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Build the CSV string
  const csvContent = [
    headers.join(','), // header row
    ...data.map(row => 
      headers.map(fieldName => {
        const value = row[fieldName] ?? '';
        // Escape quotes and wrap in quotes if value contains comma
        const stringValue = String(value).replace(/"/g, '""');
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',')
    )
  ].join('\r\n');

  // Create a blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
