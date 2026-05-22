const fs = require('fs');
const path = require('path');

const frontendSrc = path.join(__dirname, 'frontend', 'src');
const legacySrc = path.join(__dirname, 'src');

if (!fs.existsSync(frontendSrc)) {
  console.error('frontend/src was not found. Run this script from the SMS_project root.');
  process.exit(1);
}

const expectedFiles = [
  'features/gradebook/pages/PremiumGradebook.jsx',
  'features/student/pages/StudentProfile.jsx',
  'features/schedule/pages/Timetable.jsx',
  'features/reports/pages/GlobalAnalytics.jsx'
];

const missingFiles = expectedFiles.filter((file) => !fs.existsSync(path.join(frontendSrc, file)));

if (missingFiles.length > 0) {
  console.warn('Some generated pages are missing:');
  for (const file of missingFiles) {
    console.warn(`- frontend/src/${file}`);
  }
  process.exitCode = 1;
} else {
  console.log('All generated frontend pages are present under frontend/src.');
}

if (fs.existsSync(legacySrc)) {
  console.log('Note: frontend has been separated; use frontend/src instead of root src.');
}
