const fs = require('fs');
const path = require('path');

const frontendSrc = path.join(__dirname, 'frontend', 'src');

if (!fs.existsSync(frontendSrc)) {
  console.error('frontend/src was not found. Run this script from the SMS_project root.');
  process.exit(1);
}

console.log('Frontend has been separated into frontend/src.');
console.log('No file fixes are required from this legacy helper.');
